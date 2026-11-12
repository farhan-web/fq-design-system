import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import {
  sourceIdentity,
  assertSameSource,
} from './verification-provenance.mjs';

const before = await sourceIdentity();
execFileSync(
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['run', 'build-storybook'],
  { stdio: 'inherit' },
);
const after = await sourceIdentity();
assertSameSource(before, after);
await writeFile(
  'storybook-static/verification-build.json',
  JSON.stringify(
    {
      builtAt: new Date().toISOString(),
      nodeVersion: process.version,
      source: after,
    },
    null,
    2,
  ) + '\n',
);
