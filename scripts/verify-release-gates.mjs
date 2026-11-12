import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  cp,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  writeFile,
  symlink,
} from 'node:fs/promises';
import { openSync, closeSync, existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  sourceIdentity,
  assertSameSource,
} from './verification-provenance.mjs';

// Snapshot only project inputs, never credentials, editor state or root .git.
const root = process.cwd();
const source = await sourceIdentity();
const workspace = await mkdtemp(path.join(os.tmpdir(), 'fq-gate-canaries-'));
const reportDir = path.join(root, 'verification/reports/gate-canaries');
await mkdir(reportDir, { recursive: true });
const directories = [
  'src',
  'public',
  'scripts',
  '.storybook',
  '.github',
  'docs',
  '.changeset',
];
const files = [
  'package.json',
  'package-lock.json',
  'index.html',
  'vite.config.ts',
  'vitest.config.ts',
  'vitest.setup.ts',
  'vitest.shims.d.ts',
  'eslint.config.js',
  '.prettierrc.json',
  '.prettierignore',
  '.gitignore',
  'AGENTS.md',
  'README.md',
  'LICENSE',
  'CONTRIBUTING.md',
];
files.push(
  ...(await readdir(root)).filter((file) => /^tsconfig[^/]*\.json$/.test(file)),
);
for (const file of [
  ...directories,
  ...files,
  'verification/baselines',
  'verification/inventory.json',
  'verification/baseline-metadata.json',
  'verification/README.md',
  'verification/behavior-matrix.md',
]) {
  try {
    await cp(path.join(root, file), path.join(workspace, file), {
      recursive: true,
    });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
await symlink(
  path.join(root, 'node_modules'),
  path.join(workspace, 'node_modules'),
  'dir',
);
const git = (...args) =>
  execFileSync('git', args, {
    cwd: workspace,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
git('init', '-b', 't10-gate-canaries');
git(
  'add',
  '--force',
  '--',
  ...directories,
  ...files.filter((file) => existsSync(path.join(workspace, file))),
  'verification',
);
git(
  '-c',
  'user.name=Verification Canary',
  '-c',
  'user.email=verification@local.invalid',
  '-c',
  'commit.gpgsign=false',
  'commit',
  '-m',
  'test: isolate release gate negative probes',
);
const snapshot = await sourceIdentity(workspace);
assertSameSource(source, snapshot);
assert.equal(source.baselineFingerprint, snapshot.baselineFingerprint);
const results = [];
const command = (label, script, args = []) => {
  const log = path.join(reportDir, label + '.log');
  const descriptor = openSync(log, 'w');
  let status = 0;
  try {
    execFileSync(process.execPath, [script, ...args], {
      cwd: workspace,
      stdio: ['ignore', descriptor, descriptor],
      env: process.env,
    });
  } catch (error) {
    status = error.status ?? -1;
  } finally {
    closeSync(descriptor);
  }
  return { status, log: path.basename(log) };
};
const json = async (file) =>
  JSON.parse(await readFile(path.join(workspace, file), 'utf8'));
const probes = [
  {
    name: 'layout',
    file: 'src/components/Button/Button.css',
    mutate: (s) => s + '\n.fq-button--primary { padding-left: 3px; }\n',
    script: 'scripts/verify-browser.mjs',
    args: ['--filter=components-button--primary'],
    inspect: async () =>
      (await json('verification/reports/filtered/results.json')).some(
        (r) => r.status === 'failed' && r.error.includes("'padding-left'"),
      ),
  },
  {
    name: 'behavior',
    file: 'src/components/Button/Button.tsx',
    mutate: (s) =>
      s.replace('{...props}', '{...props}\n        onClick={() => {}}'),
    script: 'scripts/verify-browser.mjs',
    args: ['--behavior-only'],
    inspect: async () =>
      (await json('verification/reports/behavior/results.json')).some(
        (r) =>
          r.status === 'failed' &&
          /Count 0/.test(r.error) &&
          /Count 1/.test(r.error),
      ),
  },
  {
    name: 'accessibility',
    file: 'src/components/Dialog/Dialog.tsx',
    mutate: (s) => s.replace('id={titleId}', "id={titleId + '-broken'}"),
    script: 'scripts/verify-accessibility.mjs',
    args: ['--filter=components-dialog--default'],
    inspect: async () =>
      (await json('verification/reports/a11y/results.json')).results.some((r) =>
        r.violations?.some((v) => v.id === 'aria-dialog-name'),
      ),
  },
  {
    name: 'package-export',
    file: 'package.json',
    mutate: (s) => {
      const p = JSON.parse(s);
      p.exports['.'].import = './dist/canary-missing.js';
      return JSON.stringify(p, null, 2) + '\n';
    },
    script: 'scripts/verify-package.mjs',
    args: [],
    inspect: async () => {
      const report = await json('verification/reports/package/results.json');
      const failure = report.results.find(
        (result) => result.status === 'failed',
      );
      if (
        !failure ||
        !/failed to resolve import ["']fq-design-system["']/.test(failure.error)
      )
        return false;
      const installed = path.join(
        failure.fixture,
        'react-18.3.1/node_modules/fq-design-system',
      );
      const manifest = JSON.parse(
        await readFile(path.join(installed, 'package.json'), 'utf8'),
      );
      return (
        manifest.exports['.'].import === './dist/canary-missing.js' &&
        !existsSync(path.join(installed, 'dist/canary-missing.js'))
      );
    },
  },
];
let failure;
try {
  for (const probe of probes) {
    console.log(`Canary ${probe.name}: proving the original gate passes`);
    if (probe.name !== 'package-export')
      assert.equal(
        command(
          probe.name + '-positive-build',
          'scripts/verification-build.mjs',
        ).status,
        0,
        'Positive static build must pass',
      );
    const positive = command(
      probe.name + '-positive',
      probe.script,
      probe.args,
    );
    assert.equal(positive.status, 0, `${probe.name}: original gate must pass`);
    const file = path.join(workspace, probe.file);
    const original = await readFile(file, 'utf8');
    const mutated = probe.mutate(original);
    assert.notEqual(
      mutated,
      original,
      'Mutation must actually alter the source',
    );
    try {
      await writeFile(file, mutated);
      await writeFile(
        path.join(reportDir, probe.name + '.patch'),
        git('diff', '--', probe.file),
      );
      if (probe.name !== 'package-export')
        assert.equal(
          command(
            probe.name + '-negative-build',
            'scripts/verification-build.mjs',
          ).status,
          0,
          'Mutation must compile: stale/build errors do not prove a gate',
        );
      console.log(
        `Canary ${probe.name}: expecting a specific regression failure`,
      );
      const negative = command(
        probe.name + '-negative',
        probe.script,
        probe.args,
      );
      assert.notEqual(
        negative.status,
        0,
        `${probe.name}: broken gate unexpectedly passed`,
      );
      assert(
        await probe.inspect(),
        `${probe.name}: failure did not match the intended regression`,
      );
      await cp(
        path.join(workspace, 'verification/reports'),
        path.join(reportDir, probe.name),
        { recursive: true },
      );
      results.push({
        name: probe.name,
        status: 'passed',
        positive,
        negative,
        observed:
          'Intended regression was rejected after successful control run',
      });
    } finally {
      await writeFile(file, original);
    }
  }
} catch (error) {
  failure = error.message;
  process.exitCode = 1;
} finally {
  const after = await sourceIdentity();
  assertSameSource(source, after);
  assert.equal(source.baselineFingerprint, after.baselineFingerprint);
  assertSameSource(source, await sourceIdentity(workspace));
  const report = {
    schemaVersion: 1,
    source,
    branch: 't10-gate-canaries',
    snapshotCommit: snapshot.commit,
    workspace,
    status: results.length === probes.length && !failure ? 'passed' : 'failed',
    results,
    failure: failure ?? null,
  };
  await writeFile(
    path.join(reportDir, 'results.json'),
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(
    `Release gate canaries ${report.status}: ${results.length}/${probes.length}; isolated workspace retained for review`,
  );
}
