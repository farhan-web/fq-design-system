/* global getComputedStyle, document */
import assert from 'node:assert/strict';
export async function verifyControlDensity(page, url, theme) {
  await page.goto(
    `${url}/iframe.html?id=foundations-component-tokens--controls&viewMode=story&globals=theme:${theme}`,
  );
  const scope = page.getByTestId('density-scope');
  const sibling = page.getByTestId('density-sibling');
  await scope.waitFor();
  const css = (locator, property) =>
    locator.evaluate(
      (el, p) => getComputedStyle(el).getPropertyValue(p),
      property,
    );
  const before = await css(sibling, 'padding-right');
  const select = scope.locator('.fq-select');
  const textarea = scope.locator('.fq-textarea');
  const chips = scope.locator('.fq-chips').first();
  const input = scope.getByRole('textbox', { name: 'Amount' });
  for (const [density, factor] of [
    ['compact', 0.75],
    ['comfortable', 1],
    ['spacious', 1.25],
  ]) {
    await page.getByRole('combobox', { name: 'Density' }).selectOption(density);
    assert.equal(parseFloat(await css(select, 'padding-left')), 12 * factor);
    assert.equal(parseFloat(await css(textarea, 'padding-top')), 8 * factor);
    assert.equal(parseFloat(await css(chips, 'padding-right')), 12 * factor);
    assert.equal(
      parseFloat(await css(scope.locator('.fq-switch').first(), 'gap')),
      10 * factor,
    );
    assert.equal(
      parseFloat(
        await css(scope.locator('.fq-input-container').first(), 'height'),
      ),
      52,
    );
    assert.equal(parseFloat(await css(chips, 'height')), 32);
    await input.focus();
    const geometry = await input.evaluate((el) => {
      const label = el
        .closest('.fq-input-container')
        .querySelector('label')
        .getBoundingClientRect();
      const field = el.getBoundingClientRect();
      return { labelBottom: label.bottom, inputTop: field.top };
    });
    assert(
      geometry.labelBottom <= geometry.inputTop + 0.5,
      'Floating label must stay above the input row',
    );
    await input.fill('84');
    assert.equal(await input.inputValue(), '84');
    for (const locator of [
      select,
      textarea,
      chips,
      scope.getByTestId('density-button'),
    ]) {
      const r = await locator.boundingBox();
      assert(
        r.height >= 24,
        'Density retains baseline control floor of 24 CSS px',
      );
      assert(
        await locator.evaluate((el) => el.clientWidth >= el.scrollWidth - 1),
        'No unexpected horizontal control overflow',
      );
    }
    assert.equal(await css(sibling, 'padding-right'), before);
  }
  await page.getByRole('button', { name: 'Toggle brand' }).click();
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== 'running'),
  );
  assert.equal(await css(select, 'border-radius'), '13px');
  for (const selector of [
    '.fq-select-field__label',
    '.fq-select-field__message',
    '.fq-switch__label',
  ])
    assert(
      (await css(scope.locator(selector).first(), 'font-family')).includes(
        'Georgia',
      ),
      'Scoped family font reaches labels/helpers',
    );
  assert.equal(await css(textarea, 'border-radius'), '13px');
  assert.equal(
    await css(scope.locator('.fq-checkbox__input').first(), 'background-color'),
    theme === 'dark' ? 'rgb(196, 163, 255)' : 'rgb(102, 51, 153)',
  );
  assert.equal(
    await css(scope.locator('.fq-radio__control').first(), 'border-top-color'),
    theme === 'dark' ? 'rgb(196, 163, 255)' : 'rgb(102, 51, 153)',
  );
  assert.equal(
    await css(scope.locator('.fq-switch__control').first(), 'background-color'),
    theme === 'dark' ? 'rgb(196, 163, 255)' : 'rgb(102, 51, 153)',
  );
  await scope.getByTestId('density-button').hover();
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== 'running'),
  );
  assert.equal(
    await css(scope.getByTestId('density-button'), 'background-color'),
    theme === 'dark' ? 'rgb(214, 192, 255)' : 'rgb(85, 48, 128)',
  );
  await page.getByRole('button', { name: 'Toggle brand' }).focus();
  await page.keyboard.press('Tab');
  assert.equal(
    await css(scope.getByTestId('density-button'), 'outline-style'),
    'solid',
  );
  // The original primary token remains background-only; focus uses semantic accent.
  await scope
    .getByTestId('density-button')
    .evaluate((el) => el.style.setProperty('--fq-button-primary', '#123456'));
  await page.mouse.move(0, 0);
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== 'running'),
  );
  assert.equal(
    await css(scope.getByTestId('density-button'), 'background-color'),
    'rgb(18, 52, 86)',
  );
  assert.equal(
    await css(scope.getByTestId('density-button'), 'outline-color'),
    theme === 'dark' ? 'rgb(196, 163, 255)' : 'rgb(102, 51, 153)',
  );
  const invalid = scope.getByRole('textbox', { name: 'Invalid' });
  assert.equal(await invalid.getAttribute('aria-invalid'), 'true');
  assert.equal(
    await css(invalid, 'color'),
    theme === 'dark' ? 'rgb(255, 187, 136)' : 'rgb(136, 68, 34)',
  );
  assert.equal(
    await scope.getByRole('textbox', { name: 'Disabled' }).isDisabled(),
    true,
  );
  assert.equal(
    await css(scope.getByRole('textbox', { name: 'Disabled' }), 'color'),
    theme === 'dark' ? 'rgb(107, 110, 119)' : 'rgb(174, 178, 190)',
    'Disabled foreground retains its semantic neutral role',
  );
  for (const [id, color] of [
    [
      'density-secondary',
      theme === 'dark' ? 'rgb(89, 68, 102)' : 'rgb(216, 196, 240)',
    ],
    [
      'density-danger',
      theme === 'dark' ? 'rgb(80, 48, 32)' : 'rgb(240, 196, 176)',
    ],
  ]) {
    const button = scope.getByTestId(id);
    await button.hover();
    await page.waitForFunction(() =>
      document.getAnimations().every((a) => a.playState !== 'running'),
    );
    assert.equal(
      await css(button, 'background-color'),
      color,
      'Branded hover role',
    );
  }
  for (const family of ['checkbox', 'radio', 'switch']) {
    const alignment = await scope
      .locator(`.fq-${family}-field`)
      .first()
      .evaluate(
        (el, family) => ({
          label: el
            .querySelector(`.fq-${family}__label`)
            .getBoundingClientRect().left,
          helper: el
            .querySelector(`.fq-${family}-field__message`)
            .getBoundingClientRect().left,
        }),
        family,
      );
    assert(
      Math.abs(alignment.label - alignment.helper) <= 0.5,
      `${family} helper aligns with brand spacing/density`,
    );
  }
  assert.equal(await css(sibling, 'padding-right'), before);
}

