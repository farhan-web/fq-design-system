/* global window, document, getComputedStyle */
import assert from 'node:assert/strict';
import axe from 'axe-core';

export async function inspectAccessibility(page, key, selector = 'body') {
  await page.evaluate(() => document.fonts.ready);
  await page.addScriptTag({
    content: axe.source + '\nwindow.__fqOverlayAxe = window.axe;',
  });
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every((animation) => animation.playState !== 'running'),
  );
  const ruleIds = [
    ...axe
      .getRules(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .map((rule) => rule.ruleId),
    'aria-dialog-name',
  ];
  const report = await page.evaluate(
    async ({ ruleIds, selector }) => {
      const result = await window.__fqOverlayAxe.run(
        document.querySelector(selector),
        {
          runOnly: {
            type: 'rule',
            values: ruleIds,
          },
        },
      );
      return {
        engine: result.testEngine,
        violations: result.violations,
        incomplete: result.incomplete,
        passedRules: result.passes.map((rule) => rule.id),
      };
    },
    { ruleIds, selector },
  );
  let contrastFallback = null;
  if (selector === '.fq-tooltip') {
    const measured = await page.getByRole('tooltip').evaluate((el) => {
      const computed = getComputedStyle(el);
      return {
        id: el.id,
        color: computed.color,
        background: computed.backgroundColor,
      };
    });
    const rgb = (value) => {
      const match = /^rgb\((\d+), (\d+), (\d+)\)$/.exec(value);
      assert(match, `Contrast fallback requires opaque sRGB, got ${value}`);
      return match.slice(1).map(Number);
    };
    const luminance = (color) =>
      rgb(color)
        .map((value) => {
          const channel = value / 255;
          return channel <= 0.04045
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4;
        })
        .reduce(
          (sum, channel, index) =>
            sum + channel * [0.2126, 0.7152, 0.0722][index],
          0,
        );
    const foreground = luminance(measured.color);
    const background = luminance(measured.background);
    contrastFallback = {
      ...measured,
      ratio:
        (Math.max(foreground, background) + 0.05) /
        (Math.min(foreground, background) + 0.05),
    };
  }
  return { key, selector, contrastFallback, ...report };
}

export function assertAccessible(report) {
  if (report.contrastFallback)
    assert(
      report.contrastFallback.ratio >= 4.5,
      `Tooltip contrast below 4.5:1 in ${report.key}`,
    );
  for (const rule of report.incomplete) {
    assert(
      rule.id === 'color-contrast' &&
        report.contrastFallback &&
        rule.nodes.every(
          (node) =>
            node.target.length === 1 &&
            node.target[0] === `#${report.contrastFallback.id}`,
        ),
      `Unreviewed axe incomplete result ${rule.id} in ${report.key}`,
    );
  }

  assert.deepEqual(
    report.violations.map(({ id, nodes }) => ({
      id,
      targets: nodes.map((node) => node.target),
    })),
    [],
    `Accessibility violations in ${report.key}`,
  );
}

export async function verifyAccessibilityGate(page, receipts) {
  const dialog = page.getByRole('dialog', {
    name: 'Dialog Title',
    exact: true,
  });
  const element = await dialog.elementHandle();
  assert(element);
  const id = await dialog.getAttribute('aria-labelledby');
  assert(id);
  await element.evaluate((el) => el.removeAttribute('aria-labelledby'));
  try {
    const report = await inspectAccessibility(
      page,
      'negative-probe-dialog-name',
      '.fq-dialog',
    );
    assert(report.violations.some(({ id }) => id === 'aria-dialog-name'));
    assert.throws(() => assertAccessible(report), /Accessibility violations/);
    receipts.push({ ...report, expectedFailure: 'aria-dialog-name' });
  } finally {
    await element.evaluate(
      (el, value) => el.setAttribute('aria-labelledby', value),
      id,
    );
  }
}
