import { describe, expect, it } from 'vitest';
import { createTheme } from '@mui/material';
import { createFqTheme, fqTheme } from './fqTheme';
import {
  parseFqTheme,
  parseFqThemeJson,
  themeCssVariables,
  resolveToken,
  defaultFqThemeDefinition,
} from './tokenConfig';

describe('theme version 1', () => {
  it('derives MUI defaults from the accessible canonical definition', () => {
    expect(fqTheme.palette.primary.main.toLowerCase()).toBe('#0062cc');
    expect(fqTheme.palette.background.paper).toBe('#F4F7FE');
    expect(fqTheme.palette.primary.main).toBe('#0062CC');
    expect(fqTheme.typography.fontFamily).toBe(
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    );
    expect(fqTheme.shadows).toEqual(createTheme().shadows);
    expect(fqTheme.zIndex).toEqual(createTheme().zIndex);
    expect(fqTheme.shape.borderRadius).toBe(8);
    expect(fqTheme.spacing(2)).toBe('16px');
    expect(Object.isFrozen(defaultFqThemeDefinition.foundation.palette)).toBe(
      true,
    );
  });
  it('resolves CSS and MUI from the same palette, font, radius and spacing', () => {
    const theme = createFqTheme({
      schemaVersion: 1,
      foundation: {
        palette: { '--color-blue-400': '#663399' },
        radius: { '--radius-md': '14px' },
        spacing: { '--spacing-8': '10px' },
        typography: { '--font-family': 'Georgia, serif' },
      },
    });
    expect(resolveToken(theme.cssVariables, '--color-primary')).toBe('#663399');
    expect(theme.muiTheme.palette.primary.main).toBe('#663399');
    expect(theme.muiTheme.shape.borderRadius).toBe(14);
    expect(theme.muiTheme.typography.fontFamily).toBe('Georgia, serif');
    expect(theme.muiTheme.spacing(2)).toBe('20px');
  });
  it('inherits shared semantic values and explicitly overrides them in dark mode', () => {
    const config = {
      schemaVersion: 1 as const,
      semantic: {
        light: { '--color-danger': '#990000' },
        dark: { '--color-primary': '#aabbcc' },
      },
    };
    expect(createFqTheme(config, 'dark').muiTheme.palette.primary.main).toBe(
      '#aabbcc',
    );
    expect(resolveToken(themeCssVariables(config), '--color-danger')).toBe(
      '#990000',
    );
    expect(
      resolveToken(themeCssVariables(config, 'dark'), '--color-danger'),
    ).toBe('#FFBCBC');
    expect(resolveToken(themeCssVariables(config), '--color-primary')).toBe(
      '#0062CC',
    );
  });
  it('links legacy spacing aliases and gives explicit legacy overrides precedence', () => {
    const config = {
      schemaVersion: 1 as const,
      foundation: { spacing: { '--spacing-8': '10px' } },
      aliases: { '--space-2': '13px' },
    };
    const variables = themeCssVariables(config);
    expect(resolveToken(variables, '--spacing-8')).toBe('10px');
    expect(resolveToken(variables, '--space-2')).toBe('13px');
    expect(
      resolveToken(
        themeCssVariables({ schemaVersion: 1, foundation: config.foundation }),
        '--space-2',
      ),
    ).toBe('10px');
  });
  it('keeps component overrides separate and density independent of sizes', () => {
    const theme = createFqTheme({
      schemaVersion: 1,
      components: { button: { '--fq-button-radius': '19px' } },
      density: 'compact',
    });
    expect(theme.cssVariables['--fq-button-radius']).toBe('19px');
    expect(theme.cssVariables['--fq-input-radius']).toBeUndefined();
    expect(theme.cssVariables['--fq-density-padding']).toBe('0.75');
    expect(theme.muiTheme.spacing(2)).toBe('12px');
    expect(
      themeCssVariables(undefined, 'light', 'spacious')['--fq-density-gap'],
    ).toBe('1.25');
  });
  it.each([
    [{}, 'schemaVersion'],
    [{ schemaVersion: 2 }, 'schemaVersion'],
    [{ schemaVersion: 1, extra: true }, 'extra'],
    [{ schemaVersion: 1, foundation: { other: {} } }, 'other'],
    [
      { schemaVersion: 1, foundation: { palette: { '--missing': '#fff' } } },
      '--missing',
    ],
    [
      {
        schemaVersion: 1,
        foundation: { palette: { '--color-blue-400': '#xyz' } },
      },
      '--color-blue-400',
    ],
    [
      {
        schemaVersion: 1,
        foundation: { palette: { '--color-blue-400': 'rgb(300 0 0)' } },
      },
      '--color-blue-400',
    ],
    [
      { schemaVersion: 1, foundation: { radius: { '--radius-md': '-2px' } } },
      '--radius-md',
    ],
    [
      { schemaVersion: 1, foundation: { radius: { '--radius-md': '1rem' } } },
      '--radius-md',
    ],
    [
      {
        schemaVersion: 1,
        foundation: { typography: { '--font-weight-bold': '2000' } },
      },
      '--font-weight-bold',
    ],
    [
      {
        schemaVersion: 1,
        foundation: { palette: { '--color-blue-400': 'var(--missing)' } },
      },
      '--missing',
    ],
    [
      {
        schemaVersion: 1,
        semantic: { light: { '--color-primary': 'var(--radius-md)' } },
      },
      '--color-primary',
    ],
    [{ schemaVersion: 1, semantic: { other: {} } }, 'other'],
    [{ schemaVersion: 1, components: { unknownWidget: {} } }, 'unknownWidget'],
    [
      {
        schemaVersion: 1,
        components: { button: { '--fq-input-radius': '2px' } },
      },
      '--fq-input-radius',
    ],
    [{ schemaVersion: 1, density: 'tiny' }, 'density'],
    [
      { schemaVersion: 1, aliases: { '--space-2': 'var(--space-2)' } },
      'cyclic',
    ],
    [
      {
        schemaVersion: 1,
        foundation: {
          typography: { '--font-family': 'x; } body { color: red' },
        },
      },
      '--font-family',
    ],
    [{ schemaVersion: 1, foundation: [] }, 'foundation'],
  ])('rejects invalid config atomically: %j', (input, message) => {
    const before = JSON.stringify(defaultFqThemeDefinition);
    expect(() => parseFqTheme(input)).toThrow(message);
    expect(JSON.stringify(defaultFqThemeDefinition)).toBe(before);
  });
  it('parses JSON and rejects malformed or prototype keys', () => {
    expect(parseFqThemeJson('{"schemaVersion":1}').schemaVersion).toBe(1);
    expect(() => parseFqThemeJson('{')).toThrow('invalid JSON');
    expect(() =>
      parseFqThemeJson('{"schemaVersion":1,"foundation":{"__proto__":{}}}'),
    ).toThrow('unknown group');
  });
  it('normalizes supported RGB and color-mix for MUI without changing CSS', () => {
    const theme = createFqTheme({
      schemaVersion: 1,
      semantic: { light: { '--color-primary': 'rgb(10 20 30 / 50%)' } },
    });
    expect(theme.muiTheme.palette.primary.main).toBe('rgba(10, 20, 30, 0.5)');
    const mixed = createFqTheme({
      schemaVersion: 1,
      semantic: {
        light: {
          '--color-primary':
            'color-mix(in srgb, var(--color-blue-400) 15%, transparent)',
        },
      },
    });
    expect(mixed.muiTheme.palette.primary.main).toBe('rgba(0, 98, 204, 0.15)');
  });
  it('preserves non-pixel spacing and string arguments without coercing units', () => {
    const theme = createFqTheme({
      schemaVersion: 1,
      foundation: { spacing: { '--spacing-8': '0.5rem' } },
    });
    expect(theme.muiTheme.spacing(2)).toBe('calc(0.5rem * 2)');
    expect(theme.muiTheme.spacing('auto')).toBe('auto');
  });
  it.each([
    { aliases: { '--space-2': 'var(--color-blue-400)' } },
    { foundation: { shadow: { '--shadow-sm': '0 0 -2px #000000' } } },
    { foundation: { shadow: { '--shadow-sm': '0 0 2px rgb(999 0 0)' } } },
    { foundation: { typography: { '--font-family': '"Unclosed' } } },
    { foundation: { layer: { '--z-index-modal': '1.5' } } },
    { components: { input: { '--fq-input-radius': 'var(--color-blue-400)' } } },
  ])('rejects resolved alias types and malformed CSS values: %j', (patch) => {
    expect(() => parseFqTheme({ schemaVersion: 1, ...patch })).toThrow();
  });
});

