import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

test('generated token checks reject source/output drift without rewriting files', async () => {
  const root = process.cwd();
  const fixture = await mkdtemp(path.join(tmpdir(), 'fq-token-check-'));
  try {
    await cp(path.join(root, 'src/theme'), path.join(fixture, 'src/theme'), {
      recursive: true,
    });
    await cp(
      path.join(root, 'src/foundations'),
      path.join(fixture, 'src/foundations'),
      { recursive: true },
    );
    await cp(
      path.join(root, '.prettierrc.json'),
      path.join(fixture, '.prettierrc.json'),
    );
    const check = () =>
      spawnSync(
        process.execPath,
        [path.join(root, 'scripts/generate-theme-tokens.mjs'), '--check'],
        { cwd: fixture, encoding: 'utf8' },
      );
    const first = check();
    assert.equal(first.status, 0, first.stderr);
    const file = path.join(fixture, 'src/foundations/spacing.css');
    const original = await readFile(file, 'utf8');
    const modified = original.replace('--spacing-8: 8px', '--spacing-8: 9px');
    assert.notEqual(modified, original);
    await writeFile(file, modified);
    assert.notEqual(check().status, 0);
    assert.equal(await readFile(file, 'utf8'), modified);
    await writeFile(file, original);
    const source = path.join(fixture, 'src/theme/default-theme.json');
    const definition = JSON.parse(await readFile(source, 'utf8'));
    definition.foundation.palette['--color-blue-400'] = '#123456';
    await writeFile(source, JSON.stringify(definition));
    assert.notEqual(check().status, 0);
    assert.equal(await readFile(file, 'utf8'), original);
    definition.schemaVersion = 2;
    await writeFile(source, JSON.stringify(definition));
    const wrongVersion = check();
    assert.notEqual(wrongVersion.status, 0);
    assert(wrongVersion.stderr.includes('defaults.schemaVersion'));
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
