/* global document, window, getComputedStyle */
import assert from 'node:assert/strict';
import { mkdir, readFile, copyFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

export async function verifyStyleIsolation({
  dir,
  run,
  save,
  browser,
  installed,
  legacyBox,
  legacyDefaultGeometry,
}) {
  const fixture = path.join(dir, 'style-isolation');
  await mkdir(fixture);
  const hostCss = `html{background:rgb(240,235,230)}body{margin:23px;padding:7px;min-height:0;font-family:Georgia,serif;font-size:19px;line-height:1.8;color:rgb(31,41,51);background:rgb(230,235,240)}h1{margin:5px 0;font-size:25px}a{color:rgb(70,40,110)}#root{margin:9px;min-height:37px}#consumer-scope{--color-primary:rgb(123,45,67);--radius-md:13px}`;
  const outside =
    '<h1 id="outside-heading">Host heading</h1><a id="outside-link" href="#host">Host link</a><button id="outside-button">Native host button</button>';
  const template = `<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8"><title>Isolated consumer</title><style id="host-style">${hostCss}</style></head><body>${outside}<div id="root"></div><script type="module" src="/client.tsx"></script></body></html>`;
  await save(fixture, 'index.html', template);
  await save(
    fixture,
    'app.tsx',
    `import React, { useEffect, useState } from 'react';
import { FqThemeProvider, Button, Input, Badge } from 'fq-design-system';
export default function App() {
  const [count,setCount] = useState(0);
  useEffect(() => { document.documentElement.dataset.isolationReady='true'; }, []);
  return <FqThemeProvider enableCssLayer><div id="consumer-scope"><Button className="consumer-button" onClick={() => setCount(count+1)}>Count {count}</Button><Input label="Isolated input"/><Badge>Isolated badge</Badge></div></FqThemeProvider>;
}`,
  );
  await save(
    fixture,
    'client.tsx',
    `import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './app';
import 'fq-design-system/isolated.css';
window.recoverableErrors=[];
hydrateRoot(document.getElementById('root'), <App/>, { onRecoverableError(error) {window.recoverableErrors.push(String(error));} });`,
  );
  const vite = path.join(dir, 'node_modules/vite/bin/vite.js');
  run(process.execPath, [vite, 'build'], fixture);
  run(
    process.execPath,
    [vite, 'build', '--ssr', 'app.tsx', '--outDir', 'server'],
    fixture,
  );
  await save(
    fixture,
    'render.mjs',
    `import {createElement} from 'react';import {renderToString} from 'react-dom/server';import {readFileSync,writeFileSync} from 'node:fs';import App from './server/app.js';const markup=renderToString(createElement(App));if(!markup.includes('@layer mui'))throw Error('Isolated SSR must emit MUI layers');const html=readFileSync('dist/index.html','utf8');writeFileSync('dist/index.html',html.replace('<div id="root"></div>','<div id="root">'+markup+'</div>'));`,
  );
  run(process.execPath, ['render.mjs'], fixture);
  const root = path.join(fixture, 'dist');
  await save(
    root,
    'host.html',
    template.replace('<script type="module" src="/client.tsx"></script>', ''),
  );
  const manifest = JSON.parse(
    await readFile(path.join(installed, 'package.json'), 'utf8'),
  );
  await copyFile(
    path.join(installed, manifest.exports['./reset.css']),
    path.join(root, 'reset.css'),
  );
  const server = createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url, 'http://localhost').pathname;
      if (pathname === '/favicon.ico') {
        response.writeHead(204);
        response.end();
        return;
      }
      const file = path.resolve(
        root,
        '.' + (pathname === '/' ? '/index.html' : pathname),
      );
      if (!file.startsWith(root + path.sep)) throw Error('Invalid path');
      response.setHeader(
        'Content-Type',
        {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
        }[path.extname(file)] ?? 'application/octet-stream',
      );
      response.end(await readFile(file));
    } catch {
      response.writeHead(404);
      response.end();
    }
  });
  const context = await browser.newContext({
    viewport: { width: 900, height: 800 },
    colorScheme: 'light',
  });
  const errors = [];
  try {
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const url = `http://127.0.0.1:${server.address().port}`;
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (['error', 'warning'].includes(message.type()))
        errors.push(message.text());
    });
    const external = () =>
      page.evaluate(() =>
        Object.fromEntries(
          [
            'html',
            'body',
            '#root',
            '#outside-heading',
            '#outside-link',
            '#outside-button',
          ].map((selector) => {
            const el = document.querySelector(selector);
            const s = getComputedStyle(el);
            return [
              selector,
              Object.fromEntries(
                [
                  'fontFamily',
                  'fontSize',
                  'lineHeight',
                  'color',
                  'backgroundColor',
                  'margin',
                  'padding',
                  'minHeight',
                  'boxSizing',
                  'borderWidth',
                  'textDecorationLine',
                ].map((key) => [key, s[key]]),
              ),
            ];
          }),
        ),
      );
    await page.goto(url + '/host.html');
    const before = await external();
    await page.goto(url);
    await page.locator('html[data-isolation-ready="true"]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .every((animation) => animation.playState !== 'running'),
    );
    assert.deepEqual(
      await external(),
      before,
      'Isolated CSS must preserve host styles when imported after host CSS',
    );
    const button = page.getByRole('button', { name: 'Count 0', exact: true });
    const actual = await button.evaluate((element) => {
      const s = getComputedStyle(element);
      const r = element.getBoundingClientRect();
      return {
        box: s.boxSizing,
        padding: s.paddingLeft,
        radius: s.borderRadius,
        color: s.backgroundColor,
        font: s.fontFamily,
        lineHeight: s.lineHeight,
        weight: s.fontWeight,
        size: s.fontSize,
        height: r.height,
        width: r.width,
      };
    });
    assert.deepEqual(
      actual,
      { ...legacyBox, box: 'content-box', ...legacyDefaultGeometry },
      'Internal Button must preserve the frozen legacy default geometry',
    );
    assert.equal(
      await page
        .locator('.fq-input-container')
        .evaluate((el) => getComputedStyle(el).boxSizing),
      'border-box',
    );
    const layers = await page.evaluate(() => {
      const result = [];
      const walk = (rules) => {
        for (const rule of rules) {
          if (rule.constructor.name === 'CSSLayerBlockRule')
            result.push({
              name: rule.name,
              count: rule.cssRules.length,
              button: rule.cssText.includes('.fq-button'),
              tokens: rule.cssText.includes('--color-primary'),
            });
          if (rule.cssRules) walk(rule.cssRules);
        }
      };
      for (const sheet of document.styleSheets) walk(sheet.cssRules);
      return result;
    });
    assert(
      layers.some(
        (layer) => layer.name === 'fq' && layer.count > 0 && layer.button,
      ),
      'Actual FQ component rules must be in a layer',
    );
    assert(layers.some((layer) => layer.name === 'fq-tokens' && layer.tokens));
    assert(layers.some((layer) => layer.name === 'mui' && layer.count > 0));
    assert(!layers.some((layer) => layer.name === 'reset'));
    // Mode changes must affect only library tokens, including the media fallback.
    await page.locator('html').evaluate((el) => {
      el.dataset.theme = 'dark';
    });
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .every((animation) => animation.playState !== 'running'),
    );
    assert.equal(
      await page
        .locator('.fq-input-container')
        .evaluate((el) => getComputedStyle(el).backgroundColor),
      'rgb(15, 23, 42)',
    );
    assert.deepEqual(await external(), before);
    await page.emulateMedia({ colorScheme: 'dark' });
    await page
      .locator('html')
      .evaluate((el) => el.removeAttribute('data-theme'));
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .every((animation) => animation.playState !== 'running'),
    );
    assert.equal(
      await page
        .locator('.fq-input-container')
        .evaluate((el) => getComputedStyle(el).backgroundColor),
      'rgb(15, 23, 42)',
    );
    assert.deepEqual(await external(), before);
    await page.emulateMedia({ colorScheme: 'light' });
    await page.locator('html').evaluate((el) => {
      el.dataset.theme = 'light';
    });
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .every((animation) => animation.playState !== 'running'),
    );
    await page.evaluate(() => {
      document.querySelector('#host-style').textContent +=
        ' .consumer-button{background-color:rgb(90,60,30);border-radius:17px;padding-inline:31px;font-family:Georgia,serif}';
    });
    const overrides = async () => {
      await page.waitForFunction(() =>
        document
          .getAnimations()
          .every((animation) => animation.playState !== 'running'),
      );
      return button.evaluate((el) => {
        const s = getComputedStyle(el);
        return {
          color: s.backgroundColor,
          radius: s.borderRadius,
          padding: s.paddingLeft,
          font: s.fontFamily,
          slotFont: getComputedStyle(el.querySelector('.fq-button__content'))
            .fontFamily,
        };
      });
    };
    const expected = {
      color: 'rgb(90, 60, 30)',
      radius: '17px',
      padding: '31px',
      font: 'Georgia, serif',
      slotFont: 'Georgia, serif',
    };
    assert.deepEqual(
      await overrides(),
      expected,
      'Unlayered consumer CSS must win even when imported first',
    );
    await page.evaluate(() =>
      document.head.append(document.querySelector('#host-style')),
    );
    assert.deepEqual(
      await overrides(),
      expected,
      'Unlayered consumer CSS must also win when imported last',
    );
    assert.deepEqual(await external(), before);
    await button.hover();
    assert.deepEqual(
      await overrides(),
      expected,
      'Consumer background override must survive FQ hover state',
    );
    await button.click();
    await page.getByRole('button', { name: 'Count 1', exact: true }).waitFor();
    await page
      .getByRole('textbox', { name: 'Isolated input' })
      .fill('isolated consumer');
    assert.deepEqual(await page.evaluate(() => window.recoverableErrors), []);
    assert.deepEqual(
      errors,
      [],
      'Isolated SSR/hydration must have no warnings',
    );
    // Reset remains a separate, explicit application-level choice.
    await page.evaluate(() => document.querySelector('#host-style').remove());
    const marginBefore = await page
      .locator('body')
      .evaluate((el) => getComputedStyle(el).margin);
    assert.equal(marginBefore, '8px');
    const resetSheet = await page.addStyleTag({ url: url + '/reset.css' });
    assert.equal(
      await page.locator('body').evaluate((el) => getComputedStyle(el).margin),
      '0px',
    );
    assert(
      (
        await page
          .locator('body')
          .evaluate((el) => getComputedStyle(el).fontFamily)
      ).includes('Inter'),
    );
    await resetSheet.evaluate((element) =>
      document.head.insertBefore(
        element,
        document.querySelector('link[rel="stylesheet"]'),
      ),
    );
    assert.equal(
      await page.locator('body').evaluate((el) => getComputedStyle(el).margin),
      '0px',
    );
    return {
      modes: ['explicit-light', 'explicit-dark', 'system-dark'],
      resetImportOrders: ['before', 'after'],
      hostStyles: before,
      componentStyles: actual,
      layers,
      consumerImportOrders: ['before', 'after'],
      reset: 'opt-in confirmed',
      ssr: 'layered SSR + hydration without warnings',
    };
  } finally {
    await context.close();
    await new Promise((resolve) => server.close(resolve));
  }
}