export async function verifyNavigationDensity(page, url, theme) {
  const cases = [
    [
      'tabs',
      'components-tabs--default',
      '.fq-tabs__trigger',
      'padding-left',
      12,
      'gap',
      8,
      52,
    ],
    [
      'accordion',
      'components-accordion--default',
      '.fq-accordion__trigger',
      'padding-top',
      16,
      'gap',
      8,
      44,
    ],
    [
      'navigation-bottom',
      'components-navigationbottom--default',
      '.fq-nav-bottom__item',
      'padding-top',
      12,
      'gap',
      4,
      64,
    ],
  ];
  for (const [
    family,
    id,
    selector,
    padding,
    basePadding,
    gap,
    baseGap,
    floor,
  ] of cases) {
    await page.goto(
      `${url}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`,
    );
    const target = page.locator(selector).first();
    await target.waitFor();
    for (const [density, factor] of [
      ['compact', 0.75],
      ['comfortable', 1],
      ['spacious', 1.25],
    ]) {
      await page.locator('#storybook-root').evaluate((el, factor) => {
        el.style.setProperty('--fq-density-padding', String(factor));
        el.style.setProperty('--fq-density-gap', String(factor));
      }, factor);
      const actual = await target.evaluate(
        (el, props) => {
          const s = getComputedStyle(el),
            r = el.getBoundingClientRect();
          return {
            padding: parseFloat(s.getPropertyValue(props[0])),
            gap: parseFloat(s.getPropertyValue(props[1])),
            height: r.height,
          };
        },
        [padding, gap],
      );
      assert.equal(
        actual.padding,
        basePadding * factor,
        `${family}/${density} padding`,
      );
      assert.equal(actual.gap, baseGap * factor, `${family}/${density} gap`);
      assert(
        actual.height >= floor,
        `${family}/${density} retains interaction floor`,
      );
    }
    const brand = theme === 'dark' ? 'rgb(196, 163, 255)' : 'rgb(102, 51, 153)';
    await page.locator('#storybook-root').evaluate(
      (el, { family, brand }) => {
        el.style.setProperty(`--fq-${family}-font-family`, 'Georgia, serif');
        el.style.setProperty(`--fq-${family}-text-activity`, brand);
        el.style.setProperty(`--fq-${family}-primary`, brand);
        el.style.setProperty(`--fq-${family}-text-high`, brand);
      },
      { family, brand },
    );
    await page.waitForFunction(() =>
      document.getAnimations().every((a) => a.playState !== 'running'),
    );
    assert(
      (await target.evaluate((el) => getComputedStyle(el).fontFamily)).includes(
        'Georgia',
      ),
    );
    if (family === 'tabs') {
      const selected = page.getByRole('tab', { selected: true });
      assert.equal(
        await selected.evaluate((el) => getComputedStyle(el).color),
        brand,
      );
      await selected.focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(() =>
        document.getAnimations().every((a) => a.playState !== 'running'),
      );
      assert.equal(
        await page
          .getByRole('tab', { selected: true })
          .evaluate((el) => getComputedStyle(el).color),
        brand,
      );
    } else if (family === 'accordion') {
      if ((await target.getAttribute('aria-expanded')) !== 'true')
        await target.click();
      await page.waitForFunction(() =>
        document.getAnimations().every((a) => a.playState !== 'running'),
      );
      const content = page.locator('.fq-accordion__content').first();
      assert(
        await content.evaluate((el) => el.clientHeight >= el.scrollHeight - 1),
        'Expanded content is not clipped after density',
      );
      await target.focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      assert.equal(
        await target.evaluate((el) => getComputedStyle(el).outlineStyle),
        'solid',
      );
    } else {
      const button = page.locator(selector).nth(1);
      await button.click();
      await page.waitForFunction(() =>
        document.getAnimations().every((a) => a.playState !== 'running'),
      );
      assert.equal(await button.getAttribute('aria-current'), 'page');
      assert.equal(
        await button.evaluate((el) => getComputedStyle(el).color),
        brand,
      );
    }
    assert.equal(
      await page
        .locator('body')
        .evaluate(
          (el, name) => el.style.getPropertyValue(name),
          `--fq-${family}-font-family`,
        ),
      '',
    );
  }
}

