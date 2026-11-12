import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

test('component inventory rejects active colors, unknown CSS aliases and orphan registry tokens', async () => {
  const repo = process.cwd(),
    root = await mkdtemp(path.join(tmpdir(), 'fq-component-inventory-'));
  try {
    await cp(
      path.join(repo, 'src/components'),
      path.join(root, 'src/components'),
      { recursive: true },
    );
    await mkdir(path.join(root, 'src/theme'), { recursive: true });
    await cp(
      path.join(repo, 'src/theme/componentTokens.ts'),
      path.join(root, 'src/theme/componentTokens.ts'),
    );
    const run = () =>
      spawnSync(
        process.execPath,
        [
          path.join(repo, 'scripts/inventory-component-tokens.mjs'),
          `--root=${root}`,
        ],
        { encoding: 'utf8' },
      );
    assert.equal(run().status, 0);
    const file = path.join(root, 'src/components/Button/Button.css'),
      original = await readFile(file, 'utf8');
    await writeFile(file, original + '\n.fq-button { color: #123456; }\n');
    assert.match(run().stderr, /active literal color/);
    await writeFile(
      file,
      original + '\n.fq-button { color: var(--fq-button-typo); }\n',
    );
    assert.match(run().stderr, /unregistered component token/);
    await writeFile(file, original);
    const registry = path.join(root, 'src/theme/componentTokens.ts');
    await writeFile(
      registry,
      (await readFile(registry, 'utf8')).replace(
        'button: {',
        "button: { '--fq-button-orphan': 'color',",
      ),
    );
    assert.match(run().stderr, /no CSS consumer/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
