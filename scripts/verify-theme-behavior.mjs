/* global document, getComputedStyle */
import assert from 'node:assert/strict';
export async function verifyThemeBehavior(page, url, theme) {
  await page.goto(
    `${url}/iframe.html?id=foundations-theme-tokens--contracts&viewMode=story&globals=theme:${theme}`,
  );
  const scope = page.getByTestId('theme-scope');
  const button = page.getByTestId('theme-button');
  const input = scope.locator('.fq-input-container');
  const sibling = page.getByTestId('theme-sibling').locator('.fq-button');
  const styles = (locator) =>
    locator.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        background: s.backgroundColor,
        radius: s.borderRadius,
        padding: s.paddingRight,
        gap: s.gap,
        font: s.fontFamily,
        shadow: s.boxShadow,
      };
    });
  await button.waitFor();
  const original = await styles(button);
  const originalInput = await styles(input);
  const originalSibling = await styles(sibling);
  const mui = page.getByTestId('mui-theme');
  const control = async (name) => {
    await page.getByRole('button', { name, exact: true }).click();
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .every((animation) => animation.playState !== 'running'),
    );
  };
  const reset = () => control('Reset theme');
  await control('Change palette');
  assert.equal(
    (await styles(button)).background,
    'rgb(102, 51, 153)',
    'Button palette must update after transitions',
  );
  assert.equal(await mui.getAttribute('data-primary'), '#663399');
  assert.equal(
    await scope
      .locator('.fq-badge')
      .evaluate((el) => getComputedStyle(el).backgroundColor),
    'rgb(102, 51, 153)',
  );
  await reset();
  await control('Change spacing');
  assert.equal((await styles(button)).padding, '20px');
  assert.equal((await styles(button)).gap, '10px');
  assert.equal(await mui.getAttribute('data-spacing'), '20px');
  await reset();
  await control('Change radius');
  assert.equal((await styles(button)).radius, '14px');
  assert.equal((await styles(input)).radius, '14px');
  assert.equal(await mui.getAttribute('data-radius'), '14');
  await reset();
  await control('Change font');
  assert((await styles(button)).font.includes('Georgia'));
  assert.equal(await mui.getAttribute('data-font'), 'Georgia, serif');
  await reset();
  const shadowBefore = await scope
    .getByTestId('theme-shadow')
    .evaluate((el) => getComputedStyle(el).boxShadow);
  await control('Change shadow');
  assert.notEqual(
    await scope
      .getByTestId('theme-shadow')
      .evaluate((el) => getComputedStyle(el).boxShadow),
    shadowBefore,
  );
  assert.equal(
    await mui.getAttribute('data-shadow'),
    '0 4px 10px rgb(0 0 0 / 30%)',
  );
  await reset();
  await control('Override Button');
  assert.equal((await styles(button)).radius, '19px');
  assert.equal((await styles(button)).background, 'rgb(102, 51, 153)');
  assert.deepEqual(await styles(input), originalInput);
  await control('Import invalid JSON');
  assert(
    (await page.getByRole('alert').textContent()).includes('schemaVersion'),
  );
  assert.equal((await styles(button)).radius, '19px');
  await reset();
  await control('Override legacy');
  assert.equal((await styles(button)).padding, '27px');
  await reset();
  for (const [density, padding, gap] of [
    ['compact', '12px', '6px'],
    ['comfortable', '16px', '8px'],
    ['spacious', '20px', '10px'],
  ]) {
    await page.getByRole('combobox', { name: 'Density' }).selectOption(density);
    assert.equal((await styles(button)).padding, padding);
    assert.equal((await styles(button)).gap, gap);
    assert.equal(await mui.getAttribute('data-spacing'), padding);
    assert.equal(
      await page
        .getByTestId('theme-button-sm')
        .evaluate((el) => getComputedStyle(el).minHeight),
      '32px',
    );
    assert.equal(
      await page
        .getByTestId('theme-button-lg')
        .evaluate((el) => getComputedStyle(el).minHeight),
      '48px',
    );
  }
  await reset();
  assert.deepEqual(await styles(button), original);
  assert.deepEqual(await styles(sibling), originalSibling);
  // Native CSS declarations retain ordinary cascade precedence at the instance.
  await button.evaluate((el) => el.style.setProperty('--space-4', '29px'));
  assert.equal((await styles(button)).padding, '29px');
}
