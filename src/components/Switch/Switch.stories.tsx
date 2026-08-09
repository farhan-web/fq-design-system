import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Notifications',
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const On: Story = {
  args: {
    checked: true,
    readOnly: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledOn: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: 'Receive notifications about new activity.',
  },
};

export const Error: Story = {
  args: {
    error: 'Notification preference is required.',
  },
};
