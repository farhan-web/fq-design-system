import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { format, resolveConfig } from 'prettier';
import {
  sourceIdentity,
  contextPath,
  reviewPath,
  digestFiles,
  git,
  isSensitive,
} from './verification-provenance.mjs';

const requiredHeadings = [
  'Current state',
  'Verification evidence',
  'Gaps and next action',
];
const fingerprint = /^[a-f0-9]{64}$/;
const fail = (message) => {
  throw new Error(message);
};
async function read(root, file) {
  return readFile(path.join(root, file), 'utf8');
}

export async function refresh(root, { task, summary, next }) {
  if (!task || !summary?.trim() || !next)
    fail(
      'Refresh requires --task, --summary and --next. Update current-context.md first.',
    );
  const plan = await read(root, 'docs/production-readiness-plan.md');
  for (const id of [task, next])
    if (!/^[TS]\d{2}$/.test(id) || !new RegExp(`^### ${id} —`, 'm').test(plan))
      fail(`Unknown plan task: ${id}`);
  const source = await sourceIdentity(root);
  const manifest = {
    schemaVersion: 1,
    taskId: task,
    lifecycle: 'handoff',
    reviewedAt: new Date().toISOString(),
    reviewSummary: summary.trim(),
    nextTask: next,
    source,
    contextFingerprint: await digestFiles(root, [contextPath]),
  };
  await writeFile(
    path.join(root, reviewPath),
    await format(JSON.stringify(manifest), {
      ...(await resolveConfig(path.join(root, 'package.json'))),
      parser: 'json',
    }),
  );
  return manifest;
}

export async function check(root, { base } = {}) {
  const doc = await read(root, contextPath);
  const plan = await read(root, 'docs/production-readiness-plan.md');
  const manifest = JSON.parse(await read(root, reviewPath));
  if (manifest.schemaVersion !== 1 || manifest.lifecycle !== 'handoff')
    fail('Unsupported context schema or lifecycle.');
  if (
    !manifest.reviewSummary?.trim() ||
    !Number.isFinite(Date.parse(manifest.reviewedAt))
  )
    fail('Missing review summary or valid timestamp.');
  const match = doc.match(/^Last reviewed: (\d{4}-\d{2}-\d{2})\./m);
  if (!match || match[1] !== manifest.reviewedAt.slice(0, 10))
    fail('Context Last reviewed must match the handoff date.');
  for (const heading of requiredHeadings)
    if (!doc.includes(`## ${heading}\n`))
      fail(`Context missing heading: ${heading}`);
  for (const id of [manifest.taskId, manifest.nextTask])
    if (
      !/^[TS]\d{2}$/.test(id || '') ||
      !new RegExp(`^### ${id} —`, 'm').test(plan)
    )
      fail(`Unknown plan task: ${id}`);
  if (!/^[a-f0-9]{40,64}$/.test(manifest.source?.commit || ''))
    fail('Missing source commit identity.');
  const actual = await sourceIdentity(root);
  for (const key of [
    'sourceFingerprint',
    'policyFingerprint',
    'baselineFingerprint',
  ]) {
    if (
      !fingerprint.test(manifest.source?.[key] || '') ||
      manifest.source[key] !== actual[key]
    )
      fail(
        `Stale context: ${key} changed. Review docs and run steering:refresh.`,
      );
  }
  if (
    !fingerprint.test(manifest.contextFingerprint || '') ||
    manifest.contextFingerprint !== (await digestFiles(root, [contextPath]))
  )
    fail(
      'Context prose changed since review. Run steering:refresh after reviewing it.',
    );
  // Relative Markdown links in canonical guidance only; external links are not fetched.
  for (const file of [
    'AGENTS.md',
    'README.md',
    'CONTRIBUTING.md',
    'docs/production-readiness-plan.md',
    'docs/steering/README.md',
    contextPath,
    'docs/steering/decisions.md',
    'verification/README.md',
    'verification/behavior-matrix.md',
  ]) {
    const markdown = await read(root, file);
    for (const [, raw] of markdown.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^[a-z][a-z\d+.-]*:/i.test(raw) || raw.startsWith('#')) continue;
      const target = raw.replace(/^<|>$/g, '').split('#')[0];
      if (!target) continue;
      const resolved = path.resolve(
        root,
        path.dirname(file),
        decodeURIComponent(target),
      );
      if (!resolved.startsWith(path.resolve(root) + path.sep))
        fail(`Guidance link escapes repository: ${file} -> ${raw}`);
      try {
        await readFile(resolved);
      } catch {
        fail(`Broken guidance link: ${file} -> ${raw}`);
      }
    }
  }
  if (base !== undefined) {
    if (!/^[a-f0-9]{7,64}$/.test(base) || /^0+$/.test(base))
      fail('--base requires a nonzero commit SHA.');
    const mergeBase = git(root, ['merge-base', base, 'HEAD']);
    const committed = git(root, [
      'diff',
      '--name-only',
      '-z',
      `${mergeBase}...HEAD`,
    ]).split('\0');
    const working = git(root, ['diff', '--name-only', '-z', 'HEAD']).split(
      '\0',
    );
    const untracked = git(root, [
      'ls-files',
      '--others',
      '--exclude-standard',
      '-z',
    ]).split('\0');
    const changed = new Set(
      [...committed, ...working, ...untracked].filter(Boolean),
    );
    if (
      [...changed].some(isSensitive) &&
      (!changed.has(contextPath) || !changed.has(reviewPath))
    )
      fail(
        'Sensitive changes require both current-context.md and current-context.json updates in this PR.',
      );
  }
  return {
    taskId: manifest.taskId,
    nextTask: manifest.nextTask,
    source: actual,
    reviewedSourceCommit: manifest.source.commit,
    reviewedAt: manifest.reviewedAt,
    sourceFingerprint: actual.sourceFingerprint,
    base: base || null,
    checkedAt: new Date().toISOString(),
  };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const args = Object.fromEntries(
    process.argv.slice(3).map((arg) => {
      const at = arg.indexOf('=');
      if (!arg.startsWith('--') || at < 0) fail('Use --name=value arguments.');
      return [arg.slice(2, at), arg.slice(at + 1)];
    }),
  );
  async function report(value) {
    if (!args.report) return;
    const destination = path.resolve(args.report);
    if (
      !destination.startsWith(path.resolve('verification/reports') + path.sep)
    )
      fail('Reports must be written inside verification/reports/.');
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, JSON.stringify(value, null, 2) + '\n');
  }
  try {
    const allowed =
      process.argv[2] === 'refresh'
        ? ['task', 'summary', 'next']
        : ['base', 'report'];
    for (const key of Object.keys(args))
      if (!allowed.includes(key)) fail(`Unknown argument: --${key}`);
    if (process.argv[2] === 'refresh') {
      await refresh(process.cwd(), args);
      console.log('Context handoff recorded. Run npm run steering:check.');
    } else if (process.argv[2] === 'check') {
      const result = await check(process.cwd(), args);
      await report({ status: 'passed', ...result });
      console.log(
        `Steering valid: ${result.taskId} -> ${result.nextTask}; source ${result.sourceFingerprint.slice(0, 12)}`,
      );
      if (!args.base)
        console.log(
          'No --base supplied: PR diff lifecycle check was not performed.',
        );
    } else fail('Use steering.mjs check or refresh.');
  } catch (error) {
    await report({
      status: 'failed',
      checkedAt: new Date().toISOString(),
      error: error.message,
    }).catch(() => {});
    console.error(error.message);
    process.exitCode = 1;
  }
}
