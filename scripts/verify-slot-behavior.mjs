/* global document, getComputedStyle */
import assert from 'node:assert/strict';
export async function verifySlotBehavior(page, url, theme) {
  await page.goto(
    `${url}/iframe.html?id=foundations-overrides--contracts&viewMode=story&globals=theme:${theme}`,
  );
  const button = page.getByTestId('override-button');
  const sibling = page.getByTestId('override-sibling');
  const instance = page.getByTestId('override-instance');
  await button.waitFor();
  const styles = (el) =>
    el.evaluate((node) => {
      const s = getComputedStyle(node);
      return {
        padding: s.paddingTop,
        gap: s.gap,
        radius: s.borderRadius,
        color: s.color,
        font: s.fontFamily,
      };
    });
  const settle = () =>
    page.waitForFunction(() =>
      document.getAnimations().every((a) => a.playState !== 'running'),
    );
  const original = await styles(sibling);
  // Global -> scope -> component classes -> inline instance, same five properties.
  const css = (selector, n, color, font) =>
    `${selector}{padding:${n}px;gap:${n}px;border-radius:${n}px;color:${color};font-family:${font}}`;
  await page.addStyleTag({
    content: css('.fq-button', 7, 'rgb(10,20,30)', 'serif'),
  });
  await settle();
  assert.deepEqual(await styles(button), {
    padding: '7px',
    gap: '7px',
    radius: '7px',
    color: 'rgb(10, 20, 30)',
    font: 'serif',
  });
  const globalSibling = await styles(sibling);
  await page.addStyleTag({
    content: css(
      '[data-testid="override-scope"] .fq-button',
      8,
      'rgb(20,30,40)',
      'monospace',
    ),
  });
  await settle();
  assert.deepEqual(await styles(button), {
    padding: '8px',
    gap: '8px',
    radius: '8px',
    color: 'rgb(20, 30, 40)',
    font: 'monospace',
  });
  assert.deepEqual(await styles(sibling), globalSibling);
  await page.addStyleTag({
    content: css(
      '[data-testid="override-scope"] .consumer-button',
      11,
      'rgb(30,40,50)',
      'cursive',
    ),
  });
  await settle();
  assert.deepEqual(await styles(button), {
    padding: '11px',
    gap: '11px',
    radius: '11px',
    color: 'rgb(30, 40, 50)',
    font: 'cursive',
  });
  assert.deepEqual(await styles(instance), {
    padding: '13px',
    gap: '9px',
    radius: '17px',
    color: 'rgb(12, 34, 56)',
    font: 'monospace',
  });
  assert.deepEqual(await styles(sibling), globalSibling);
  await button.click();
  assert.equal(await button.innerText(), 'Count 1');
  const input = page.getByRole('textbox', { name: 'Custom email' });
  await input.fill('consumer@example.com');
  assert.equal(await input.getAttribute('name'), 'email');
  assert.equal(
    await input.getAttribute('aria-describedby'),
    await page.getByTestId('override-helper').getAttribute('id'),
  );
  assert.equal(
    await input.evaluate((el) => el.classList.contains('native-input')),
    true,
  );
  assert.equal(
    await page
      .locator('.consumer-field')
      .evaluate((el) => getComputedStyle(el).paddingTop),
    '6px',
  );
  await page
    .getByRole('button', { name: 'Open custom dialog', exact: true })
    .click();
  const dialog = page.getByRole('dialog', {
    name: 'Custom dialog',
    exact: true,
  });
  await dialog.waitFor();
  assert.equal(
    await dialog.evaluate((el) => getComputedStyle(el).borderRadius),
    '19px',
  );
  assert.equal(
    await page
      .getByTestId('override-dialog-content')
      .evaluate((el) => getComputedStyle(el).paddingTop),
    '23px',
  );
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await dialog.waitFor({ state: 'hidden' });
  await page
    .getByRole('button', { name: 'Open custom sheet', exact: true })
    .click();
  const sheet = page.getByRole('dialog', { name: 'Custom sheet', exact: true });
  await sheet.waitFor();
  await page.waitForFunction(
    () => document.activeElement?.getAttribute('aria-label') === 'Close',
  );
  assert.equal(
    await sheet.evaluate((el) => getComputedStyle(el).borderTopLeftRadius),
    '21px',
  );
  assert.equal(
    await page
      .getByTestId('override-sheet-body')
      .evaluate((el) => getComputedStyle(el).paddingTop),
    '25px',
  );
  assert.equal(
    await page
      .getByTestId('override-sheet-backdrop')
      .evaluate((el) => getComputedStyle(el).backgroundColor),
    'rgba(1, 2, 3, 0.5)',
  );
  await page.keyboard.press('Escape');
  await sheet.waitFor({ state: 'hidden' });
  assert.notDeepEqual(original, globalSibling);
}
