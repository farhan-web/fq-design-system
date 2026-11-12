import { render, screen } from '@testing-library/react';
import { createTheme, useTheme } from '@mui/material';
import { describe, it, expect } from 'vitest';
import { FqThemeProvider } from './FqThemeProvider';
function Probe() {
  const theme = useTheme();
  return <output data-testid="theme">{theme.palette.primary.main}</output>;
}
describe('FqThemeProvider', () => {
  it('preserves the legacy DOM and accepts a custom MUI theme', () => {
    const { container, rerender } = render(
      <FqThemeProvider>
        <Probe />
      </FqThemeProvider>,
    );
    expect(container.querySelector('[data-fq-theme]')).toBeNull();
    rerender(
      <FqThemeProvider
        theme={createTheme({ palette: { primary: { main: '#112233' } } })}
      >
        <Probe />
      </FqThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('#112233');
  });
  it('updates scoped CSS and MUI together and isolates sibling variables', () => {
    const { container, rerender } = render(
      <>
        <FqThemeProvider
          tokens={{
            schemaVersion: 1,
            semantic: { light: { '--color-primary': '#663399' } },
          }}
        >
          <Probe />
        </FqThemeProvider>
        <span data-testid="sibling">Outside</span>
      </>,
    );
    const scope = container.querySelector('[data-fq-theme]') as HTMLElement;
    expect(scope.style.getPropertyValue('--color-primary')).toBe('#663399');
    expect(screen.getByTestId('theme')).toHaveTextContent('#663399');
    expect(screen.getByTestId('sibling').closest('[data-fq-theme]')).toBeNull();
    rerender(
      <FqThemeProvider mode="dark" density="spacious">
        <Probe />
      </FqThemeProvider>,
    );
    expect(container.querySelector('[data-fq-theme]')).toHaveAttribute(
      'data-theme',
      'dark',
    );
    expect(
      (
        container.querySelector('[data-fq-theme]') as HTMLElement
      ).style.getPropertyValue('--fq-density-padding'),
    ).toBe('1.25');
  });
  it('rejects independent MUI and token configurations that could diverge', () => {
    expect(() =>
      render(
        <FqThemeProvider theme={createTheme()} tokens={{ schemaVersion: 1 }}>
          <Probe />
        </FqThemeProvider>,
      ),
    ).toThrow('not both');
  });
});