export async function verifyFeedbackDensity(page, url, theme) {
  const cases = [
    [
      'badge',
      'components-badge--solid-primary',
      '.fq-badge',
      '.fq-badge',
      'padding-right',
      6,
      'primary',
      'background-color',
    ],
    [
      'label',
      'components-label--primary',
      '.fq-label',
      '.fq-label',
      'padding-left',
      8,
      'primary-subtle',
      'background-color',
    ],
    [
      'banner',
      'components-banner--info',
      '.fq-banner',
      '.fq-banner__description',
      'padding-top',
      12,
      'primary-subtle',
      'background-color',
    ],
    [
      'banner-gradient',
      'components-bannergradient--small-default',
      '.fq-banner-gradient',
      '.fq-banner-gradient__text',
      'padding-left',
      20,
      'gradient-violet-100',
      'background-image',
    ],
    [
      'banner-info',
      'components-bannerinfo--description-only',
      '.fq-banner-info',
      '.fq-banner-info__description',
      'padding-top',
      12,
      'neutral-0',
      'background-color',
    ],
    [
      'countdown',
      'components-countdown--default',
      '.fq-countdown__segment',
      '.fq-countdown',
      'padding-right',
      4,
      'danger',
      'background-color',
    ],
  ];
  for (const [
    family,
    id,
    selector,
    fontSelector,
    padding,
    base,
    role,
    property,
  ] of cases) {
    await page.goto(
      `${url}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`,
    );
    const target = page.locator(selector).first();
    await target.waitFor();
    for (const [density, factor] of [
      ['compact', 0.75],
      ['comfortable', 1],
      ['spacious', 1.25],
    ]) {
      await page.locator('#storybook-root').evaluate((el, factor) => {
        el.style.setProperty('--fq-density-padding', String(factor));
        el.style.setProperty('--fq-density-gap', String(factor));
      }, factor);
      assert.equal(
        await target.evaluate(
          (el, p) => parseFloat(getComputedStyle(el).getPropertyValue(p)),
          padding,
        ),
        base * factor,
        `${family}/${density} padding`,
      );
      assert(
        await target.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
        `${family}/${density} no unexpected horizontal overflow`,
      );
      if (family === 'badge') {
        assert.equal(
          await target.evaluate((el) => getComputedStyle(el).height),
          '18px',
        );
        assert.equal(
          await target.evaluate((el) => getComputedStyle(el).paddingTop),
          '2px',
          'Badge vertical padding preserves fixed text box',
        );
      }
      if (family === 'banner-gradient')
        assert.equal(
          await target.evaluate((el) => getComputedStyle(el).height),
          '48px',
        );
      if (family === 'countdown')
        assert.equal(
          await target.evaluate((el) => getComputedStyle(el).height),
          '20px',
        );
    }
    const brand = theme === 'dark' ? 'rgb(196, 163, 255)' : 'rgb(102, 51, 153)';
    await page.locator('#storybook-root').evaluate(
      (el, { family, brand, role }) => {
        el.style.setProperty(`--fq-${family}-font-family`, 'Georgia, serif');
        el.style.setProperty(`--fq-${family}-${role}`, brand);
      },
      { family, brand, role },
    );
    await page.waitForFunction(() =>
      document.getAnimations().every((a) => a.playState !== 'running'),
    );
    assert(
      (
        await page
          .locator(fontSelector)
          .first()
          .evaluate((el) => getComputedStyle(el).fontFamily)
      ).includes('Georgia'),
      `${family} font override`,
    );
    const color = await target.evaluate(
      (el, p) => getComputedStyle(el).getPropertyValue(p),
      property,
    );
    if (property === 'background-image')
      assert(color.includes(brand), `${family} gradient stop override`);
    else assert.equal(color, brand, `${family} color override`);
  }
  for (const [id, family, selector] of [
    ['components-banner--dismissible', 'banner', '.fq-banner__dismiss'],
    [
      'components-bannerinfo--closable',
      'banner-info',
      '.fq-banner-info__close',
    ],
  ]) {
    await page.goto(
      `${url}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`,
    );
    const close = page.locator(selector);
    await close.waitFor();
    await page
      .locator('#storybook-root')
      .evaluate(
        (el, family) =>
          el.style.setProperty(
            `--fq-${family}-hover-overlay`,
            'rgba(102, 51, 153, 0.2)',
          ),
        family,
      );
    await close.hover();
    await page.waitForFunction(() =>
      document.getAnimations().every((a) => a.playState !== 'running'),
    );
    assert.equal(
      await close.evaluate((el) => getComputedStyle(el).backgroundColor),
      'rgba(102, 51, 153, 0.2)',
    );
    await close.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    assert.equal(
      await close.evaluate((el) => getComputedStyle(el).outlineStyle),
      'solid',
    );
  }
}

