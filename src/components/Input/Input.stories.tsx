import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Mail, Search } from 'lucide-react';

import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,

  parameters: {
    layout: 'padded',
  },

  tags: ['autodocs'],

  argTypes: {
    label: {
      control: 'text',
    },

    helperText: {
      control: 'text',
    },

    error: {
      control: 'text',
    },

    required: {
      control: 'boolean',
    },

    disabled: {
      control: 'boolean',
    },

    readOnly: {
      control: 'boolean',
    },

    type: {
      control: 'select',
      options: [
        'text',
        'email',
        'password',
        'number',
        'search',
        'tel',
        'url',
      ],
    },

    startIcon: {
      control: false,
    },

    endIcon: {
      control: false,
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    helperText: 'We will never share your email.',
  },
};

export const Required: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
  },
};

export const Error: Story = {
  args: {
    label: 'Email',
    value: 'invalid-email',
    error: 'Please enter a valid email address.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Email',
    value: 'user@example.com',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Email',
    value: 'user@example.com',
    readOnly: true,
  },
};

export const WithStartIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search products...',
    startIcon: <Search />,
  },
};

export const WithEndIcon: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    endIcon: <Mail />,
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search products...',
    startIcon: <Search />,
    endIcon: <Mail />,
  },
};

export const Interaction: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox', {
      name: 'Email',
    });

    await expect(input).toBeEnabled();

    await userEvent.type(
      input,
      'user@example.com',
    );

    await expect(input).toHaveValue(
      'user@example.com',
    );
  },
};

export const DisabledInteraction: Story = {
  args: {
    label: 'Email',
    value: 'user@example.com',
    disabled: true,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText('Email');

    await expect(input).toBeDisabled();
  },
};

export const ErrorInteraction: Story = {
  args: {
    label: 'Email',
    value: 'invalid-email',
    error: 'Please enter a valid email address.',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText('Email');
    const error = canvas.getByText(
      'Please enter a valid email address.',
    );

    await expect(input).toHaveAttribute(
      'aria-invalid',
      'true',
    );

    await expect(input).toHaveAttribute(
      'aria-describedby',
      error.id,
    );
  },
};

export const KeyboardInteraction: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText('Email');

    await userEvent.tab();

    await expect(input).toHaveFocus();
  },
};
