import { createRequire } from 'node:module';
import { rm, copyFile } from 'node:fs/promises';
import path from 'node:path';

// API Extractor's CJS export works in native Node; its ESM distribution uses
// extensionless relative imports. Keep it outside Vite's config bundling.
const require = createRequire(import.meta.url);
const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor');
const root = process.cwd();
const config = ExtractorConfig.prepare({
  configObject: {
    projectFolder: root,
    mainEntryPointFilePath: '<projectFolder>/dist/index.d.ts',
    compiler: { tsconfigFilePath: '<projectFolder>/tsconfig.lib.json' },
    apiReport: { enabled: false },
    docModel: { enabled: false },
    tsdocMetadata: { enabled: false },
    dtsRollup: {
      enabled: true,
      untrimmedFilePath: '<projectFolder>/dist/fq-design-system.d.ts',
    },
    messages: { extractorMessageReporting: { default: { logLevel: 'none' } } },
  },
  configObjectFullPath: path.join(root, 'api-extractor.json'),
  packageJsonFullPath: path.join(root, 'package.json'),
});
const result = Extractor.invoke(config, { localBuild: true });
if (!result.succeeded)
  throw new Error(`Public type bundling failed (${result.errorCount} errors)`);
for (const output of ['components', 'hooks', 'theme', 'types', 'index.d.ts'])
  await rm(path.join(root, 'dist', output), { recursive: true, force: true });
console.log('Public declarations bundled into dist/fq-design-system.d.ts');

await copyFile('src/theme/theme.schema.json', 'dist/theme-schema.json');