export async function verifyOverlayDensity(page, url, theme) {
  await page.goto(
    `${url}/iframe.html?id=foundations-overlay-density--contracts&viewMode=story&globals=theme:${theme}`,
  );
  const cases = [
    [
      'dialog',
      '.fq-dialog',
      '.fq-dialog__content',
      'padding-top',
      20,
      '.fq-dialog__title-text',
      13,
    ],
    [
      'sheet',
      '.fq-bottom-sheet',
      '.fq-bottom-sheet__body',
      'padding-right',
      16,
      '.fq-bottom-sheet__title',
      13,
    ],
    [
      'snack',
      '.fq-snackbar',
      '.fq-snackbar',
      'padding-top',
      12,
      '.fq-snackbar',
      13,
    ],
    [
      'tooltip',
      '.fq-tooltip__content',
      '.fq-tooltip__content',
      'padding-top',
      12,
      '.fq-tooltip__content',
      13,
    ],
    [
      'coachmark',
      '.fq-coachmark',
      '.fq-coachmark',
      'padding-top',
      16,
      '.fq-coachmark__title',
      13,
    ],
  ];
  for (const [
    kind,
    rootSelector,
    padSelector,
    padding,
    base,
    fontSelector,
    radius,
  ] of cases) {
    await page
      .getByRole('button', { name: `Open dense ${kind}`, exact: true })
      .click();
    const root = page.locator(rootSelector);
    await root.waitFor({ state: 'visible' });
    const panel = kind === 'tooltip' ? page : root;
    for (const [density, factor] of [
      ['compact', 0.75],
      ['comfortable', 1],
      ['spacious', 1.25],
    ]) {
      await panel
        .getByRole('combobox', { name: 'Overlay density', exact: true })
        .selectOption(density);
      assert.equal(
        await page
          .locator(padSelector)
          .evaluate(
            (el, p) => parseFloat(getComputedStyle(el).getPropertyValue(p)),
            padding,
          ),
        base * factor,
        `${kind}/${density} portal padding`,
      );
      assert(
        await root.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
        `${kind}/${density} horizontal content fits`,
      );
      const close = panel.getByRole('button', {
        name: 'Dismiss dense',
        exact: true,
      });
      await page.waitForFunction(
        (el) => el && el.getBoundingClientRect().height >= 32,
        await close.elementHandle(),
      );
      assert(
        (await close.boundingBox()).height >= 32,
        'Library action retains sm Button minimum',
      );
    }
    await panel.getByRole('button', { name: 'Brand', exact: true }).click();
    await page.waitForFunction(() =>
      document.getAnimations().every((a) => a.playState !== 'running'),
    );
    assert.equal(
      await root.evaluate((el) => getComputedStyle(el).borderTopLeftRadius),
      `${radius}px`,
      `${kind} scoped radius`,
    );
    assert(
      (
        await page
          .locator(fontSelector)
          .evaluate((el) => getComputedStyle(el).fontFamily)
      ).includes('Georgia'),
      `${kind} scoped font`,
    );
    assert.equal(
      await root.evaluate((el) => getComputedStyle(el).backgroundColor),
      ['snack', 'tooltip'].includes(kind)
        ? 'rgb(102, 51, 153)'
        : theme === 'dark'
          ? 'rgb(68, 51, 85)'
          : 'rgb(242, 234, 255)',
      `${kind} scoped surface`,
    );
    if (kind === 'sheet')
      assert(
        (
          await page
            .locator('.fq-bottom-sheet__body')
            .evaluate((el) => getComputedStyle(el).fontFamily)
        ).includes('Georgia'),
        'Portal body inherits its family font',
      );
    if (kind === 'tooltip')
      assert.equal(
        await root
          .locator('.fq-tooltip__arrow')
          .evaluate((el) => getComputedStyle(el).borderBottomColor),
        'rgb(102, 51, 153)',
        'Tooltip arrow follows surface token',
      );
    await panel
      .getByRole('button', { name: 'Dismiss dense', exact: true })
      .click();
    if (kind === 'tooltip') {
      await page.waitForFunction(
        (el) =>
          el.getAttribute('aria-hidden') === 'true' &&
          getComputedStyle(el).opacity === '0' &&
          getComputedStyle(el).pointerEvents === 'none',
        await root.elementHandle(),
      );
    } else await root.waitFor({ state: 'hidden' });
  }
  assert.equal(
    await page
      .locator('body')
      .evaluate((el) => el.style.getPropertyValue('--fq-density-padding')),
    '',
  );
}

