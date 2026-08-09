import type {
  Meta,
  StoryObj,
} from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import {
  ArrowRight,
  Save,
  Trash2,
} from 'lucide-react';

import {
  Button,
} from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,

  tags: ['autodocs'],

  parameters: {
    layout: 'centered',

    docs: {
      description: {
        component:
          'Button is used to trigger an action or submit an operation. ' +
          'It supports multiple visual variants, sizes, loading state, icons, ' +
          'full-width layout, and native button attributes.',
      },
    },
  },

  args: {
    children: 'Button',
  },

  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'ghost',
        'danger',
      ],
    },

    size: {
      control: 'select',
      options: [
        'sm',
        'md',
        'lg',
      ],
    },

    loading: {
      control: 'boolean',
    },

    disabled: {
      control: 'boolean',
    },

    fullWidth: {
      control: 'boolean',
    },

    iconOnly: {
      control: 'boolean',
    },

    startIcon: {
      control: false,
    },

    endIcon: {
      control: false,
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithStartIcon: Story = {
  args: {
    startIcon: <Save />,
    children: 'Save',
  },
};

export const WithEndIcon: Story = {
  args: {
    endIcon: <ArrowRight />,
    children: 'Next',
  },
};

export const WithBothIcons: Story = {
  args: {
    startIcon: <Save />,
    endIcon: <ArrowRight />,
    children: 'Continue',
  },
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    children: <Save />,
    'aria-label': 'Save',
  },
};

export const DeleteIconOnly: Story = {
  args: {
    variant: 'danger',
    iconOnly: true,
    children: <Trash2 />,
    'aria-label': 'Delete',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Save',
  },

  parameters: {
    layout: 'padded',
  },
};

export const Interaction: Story = {
  args: {
    children: 'Save',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole('button', {
      name: 'Save',
    });

    await expect(button).toBeEnabled();

    await userEvent.click(button);

    await expect(button).toBeEnabled();
  },
};

export const DisabledInteraction: Story = {
  args: {
    children: 'Delete',
    variant: 'danger',
    disabled: true,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole('button', {
      name: 'Delete',
    });

    await expect(button).toBeDisabled();
  },
};

export const LoadingInteraction: Story = {
  args: {
    children: 'Saving...',
    loading: true,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole('button', {
      name: 'Saving...',
    });

    await expect(button).toBeDisabled();

    await expect(button).toHaveAttribute(
      'aria-busy',
      'true',
    );
  },
};

export const IconOnlyAccessibility: Story = {
  args: {
    iconOnly: true,
    children: <Save />,
    'aria-label': 'Save',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole('button', {
      name: 'Save',
    });

    await expect(button).toBeVisible();
  },
};

export const KeyboardInteraction: Story = {
  args: {
    children: 'Save',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole('button', {
      name: 'Save',
    });

    await userEvent.tab();

    await expect(button).toHaveFocus();
  },
};
