import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '../Checkbox/Checkbox';
import { CheckboxGroup } from './CheckboxGroup';

const meta = {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Group label rendered as <legend>.',
    },
    helperText: {
      control: 'text',
      description: 'Supporting text shown below the group.',
    },
    error: {
      control: 'text',
      description:
        'Error message shown below the group. Takes priority over helperText.',
    },
    required: {
      control: 'boolean',
      description: 'Shows a required asterisk next to the group label.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all checkboxes in the group.',
    },
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const DefaultItems = () => (
  <>
    <Checkbox label="Bagasi" />
    <Checkbox label="Makan" />
    <Checkbox label="Pilih kursi" />
  </>
);

export const Default: Story = {
  args: {
    label: 'Layanan tambahan',
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <DefaultItems />
    </CheckboxGroup>
  ),
};

export const WithHelperText: Story = {
  args: {
    label: 'Layanan tambahan',
    helperText: 'Pilih layanan yang ingin ditambahkan.',
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <DefaultItems />
    </CheckboxGroup>
  ),
};

export const WithError: Story = {
  args: {
    label: 'Layanan tambahan',
    error: 'Pilih minimal 1 layanan.',
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <DefaultItems />
    </CheckboxGroup>
  ),
};

export const Required: Story = {
  args: {
    label: 'Layanan tambahan',
    required: true,
    helperText: 'Wajib dipilih minimal 1.',
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <DefaultItems />
    </CheckboxGroup>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Layanan tambahan',
    disabled: true,
    helperText: 'Layanan tidak tersedia untuk rute ini.',
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <Checkbox label="Bagasi" defaultChecked />
      <Checkbox label="Makan" />
      <Checkbox label="Pilih kursi" />
    </CheckboxGroup>
  ),
};

export const NoLabel: Story = {
  render: () => (
    <CheckboxGroup>
      <Checkbox label="Opsi A" />
      <Checkbox label="Opsi B" />
      <Checkbox label="Opsi C" />
    </CheckboxGroup>
  ),
};

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <CheckboxGroup label="Default">
        <Checkbox label="Opsi A" />
        <Checkbox label="Opsi B" />
      </CheckboxGroup>

      <CheckboxGroup label="With helper text" helperText="Pilih yang sesuai.">
        <Checkbox label="Opsi A" />
        <Checkbox label="Opsi B" />
      </CheckboxGroup>

      <CheckboxGroup label="With error" error="Pilih minimal 1 opsi.">
        <Checkbox label="Opsi A" />
        <Checkbox label="Opsi B" />
      </CheckboxGroup>

      <CheckboxGroup label="Required" required helperText="Wajib diisi.">
        <Checkbox label="Opsi A" />
        <Checkbox label="Opsi B" />
      </CheckboxGroup>

      <CheckboxGroup label="Disabled" disabled helperText="Tidak tersedia.">
        <Checkbox label="Opsi A" defaultChecked />
        <Checkbox label="Opsi B" />
      </CheckboxGroup>
    </div>
  ),
};
