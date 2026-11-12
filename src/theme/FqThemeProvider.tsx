/**
 * FqThemeProvider
 *
 * Wraps MUI's ThemeProvider + StyledEngineProvider so that:
 *  1. Browser MUI styles are injected FIRST in <head> (injectFirst)
 *     Opt-in enableCssLayer stabilizes CSS precedence across SSR hydration.
 *  2. Legacy CSS uses load order; isolated.css uses the FQ layer above MUI.
 *  3. The fqTheme resets all MUI component visual defaults to `all: unset`
 *
 * Usage:
 *   import { FqThemeProvider } from 'fq-design-system';
 *   <FqThemeProvider>
 *     <App />
 *   </FqThemeProvider>
 *
 * Legacy MUI-only customization (CSS variables remain independent on this path):
 *   import { fqTheme } from 'fq-design-system';
 *   import { createTheme } from '@mui/material/styles';
 *   const myTheme = createTheme({ ...fqTheme, palette: { primary: { main: '#FF0000' } } });
 *   <FqThemeProvider theme={myTheme}>...</FqThemeProvider>
 */
import { useContext, useMemo, type CSSProperties, type ReactNode } from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import type { Theme } from '@mui/material';
import { fqTheme, createFqTheme } from './fqTheme';
import {
  type FqThemeConfig,
  type FqThemeMode,
  type FqDensity,
} from './tokenConfig';

import { PortalScopeContext } from './portalScope';

export interface FqThemeProviderProps {
  children: ReactNode;
  /** Override the default fqTheme with a custom theme. */
  theme?: Theme;
  /**
   * Required with isolated.css. Opt in to MUI's layer for predictable overrides.
   * Default false preserves the existing cascade and component dimensions.
   * Enabling it can change specificity/layout; verify your consumer theme.
   */
  enableCssLayer?: boolean;
  /** Validated token configuration. Cannot be combined with a separate MUI theme. */
  tokens?: FqThemeConfig;
  /** Explicit token mode; absent retains the legacy provider behavior. */
  mode?: FqThemeMode;
  density?: FqDensity;
}

export function FqThemeProvider({
  children,
  theme,
  tokens,
  mode,
  density,
  enableCssLayer = false,
}: FqThemeProviderProps) {
  const generated = useMemo(
    () =>
      tokens || mode || density
        ? createFqTheme(
            tokens ?? { schemaVersion: 1 },
            mode ?? 'light',
            density,
          )
        : null,
    [tokens, mode, density],
  );
  const inheritedScope = useContext(PortalScopeContext);
  const portalScope = useMemo(
    () =>
      generated
        ? {
            'data-fq-theme': '',
            style: generated.cssVariables as CSSProperties,
            'data-theme': generated.mode,
            'data-density': generated.density,
          }
        : inheritedScope,
    [generated, inheritedScope],
  );
  if (theme && generated)
    throw new Error(
      'FqThemeProvider: use tokens/mode/density or theme, not both.',
    );
  return (
    <StyledEngineProvider injectFirst enableCssLayer={enableCssLayer}>
      <ThemeProvider theme={generated?.muiTheme ?? theme ?? fqTheme}>
        <PortalScopeContext.Provider value={portalScope}>
          {generated ? (
            <div
              data-fq-theme=""
              data-theme={generated.mode}
              data-density={generated.density}
              style={
                {
                  display: 'contents',
                  ...generated.cssVariables,
                } as CSSProperties
              }
            >
              {children}
            </div>
          ) : (
            children
          )}
        </PortalScopeContext.Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

FqThemeProvider.displayName = 'FqThemeProvider';
