/* global document, HTMLElement, getComputedStyle */
import {
  sourceIdentity,
  assertSameSource,
} from './verification-provenance.mjs';
import { format, resolveConfig } from 'prettier';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {
  verifyControlDensity,
  verifyNavigationDensity,
  verifyFeedbackDensity,
  verifyOverlayDensity,
  verifyDensityOffsets,
} from './verify-density-behavior.mjs';
import { verifyPortalBehavior } from './verify-portal-behavior.mjs';
import { verifySlotBehavior } from './verify-slot-behavior.mjs';
import { verifyThemeBehavior } from './verify-theme-behavior.mjs';
import { verifyTooltipBehavior } from './verify-tooltip-behavior.mjs';
import {
  inspectAccessibility,
  assertAccessible,
  verifyAccessibilityGate,
} from './verify-overlay-accessibility.mjs';
import { verifyOverlayBehavior } from './verify-overlay-behavior.mjs';

const formatting = { ...(await resolveConfig('package.json')), parser: 'json' };
const filter = process.argv
  .find((arg) => arg.startsWith('--filter='))
  ?.slice(9);
const behaviorOnly = process.argv.includes('--behavior-only');
const pendingBaselines = new Map();
const update = process.argv.includes('--update');
const reason = process.argv
  .find((arg) => arg.startsWith('--reason='))
  ?.slice(9);
if (update && behaviorOnly)
  throw new Error('Behavior-only runs cannot update style baselines');
if (behaviorOnly && filter)
  throw new Error('Use either --behavior-only or --filter, not both');
if (update && !reason)
  throw new Error('Baseline updates require --reason=<explanation>');
const root = path.resolve('storybook-static');
const baselineDir = 'verification/baselines';
const reportDir = behaviorOnly
  ? 'verification/reports/behavior'
  : filter
    ? 'verification/reports/filtered'
    : 'verification/reports';
