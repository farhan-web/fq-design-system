import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { refresh, check } from '../steering.mjs';
import {
  sourceIdentity,
  assertSameSource,
  git,
  contextPath,
} from '../verification-provenance.mjs';

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'fq-steering-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const directory of ['src', 'docs/steering', 'verification', '.github'])
    await mkdir(path.join(root, directory), { recursive: true });
  const files = {
    'src/button.ts': 'export const padding = 12;\n',
    'package.json': '{}\n',
    'AGENTS.md': '# Guidelines\n',
    'README.md': '# Readme\n',
    'CONTRIBUTING.md': '# Contributing\n',
    'docs/production-readiness-plan.md':
      '# Plan\n\n### S01 — Steering\n\n### T03 — Packaging\n',
    'docs/steering/README.md': '# Steering\n',
    'docs/steering/decisions.md': '# Decisions\n',
    'verification/README.md': '# Verify\n',
    'verification/behavior-matrix.md': '# Matrix\n',
    [contextPath]: `# Current Context\n\nLast reviewed: ${new Date().toISOString().slice(0, 10)}.\n\n## Current state\n\nS01.\n\n## Verification evidence\n\nTests.\n\n## Gaps and next action\n\nT03.\n`,
  };
  for (const [file, content] of Object.entries(files))
    await writeFile(path.join(root, file), content);
  git(root, ['init', '--quiet']);
  git(root, ['add', '.']);
  git(root, [
    '-c',
    'commit.gpgsign=false',
    '-c',
    'user.name=Fixture',
    '-c',
    'user.email=fixture@example.invalid',
    'commit',
    '--quiet',
    '-m',
    'fixture',
  ]);
  await refresh(root, {
    task: 'S01',
    summary: 'Reviewed fixture',
    next: 'T03',
  });
  return root;
}

test('valid review passes and new/deleted/untracked source makes it stale', async (t) => {
  const root = await fixture(t);
  assert.equal((await check(root)).taskId, 'S01');
  await writeFile(
    path.join(root, 'src/new.ts'),
    'export const color = "blue";',
  );
  await assert.rejects(check(root), /sourceFingerprint/);
  await rm(path.join(root, 'src/new.ts'));
  await rm(path.join(root, 'src/button.ts'));
  await assert.rejects(check(root), /sourceFingerprint/);
});

test('policy, prose and baseline freshness are checked independently', async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, 'README.md'), '# Changed contract');
  await assert.rejects(check(root), /policyFingerprint/);
  await refresh(root, { task: 'S01', summary: 'Reviewed policy', next: 'T03' });
  await writeFile(
    path.join(root, contextPath),
    (await readFile(path.join(root, contextPath), 'utf8')) + '\nExtra note.\n',
  );
  await assert.rejects(check(root), /prose changed/);
  await refresh(root, { task: 'S01', summary: 'Reviewed note', next: 'T03' });
  await mkdir(path.join(root, 'verification/baselines'));
  await writeFile(path.join(root, 'verification/baselines/button.json'), '{}');
  await assert.rejects(check(root), /baselineFingerprint/);
});

test('generated output does not invalidate source identity', async (t) => {
  const root = await fixture(t);
  const before = await sourceIdentity(root);
  await mkdir(path.join(root, 'verification/reports'), { recursive: true });
  await writeFile(path.join(root, 'verification/reports/log.json'), '{}');
  await mkdir(path.join(root, 'dist'));
  await writeFile(path.join(root, 'dist/output.js'), 'generated');
  const after = await sourceIdentity(root);
  assertSameSource(before, after);
  await check(root);
});

test('broken links, missing headings, invalid tasks and dates fail', async (t) => {
  const root = await fixture(t);
  await assert.rejects(
    refresh(root, { task: 'UNKNOWN', summary: 'x', next: 'T03' }),
    /Unknown plan task/,
  );
  await writeFile(path.join(root, 'AGENTS.md'), '[missing](missing.md)');
  await refresh(root, { task: 'S01', summary: 'Test link', next: 'T03' });
  await assert.rejects(check(root), /Broken guidance link/);
  await writeFile(path.join(root, 'AGENTS.md'), '# Guidelines');
  const original = await readFile(path.join(root, contextPath), 'utf8');
  await writeFile(
    path.join(root, contextPath),
    original.replace('## Current state', '## Other'),
  );
  await refresh(root, { task: 'S01', summary: 'Test heading', next: 'T03' });
  await assert.rejects(check(root), /missing heading/);
  await writeFile(
    path.join(root, contextPath),
    original.replace(/Last reviewed: .*/, 'Last reviewed: 2000-01-01.'),
  );
  await refresh(root, { task: 'S01', summary: 'Test date', next: 'T03' });
  await assert.rejects(check(root), /handoff date/);
});

test('PR base requires both prose and manifest updates for sensitive changes', async (t) => {
  const root = await fixture(t);
  git(root, ['add', '.']);
  git(root, [
    '-c',
    'commit.gpgsign=false',
    '-c',
    'user.name=Fixture',
    '-c',
    'user.email=fixture@example.invalid',
    'commit',
    '--quiet',
    '-m',
    'review',
  ]);
  const base = git(root, ['rev-parse', 'HEAD']);
  await writeFile(
    path.join(root, 'src/button.ts'),
    'export const padding = 24;',
  );
  await refresh(root, {
    task: 'S01',
    summary: 'Source changed but prose forgotten',
    next: 'T03',
  });
  await assert.rejects(check(root, { base }), /both current-context/);
  await writeFile(
    path.join(root, contextPath),
    (await readFile(path.join(root, contextPath), 'utf8')) +
      '\nReviewed padding change.\n',
  );
  await refresh(root, {
    task: 'S01',
    summary: 'Reviewed padding',
    next: 'T03',
  });
  await check(root, { base });
  await assert.rejects(check(root, { base: '--all' }), /commit SHA/);
});

test('provenance detects source mutation during verification', async (t) => {
  const root = await fixture(t);
  const before = await sourceIdentity(root);
  await writeFile(
    path.join(root, 'src/button.ts'),
    'export const padding = 32;',
  );
  const after = await sourceIdentity(root);
  assert.throws(
    () => assertSameSource(before, after),
    /Source changed during verification/,
  );
});
