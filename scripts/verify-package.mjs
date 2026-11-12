/* global document, getComputedStyle, window */
import assert from 'node:assert/strict';
import ts from 'typescript';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  lstat,
  rm,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';
import { verifyStyleIsolation } from './verify-style-isolation.mjs';
import {
  sourceIdentity,
  assertSameSource,
} from './verification-provenance.mjs';

const root = process.cwd();
const reportDir = path.join(root, 'verification/reports/package');
const work = await mkdtemp(path.join(os.tmpdir(), 'fq-consumer-'));
const startedAt = new Date().toISOString();
const source = await sourceIdentity();
const publicAst = ts.createSourceFile(
  'index.ts',
  await readFile(path.join(root, 'src/index.ts'), 'utf8'),
  ts.ScriptTarget.Latest,
  true,
);
const runtimeExports = [];
const typeExports = [];
for (const statement of publicAst.statements) {
  if (
    ts.isExportDeclaration(statement) &&
    statement.exportClause &&
    ts.isNamedExports(statement.exportClause)
  ) {
    for (const item of statement.exportClause.elements)
      (statement.isTypeOnly || item.isTypeOnly
        ? typeExports
        : runtimeExports
      ).push(item.name.text);
  }
}
runtimeExports.sort();
const results = [];
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const env = {
  ...process.env,
  PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH,
  npm_config_cache:
    process.env.FQ_PACKAGE_NPM_CACHE ||
    path.join(os.tmpdir(), 'fq-design-system-npm-cache'),
  npm_config_fetch_retries: '0',
  npm_config_fetch_timeout: '20000',
  npm_config_audit: 'false',
  npm_config_fund: 'false',
  npm_config_update_notifier: 'false',
};
const run = (command, args, cwd) =>
  execFileSync(command, args, {
    cwd,
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 12 * 1024 * 1024,
  });
const packJson = (output) =>
  JSON.parse(output.slice(output.lastIndexOf('\n[') + 1));
const save = async (dir, name, content) =>
  writeFile(
    path.join(dir, name),
    typeof content === 'string'
      ? content
      : JSON.stringify(content, null, 2) + '\n',
  );
