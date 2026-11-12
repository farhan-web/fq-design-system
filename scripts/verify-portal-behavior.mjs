/* global document, getComputedStyle */
import assert from 'node:assert/strict';
export async function verifyPortalBehavior(page, url, theme) {
  await page.goto(
    `${url}/iframe.html?id=foundations-portals--contracts&viewMode=story&globals=theme:${theme}`,
  );
  const read = (locator) =>
    locator.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        color: s.color,
        background: s.backgroundColor,
        padding: s.paddingTop,
        gap: s.gap,
        radius: s.borderRadius,
        font: s.fontFamily,
      };
    });
  const a = page.getByTestId('inline-A');
  const b = page.getByTestId('inline-B');
  await a.waitFor();
  const expectedA = await read(a);
  const expectedB = await read(b);
  assert.notDeepEqual(expectedA, expectedB);
  const readBodyScope = () =>
    page.locator('body').evaluate((el) => ({
      tokens: Object.fromEntries(
        Array.from(el.style)
          .filter((name) => name.startsWith('--'))
          .sort()
          .map((name) => [name, el.style.getPropertyValue(name)]),
      ),
      mode: el.getAttribute('data-theme'),
      density: el.getAttribute('data-density'),
      scroll: ['overflow', 'overflow-x', 'overflow-y', 'padding-right'].map(
        (name) => [
          name,
          el.style.getPropertyValue(name),
          el.style.getPropertyPriority(name),
        ],
      ),
    }));
  const bodyTokens = await readBodyScope();
  // Default/custom portals escape the intentionally transformed, clipped brand host.
  for (const target of ['default', 'custom', 'inline']) {
    await page.getByRole('combobox', { name: 'Target A' }).selectOption(target);
    for (const kind of ['dialog', 'sheet', 'snack']) {
      await page
        .getByRole('button', { name: `Open ${kind} A`, exact: true })
        .click();
      const probe = page.getByTestId(`${kind}-A`);
      await probe.waitFor();
      assert.deepEqual(
        await read(probe),
        expectedA,
        `${kind}/${target} retains all brand values`,
      );
      assert.deepEqual(await read(b), expectedB);
      const root =
        kind === 'snack'
          ? probe.locator(
              'xpath=ancestor::*[contains(@class,"MuiSnackbar-root")]',
            )
          : probe.locator(
              'xpath=ancestor::*[contains(@class,"MuiModal-root")]',
            );
      assert.equal(await root.getAttribute('data-theme'), 'light');
      assert.equal(
        await root.evaluate((el) => !!el.closest('[data-testid="brand-A"]')),
        target === 'inline',
      );
      if (target === 'custom')
        assert.equal(
          await root.evaluate((el) => el.parentElement.id),
          'portal-host-A',
        );
      if (target === 'default')
        assert.equal(
          await root.evaluate((el) => el.parentElement.tagName),
          'BODY',
        );
      if (target !== 'inline') {
        // MUI modal roots are reset by the existing compatibility theme.
        // Preserve their baseline positioning; the sheet itself is fixed.
        if (kind === 'sheet') {
          const surface = probe.locator(
            'xpath=ancestor::*[contains(@class,"fq-bottom-sheet") and @role="dialog"]',
          );
          const geometry = await surface.evaluate((el) => {
            const r = el.getBoundingClientRect();
            const s = getComputedStyle(el);
            return {
              width: r.width,
              position: s.position,
              zIndex: Number(s.zIndex),
            };
          });
          assert.equal(geometry.position, 'fixed');
          assert(geometry.zIndex > 0);
          assert(Math.abs(geometry.width - page.viewportSize().width) < 1);
        }
        const dismiss = page.getByRole('button', {
          name: 'Dismiss A',
          exact: true,
        });
        // Playwright's click asserts hit testing and visibility outside the clipped host.
        await dismiss.click();
      } else {
        // Inline is intentionally subject to host clipping; exercise semantic dismissal.
        await page
          .getByRole('button', { name: 'Dismiss A', exact: true })
          .evaluate((el) => el.click());
      }
      await probe.waitFor({ state: 'hidden' });
    }
  }
  // Live updates, nested portals and independent simultaneous brand B.
  await page
    .getByRole('combobox', { name: 'Target A' })
    .selectOption('default');
  await page
    .getByRole('button', { name: 'Open dialog A', exact: true })
    .click();
  await page.getByRole('button', { name: 'Update A', exact: true }).click();
  const changedA = await read(a);
  assert.notDeepEqual(changedA, expectedA);
  assert.deepEqual(await read(page.getByTestId('dialog-A')), changedA);
  assert.deepEqual(await read(b), expectedB);
  await page.getByRole('button', { name: 'Mode A', exact: true }).click();
  const darkA = await read(a);
  assert.notEqual(darkA.color, changedA.color);
  assert.deepEqual(await read(page.getByTestId('dialog-A')), darkA);
  await page.getByRole('button', { name: 'Nested A', exact: true }).click();
  assert.deepEqual(await read(page.getByTestId('nested-A')), darkA);
  await page
    .getByRole('button', { name: 'Close nested A', exact: true })
    .click();
  await page.getByTestId('nested-A').waitFor({ state: 'hidden' });
  await page
    .getByRole('button', {
      name: 'Open sheet B',
      exact: true,
      includeHidden: true,
    })
    .evaluate((el) => el.click());
  const sheetB = page.getByTestId('sheet-B');
  await sheetB.waitFor();
  assert.deepEqual(await read(sheetB), expectedB);
  assert.deepEqual(await read(page.getByTestId('dialog-A')), darkA);
  await page.getByRole('button', { name: 'Dismiss B', exact: true }).click();
  await sheetB.waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'Dismiss A', exact: true }).click();
  await page.getByTestId('dialog-A').waitFor({ state: 'hidden' });
  assert.deepEqual(
    await readBodyScope(),
    bodyTokens,
    'Portal scope must leave body tokens, mode and owned scroll styles unchanged',
  );
  // Unmount entire React tree via navigation; no portal nodes carry into the next story.
  await page.goto(
    `${url}/iframe.html?id=components-button--primary&viewMode=story`,
  );
  assert.equal(
    await page.locator('.MuiModal-root, .MuiSnackbar-root').count(),
    0,
  );
}
