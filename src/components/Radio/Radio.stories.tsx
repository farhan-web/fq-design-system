import type { Meta, StoryObj } from '@storybook/react-vite';

import { Radio } from './Radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Cash',
    name: 'payment',
  },
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
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

export const Error: Story = {
  args: {
    error: 'Please select a payment method.',
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: 'You can change this later.',
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const PaymentMethods: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <Radio
        name="payment"
        value="cash"
        label="Cash"
      />

      <Radio
        name="payment"
        value="card"
        label="Credit Card"
      />

      <Radio
        name="payment"
        value="transfer"
        label="Bank Transfer"
      />
    </div>
  ),
};