let browser;
let passed = false;
try {
  console.log('Checking dry-run manifest and prepack build...');
  const [dry] = packJson(run(npm, ['pack', '--dry-run', '--json'], root));
  const [packed] = packJson(
    run(npm, ['pack', '--pack-destination', work, '--json'], root),
  );
  const files = packed.files.map((file) => file.path);
  const componentInventory = JSON.parse(
    await readFile(
      path.join(root, 'verification/reports/component-token-inventory.json'),
      'utf8',
    ),
  );
  const sample = {
    color: '#663399',
    length: '13px',
    font: 'Georgia, serif',
    density: '1.25',
  };
  const allFamilyOverrides = {
    schemaVersion: 1,
    components: Object.fromEntries(
      componentInventory.families
        .filter((family) => Object.keys(family.tokens).length)
        .map((family) => [
          family.group,
          Object.fromEntries(
            Object.entries(family.tokens).map(([key, type]) => {
              assert(
                Object.hasOwn(sample, type),
                `Missing consumer fixture for token category ${type}`,
              );
              return [key, sample[type]];
            }),
          ),
        ]),
    ),
  };
  const legacyThemeDefinition = JSON.parse(
    await readFile(
      path.join(root, 'scripts/fixtures/theme-v1-definition.json'),
      'utf8',
    ),
  );

  for (const file of [
    'package.json',
    'README.md',
    'LICENSE',
    'dist/fq-design-system.js',
    'dist/fq-design-system.css',
    'dist/fq-design-system.d.ts',
    'dist/theme-schema.json',
    'dist/fq-design-system.isolated.css',
    'dist/fq-design-system.reset.css',
  ])
    assert(files.includes(file), `Missing packed file: ${file}`);
  assert.deepEqual(
    files,
    dry.files.map((file) => file.path),
  );
  assert(
    files.every(
      (file) =>
        [
          'package.json',
          'README.md',
          'LICENSE',
          'dist/theme-schema.json',
          'dist/fq-design-system.isolated.css',
          'dist/fq-design-system.reset.css',
        ].includes(file) ||
        /^dist\/fq-design-system\.(js|css|d\.ts)$/.test(file),
    ),
    'Unexpected source/tests/demo/internal declaration files in package',
  );
  results.push({
    check: 'tarball/prepack',
    status: 'passed',
    files,
    integrity: packed.integrity,
  });
  browser = await chromium.launch({ headless: true });
  for (const variant of [
    { react: '18.3.1', types: '18.3.18', domTypes: '18.3.5' },
    { react: '19.2.8', types: '19.2.17', domTypes: '19.2.3' },
  ]) {
    const dir = path.join(work, `react-${variant.react}`);
    await mkdir(dir);
    const dependencies = {
      'fq-design-system': 'file:' + path.join(work, packed.filename),
      react: variant.react,
      'react-dom': variant.react,
      '@mui/material': '6.5.0',
      '@emotion/react': '11.14.0',
      '@emotion/styled': '11.14.1',
      '@emotion/cache': '11.14.0',
      '@emotion/server': '11.11.0',
    };
    if (variant.react.startsWith('18.'))
      dependencies['react-is'] = variant.react;
    await save(dir, 'package.json', {
      private: true,
      type: 'module',
      dependencies,
      devDependencies: {
        vite: '8.2.1',
        typescript: '6.0.3',
        '@types/react': variant.types,
        '@types/react-dom': variant.domTypes,
      },
      ...(variant.react.startsWith('18.')
        ? { overrides: { 'react-is': variant.react } }
        : {}),
    });
    console.log(
      `Installing clean consumer: React ${variant.react}, Node ${process.version}...`,
    );
    run(npm, ['install', '--ignore-scripts', '--no-audit', '--no-fund'], dir);
    const installed = path.join(dir, 'node_modules/fq-design-system');
    assert.equal((await lstat(installed)).isSymbolicLink(), false);
    const manifest = JSON.parse(
      await readFile(path.join(installed, 'package.json'), 'utf8'),
    );
    assert.equal(manifest.peerDependenciesMeta, undefined);
    assert.equal(
      manifest.exports['./compat.css'],
      manifest.exports['./style.css'],
    );
    assert.equal(
      manifest.exports['./reset.css'],
      './dist/fq-design-system.reset.css',
    );
    assert.equal(manifest.peerDependencies['lucide-react'], undefined);
    const css = await readFile(
      path.join(installed, manifest.exports['./style.css']),
      'utf8',
    );
    assert(css.includes('--color-primary') && css.includes('.fq-button'));
    const fonts = [
      ...css.matchAll(/url\(["']?(data:font\/woff2;base64,([^"')]+))["']?\)/g),
    ];
    assert.equal(
      fonts.length,
      4,
      'All four bundled fonts must be self-contained',
    );
    for (const font of fonts)
      assert.equal(
        Buffer.from(font[2], 'base64').subarray(0, 4).toString(),
        'wOF2',
      );
    await save(
      dir,
      'app.tsx',
      `import React, { useEffect, useState } from 'react';
import { FqThemeProvider, Button, Field, Form, Input, Badge, Dialog, Snackbar, type FqPortalContainer, type FqThemeConfig, type FqThemeDefinition, type ButtonProps, type InputProps, type DialogProps } from 'fq-design-system';
const supported: ButtonProps = { size: 'md', variant: 'primary' }; void supported;
// @ts-expect-error unsupported size must be rejected by published types
const invalid: ButtonProps = { size: 'giant' }; void invalid;
const styled: InputProps = { classNames: { root: 'wrapper', input: 'control' }, slotProps: { label: { style: { '--custom': '1px', color: 'red' }, 'data-probe': true } } }; void styled;
const dialogSlots: DialogProps = { open: false, slotProps: { paper: { style: { padding: 4 } }, backdrop: { className: 'veil' } } }; void dialogSlots;
// @ts-expect-error unknown slots rejected
const badSlot: InputProps = { classNames: { unknown: 'bad' } }; void badSlot;
// @ts-expect-error events belong to component props, not decoration slots
const badEvent: InputProps = { slotProps: { input: { onChange: () => {} } } }; void badEvent;
// @ts-expect-error managed ARIA cannot be replaced through slots
const badAria: DialogProps = { open: false, slotProps: { paper: { 'aria-label': 'spoof' } } }; void badAria;
const target: FqPortalContainer = () => document.body; void target;
// @ts-expect-error containers are DOM nodes/callbacks, not CSS selectors
const invalidContainer: DialogProps = { open: false, container: '#root' }; void invalidContainer;
function PortalFixture() {
  const [open, setOpen] = useState(false);
  return <FqThemeProvider enableCssLayer mode="dark" tokens={{ schemaVersion: 1, semantic: { dark: { '--color-primary': '#663399' } }, foundation: { typography: { '--font-family': 'Georgia, serif' }, radius: { '--radius-md': '11px' } } }}>
    <button type="button" onClick={() => setOpen(true)}>Open scoped portal</button>
    <Dialog open={open} title="Installed portal" container={() => document.body} onClose={() => setOpen(false)}>
      <div data-testid="installed-probe" style={{ color: 'var(--color-primary)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-family)' }}>Scoped</div>
    </Dialog>
    <Snackbar open={false} message="Portal status" disablePortal={false} container={() => document.body} />
  </FqThemeProvider>;
}
const familyOverrides: FqThemeConfig = ${JSON.stringify(allFamilyOverrides)}; void familyOverrides;
const oldDefinition: FqThemeDefinition = ${JSON.stringify(legacyThemeDefinition)}; void oldDefinition;
// @ts-expect-error unknown component group rejected
const wrongFamily: FqThemeConfig = { schemaVersion: 1, components: { missingWidget: {} } }; void wrongFamily;
// @ts-expect-error keys from another family rejected
const wrongKey: FqThemeConfig = { schemaVersion: 1, components: { dialog: { '--fq-tooltip-primary': '#663399' } } }; void wrongKey;
export default function App() {
  const [count, setCount] = useState(0);
  useEffect(() => { document.documentElement.dataset.hydrated = 'true'; }, []);
  return <FqThemeProvider enableCssLayer><div id="consumer-scope"><Form aria-label="Consumer form" onSubmit={(e) => e.preventDefault()}>
    <Field label="Email" required description="Work email"><Input name="email" type="email" /></Field>
    <Button style={{ paddingInline: 28 }} onClick={() => setCount((n) => n + 1)}>Count {count}</Button>
    <Badge>Consumer badge</Badge>
  </Form><PortalFixture /></div></FqThemeProvider>;
}
`,
    );
    await save(
      dir,
      'client.tsx',
      `import React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { hydrateRoot } from 'react-dom/client';
import App from './app';
import 'fq-design-system/style.css';
import './consumer.css';
declare global { interface Window { recoverableErrors: string[] } }
window.recoverableErrors = [];
hydrateRoot(document.getElementById('root')!, <CacheProvider value={createCache({ key: 'css' })}><App /></CacheProvider>, { onRecoverableError(error) { window.recoverableErrors.push(String(error)); } });
`,
    );
    await save(
      dir,
      'consumer.css',
      '#consumer-scope { --color-primary: rgb(123,45,67); --radius-md: 13px; }\n',
    );
    await save(
      dir,
      'index.html',
      '<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8"><title>Tarball consumer</title></head><body><div id="root"></div><script type="module" src="/client.tsx"></script></body></html>',
    );
    await save(dir, 'tsconfig.json', {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        jsx: 'react-jsx',
        strict: true,
        noEmit: true,
        skipLibCheck: false,
        types: ['vite/client'],
      },
      include: ['app.tsx', 'client.tsx', 'public-contracts.ts'],
    });
    await save(
      dir,
      'consumer-node.mts',
      `import { Button, type ButtonProps } from 'fq-design-system';
const props: ButtonProps = { variant: 'primary' }; void props; void Button;
// @ts-expect-error invalid variant rejected under NodeNext too
const invalid: ButtonProps = { variant: 'invalid' }; void invalid;
`,
    );
    await save(
      dir,
      'public-contracts.ts',
      `import type { ${typeExports.join(', ')} } from 'fq-design-system';\nexport type Contracts = [${typeExports.map((name) => (name === 'FqSlotCustomization' ? `${name}<'root'>` : name)).join(', ')}];\n`,
    );
    run(
      process.execPath,
      ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.json'],
      dir,
    );
    await save(dir, 'tsconfig.node.json', {
      extends: './tsconfig.json',
      compilerOptions: {
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        types: [],
      },
      include: ['consumer-node.mts'],
    });
    run(
      process.execPath,
      ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.node.json'],
      dir,
    );
    run(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], dir);
    run(
      process.execPath,
      [
        'node_modules/vite/bin/vite.js',
        'build',
        '--ssr',
        'app.tsx',
        '--outDir',
        'server',
      ],
      dir,
    );
    await save(
      dir,
      'render.mjs',
      `import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { CacheProvider } from '@emotion/react';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import * as library from 'fq-design-system';
import App from './server/app.js';
const require = createRequire(import.meta.url);
const createCache = require('@emotion/cache').default;
const createEmotionServer = require('@emotion/server/create-instance').default;
assert.deepEqual(Object.keys(library).sort(), ${JSON.stringify(runtimeExports)});
const tokenConfig = { schemaVersion: 1, semantic: { light: { '--color-primary': '#663399' } } };
const generatedTheme = library.createFqTheme(tokenConfig);
assert.equal(generatedTheme.muiTheme.palette.primary.main, '#663399');
assert.equal(generatedTheme.cssVariables['--color-primary'], '#663399');
assert.throws(() => library.parseFqThemeJson('{"schemaVersion":2}'));
const schema = JSON.parse(readFileSync(require.resolve('fq-design-system/theme-schema.json'), 'utf8'));
assert.equal(schema.properties.schemaVersion.const, 1);

const fullOverrides = ${JSON.stringify(allFamilyOverrides)};
const complete = library.createFqTheme(fullOverrides, 'dark', 'spacious');
assert.equal(complete.cssVariables['--fq-dialog-radius-lg'], '13px');
assert.equal(complete.cssVariables['--fq-navigation-bottom-gap-scale'], '1.25');
assert.equal(complete.cssVariables['--fq-tooltip-font-family'], 'Georgia, serif');
assert.throws(() => library.parseFqTheme({schemaVersion:1,components:{select:{'--fq-select-padding-scale':'0.5'}}}));
const cache = createCache({ key: 'css' });
const emotion = createEmotionServer(cache);
const markup = renderToString(createElement(CacheProvider, { value: cache }, createElement(App)));
const text = markup.replace(/<!--.*?-->/gs, '');
if (!text.includes('Consumer badge') || !text.includes('Count 0')) throw new Error('SSR output missing content');
const styles = emotion.constructStyleTagsFromChunks(emotion.extractCriticalToChunks(markup));
const html = readFileSync('dist/index.html','utf8').replace('<div id="root"></div>', '<div id="root">' + markup + '</div>').replace('<head>', '<head><meta name="emotion-insertion-point" content="">' + styles);
writeFileSync('dist/index.html', html);
console.log('Native ESM import and SSR passed');
`,
    );
    // Isolate server rendering modes: Emotion's server style cache is process-wide.
    // An unlayered preliminary render must not seed the layered hydration fixture.
    await save(
      dir,
      'token-ssr.mjs',
      `import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { FqThemeProvider, Button } from 'fq-design-system';
const tokens = { schemaVersion: 1, semantic: { light: { '--color-primary': '#663399' } } };
const markup = renderToString(createElement(FqThemeProvider, { tokens, mode: 'light', enableCssLayer: true }, createElement(Button, null, 'Token SSR')));
assert(markup.includes('--color-primary:#663399'));
assert(markup.includes('data-fq-theme'));
assert(markup.includes('@layer mui'));
console.log('Token SSR passed');
`,
    );
    assert(
      run(process.execPath, ['token-ssr.mjs'], dir).includes(
        'Token SSR passed',
      ),
    );
    const ssr = run(process.execPath, ['render.mjs'], dir);
    assert(ssr.includes('SSR passed'));
    const staticRoot = path.join(dir, 'dist');
    const server = createServer(async (request, response) => {
      try {
        const pathname = new URL(request.url, 'http://localhost').pathname;
        if (pathname === '/favicon.ico') {
          response.writeHead(204);
          response.end();
          return;
        }
        const filename = path.resolve(
          staticRoot,
          '.' + (pathname === '/' ? '/index.html' : pathname),
        );
        if (!filename.startsWith(staticRoot + path.sep))
          throw new Error('Invalid path');
        const data = await readFile(filename);
        response.setHeader(
          'Content-Type',
          {
            '.html': 'text/html; charset=utf-8',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.woff2': 'font/woff2',
          }[path.extname(filename)] || 'application/octet-stream',
        );
        response.end(data);
      } catch {
        response.writeHead(404);
        response.end();
      }
    });
    const context = await browser.newContext({ colorScheme: 'light' });
    try {
      await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', resolve);
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error' || message.type() === 'warning')
          errors.push(message.text());
      });
      await page.goto(`http://127.0.0.1:${server.address().port}`);
      await page.locator('html[data-hydrated="true"]').waitFor();
      await page.evaluate(() => document.fonts.ready);
      const button = page.getByRole('button', { name: 'Count 0' });
      const styles = await button.evaluate((element) => {
        const s = getComputedStyle(element);
        return {
          color: s.backgroundColor,
          radius: s.borderRadius,
          padding: s.paddingLeft,
          font: s.fontFamily,
        };
      });
      assert.equal(styles.color, 'rgb(123, 45, 67)');
      assert.equal(styles.radius, '13px');
      assert.equal(styles.padding, '28px');
      assert(styles.font.includes('Inter'));
      const legacyBox = await button.evaluate((element) => {
        const padding = element.style.paddingInline;
        element.style.removeProperty('padding-inline');
        const s = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const values = {
          box: s.boxSizing,
          padding: s.paddingLeft,
          radius: s.borderRadius,
          color: s.backgroundColor,
          font: s.fontFamily,
          lineHeight: s.lineHeight,
          weight: s.fontWeight,
          size: s.fontSize,
          height: rect.height,
          width: rect.width,
        };
        element.style.paddingInline = padding;
        return values;
      });
      await button.click();
      await page.getByRole('button', { name: 'Count 1' }).waitFor();
      await page
        .getByRole('textbox', { name: /Email/ })
        .fill('consumer@example.com');
      await page.getByRole('button', { name: 'Open scoped portal' }).click();
      const portal = page.getByRole('dialog', { name: 'Installed portal' });
      await portal.waitFor();
      assert.equal(
        await portal.evaluate(
          (el) => el.closest('.MuiModal-root').parentElement.tagName,
        ),
        'BODY',
      );
      assert.equal(
        await portal.evaluate((el) =>
          el.closest('.MuiModal-root').getAttribute('data-theme'),
        ),
        'dark',
      );
      const portalStyles = await page
        .getByTestId('installed-probe')
        .evaluate((el) => {
          const s = getComputedStyle(el);
          return { color: s.color, radius: s.borderRadius, font: s.fontFamily };
        });
      assert.equal(portalStyles.color, 'rgb(102, 51, 153)');
      assert.equal(portalStyles.radius, '11px');
      assert(portalStyles.font.includes('Georgia'));
      await page.getByRole('button', { name: 'Close dialog' }).click();
      await portal.waitFor({ state: 'hidden' });
      assert.deepEqual(await page.evaluate(() => window.recoverableErrors), []);
      assert.deepEqual(
        errors,
        [],
        'Consumer must hydrate without runtime/hydration warnings',
      );
      results.push({
        check: `clean-consumer-react-${variant.react}`,
        status: 'passed',
        node: process.version,
        dependencies,
        types: ['Bundler', 'NodeNext'],
        ssr: 'native ESM + renderToString + browser hydrateRoot',
        styles,
        portalScope:
          'scoped portal after SSR hydration, body container, dark tokens and cleanup',
      });
      const isolation = await verifyStyleIsolation({
        dir,
        run,
        save,
        browser,
        installed,
        legacyBox,
        legacyDefaultGeometry: await (async () => {
          // Layered compatibility mode intentionally differs (T03); the new
          // isolated entry preserves the frozen unlayered default dimensions.
          const baseline = JSON.parse(
            await readFile(
              path.join(
                root,
                'verification/baselines/components-button--primary-light-1440.json',
              ),
              'utf8',
            ),
          );
          const button = baseline.elements.find((element) =>
            element.classes.includes('fq-button'),
          );
          return { width: button.rect.width, height: button.rect.height };
        })(),
      });
      results.push({
        check: `isolated-consumer-react-${variant.react}`,
        status: 'passed',
        ...isolation,
      });
    } finally {
      await context.close();
      await new Promise((resolve) => server.close(resolve));
    }
  }
  assertSameSource(source, await sourceIdentity());
  passed = true;
} catch (error) {
  results.push({
    check: 'package-verification',
    status: 'failed',
    error: error.message,
    stdout: error.stdout?.toString(),
    stderr: error.stderr?.toString(),
    fixture: work,
  });
  process.exitCode = 1;
} finally {
  await browser?.close();
  await mkdir(reportDir, { recursive: true });
  const report = {
    schemaVersion: 1,
    startedAt,
    finishedAt: new Date().toISOString(),
    source,
    sourceAfter: await sourceIdentity(),
    nodeVersion: process.version,
    status: passed ? 'passed' : 'failed',
    results,
  };
  await save(reportDir, 'results.json', report);
  await save(reportDir, `node-${process.versions.node}.json`, report);
  console.log(
    `Package verification ${report.status}; report: verification/reports/package/results.json`,
  );
  if (passed) await rm(work, { recursive: true, force: true });
}
