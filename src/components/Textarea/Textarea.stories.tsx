import type { Meta, StoryObj } from '@storybook/react-vite';

import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Description',
    placeholder: 'Write something...',
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue:
      'This is an example textarea value.',
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
    defaultValue:
      'This content cannot be edited.',
  },
};

export const WithHelperText: Story = {
  args: {
    helperText:
      'Maximum 500 characters.',
  },
};

export const Error: Story = {
  args: {
    error:
      'Description is required.',
  },
};

export const CustomRows: Story = {
  args: {
    rows: 8,
  },
};
