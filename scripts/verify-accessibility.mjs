/* global document, window */
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import axe from 'axe-core';
import {
  sourceIdentity,
  assertSameSource,
} from './verification-provenance.mjs';
import { serveVerificationBuild } from './verification-server.mjs';

const discovery = process.argv.includes('--discover');
const representative = process.argv.includes('--representative');
const filter = process.argv.find((a) => a.startsWith('--filter='))?.slice(9);
assert(
  !(discovery && process.env.CI),
  'Discovery cannot run as a CI accessibility gate',
);
const startedAt = new Date().toISOString(),
  source = await sourceIdentity();
const stamp = JSON.parse(
  await readFile('storybook-static/verification-build.json', 'utf8'),
);
if (!discovery) assertSameSource(stamp.source, source);
const policy = JSON.parse(
  await readFile('.storybook/a11y-policy.json', 'utf8'),
);
assert.equal(policy.schemaVersion, 1);
const rules = [
  ...new Set([
    ...axe.getRules(policy.tags).map((r) => r.ruleId),
    ...policy.extraRules,
  ]),
];
const index = JSON.parse(await readFile('storybook-static/index.json', 'utf8'));
let stories = Object.values(index.entries).filter(
  (e) =>
    e.type === 'story' &&
    (e.title.startsWith('Components/') || e.title.startsWith('Icons/')),
);
if (representative) {
  const families = new Set();
  stories = stories.filter((s) => {
    if (families.has(s.title)) return false;
    families.add(s.title);
    return true;
  });
}
if (filter) stories = stories.filter((s) => s.id.includes(filter));
assert(stories.length, 'No accessibility scenarios matched');
const jobs = stories.flatMap((story) =>
  ['light', 'dark'].map((theme) => ({
    story,
    theme,
    viewport: { width: 1440, height: 900 },
  })),
);
const reportDir = discovery
  ? 'verification/reports/a11y-discovery'
  : 'verification/reports/a11y';
