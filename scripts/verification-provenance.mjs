import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const sourceRoots = ['src', 'public', 'scripts', '.storybook', '.github'];
const sourceFiles = [
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'index.html',
  'vite.config.ts',
  'vitest.config.ts',
  'vitest.setup.ts',
  'vitest.shims.d.ts',
  'eslint.config.js',
  '.prettierrc.json',
  '.prettierignore',
  '.gitignore',
];
const policyFiles = [
  'AGENTS.md',
  'README.md',
  'CONTRIBUTING.md',
  'docs/production-readiness-plan.md',
  'docs/component-tokens.md',
  'docs/t10-accessibility-migration.md',
  'docs/steering/README.md',
  'docs/steering/decisions.md',
  'verification/README.md',
  'verification/behavior-matrix.md',
];
export const contextPath = 'docs/steering/current-context.md';
export const reviewPath = 'docs/steering/current-context.json';

export function isSensitive(file) {
  return (
    sourceRoots.some((root) => file.startsWith(root + '/')) ||
    sourceFiles.includes(file) ||
    /^tsconfig[^/]*\.json$/.test(file) ||
    policyFiles.includes(file) ||
    file.startsWith('verification/baselines/') ||
    [
      'verification/inventory.json',
      'verification/baseline-metadata.json',
    ].includes(file)
  );
}

async function walk(root, relative) {
  let entries;
  try {
    entries = await readdir(path.join(root, relative), { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const files = [];
  for (const entry of entries) {
    if (['node_modules', '.git', '.DS_Store'].includes(entry.name)) continue;
    const file = path.posix.join(relative, entry.name);
    if (entry.isSymbolicLink())
      throw new Error(`Governed input cannot be a symlink: ${file}`);
    if (entry.isDirectory()) files.push(...(await walk(root, file)));
    else if (entry.isFile()) files.push(file);
  }
  return files;
}

export async function digestFiles(root, files) {
  const hash = createHash('sha256');
  for (const file of [...new Set(files)].sort()) {
    let content;
    try {
      content = await readFile(path.join(root, file));
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    hash
      .update(file + '\0')
      .update(createHash('sha256').update(content).digest())
      .update('\0');
  }
  return hash.digest('hex');
}

export function git(root, args) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

export async function sourceIdentity(root = process.cwd()) {
  const roots = (
    await Promise.all(sourceRoots.map((directory) => walk(root, directory)))
  ).flat();
  const configs = (await readdir(root)).filter((file) =>
    /^tsconfig[^/]*\.json$/.test(file),
  );
  return {
    commit: git(root, ['rev-parse', 'HEAD']),
    dirty: git(root, ['status', '--porcelain']).length > 0,
    sourceFingerprint: await digestFiles(root, [
      ...roots,
      ...sourceFiles,
      ...configs,
    ]),
    policyFingerprint: await digestFiles(root, policyFiles),
    baselineFingerprint: await digestFiles(root, [
      ...(await walk(root, 'verification/baselines')),
      'verification/baseline-metadata.json',
      'verification/inventory.json',
    ]),
  };
}

export function assertSameSource(before, after) {
  if (before.sourceFingerprint !== after.sourceFingerprint)
    throw new Error(
      'Source changed during verification; rerun against stable inputs.',
    );
}