const startedAt = new Date().toISOString();
const sourceAtStart = await sourceIdentity();
let buildStamp;
try {
  buildStamp = JSON.parse(
    await readFile(path.join(root, 'verification-build.json'), 'utf8'),
  );
} catch {
  throw new Error(
    'Missing verification build provenance. Run npm run verify:browser to rebuild.',
  );
}
assertSameSource(buildStamp.source, sourceAtStart);
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};
const server = createServer(async (req, res) => {
  try {
    const filename = path.resolve(
      root,
      '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname),
    );
    if (!filename.startsWith(root + path.sep)) throw new Error('Invalid path');
    const data = await readFile(filename);
    res.writeHead(200, {
      'Content-Type':
        mime[path.extname(filename)] || 'application/octet-stream',
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});
let browser;
const results = [];
const accessibilityResults = [];
const audit = async (page, key, selector) => {
  const report = await inspectAccessibility(page, key, selector);
  accessibilityResults.push(report);
  assertAccessible(report);
};
const escape = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
try {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const url = `http://127.0.0.1:${server.address().port}`;
  const index = JSON.parse(
    await readFile(path.join(root, 'index.json'), 'utf8'),
  );
  const stories = Object.values(index.entries).filter(
    (entry) =>
      entry.type === 'story' &&
      (entry.title.startsWith('Components/') ||
        entry.title.startsWith('Icons/')),
  );
  // One initial story per family plus explicit state/size coverage for controls.
  const families = new Set();
  const selected = stories.filter((story) => {
    if (!families.has(story.title)) {
      families.add(story.title);
      return true;
    }
    return (
      /^(components-button|components-input|components-accordion)--/.test(
        story.id,
      ) && !/interaction|accessibility|keyboard/.test(story.id)
    );
  });
  const visibleTooltip = stories.find(
    (story) => story.id === 'components-tooltip--visible-contract',
  );
  assert(visibleTooltip, 'Visible Tooltip contract is required');
  selected.push(visibleTooltip);
  const primary = stories.find(
    (story) => story.id === 'components-button--primary',
  );
  assert(
    primary,
    'Primary Button story is required for interaction-state contracts',
  );
  for (const state of ['hover', 'focus', 'active'])
    selected.push({ ...primary, state });
  const longContent = stories.find(
    (story) => story.id === 'components-field--long-content',
  );
  if (longContent) selected.push(longContent);
  assert(selected.length > 0, 'No component stories found');
  browser = await chromium.launch({ headless: true });
  const environment = {
    browser: browser.version(),
    platform: process.platform,
    arch: process.arch,
    schema: 1,
  };
  await mkdir(baselineDir, { recursive: true });
  await mkdir(reportDir, { recursive: true });
  const inventory = [];
  for (const theme of ['light', 'dark'])
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1440, height: 900 },
    ]) {
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        colorScheme: theme,
        reducedMotion: 'reduce',
        locale: 'en-US',
        timezoneId: 'UTC',
      });
      const page = await context.newPage();
      // Fixed wall time and frozen application intervals; RAF/timeouts still mount overlays.
      await page.addInitScript(() => {
        const NativeDate = Date;
        const fixed = 1794225600000;
        globalThis.Date = class extends NativeDate {
          constructor(...args) {
            super(...(args.length ? args : [fixed]));
          }
          static now() {
            return fixed;
          }
        };
        globalThis.setInterval = () => 0;
      });
      for (const story of selected) {
        const key = `${story.id}${story.state ? '-' + story.state : ''}-${theme}-${viewport.width}`;
        if (behaviorOnly || (filter && !key.includes(filter))) continue;
        try {
          await page.goto(
            `${url}/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`,
          );
          await page
            .locator('body [class*="fq-"]')
            .first()
            .waitFor({ state: 'attached', timeout: 10000 });
          await page.evaluate(() => document.fonts.ready);
          await page.addStyleTag({
            content:
              '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}',
          });
          await page.waitForTimeout(100);
          assert.equal(
            await page.locator('html').getAttribute('data-theme'),
            theme,
          );
          if (story.state === 'hover') await page.locator('.fq-button').hover();
          if (story.state === 'focus') {
            await page.keyboard.press('Tab');
            await page.locator('.fq-button').focus();
          }
          if (story.state === 'focus')
            assert.equal(
              await page
                .locator('.fq-button')
                .evaluate((el) => el.matches(':focus-visible')),
              true,
            );
          if (story.state === 'active') {
            await page.locator('.fq-button').hover();
            await page.mouse.down();
          }
          const snapshot = await page.evaluate(() => {
            const properties = [
              'display',
              'visibility',
              'color',
              'background-color',
              'padding-top',
              'padding-right',
              'padding-bottom',
              'padding-left',
              'gap',
              'border-radius',
              'border-width',
              'border-color',
              'font-family',
              'font-size',
              'font-weight',
              'line-height',
              'box-shadow',
              'outline-style',
              'outline-width',
              'outline-color',
              'opacity',
              'position',
              'overflow',
            ];
            const style = (element, pseudo) => {
              const computed = getComputedStyle(element, pseudo);
              return Object.fromEntries(
                properties.map((property) => [
                  property,
                  computed.getPropertyValue(property),
                ]),
              );
            };
            const elements = [
              ...document.querySelectorAll('[class*="fq-"]'),
            ].filter((el) => el instanceof HTMLElement);
            return elements.map((element) => {
              const rect = element.getBoundingClientRect();
              const round = (value) => Math.round(value * 1000) / 1000;
              const classes = [...element.classList]
                .filter((name) => name.startsWith('fq-'))
                .sort();
              return {
                tag: element.tagName.toLowerCase(),
                classes,
                role: element.getAttribute('role'),
                disabled: element.hasAttribute('disabled'),
                styles: style(element),
                pseudo: Object.fromEntries(
                  ['::before', '::after'].map((pseudo) => [
                    pseudo,
                    {
                      content: getComputedStyle(element, pseudo).content,
                      styles: style(element, pseudo),
                    },
                  ]),
                ),
                rect: {
                  x: round(rect.x),
                  y: round(rect.y),
                  width: round(rect.width),
                  height: round(rect.height),
                },
                scroll: {
                  width: element.scrollWidth,
                  height: element.scrollHeight,
                  clientWidth: element.clientWidth,
                  clientHeight: element.clientHeight,
                },
              };
            });
          });
          assert(snapshot.length > 0);
          const aria = await page.locator('body').ariaSnapshot();
          await page.mouse.up();
          const actual = {
            environment,
            story: story.id,
            theme,
            viewport,
            elements: snapshot,
            aria,
          };
          await writeFile(
            path.join(reportDir, key + '.actual.json'),
            JSON.stringify(actual, null, 2) + '\n',
          );
          const filename = path.join(baselineDir, key + '.json');
          if (update) {
            pendingBaselines.set(
              filename,
              await format(JSON.stringify(actual), formatting),
            );
          } else {
            const expected = JSON.parse(await readFile(filename, 'utf8'));
            assert.deepEqual(actual, expected);
          }
          results.push({ key, status: update ? 'recorded' : 'passed' });
        } catch (error) {
          const html = await page
            .locator('body')
            .innerHTML()
            .catch(() => 'Unavailable');
          await writeFile(
            path.join(reportDir, key + '.html'),
            `<pre>${escape(html)}</pre>`,
          );
          results.push({ key, status: 'failed', error: error.message });
        }
        inventory.push(key);
      }
      // Independent browser behavior assertions, not captured as accepted bug baselines.
      if (!filter)
        try {
          // Behavioral focus recovery needs real intervals (MUI polls body focus).
          // Baseline pages freeze intervals only for deterministic Countdown data.
          const page = await context.newPage();
          await page.goto(
            `${url}/iframe.html?id=components-input--unfilled&viewMode=story&globals=theme:${theme}`,
          );
          const auditScenario = (page, name, selector) =>
            audit(page, `${name}-${theme}-${viewport.width}`, selector);
          await verifyThemeBehavior(page, url, theme);
          await verifySlotBehavior(page, url, theme);
          await verifyPortalBehavior(page, url, theme);
          await verifyControlDensity(page, url, theme);
          await verifyNavigationDensity(page, url, theme);
          await verifyFeedbackDensity(page, url, theme);
          await verifyOverlayDensity(page, url, theme);
          await verifyDensityOffsets(page, url, theme);
          await verifyOverlayBehavior(page, url, theme, auditScenario);
          await verifyTooltipBehavior(page, url, theme, auditScenario);
          // Dialog ARIA must live on the paper, not MUI's presentation root.
          await page.goto(
            `${url}/iframe.html?id=components-dialog--default&viewMode=story&globals=theme:${theme}`,
          );
          const namedDialog = page.getByRole('dialog', {
            name: 'Dialog Title',
            exact: true,
          });
          await namedDialog.waitFor();
          const headingId = await namedDialog.getAttribute('aria-labelledby');
          assert(headingId);
          assert.equal(
            await page.locator(`[id="${headingId}"]`).textContent(),
            'Dialog Title',
          );
          await auditScenario(page, 'dialog-default', '.fq-dialog');
          if (theme === 'light' && viewport.width === 390) {
            await verifyAccessibilityGate(page, accessibilityResults);
          }
          await page.goto(
            `${url}/iframe.html?id=components-dialog--without-title&viewMode=story&globals=theme:${theme}`,
          );
          const titlelessDialog = page.getByRole('dialog', {
            name: 'Review order',
            exact: true,
          });
          await titlelessDialog.waitFor();
          assert.equal(
            await titlelessDialog.getAttribute('aria-labelledby'),
            null,
          );
          assert.equal(
            await titlelessDialog.getAttribute('aria-describedby'),
            'order-description',
          );
          assert.equal(
            await page.locator('#order-description').textContent(),
            'Check the delivery address.',
          );
          await auditScenario(page, 'dialog-titleless', '.fq-dialog');
          await page.goto(
            `${url}/iframe.html?id=components-input--unfilled&viewMode=story&globals=theme:${theme}`,
          );
          const input = page.locator('input').first();
          await input.fill('Consumer input');
          assert.equal(await input.inputValue(), 'Consumer input');
          await page.keyboard.press('Tab');
          assert.equal(
            await input.evaluate((el) => document.activeElement === el),
            false,
          );
          await page.goto(
            `${url}/iframe.html?id=components-button--disabled&viewMode=story&globals=theme:${theme}`,
          );
          await page.locator('.fq-button').first().waitFor();
          assert.equal(
            await page.locator('.fq-button').first().isDisabled(),
            true,
          );
          await page.goto(
            `${url}/iframe.html?id=components-tabs--default&viewMode=story&globals=theme:${theme}`,
          );
          const flights = page.getByRole('tab', {
            name: 'Flights',
            exact: true,
          });
          await flights.focus();
          await page.keyboard.press('ArrowRight');
          const hotels = page.getByRole('tab', { name: 'Hotels', exact: true });
          assert.equal(await hotels.getAttribute('aria-selected'), 'true');
          assert.equal(
            await hotels.evaluate((el) => document.activeElement === el),
            true,
          );
          const panelId = await hotels.getAttribute('aria-controls');
          assert(panelId);
          assert.equal(
            await page.locator(`[id="${panelId}"]`).getAttribute('role'),
            'tabpanel',
          );
          await page.goto(
            `${url}/iframe.html?id=components-accordion--default&viewMode=story&globals=theme:${theme}`,
          );
          const baggage = page.getByRole('button', {
            name: 'Baggage policy',
            exact: true,
          });
          const cancellation = page.getByRole('button', {
            name: 'Cancellation & refund',
            exact: true,
          });
          for (let attempt = 0; attempt < 3; attempt++) {
            await baggage.click();
            assert.equal(await baggage.getAttribute('aria-expanded'), 'true');
            await cancellation.click();
            assert.equal(await baggage.getAttribute('aria-expanded'), 'false');
            assert.equal(
              await cancellation.getAttribute('aria-expanded'),
              'true',
            );
            await cancellation.click();
            assert.equal(
              await cancellation.getAttribute('aria-expanded'),
              'false',
            );
          }
          await page.goto(
            `${url}/iframe.html?id=components-accordion--controlled&viewMode=story&globals=theme:${theme}`,
          );
          const controlledBaggage = page.getByRole('button', {
            name: 'Baggage policy',
            exact: true,
          });
          const controlledCancellation = page.getByRole('button', {
            name: 'Cancellation & refund',
            exact: true,
          });
          await controlledBaggage.waitFor();
          assert.equal(
            await controlledBaggage.getAttribute('aria-expanded'),
            'true',
          );
          await controlledBaggage.click();
          assert.equal(
            await controlledBaggage.getAttribute('aria-expanded'),
            'false',
          );
          await controlledCancellation.click();
          assert.equal(
            await controlledCancellation.getAttribute('aria-expanded'),
            'true',
          );
          await controlledBaggage.click();
          assert.equal(
            await controlledCancellation.getAttribute('aria-expanded'),
            'false',
          );
          assert.equal(
            await controlledBaggage.getAttribute('aria-expanded'),
            'true',
          );
          await page.goto(
            `${url}/iframe.html?id=components-form--default&viewMode=story&globals=theme:${theme}`,
          );
          const email = page.getByRole('textbox', { name: /Email/ });
          await email.waitFor();
          const fieldId = await email.getAttribute('id');
          assert(fieldId);
          assert.equal(
            await page
              .locator('label')
              .filter({ hasText: 'Email' })
              .getAttribute('for'),
            fieldId,
          );
          assert.equal(
            await page
              .locator('[id]')
              .evaluateAll(
                (elements) =>
                  new Set(elements.map((el) => el.id)).size === elements.length,
              ),
            true,
          );
          const describedBy = await email.getAttribute('aria-describedby');
          for (const id of (describedBy || '').split(/\s+/).filter(Boolean))
            assert.equal(await page.locator(`[id="${id}"]`).count(), 1);
          assert.equal(await email.evaluate((el) => el.checkValidity()), false);
          await email.fill('consumer@example.com');
          assert.equal(await email.evaluate((el) => el.checkValidity()), true);
          await page.locator('form').evaluate((form) => {
            form.dataset.submits = '0';
            form.addEventListener('submit', () => {
              form.dataset.submits = String(Number(form.dataset.submits) + 1);
            });
          });
          const submit = page.getByRole('button', {
            name: 'Register',
            exact: true,
          });
          const clickable = await submit.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            const target = document.elementFromPoint(
              rect.x + rect.width / 2,
              rect.y + rect.height / 2,
            );
            return (
              rect.width > 0 &&
              rect.height >= 24 &&
              !!target &&
              el.contains(target)
            );
          });
          assert.equal(
            clickable,
            true,
            'Submit button must remain visible and hit-testable',
          );
          await submit.click();
          assert.equal(
            await page.locator('form').getAttribute('data-submits'),
            '1',
          );
          await page.locator('form').evaluate((form) => form.reset());
          assert.equal(await email.inputValue(), '');
          results.push({
            key: `behavior-${theme}-${viewport.width}`,
            status: 'passed',
          });
        } catch (error) {
          results.push({
            key: `behavior-${theme}-${viewport.width}`,
            status: 'failed',
            error: error.message,
          });
        }
      await context.close();
    }
  assert(results.length > 0, 'No scenarios matched the requested filter');
  const beforeUpdate = await sourceIdentity();
  try {
    assertSameSource(sourceAtStart, beforeUpdate);
    assert.equal(
      sourceAtStart.baselineFingerprint,
      beforeUpdate.baselineFingerprint,
      'Baseline inputs changed during verification',
    );
  } catch (error) {
    results.push({
      key: 'input-integrity',
      status: 'failed',
      error: error.message,
    });
  }
  if (update && !results.some((result) => result.status === 'failed')) {
    for (const [filename, content] of pendingBaselines)
      await writeFile(filename, content);
    await writeFile(
      'verification/baseline-metadata.json',
      await format(
        JSON.stringify({
          environment,
          reason,
          capturedAt: new Date().toISOString(),
          scenarios: (await readdir(baselineDir)).filter((file) =>
            file.endsWith('.json'),
          ).length,
          capturedScenarios: inventory,
          source: sourceAtStart,
          build: buildStamp,
        }),
        formatting,
      ),
    );
  }
  await writeFile(
    path.join(reportDir, 'accessibility-results.json'),
    await format(
      JSON.stringify({ source: sourceAtStart, audits: accessibilityResults }),
      formatting,
    ),
  );
  const runMetadata = {
    schemaVersion: 1,
    nodeVersion: process.version,
    startedAt,
    finishedAt: new Date().toISOString(),
    command: ['node', 'scripts/verify-browser.mjs', ...process.argv.slice(2)],
    mode: update
      ? 'update'
      : behaviorOnly
        ? 'behavior-only'
        : filter
          ? 'filtered'
          : 'comparison',
    filter: filter || null,
    reason: reason || null,
    environment,
    source: sourceAtStart,
    sourceAfter: await sourceIdentity(),
    build: buildStamp,
    status: results.some((result) => result.status === 'failed')
      ? 'failed'
      : 'passed',
    checks: results.length,
    passed: results.filter((result) => result.status !== 'failed').length,
  };
  await writeFile(
    path.join(reportDir, 'run-metadata.json'),
    await format(JSON.stringify(runMetadata), formatting),
  );
  await writeFile(
    path.join(reportDir, 'results.json'),
    JSON.stringify(results, null, 2) + '\n',
  );
  await writeFile(
    path.join(reportDir, 'verification-report.html'),
    `<!doctype html><html lang="en"><meta charset="utf-8"><title>Browser contract verification</title><h1>Browser contract verification</h1><p>No screenshots. Exact style/geometry comparison on the recorded browser environment.</p><details><summary>Source provenance</summary><pre>${escape(JSON.stringify(runMetadata, null, 2))}</pre></details><table><tr><th>Scenario</th><th>Result</th><th>Difference</th></tr>${results.map((result) => `<tr><td>${escape(result.key)}</td><td>${escape(result.status)}</td><td><pre>${escape(result.error || '')}</pre></td></tr>`).join('')}</table></html>`,
  );
  console.log(
    `${results.filter((result) => result.status !== 'failed').length}/${results.length} checks passed or recorded; report: ${reportDir}/verification-report.html`,
  );
  if (results.some((result) => result.status === 'failed'))
    process.exitCode = 1;
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