describe('component density override contract', () => {
  it('accepts new component groups and preserves old definitions', () => {
    const theme = parseFqTheme({
      schemaVersion: 1,
      components: {
        select: {
          '--fq-select-radius-md': '13px',
          '--fq-select-padding-scale': '1.25',
        },
        checkbox: { '--fq-checkbox-primary': 'var(--color-danger)' },
      },
    });
    expect(theme.components.select?.['--fq-select-radius-md']).toBe('13px');
    expect(() =>
      parseFqTheme({ ...theme, components: { button: {}, input: {} } }),
    ).not.toThrow();
  });
  it.each(['0', '0.74', '1.26', '2', '12px', 'NaN'])(
    'rejects unsupported density scale %s atomically',
    (scale) => {
      expect(() =>
        parseFqTheme({
          schemaVersion: 1,
          components: { select: { '--fq-select-padding-scale': scale } },
        }),
      ).toThrow('density');
      expect(defaultFqThemeDefinition.components.select).toEqual({});
    },
  );
  it('rejects a spacing reference used as a density scale', () => {
    expect(() =>
      parseFqTheme({
        schemaVersion: 1,
        components: {
          select: { '--fq-select-padding-scale': 'var(--spacing-8)' },
        },
      }),
    ).toThrow('density');
  });
});
