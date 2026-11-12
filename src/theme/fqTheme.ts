/**
 * fqTheme — MUI theme wired to fq-design-system tokens.
 *
 * Strategy: reset ALL MUI component visual defaults to `unset` so that
 * our `fq-*` CSS classes (loaded after MUI via StyledEngineProvider injectFirst)
 * own 100% of the visual styling.
 */
import { createTheme, type ThemeOptions } from '@mui/material';

import {
  parseFqTheme,
  themeCssVariables,
  resolveToken,
  type FqThemeConfig,
  type FqThemeDefinition,
  type FqThemeMode,
  type FqDensity,
} from './tokenConfig';

// MUI's color utilities accept comma syntax; CSS tokens retain their original form.
function muiColor(value: string): string {
  const rgb =
    /^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)(?:\s*\/\s*(\d+(?:\.\d+)?)%)?\s*\)$/.exec(
      value,
    );
  if (rgb)
    return rgb[4]
      ? `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${Number(rgb[4]) / 100})`
      : `rgb(${rgb[1]}, ${rgb[2]}, ${rgb[3]})`;
  const mix =
    /^color-mix\(\s*in srgb,\s*(#[\da-f]{6}) (\d+)%,\s*transparent\s*\)$/i.exec(
      value,
    );
  if (mix)
    return `rgba(${[1, 3, 5].map((i) => parseInt(mix[1].slice(i, i + 2), 16)).join(', ')}, ${Number(mix[2]) / 100})`;
  return value;
}

// Minimal reset applied to every component root — removes all MUI visual defaults.
// Our fq-* CSS classes (higher cascade position) then supply the real styles.
const RESET = { all: 'unset', display: 'revert' } as const;

