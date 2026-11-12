/* global document, getComputedStyle */
import assert from 'node:assert/strict';

export async function verifyTooltipBehavior(page, url, theme, audit) {
  await page.goto(
    `${url}/iframe.html?id=components-tooltip--lifecycle&viewMode=story&globals=theme:${theme}`,
  );
  const trigger = page.getByRole('button', {
    name: 'Account help',
    exact: true,
  });
  const tooltip = page.getByRole('tooltip');
  assert.equal(await trigger.getAttribute('aria-describedby'), 'existing-help');

  await trigger.focus();
  await tooltip.waitFor();
  const tooltipId = await tooltip.getAttribute('id');
  assert.equal(
    await trigger.getAttribute('aria-describedby'),
    `existing-help ${tooltipId}`,
  );
  await audit(page, 'tooltip-focus', '.fq-tooltip');
  await page.keyboard.press('Escape');
  await tooltip.waitFor({ state: 'hidden' });
  assert.equal(await trigger.getAttribute('aria-describedby'), 'existing-help');
  assert.equal(
    await trigger.evaluate((el) => document.activeElement === el),
    true,
  );
  await page.keyboard.press('Tab');

  for (const placement of [
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
    'right',
    'right-start',
    'right-end',
  ]) {
    await page.mouse.move(0, 0);
    await page
      .getByRole('combobox', { name: 'Tooltip placement' })
      .selectOption(placement);
    await trigger.hover();
    await tooltip.waitFor();
    await page.waitForFunction(() => {
      const el = document.querySelector('[role="tooltip"]');
      return el && getComputedStyle(el).opacity === '1';
    });
    const from = await trigger.boundingBox();
    const to = await tooltip.boundingBox();
    assert(from && to);
    // Cross the shared edge before moving within a tall or wide bubble.
    // A diagonal to a distant center can leave both trigger and gap entirely.
    const center = { x: from.x + from.width / 2, y: from.y + from.height / 2 };
    const destination = { x: to.x + to.width / 2, y: to.y + to.height / 2 };
    const horizontal =
      placement.startsWith('left') || placement.startsWith('right');
    const crossing = horizontal
      ? {
          x: destination.x,
          y: Math.max(to.y + 1, Math.min(center.y, to.y + to.height - 1)),
        }
      : {
          x: Math.max(to.x + 1, Math.min(center.x, to.x + to.width - 1)),
          y: destination.y,
        };
    await page.mouse.move(center.x, center.y);
    let origin = center;
    for (const waypoint of [crossing, destination]) {
      for (let step = 1; step <= 8; step += 1) {
        await page.mouse.move(
          origin.x + ((waypoint.x - origin.x) * step) / 8,
          origin.y + ((waypoint.y - origin.y) * step) / 8,
        );
        await page.waitForTimeout(25);
        assert.equal(
          await tooltip.count(),
          1,
          `Hover bridge lost at ${placement}, step ${step}`,
        );
      }
      origin = waypoint;
    }
    assert.equal(
      await tooltip.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return el.contains(
          document.elementFromPoint(
            rect.x + rect.width / 2,
            rect.y + rect.height / 2,
          ),
        );
      }),
      true,
      `Tooltip ${placement} must receive pointer input`,
    );
    await page.keyboard.press('Escape'); // Focus is on the placement select, outside Tooltip.
    await tooltip.waitFor({ state: 'hidden' });
    await page.mouse.move(0, 0);
  }
}
