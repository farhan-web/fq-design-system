import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FqThemeProvider } from './FqThemeProvider';
import type { FqDensity, FqThemeConfig } from './tokenConfig';
import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import { Select } from '../components/Select/Select';
import { Textarea } from '../components/Textarea/Textarea';
import { Checkbox } from '../components/Checkbox/Checkbox';
import { Radio } from '../components/Radio/Radio';
import { Switch } from '../components/Switch/Switch';
import { CheckboxGroup } from '../components/CheckboxGroup/CheckboxGroup';
import { Chips } from '../components/Chips/Chips';
import { IconButton } from '../components/IconButton/IconButton';

const meta: Meta = {
  title: 'Foundations/Component tokens',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;
export const Controls: Story = {
  render: function DensityControls(_args, context) {
    const [density, setDensity] = useState<FqDensity>('comfortable');
    const [brand, setBrand] = useState(false);
    const tokens: FqThemeConfig = {
      schemaVersion: 1,
      ...(brand
        ? {
            semantic: {
              light: {
                '--color-primary': '#663399',
                '--color-primary-hover': '#553080',
                '--color-primary-subtle': '#f2eaff',
                '--color-danger-subtle': '#fff0e5',
                '--color-text-activity': '#663399',
                '--color-danger': '#884422',
                '--color-text-alert': '#884422',
              },
              dark: {
                '--color-primary': '#c4a3ff',
                '--color-primary-hover': '#d6c0ff',
                '--color-primary-subtle': '#443355',
                '--color-danger-subtle': '#4d3322',
                '--color-text-activity': '#c4a3ff',
                '--color-danger': '#ffbb88',
                '--color-text-alert': '#ffbb88',
              },
            },
            foundation: {
              palette: {
                '--color-blue-400': '#663399',
                '--color-red-400': '#884422',
              },
            },
            aliases: { '--space-2': '10px' },
            components: {
              button: {
                '--fq-button-blue-200':
                  context.globals.theme === 'dark' ? '#594466' : '#d8c4f0',
                '--fq-button-red-200':
                  context.globals.theme === 'dark' ? '#503020' : '#f0c4b0',
              },
              select: {
                '--fq-select-radius-md': '13px',
                '--fq-select-font-family': 'Georgia, serif',
              },
              switch: {
                '--fq-switch-font-family': 'Georgia, serif',
                '--fq-switch-gap': '13px',
              },
              textarea: { '--fq-textarea-radius-md': '13px' },
              input: { '--fq-input-radius': '13px' },
            },
          }
        : {}),
    };
    return (
      <>
        <select
          aria-label="Density"
          value={density}
          onChange={(e) => setDensity(e.target.value as FqDensity)}
        >
          {['compact', 'comfortable', 'spacious'].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <button onClick={() => setBrand(!brand)}>Toggle brand</button>
        <div data-testid="density-scope">
          <FqThemeProvider
            tokens={tokens}
            density={density}
            mode={context.globals.theme === 'dark' ? 'dark' : 'light'}
          >
            <div style={{ display: 'grid', gap: 16, padding: 8 }}>
              <Button data-testid="density-button">Action</Button>
              <Button variant="secondary" data-testid="density-secondary">
                Secondary
              </Button>
              <Button variant="danger" data-testid="density-danger">
                Danger
              </Button>
              <Input
                label="Amount"
                defaultValue="42"
                prefix="IDR"
                helperText="Helper"
              />
              <Input label="Invalid" error="Error" defaultValue="Invalid" />
              <Input label="Disabled" disabled defaultValue="Disabled" />
              <Select label="Choice" helperText="Choice helper">
                <option>First option</option>
              </Select>
              <Textarea label="Comment" defaultValue="A comment" showCount />
              <Checkbox
                label="Checked"
                helperText="Checkbox helper"
                defaultChecked
              />
              <Radio
                label="Radio choice"
                helperText="Radio helper"
                defaultChecked
              />
              <Switch
                label="Enabled"
                helperText="Switch helper"
                defaultChecked
              />
              <Switch label="Disabled switch" disabled defaultChecked />
              <CheckboxGroup label="Options" helperText="Choose">
                <Checkbox label="Group item" />
              </CheckboxGroup>
              <Chips active>Selected chip</Chips>
              <Chips disabled>Disabled chip</Chips>
              <IconButton aria-label="Icon action">
                <svg width="16" height="16" aria-hidden="true">
                  <path d="M0 8h16" />
                </svg>
              </IconButton>
            </div>
          </FqThemeProvider>
        </div>
        <Button data-testid="density-sibling">Outside</Button>
      </>
    );
  },
};
