import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Snackbar, type SnackbarVariant } from './Snackbar';
import { Button } from '../Button/Button';

const meta: Meta<typeof Snackbar> = {
  title: 'Components/Snackbar',
  component: Snackbar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'error'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Snackbar>;

// ── Default (Controls) ────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    open: true,
    message: 'Item saved successfully',
    variant: 'default',
    autoHideDuration: null,
  },
};

// ── Variants ─────────────────────────────────────────────────────────────────

const VARIANTS: SnackbarVariant[] = [
  'default',
  'info',
  'success',
  'warning',
  'error',
];
const MESSAGES: Record<SnackbarVariant, string> = {
  default: 'Changes saved',
  info: 'New update available',
  success: 'Payment successful',
  warning: 'Session expiring soon',
  error: 'Something went wrong',
};

export const Variants: Story = {
  name: 'Variant Gallery',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {VARIANTS.map((v) => (
        <Snackbar
          key={v}
          open
          variant={v}
          message={MESSAGES[v]}
          autoHideDuration={null}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        />
      ))}
    </div>
  ),
};

// ── With action ───────────────────────────────────────────────────────────────

export const WithAction: Story = {
  name: 'With Action Button',
  args: {
    open: true,
    message: '1 item deleted',
    autoHideDuration: null,
    action: (
      <button
        style={{
          background: 'none',
          border: 'none',
          color: '#6eb3ff',
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
          padding: 0,
        }}
      >
        UNDO
      </button>
    ),
  },
};

// ── Interactive (trigger) ─────────────────────────────────────────────────────

export const Interactive: Story = {
  name: 'Interactive (auto-hide 3s)',
  render: function InteractiveDemo() {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Show Snackbar
        </Button>
        <Snackbar
          open={open}
          message="Action performed successfully"
          variant="success"
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};
