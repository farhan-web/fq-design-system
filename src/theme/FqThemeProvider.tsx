/**
 * FqThemeProvider
 *
 * Wraps MUI's ThemeProvider + StyledEngineProvider so that:
 *  1. MUI emotion styles are injected FIRST in <head> (injectFirst)
 *  2. Our static fq-* CSS files load AFTER → same-specificity rules win for us
 *  3. The fqTheme resets all MUI component visual defaults to `all: unset`
 *
 * Usage:
 *   import { FqThemeProvider } from 'fq-design-system';
 *   <FqThemeProvider>
 *     <App />
 *   </FqThemeProvider>
 *
 * To override theme tokens:
 *   import { fqTheme } from 'fq-design-system';
 *   import { createTheme } from '@mui/material/styles';
 *   const myTheme = createTheme({ ...fqTheme, palette: { primary: { main: '#FF0000' } } });
 *   <FqThemeProvider theme={myTheme}>...</FqThemeProvider>
 */
import { type ReactNode } from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { type Theme } from '@mui/material/styles';
import { fqTheme } from './fqTheme';

export interface FqThemeProviderProps {
  children: ReactNode;
  /** Override the default fqTheme with a custom theme. */
  theme?: Theme;
}

export function FqThemeProvider({
  children,
  theme = fqTheme,
}: FqThemeProviderProps) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
}

FqThemeProvider.displayName = 'FqThemeProvider';