export function createFqTheme(
  config: FqThemeConfig | FqThemeDefinition = { schemaVersion: 1 },
  mode: FqThemeMode = 'light',
  density?: FqDensity,
) {
  const definition = parseFqTheme(config);
  const cssVariables = themeCssVariables(definition, mode, density);
  const token = (name: string) => resolveToken(cssVariables, name);
  const color = (name: string) => muiColor(token(name));
  const paddingScale = Number(cssVariables['--fq-density-padding']);
  const muiTheme = createTheme({
    // ── Palette ─────────────────────────────────────────────────────────────
    palette: {
      mode,
      primary: {
        main: color('--color-primary'),
        light: color('--color-primary-hover'),
        dark: color('--color-blue-500'),
        contrastText: color('--color-neutral-0'),
      },
      error: {
        main: color('--color-danger'),
        contrastText: color('--color-neutral-0'),
      },
      success: {
        main: color('--color-success'),
        contrastText: color('--color-neutral-0'),
      },
      warning: {
        main: color('--color-warning-solid'),
        contrastText: color('--color-text-high'),
      },
      text: {
        primary: color('--color-text-high'),
        secondary: color('--color-text-medium'),
        disabled: color('--color-text-disabled'),
      },
      background: {
        default: color('--color-background'),
        paper: color('--color-surface'),
      },
    },

    // ── Typography ───────────────────────────────────────────────────────────
    typography: {
      fontFamily: token('--font-family'),
      fontSize: parseFloat(token('--font-size-md')),
      fontWeightLight: Number(token('--font-weight-light')),
      fontWeightRegular: Number(token('--font-weight-regular')),
      fontWeightMedium: Number(token('--font-weight-medium')),
      fontWeightBold: Number(token('--font-weight-bold')),
    },

    spacing: token('--spacing-8').endsWith('px')
      ? Number.parseFloat(token('--spacing-8')) * paddingScale
      : (factor: number | string) =>
          typeof factor === 'string'
            ? factor
            : `calc(${token('--spacing-8')} * ${factor * paddingScale})`,

    shadows: Array.from({ length: 25 }, (_, index) =>
      token(`--mui-shadow-${index}`),
    ) as ThemeOptions['shadows'],
    zIndex: Object.fromEntries(
      Object.keys(definition.foundation.layer)
        .filter((key) => key.startsWith('--mui-z-index-'))
        .map((key) => [
          key
            .replace('--mui-z-index-', '')
            .replace(/-([a-z])/g, (_match, letter: string) =>
              letter.toUpperCase(),
            ),
          Number(token(key)),
        ]),
    ),
    // ── Shape ────────────────────────────────────────────────────────────────
    shape: {
      borderRadius: parseFloat(token('--radius-md')),
    },

    // ── Component overrides ──────────────────────────────────────────────────
    // All set to `all: unset` so our fq-* CSS classes own the visual layer.
    components: {
      // ── Button & ButtonBase ──────────────────────────────────────────────
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
          disableTouchRipple: true,
        },
        styleOverrides: {
          root: RESET,
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
          disableRipple: true,
        },
        styleOverrides: {
          root: { ...RESET, display: 'inline-flex', cursor: 'pointer' },
          startIcon: RESET,
          endIcon: RESET,
          loadingIndicator: RESET,
        },
      },
      MuiIconButton: {
        defaultProps: { disableRipple: true },
        styleOverrides: {
          root: { ...RESET, display: 'inline-flex', cursor: 'pointer' },
        },
      },

      // ── Input ────────────────────────────────────────────────────────────
      MuiInputBase: {
        styleOverrides: {
          root: { ...RESET, display: 'block' },
          input: {
            ...RESET,
            display: 'block',
            width: '100%',
            boxSizing: 'border-box',
          },
          multiline: RESET,
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { ...RESET, display: 'block' },
          notchedOutline: { display: 'none' },
        },
      },
      MuiFilledInput: {
        styleOverrides: { root: { ...RESET, display: 'block' } },
      },
      MuiInput: {
        styleOverrides: { root: { ...RESET, display: 'block' } },
      },
      MuiFormLabel: {
        styleOverrides: { root: RESET },
      },
      MuiFormControl: {
        styleOverrides: { root: { ...RESET, display: 'block' } },
      },
      MuiFormHelperText: {
        styleOverrides: { root: RESET },
      },

      // ── Select ───────────────────────────────────────────────────────────
      MuiSelect: {
        defaultProps: { disableUnderline: true },
        styleOverrides: {
          root: { ...RESET, display: 'block' },
          select: RESET,
          icon: RESET,
          nativeInput: RESET,
        },
      },
      MuiMenuItem: {
        defaultProps: { disableRipple: true },
        styleOverrides: {
          root: { ...RESET, display: 'flex', cursor: 'pointer' },
        },
      },
      MuiList: {
        styleOverrides: { root: { ...RESET, display: 'block' } },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: { root: { ...RESET, display: 'block' } },
      },
      MuiPopover: {
        styleOverrides: { root: RESET, paper: RESET },
      },
      MuiMenu: {
        styleOverrides: { root: RESET, paper: RESET, list: RESET },
      },

      // ── Checkbox / Radio / Switch ─────────────────────────────────────────
      MuiCheckbox: {
        defaultProps: { disableRipple: true },
        styleOverrides: {
          root: { ...RESET, display: 'inline-flex', cursor: 'pointer' },
        },
      },
      MuiRadio: {
        defaultProps: { disableRipple: true },
        styleOverrides: {
          root: { ...RESET, display: 'inline-flex', cursor: 'pointer' },
        },
      },
      MuiSwitch: {
        defaultProps: { disableRipple: true },
        styleOverrides: {
          root: { ...RESET, display: 'inline-flex' },
          switchBase: { ...RESET, display: 'inline-flex', cursor: 'pointer' },
          track: RESET,
          thumb: RESET,
        },
      },

      // ── Tabs ─────────────────────────────────────────────────────────────
      MuiTabs: {
        defaultProps: { TabIndicatorProps: { style: { display: 'none' } } },
        styleOverrides: {
          root: { ...RESET, display: 'block' },
          flexContainer: { ...RESET, display: 'flex' },
          indicator: { display: 'none' },
          scroller: { ...RESET, overflow: 'auto' },
        },
      },
      MuiTab: {
        defaultProps: { disableRipple: true },
        styleOverrides: {
          root: { ...RESET, display: 'inline-flex', cursor: 'pointer' },
        },
      },

      // ── Accordion ────────────────────────────────────────────────────────
      MuiAccordion: {
        defaultProps: { disableGutters: true, elevation: 0, square: true },
        styleOverrides: {
          root: { ...RESET, display: 'block' },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            ...RESET,
            display: 'flex',
            width: '100%',
            cursor: 'pointer',
            alignItems: 'center',
          },
          content: { ...RESET, flexGrow: 1, display: 'flex' },
          expandIconWrapper: RESET,
        },
      },
      MuiAccordionDetails: {
        styleOverrides: { root: { ...RESET, display: 'block' } },
      },

      // ── Tooltip ───────────────────────────────────────────────────────────
      MuiTooltip: {
        styleOverrides: {
          tooltip: RESET,
          arrow: RESET,
          popper: RESET,
        },
      },

      // ── Dialog ────────────────────────────────────────────────────────────
      MuiDialog: {
        defaultProps: { disableScrollLock: false },
        styleOverrides: {
          root: RESET,
          paper: { ...RESET, display: 'flex', flexDirection: 'column' },
          container: RESET,
        },
      },
      MuiDialogTitle: {
        styleOverrides: { root: { ...RESET, display: 'block' } },
      },
      MuiDialogContent: {
        styleOverrides: { root: RESET },
      },
      MuiDialogActions: {
        styleOverrides: { root: { ...RESET, display: 'flex' } },
      },

      // ── Modal ─────────────────────────────────────────────────────────────
      MuiModal: {
        styleOverrides: {
          root: RESET,
          backdrop: RESET,
        },
      },

      // ── Backdrop ──────────────────────────────────────────────────────────
      MuiBackdrop: {
        styleOverrides: { root: RESET },
      },

      // ── Popper ────────────────────────────────────────────────────────────
      MuiPopper: {
        styleOverrides: { root: RESET },
      },

      // ── Disable CssBaseline global injection ──────────────────────────────
      MuiCssBaseline: {
        styleOverrides: '',
      },
    },
  });
  return {
    definition,
    cssVariables,
    muiTheme,
    mode,
    density: density ?? definition.density,
  };
}

export const fqTheme = createFqTheme().muiTheme;
export type FqTheme = typeof fqTheme;