export async function verifyDensityOffsets(page, url, theme) {
  await page.goto(
    `${url}/iframe.html?id=components-chips--dismiss-keyboard-contract&viewMode=story&globals=theme:${theme}`,
  );
  const primary = page.getByRole('button', { name: 'Filter', exact: true });
  const remove = page.getByRole('button', { name: 'Remove', exact: true });
  await primary.focus();
  await page.keyboard.press('Enter');
  await page
    .getByRole('status', { name: 'Selected count' })
    .filter({ hasText: '1' })
    .waitFor();
  await page.keyboard.press('Tab');
  assert(
    await remove.evaluate((el) => el === document.activeElement),
    'Dismiss follows primary in keyboard order',
  );
  await page.keyboard.press('Enter');
  await page
    .getByRole('status', { name: 'Dismissed count' })
    .filter({ hasText: '1' })
    .waitFor();
  await page.keyboard.press('Space');
  await page
    .getByRole('status', { name: 'Dismissed count' })
    .filter({ hasText: '2' })
    .waitFor();
  assert.equal(
    await page.getByRole('status', { name: 'Selected count' }).textContent(),
    '1',
    'Dismiss never selects the primary action',
  );

  await page.goto(
    `${url}/iframe.html?id=components-chips--dismissible&viewMode=story&globals=theme:${theme}`,
  );
  const chip = page.locator('.fq-chips-group > .fq-chips:first-child');
  await chip.waitFor();
  for (const factor of [0.75, 1, 1.25]) {
    await chip.evaluate(
      (el, factor) =>
        el.style.setProperty('--fq-density-padding', String(factor)),
      factor,
    );
    const metrics = await chip.evaluate((el) => {
      const action = el.nextElementSibling.getBoundingClientRect();
      return {
        right: el.getBoundingClientRect().right,
        left: action.left,
        width: action.width,
        height: action.height,
      };
    });
    assert(
      metrics.width >= 24 && metrics.height >= 24,
      'Dismiss target is at least 24px',
    );
    assert(metrics.left >= metrics.right, 'Native actions never overlap');
  }
  await page.goto(
    `${url}/iframe.html?id=components-chips--invert-active&viewMode=story&globals=theme:${theme}`,
  );
  const invert = page.locator('.fq-chips');
  await invert.waitFor();
  await invert.evaluate((el) => {
    el.style.setProperty('--fq-chips-inverse-inactive', '#663399');
    el.style.setProperty('--fq-chips-inverse-selected-hover', '#553080');
  });
  await page.mouse.move(0, 0);
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== 'running'),
  );
  assert.equal(
    await invert.evaluate((el) => getComputedStyle(el).backgroundColor),
    'rgb(102, 51, 153)',
  );
  await invert.hover();
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== 'running'),
  );
  assert.equal(
    await invert.evaluate((el) => getComputedStyle(el).backgroundColor),
    'rgb(85, 48, 128)',
    'Invert hover consumes brand token',
  );
  await page.goto(
    `${url}/iframe.html?id=components-tabs--density-badge-contract&viewMode=story&globals=theme:${theme}`,
  );
  const tab = page.getByRole('tab', { selected: true });
  await tab.waitFor();
  for (const factor of [0.75, 1, 1.25]) {
    await tab.evaluate(
      (el, factor) => el.style.setProperty('--fq-density-gap', String(factor)),
      factor,
    );
    const offset = await tab
      .locator('.fq-tabs__badge')
      .evaluate((el) => parseFloat(getComputedStyle(el).marginLeft));
    assert.equal(offset, -4 * factor, 'Tab badge correction follows gap scale');
  }
}
