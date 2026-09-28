/**
 * fqTheme — MUI theme wired to fq-design-system tokens.
 *
 * Strategy: reset ALL MUI component visual defaults to `unset` so that
 * our `fq-*` CSS classes (loaded after MUI via StyledEngineProvider injectFirst)
 * own 100% of the visual styling.
 */
import { createTheme } from '@mui/material/styles';

// ── Raw token values (mirrors src/foundations/colors.css) ──────────────────
const TOKENS = {
  primary: '#007CFF',
  primaryLight: '#5BAAFF',
  primaryDark: '#0062CC',
  danger: '#F15C59',
  success: '#0BAE54',
  warning: '#F5A623',
  neutral0: '#FFFFFF',
  neutral100: '#F4F7FE',
  neutral200: '#D8DCE8',
  neutral400: '#AEB2BE',
  neutral600: '#71747D',
  neutral700: '#4D4F56',
  neutral800: '#303135',
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} as const;

// Minimal reset applied to every component root — removes all MUI visual defaults.
// Our fq-* CSS classes (higher cascade position) then supply the real styles.
const RESET = { all: 'unset', display: 'revert' } as const;

export const fqTheme = createTheme({
  // ── Palette ─────────────────────────────────────────────────────────────
  palette: {
    primary: {
      main: TOKENS.primary,
      light: TOKENS.primaryLight,
      dark: TOKENS.primaryDark,
      contrastText: TOKENS.neutral0,
    },
    error: {
      main: TOKENS.danger,
      contrastText: TOKENS.neutral0,
    },
    success: {
      main: TOKENS.success,
      contrastText: TOKENS.neutral0,
    },
    warning: {
      main: TOKENS.warning,
      contrastText: TOKENS.neutral800,
    },
    text: {
      primary: TOKENS.neutral800,
      secondary: TOKENS.neutral700,
      disabled: TOKENS.neutral400,
    },
    background: {
      default: TOKENS.neutral0,
      paper: TOKENS.neutral100,
    },
  },

  // ── Typography ───────────────────────────────────────────────────────────
  typography: {
    fontFamily: TOKENS.fontFamily,
  },

  // ── Shape ────────────────────────────────────────────────────────────────
  shape: {
    borderRadius: 8,
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

export type FqTheme = typeof fqTheme;
