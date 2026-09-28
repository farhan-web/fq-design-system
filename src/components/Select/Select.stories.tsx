import type { Meta, StoryObj } from '@storybook/react-vite';

import { Select } from './Select';

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Country',
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <option value="">Select a country</option>
      <option value="id">Indonesia</option>
      <option value="sg">Singapore</option>
      <option value="my">Malaysia</option>
    </Select>
  ),
};

export const Selected: Story = {
  render: (args) => (
    <Select {...args} defaultValue="id">
      <option value="">Select a country</option>
      <option value="id">Indonesia</option>
      <option value="sg">Singapore</option>
      <option value="my">Malaysia</option>
    </Select>
  ),
};

export const Required: Story = {
  args: {
    required: true,
  },
  render: (args) => (
    <Select {...args}>
      <option value="">Select a country</option>
      <option value="id">Indonesia</option>
      <option value="sg">Singapore</option>
    </Select>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <Select {...args} defaultValue="id">
      <option value="id">Indonesia</option>
      <option value="sg">Singapore</option>
    </Select>
  ),
};

export const WithHelperText: Story = {
  args: {
    helperText: 'Select your current country.',
  },
  render: (args) => (
    <Select {...args}>
      <option value="">Select a country</option>
      <option value="id">Indonesia</option>
      <option value="sg">Singapore</option>
    </Select>
  ),
};

export const Error: Story = {
  args: {
    error: 'Country is required.',
  },
  render: (args) => (
    <Select {...args}>
      <option value="">Select a country</option>
      <option value="id">Indonesia</option>
      <option value="sg">Singapore</option>
    </Select>
  ),
};

export const WithOptGroup: Story = {
  name: 'With Option Groups',
  args: {
    label: 'Destination',
    helperText: 'Native <optgroup> works out of the box.',
  },
  render: (args) => (
    <Select {...args}>
      <option value="">Select a destination</option>
      <optgroup label="Asia">
        <option value="bali">Bali</option>
        <option value="singapore">Singapore</option>
        <option value="bangkok">Bangkok</option>
      </optgroup>
      <optgroup label="Europe">
        <option value="paris">Paris</option>
        <option value="london">London</option>
        <option value="rome">Rome</option>
      </optgroup>
    </Select>
  ),
};
