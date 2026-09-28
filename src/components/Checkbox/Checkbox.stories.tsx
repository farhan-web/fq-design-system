import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label displayed next to the checkbox.',
    },
    helperText: {
      control: 'text',
      description: 'Supporting text displayed below the checkbox.',
    },
    error: {
      control: 'text',
      description: 'Error message and error state.',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Displays the checkbox in an indeterminate state.',
    },
    checked: {
      control: 'boolean',
      description: 'Controls the checked state.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction with the checkbox.',
    },
    required: {
      control: 'boolean',
      description: 'Marks the checkbox as required.',
    },
    readOnly: {
      control: 'boolean',
      description: 'Prevents interaction but preserves visual checked state.',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Remember me',
  },
};

export const Checked: Story = {
  args: {
    label: 'Remember me',
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Select all',
    indeterminate: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Subscribe to updates',
    helperText: 'Receive occasional product updates.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Accept terms',
    error: 'You must accept the terms.',
  },
};

export const ErrorChecked: Story = {
  name: 'Error / Checked',
  args: {
    label: 'Accept terms',
    checked: true,
    error: 'You must accept the terms.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Unavailable option',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Already selected',
    checked: true,
    disabled: true,
  },
};

export const ReadOnly: Story = {
  name: 'Read Only / Unchecked',
  args: {
    label: 'Option is locked',
    readOnly: true,
  },
};

export const ReadOnlyChecked: Story = {
  name: 'Read Only / Checked',
  args: {
    label: 'Option is locked and selected',
    checked: true,
    readOnly: true,
  },
};

export const Required: Story = {
  args: {
    label: 'Accept terms',
    required: true,
  },
};

export const LongLabel: Story = {
  args: {
    label:
      'I agree to receive product updates, announcements, and occasional marketing communications.',
  },
};

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Checkbox label="Default" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
      <Checkbox label="Read only" readOnly />
      <Checkbox label="Read only checked" readOnly defaultChecked />
      <Checkbox label="Error" error="Required field" />
      <Checkbox label="With helper text" helperText="Supporting information" />
    </div>
  ),
};
