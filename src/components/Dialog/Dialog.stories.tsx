import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, type DialogSize } from './Dialog';
import { Button } from '../Button/Button';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'fullscreen'] satisfies DialogSize[],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Dialog>;

// ── Default (Controls) ────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    open: true,
    title: 'Dialog Title',
    children: <p>Dialog content goes here. You can put any content inside.</p>,
  },
};

// ── With Actions ──────────────────────────────────────────────────────────────

export const WithActions: Story = {
  name: 'With Actions',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open Dialog
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm Delete"
          actions={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Delete
              </Button>
            </>
          }
        >
          <p>
            Are you sure you want to delete this item? This action cannot be
            undone.
          </p>
        </Dialog>
      </>
    );
  },
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Size Gallery',
  render: () => {
    const [openSize, setOpenSize] = React.useState<DialogSize | null>(null);
    const sizes: DialogSize[] = ['sm', 'md', 'lg'];
    return (
      <>
        <div style={{ display: 'flex', gap: 12 }}>
          {sizes.map((s) => (
            <Button key={s} variant="secondary" onClick={() => setOpenSize(s)}>
              Open {s.toUpperCase()}
            </Button>
          ))}
        </div>
        {sizes.map((s) => (
          <Dialog
            key={s}
            open={openSize === s}
            onClose={() => setOpenSize(null)}
            title={`Size: ${s.toUpperCase()}`}
            size={s}
            actions={
              <Button variant="primary" onClick={() => setOpenSize(null)}>
                Close
              </Button>
            }
          >
            <p>This dialog uses size="{s}".</p>
          </Dialog>
        ))}
      </>
    );
  },
};

// ── No Close Button ───────────────────────────────────────────────────────────

export const NoCloseButton: Story = {
  name: 'No Close Button (disableBackdropClick)',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open Dialog
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Important Notice"
          disableBackdropClick
          actions={
            <Button variant="primary" onClick={() => setOpen(false)}>
              I Understand
            </Button>
          }
        >
          <p>
            Clicking the backdrop won't close this dialog. Use the button below.
          </p>
        </Dialog>
      </>
    );
  },
};

// ── Fullscreen ────────────────────────────────────────────────────────────────

export const Fullscreen: Story = {
  name: 'Fullscreen',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open Fullscreen
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Fullscreen Dialog"
          size="fullscreen"
          actions={
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
          }
        >
          <p>This dialog fills the entire viewport.</p>
        </Dialog>
      </>
    );
  },
};
