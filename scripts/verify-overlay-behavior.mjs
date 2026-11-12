/* global document, getComputedStyle */
import assert from 'node:assert/strict';

export async function verifyOverlayBehavior(page, url, theme, audit) {
  await page.goto(
    `${url}/iframe.html?id=components-bottomsheet--lifecycle&viewMode=story&globals=theme:${theme}`,
  );
  const sheet = page.getByRole('dialog', {
    name: 'Lifecycle sheet',
    exact: true,
  });
  const dialog = page.getByRole('dialog', {
    name: 'Lifecycle dialog',
    exact: true,
  });
  const trigger = page.getByRole('button', {
    name: 'Open lifecycle sheet',
    exact: true,
  });
  let focusStep = 0;
  const focused = async (locator) => {
    focusStep += 1;
    try {
      await page.waitForFunction(
        (el) => document.activeElement === el,
        await locator.elementHandle(),
        { timeout: 5000 },
      );
    } catch {
      throw new Error(
        `Focus step ${focusStep}: expected focus on ${await locator.evaluate((el) => el.outerHTML)}; actual ${await page.evaluate(() => document.activeElement?.outerHTML)}`,
      );
    }
  };
  const locked = async () =>
    assert.equal(
      await page.evaluate(() => getComputedStyle(document.body).overflow),
      'hidden',
    );
  let exitStep = 0;
  const sheetGone = async () => {
    exitStep += 1;
    try {
      await page
        .locator('.fq-bottom-sheet')
        .waitFor({ state: 'detached', timeout: 5000 });
    } catch (error) {
      throw new Error(`Sheet exit step ${exitStep}: ${error.message}`);
    }
  };
  const dialogGone = () =>
    page.locator('.fq-dialog').waitFor({ state: 'detached' });

  await trigger.click();
  await sheet.waitFor();
  await focused(sheet.getByRole('button', { name: 'Close', exact: true }));
  await page.keyboard.press('Shift+Tab');
  await focused(sheet.getByRole('button', { name: 'Finish sheet' }));
  await page.keyboard.press('Tab');
  await focused(sheet.getByRole('button', { name: 'Close', exact: true }));
  await locked();
  await page.waitForFunction(() => {
    const el = document.querySelector('.fq-bottom-sheet');
    return el && getComputedStyle(el).transform === 'matrix(1, 0, 0, 1, 0, 0)';
  });
  const bounds = await sheet.boundingBox();
  const viewport = page.viewportSize();
  assert(bounds && viewport);
  assert.equal(bounds.x, 0);
  assert.equal(bounds.width, viewport.width);
  assert(Math.abs(bounds.y + bounds.height - viewport.height) <= 0.5);
  const closeBounds = await sheet
    .getByRole('button', { name: 'Close', exact: true })
    .boundingBox();
  assert(
    closeBounds &&
      closeBounds.y >= bounds.y &&
      closeBounds.y + closeBounds.height <= viewport.height,
  );
  await page
    .getByRole('button', {
      name: 'Open lifecycle sheet',
      includeHidden: true,
      exact: true,
    })
    .evaluate((el) => el.focus());
  assert.equal(
    await sheet.evaluate((el) => el.contains(document.activeElement)),
    true,
  );

  await audit(page, 'bottomsheet-default', '.fq-bottom-sheet');
  await sheet.getByRole('button', { name: 'Open nested dialog' }).click();
  await dialog.waitFor();
  await audit(page, 'stacked-dialog', '.fq-dialog');
  await page.keyboard.press('Escape');
  await dialogGone();
  await sheet.waitFor();
  await locked();
  await focused(sheet.getByRole('button', { name: 'Open nested dialog' }));
  await page.keyboard.press('Escape');
  await sheetGone();
  await focused(trigger);
  assert.notEqual(
    await page.evaluate(() => getComputedStyle(document.body).overflow),
    'hidden',
  );

  // Reverse opening order must use the same manager and visual hit-test stack.
  await page
    .getByRole('button', { name: 'Open lifecycle dialog', exact: true })
    .click();
  await dialog.waitFor();
  await dialog.getByRole('button', { name: 'Open nested sheet' }).click();
  await sheet.waitFor();
  await audit(page, 'stacked-sheet', '.fq-bottom-sheet');
  const close = sheet.getByRole('button', { name: 'Close', exact: true });
  await close.click(); // Playwright verifies that the upper sheet receives pointer input.
  await sheetGone();
  await dialog.waitFor();
  await locked();
  await focused(dialog.getByRole('button', { name: 'Open nested sheet' }));
  await page.keyboard.press('Escape');
  await dialogGone();

  await page.getByRole('button', { name: 'Open empty sheet' }).click();
  const empty = page.getByRole('dialog', { name: 'Empty sheet' });
  await empty.waitFor();
  await focused(empty);
  await audit(page, 'bottomsheet-empty', '.fq-bottom-sheet');
  await page.keyboard.press('Tab');
  await focused(empty);
  await page.keyboard.press('Shift+Tab');
  await focused(empty);
  await page.keyboard.press('Escape');
  await sheetGone();
  await focused(page.getByRole('button', { name: 'Open empty sheet' }));

  await trigger.click();
  await sheet.waitFor();
  await page
    .locator('.fq-bottom-sheet__overlay')
    .click({ position: { x: 4, y: 4 } });
  await sheetGone();
  await focused(trigger);

  await page.goto(
    `${url}/iframe.html?id=components-bottomsheet--no-backdrop-dismiss&viewMode=story&globals=theme:${theme}`,
  );
  await page.getByRole('button', { name: 'Open Sheet' }).click();
  await page.getByRole('dialog', { name: 'Sticky Sheet' }).waitFor();
  await focused(page.getByRole('button', { name: 'Close', exact: true }));
  await page
    .locator('.fq-bottom-sheet__overlay')
    .click({ position: { x: 4, y: 4 } });
  assert.equal(
    await page.getByRole('dialog', { name: 'Sticky Sheet' }).count(),
    1,
  );
  await page.waitForFunction(() =>
    document.activeElement?.closest('.fq-bottom-sheet'),
  );
  await page.keyboard.press('Escape');
  await sheetGone();
  await page.goto(
    `${url}/iframe.html?id=components-bottomsheet--inline-lifecycle&viewMode=story&globals=theme:${theme}`,
  );
  const inlineTrigger = page.getByRole('button', { name: 'Open inline sheet' });
  await inlineTrigger.click();
  const inline = page.getByRole('dialog', {
    name: 'Inline sheet',
    exact: true,
  });
  await inline.waitFor();
  await focused(inline.getByRole('button', { name: 'Close', exact: true }));
  await locked();
  await audit(page, 'bottomsheet-inline', '.fq-bottom-sheet');
  await page.keyboard.press('Shift+Tab');
  await focused(inline.getByRole('button', { name: 'Finish inline sheet' }));
  await page.keyboard.press('Escape');
  await sheetGone();
  await focused(inlineTrigger);
}
