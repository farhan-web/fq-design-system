import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { BottomSheet } from './BottomSheet';

const meta = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        component:
          'Slide-up modal overlay anchored to the bottom of the screen. ' +
          'Mobile-first component — preview is wrapped in a 390×844 phone frame.',
      },
    },
  },
  args: {
    open: false,
    onClose: () => {},
    title: 'Sheet Title',
    handle: true,
    backdropDismiss: true,
    maxHeight: '90vh',
  },

  argTypes: {
    title: {
      control: 'text',
      description: 'Header title (omit to hide header)',
    },
    handle: { control: 'boolean', description: 'Show drag handle bar' },
    backdropDismiss: {
      control: 'boolean',
      description: 'Dismiss on backdrop click',
    },
    maxHeight: {
      control: 'text',
      description: 'Max height (CSS value, e.g. "50vh", "400px")',
    },
    // not controllable via panel
    open: { control: false },
    onClose: { control: false },
    action: { control: false },
    iconActions: { control: false },
    image: { control: false },
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive playground — use the Controls panel (⌘K → Controls) to toggle
 * handle, change title, adjust maxHeight, etc. in real time.
 */
export const Playground: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <MobileFrame>
        <Button onClick={() => setOpen(true)}>Open Sheet</Button>
        <BottomSheet {...args} open={open} onClose={() => setOpen(false)}>
          <p style={{ margin: 0 }}>
            Use the <strong>Controls</strong> panel to change title, toggle
            handle, set maxHeight, and more.
          </p>
        </BottomSheet>
      </MobileFrame>
    );
  },
};

/**
 * Wraps the story in a phone-frame container.
 * The `transform: translateZ(0)` is intentional: it establishes a new
 * containing block so that `position: fixed` children (overlay + sheet)
 * are constrained inside the frame instead of escaping to the viewport.
 */
function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#e5e7eb',
        padding: 24,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 390,
          height: 844,
          background: 'var(--color-surface, #f4f7fe)',
          overflow: 'hidden',
          borderRadius: 40,
          boxShadow: '0 8px 48px rgba(0,0,0,0.22)',
          transform: 'translateZ(0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function BottomSheetDemo(
  props: Omit<React.ComponentProps<typeof BottomSheet>, 'open' | 'onClose'>,
) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Sheet</Button>
      <BottomSheet {...props} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export const Default: Story = {
  render: () => (
    <MobileFrame>
      <BottomSheetDemo>
        <p>Sheet content goes here.</p>
      </BottomSheetDemo>
    </MobileFrame>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <MobileFrame>
      <BottomSheetDemo title="Filter Options">
        <p>Filter content goes here.</p>
      </BottomSheetDemo>
    </MobileFrame>
  ),
};

export const NoHandle: Story = {
  render: () => (
    <MobileFrame>
      <BottomSheetDemo title="No Handle" handle={false}>
        <p>This sheet has no drag handle.</p>
      </BottomSheetDemo>
    </MobileFrame>
  ),
};

export const NoBackdropDismiss: Story = {
  render: () => (
    <MobileFrame>
      <BottomSheetDemo title="Sticky Sheet" backdropDismiss={false}>
        <p>Click the close button to dismiss — backdrop click won't work.</p>
      </BottomSheetDemo>
    </MobileFrame>
  ),
};

export const WithAction: Story = {
  render: () => (
    <MobileFrame>
      <BottomSheetDemo
        title="Filter Options"
        action={{ label: 'Reset', onClick: () => alert('Reset!') }}
      >
        <p>Header shows a text link action on the right side.</p>
      </BottomSheetDemo>
    </MobileFrame>
  ),
};

export const WithIconActions: Story = {
  render: () => (
    <MobileFrame>
      <BottomSheetDemo
        title="Details"
        iconActions={[
          {
            label: 'Share',
            onClick: () => alert('Share!'),
            icon: (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            ),
          },
          {
            label: 'More options',
            onClick: () => alert('More!'),
            icon: (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            ),
          },
        ]}
      >
        <p>Header shows up to 2 icon-button actions on the right side.</p>
      </BottomSheetDemo>
    </MobileFrame>
  ),
};

export const WithImage: Story = {
  render: () => (
    <MobileFrame>
      <BottomSheetDemo
        title="Hotel Deal"
        image={
          <div
            style={{
              width: '100%',
              height: 200,
              background: 'linear-gradient(135deg, #007BFF 0%, #00C1EB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            Image Slot
          </div>
        }
      >
        <p>An image is shown between the handle and the title header.</p>
      </BottomSheetDemo>
    </MobileFrame>
  ),
};

export const HalfHeight: Story = {
  render: () => (
    <MobileFrame>
      {/* height="50vh" in a real app; 422px = 50% of the 844px demo frame */}
      <BottomSheetDemo
        title="Half Height"
        maxHeight="422px"
        style={{ height: '422px' }}
      >
        <p>
          This sheet is fixed at half the screen height. In a real app, pass{' '}
          <code>maxHeight="50vh"</code> and{' '}
          <code>style=&#123;&#123; height: '50vh' &#125;&#125;</code>.
        </p>
      </BottomSheetDemo>
    </MobileFrame>
  ),
};

export const WithScrollingContent: Story = {
  render: () => (
    <MobileFrame>
      <BottomSheetDemo title="Long Content">
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} style={{ margin: '0 0 12px' }}>
            Line {i + 1}: Scroll down to see the sticky header with compact H3
            title.
          </p>
        ))}
      </BottomSheetDemo>
    </MobileFrame>
  ),
};
