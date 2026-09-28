import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Mail, Search } from 'lucide-react';

import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,

  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Textfield with floating label. Label sits as placeholder when unfilled and floats to the top when focused or filled. 52px fixed height, 16px horizontal padding, body3 label, body2 input text.',
      },
    },
  },

  tags: ['autodocs'],

  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    prefix: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    startIcon: { control: false },
    endIcon: { control: false },
    onClear: { control: false },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

// ── States ─────────────────────────────────────────────────

export const Unfilled: Story = {
  name: 'Unfilled (Defocused)',
  args: { label: 'Email address' },
};

export const Filled: Story = {
  name: 'Filled (Defocused)',
  args: {
    label: 'Email address',
    value: 'user@example.com',
    onChange: () => {},
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Email address',
    helperText: 'We will never share your email.',
  },
};

export const Required: Story = {
  args: {
    label: 'Email address',
    required: true,
  },
};

export const Error: Story = {
  name: 'Error (Filled)',
  args: {
    label: 'Email address',
    value: 'invalid-email',
    onChange: () => {},
    error: 'Please enter a valid email address.',
  },
};

export const ErrorUnfilled: Story = {
  name: 'Error (Unfilled)',
  args: {
    label: 'Email address',
    error: 'This field is required.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Email address',
    value: 'user@example.com',
    onChange: () => {},
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Email address',
    value: 'user@example.com',
    onChange: () => {},
    readOnly: true,
  },
};

// ── Icons ──────────────────────────────────────────────────

export const WithStartIcon: Story = {
  args: {
    label: 'Search',
    startIcon: <Search size={20} />,
  },
};

export const WithEndIcon: Story = {
  args: {
    label: 'Email address',
    endIcon: <Mail size={20} />,
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'Search',
    startIcon: <Search size={20} />,
    endIcon: <Mail size={20} />,
  },
};

// ── Prefix ─────────────────────────────────────────────────

export const WithPrefix: Story = {
  name: 'With Prefix (Currency)',
  args: {
    label: 'Amount',
    prefix: 'IDR',
    helperText: 'Enter the amount in Indonesian Rupiah.',
  },
};

export const WithPrefixFilled: Story = {
  name: 'With Prefix — Filled',
  args: {
    label: 'Amount',
    prefix: 'IDR',
    value: '500000',
    onChange: () => {},
    helperText: 'Enter the amount in Indonesian Rupiah.',
  },
};

// ── Clear button ───────────────────────────────────────────

function ClearDemo() {
  const [value, setValue] = useState('');
  return (
    <Input
      label="Search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClear={() => setValue('')}
      helperText="Type text then focus to reveal the clear button."
    />
  );
}

export const WithClearButton: Story = {
  name: 'With Clear Button (Instant-Erase)',
  render: () => <ClearDemo />,
};

// ── Interactions ───────────────────────────────────────────

export const Interaction: Story = {
  args: { label: 'Email address' },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /Email address/ });

    await expect(input).toBeEnabled();
    await userEvent.type(input, 'user@example.com');
    await expect(input).toHaveValue('user@example.com');
  },
};

export const DisabledInteraction: Story = {
  args: { label: 'Email address', value: 'user@example.com', disabled: true },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/Email address/);
    await expect(input).toBeDisabled();
  },
};

export const ErrorInteraction: Story = {
  args: {
    label: 'Email address',
    value: 'invalid-email',
    error: 'Please enter a valid email address.',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/Email address/);
    const errorMsg = canvas.getByText('Please enter a valid email address.');

    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAttribute('aria-describedby', errorMsg.id);
  },
};

export const KeyboardInteraction: Story = {
  args: { label: 'Email address' },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/Email address/);

    await userEvent.tab();
    await expect(input).toHaveFocus();
  },
};
