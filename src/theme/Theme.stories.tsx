import { useState } from 'react';
import { useTheme } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import { Badge } from '../components/Badge/Badge';
import { FqThemeProvider } from './FqThemeProvider';
import {
  parseFqThemeJson,
  type FqThemeConfig,
  type FqDensity,
} from './tokenConfig';

const meta: Meta = {
  title: 'Foundations/Theme tokens',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;
function Probe() {
  const theme = useTheme();
  return (
    <output
      data-testid="mui-theme"
      data-primary={theme.palette.primary.main}
      data-radius={theme.shape.borderRadius}
      data-spacing={theme.spacing(2)}
      data-font={theme.typography.fontFamily}
      data-shadow={theme.shadows[1]}
    />
  );
}
export const Contracts: Story = {
  render: function ThemeContracts(_args, context) {
    const [tokens, setTokens] = useState<FqThemeConfig>({ schemaVersion: 1 });
    const [density, setDensity] = useState<FqDensity>('comfortable');
    const [error, setError] = useState('');
    const mode = context.globals.theme === 'dark' ? 'dark' : 'light';
    return (
      <>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button
            onClick={() => {
              setTokens({ schemaVersion: 1 });
              setDensity('comfortable');
              setError('');
            }}
          >
            Reset theme
          </button>
          <button
            onClick={() =>
              setTokens({
                schemaVersion: 1,
                foundation: {
                  palette: {
                    '--color-blue-400': '#663399',
                    '--color-blue-300': '#663399',
                  },
                },
              })
            }
          >
            Change palette
          </button>
          <button
            onClick={() =>
              setTokens({
                schemaVersion: 1,
                foundation: {
                  spacing: { '--spacing-8': '10px', '--spacing-16': '20px' },
                },
              })
            }
          >
            Change spacing
          </button>
          <button
            onClick={() =>
              setTokens({
                schemaVersion: 1,
                foundation: { radius: { '--radius-md': '14px' } },
              })
            }
          >
            Change radius
          </button>
          <button
            onClick={() =>
              setTokens({
                schemaVersion: 1,
                foundation: {
                  typography: { '--font-family': 'Georgia, serif' },
                },
              })
            }
          >
            Change font
          </button>
          <button
            onClick={() =>
              setTokens({
                schemaVersion: 1,
                foundation: {
                  shadow: {
                    '--elevation-04': '0 4px 10px rgb(0 0 0 / 30%)',
                    '--mui-shadow-1': '0 4px 10px rgb(0 0 0 / 30%)',
                  },
                },
              })
            }
          >
            Change shadow
          </button>
          <button
            onClick={() =>
              setTokens({
                schemaVersion: 1,
                components: {
                  button: {
                    '--fq-button-radius': '19px',
                    '--fq-button-primary': '#663399',
                  },
                },
              })
            }
          >
            Override Button
          </button>
          <button
            onClick={() =>
              setTokens({
                schemaVersion: 1,
                foundation: { spacing: { '--spacing-16': '20px' } },
                aliases: { '--space-4': '27px' },
              })
            }
          >
            Override legacy
          </button>
          <button
            onClick={() => {
              try {
                const next = parseFqThemeJson('{"schemaVersion":2}');
                setTokens(next);
              } catch (error) {
                setError((error as Error).message);
              }
            }}
          >
            Import invalid JSON
          </button>
          <label>
            Density{' '}
            <select
              value={density}
              onChange={(event) => setDensity(event.target.value as FqDensity)}
            >
              <option>compact</option>
              <option>comfortable</option>
              <option>spacious</option>
            </select>
          </label>
        </div>
        {error && <p role="alert">{error}</p>}
        <FqThemeProvider tokens={tokens} mode={mode} density={density}>
          <section
            data-testid="theme-scope"
            style={{
              padding: 16,
              background: 'var(--color-background)',
              color: 'var(--color-text-high)',
            }}
          >
            <Probe />
            <Button data-testid="theme-button">Themed Button</Button>
            <Button data-testid="theme-button-sm" size="sm">
              Small
            </Button>
            <Button data-testid="theme-button-lg" size="lg">
              Large
            </Button>
            <Input data-testid="theme-input" label="Themed Input" />
            <Badge>Theme badge</Badge>
            <div
              data-testid="theme-shadow"
              style={{
                marginTop: 16,
                padding: 8,
                boxShadow: 'var(--elevation-04)',
              }}
            >
              Raised surface
            </div>
          </section>
        </FqThemeProvider>
        <section data-testid="theme-sibling">
          <Button>Unchanged sibling</Button>
          <Input label="Sibling Input" />
        </section>
      </>
    );
  },
};
