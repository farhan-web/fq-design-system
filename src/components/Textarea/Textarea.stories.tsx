import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,

  parameters: {
    layout: 'padded',
  },

  tags: ['autodocs'],

  args: {
    label: 'Description',
    placeholder: 'Write something...',
  },

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

    rows: {
      control: 'number',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue: 'This is an example textarea value.',
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 'This content cannot be edited.',
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: 'Maximum 500 characters.',
  },
};

export const Error: Story = {
  args: {
    error: 'Description is required.',
  },
};

export const CustomRows: Story = {
  args: {
    rows: 8,
  },
};

export const Interaction: Story = {
  args: {
    label: 'Description',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textarea = canvas.getByRole('textbox', {
      name: 'Description',
    });

    await expect(textarea).toBeEnabled();

    await userEvent.type(textarea, 'This is a test description.');

    await expect(textarea).toHaveValue('This is a test description.');
  },
};

export const DisabledInteraction: Story = {
  args: {
    disabled: true,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textarea = canvas.getByRole('textbox', {
      name: 'Description',
    });

    await expect(textarea).toBeDisabled();
  },
};

export const ErrorInteraction: Story = {
  args: {
    error: 'Description is required.',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textarea = canvas.getByRole('textbox', {
      name: 'Description',
    });

    const message = canvas.getByText('Description is required.');

    await expect(textarea).toHaveAttribute('aria-invalid', 'true');

    await expect(textarea).toHaveAttribute('aria-describedby', message.id);
  },
};

export const KeyboardInteraction: Story = {
  args: {
    label: 'Description',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textarea = canvas.getByRole('textbox', {
      name: 'Description',
    });

    await userEvent.tab();

    await expect(textarea).toHaveFocus();
  },
};