await mkdir(reportDir, { recursive: true });
const server = await serveVerificationBuild();
let browser;
const results = [];
let cursor = 0;
try {
  browser = await chromium.launch({ headless: true });
  const worker = async () => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      locale: 'en-US',
      timezoneId: 'UTC',
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    for (;;) {
      const job = jobs[cursor++];
      if (!job) break;
      const key = `${job.story.id}-${job.theme}-${job.viewport.width}`;
      try {
        await page.emulateMedia({
          colorScheme: job.theme,
          reducedMotion: 'reduce',
        });
        await page.goto(
          `${server.url}/iframe.html?id=${job.story.id}&viewMode=story&globals=theme:${job.theme}`,
        );
        await page.waitForFunction(
          () =>
            document.querySelector('#storybook-root') &&
            (document.querySelector('#storybook-root').childElementCount > 0 ||
              document.querySelector(
                '.fq-dialog, .fq-bottom-sheet, .fq-snackbar',
              )),
        );
        await page.evaluate(() => document.fonts.ready);
        await page.waitForFunction(() =>
          document
            .getAnimations()
            .every(
              (a) =>
                a.effect?.getTiming().iterations === Infinity ||
                a.playState !== 'running',
            ),
        );
        await page.addScriptTag({
          content: axe.source + '\nwindow.__fqAxe = window.axe;',
        });
        const result = await page.evaluate(async (rules) => {
          const report = await window.__fqAxe.run(document.body, {
            runOnly: { type: 'rule', values: rules },
          });
          // Axe cannot infer the background behind the selected Tab's underline.
          // Resolve only this exact diagnostic with measured paint and contrast.
          const resolved = [];
          for (const rule of report.incomplete) {
            if (rule.id !== 'color-contrast') continue;
            rule.nodes = rule.nodes.filter((node) => {
              if (!node.failureSummary?.includes('due to a pseudo element'))
                return true;
              if (node.target.length !== 1) return true;
              const el = document.querySelector(node.target[0]);
              if (!el?.matches('.fq-tabs__trigger-label, .fq-tabs__badge'))
                return true;
              const trigger = el.closest(
                '.fq-tabs__trigger[aria-selected="true"]',
              );
              if (!trigger) return true;
              const rect = el.getBoundingClientRect();
              const host = trigger.getBoundingClientRect();
              const pseudo = getComputedStyle(trigger, '::after');
              const top =
                host.bottom -
                parseFloat(pseudo.bottom) -
                parseFloat(pseudo.height);
              if (!Number.isFinite(top) || top < rect.bottom) return true;
              const parse = (color) => {
                const values = color.match(/[\d.]+/g)?.map(Number);
                if (!values || !/^rgba?\(/.test(color)) return null;
                return [...values.slice(0, 3), values[3] ?? 1];
              };
              const fg = parse(getComputedStyle(el).color);
              if (!fg || fg[3] !== 1) return true;
              let bg = [255, 255, 255];
              const layers = [];
              for (let parent = el; parent; parent = parent.parentElement) {
                const style = getComputedStyle(parent);
                if (
                  style.backgroundImage !== 'none' ||
                  Number(style.opacity) !== 1
                )
                  return true;
                const layer = parse(style.backgroundColor);
                if (!layer) return true;
                layers.push(layer);
              }
              for (const layer of layers.reverse())
                bg = bg.map((c, i) => layer[i] * layer[3] + c * (1 - layer[3]));
              const luminance = (rgb) =>
                rgb.slice(0, 3).reduce((sum, c, i) => {
                  c /= 255;
                  return (
                    sum +
                    [0.2126, 0.7152, 0.0722][i] *
                      (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
                  );
                }, 0);
              const a = luminance(fg),
                b = luminance(bg);
              const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
              if (ratio < 4.5) return true;
              for (const x of [
                rect.left + 1,
                rect.left + rect.width / 2,
                rect.right - 1,
              ]) {
                const hit = document.elementFromPoint(
                  x,
                  rect.top + rect.height / 2,
                );
                if (hit !== el && !el.contains(hit)) return true;
              }
              resolved.push({
                rule: rule.id,
                target: node.target,
                ratio,
                textBottom: rect.bottom,
                underlineTop: top,
                reason:
                  'Computed opaque paint contrast >=4.5; underline below text; text hit tests unobscured',
              });
              return false;
            });
          }
          return {
            resolved,
            engine: report.testEngine,
            violations: report.violations,
            incomplete: report.incomplete.filter((rule) => rule.nodes.length),
            passes: report.passes.map((r) => r.id),
          };
        }, rules);
        results.push({
          key,
          story: job.story.id,
          theme: job.theme,
          viewport: job.viewport,
          status:
            result.violations.length || result.incomplete.length
              ? 'failed'
              : 'passed',
          ...result,
        });
      } catch (error) {
        results.push({ key, status: 'failed', error: error.message });
      }
      if (results.length % 50 === 0)
        console.log(
          `Accessibility: ${results.length}/${jobs.length} scenarios inspected`,
        );
    }
    await context.close();
  };
  await Promise.all(Array.from({ length: 3 }, worker));
  const after = await sourceIdentity();
  if (!discovery) {
    assertSameSource(source, after);
    assert.equal(
      source.baselineFingerprint,
      after.baselineFingerprint,
      'Baseline inputs changed during audit',
    );
  }
  results.sort((a, b) => a.key.localeCompare(b.key));
  const report = {
    schemaVersion: 1,
    mode: discovery ? 'discovery' : 'all-stories',
    representative,
    filter: filter ?? null,
    source,
    sourceAfter: after,
    build: stamp,
    startedAt,
    finishedAt: new Date().toISOString(),
    engine: axe.version,
    rules,
    scenarios: jobs.length,
    passed: results.filter((r) => r.status === 'passed').length,
    status: discovery
      ? 'discovered'
      : results.every((r) => r.status === 'passed')
        ? 'passed'
        : 'failed',
    results,
  };
  await writeFile(
    path.join(reportDir, 'results.json'),
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(
    `Accessibility ${report.status}: ${report.passed}/${report.scenarios}; ${reportDir}/results.json`,
  );
  if (!discovery && report.status !== 'passed') process.exitCode = 1;
} finally {
  await browser?.close();
  await server.close();
}
