import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Coachmark } from './Coachmark';

/**
 * Coachmarks are absolutely positioned relative to their anchor.
 * The decorator adds uniform padding so the popup card is fully
 * visible on the canvas for every placement.
 */
const meta = {
  title: 'Components/Coachmark',
  component: Coachmark,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Step-by-step onboarding tooltip anchored to a target element.',
      },
    },
  },
  args: {
    open: true,
    title: 'New feature',
    body: 'This button does something amazing.',
    placement: 'bottom',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ padding: '120px 320px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Coachmark>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Placements ───────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <Coachmark {...args}>
      <Button>Target</Button>
    </Coachmark>
  ),
};

export const PlacementTop: Story = {
  name: 'Placement / Top',
  args: { placement: 'top' },
  render: (args) => (
    <Coachmark {...args}>
      <Button>Target</Button>
    </Coachmark>
  ),
};

export const PlacementLeft: Story = {
  name: 'Placement / Left',
  args: { placement: 'left' },
  render: (args) => (
    <Coachmark {...args}>
      <Button>Target</Button>
    </Coachmark>
  ),
};

export const PlacementRight: Story = {
  name: 'Placement / Right',
  args: { placement: 'right' },
  render: (args) => (
    <Coachmark {...args}>
      <Button>Target</Button>
    </Coachmark>
  ),
};

// ── States ───────────────────────────────────────────────────────

export const WithSteps: Story = {
  args: { step: 1, totalSteps: 3 },
  render: (args) => (
    <Coachmark {...args} onNext={() => {}} onSkip={() => {}}>
      <Button>Target</Button>
    </Coachmark>
  ),
};

export const LastStep: Story = {
  args: { step: 3, totalSteps: 3 },
  render: (args) => (
    <Coachmark {...args} onDone={() => {}}>
      <Button>Target</Button>
    </Coachmark>
  ),
};

export const WithIllustration: Story = {
  args: { step: 1, totalSteps: 2 },
  render: (args) => (
    <Coachmark
      {...args}
      illustration={
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          aria-label="Feature illustration"
        >
          <rect
            width="80"
            height="80"
            rx="12"
            fill="var(--color-primary-subtle)"
          />
          <circle cx="40" cy="40" r="20" fill="var(--color-primary)" />
        </svg>
      }
      onNext={() => {}}
      onSkip={() => {}}
    >
      <Button>Target</Button>
    </Coachmark>
  ),
};

// ── Interactive ──────────────────────────────────────────────────

function MultiStepDemo() {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(true);
  const totalSteps = 3;

  if (!open) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p>Tour complete!</p>
        <Button
          onClick={() => {
            setStep(1);
            setOpen(true);
          }}
        >
          Restart
        </Button>
      </div>
    );
  }

  return (
    <Coachmark
      open
      title={`Step ${step}: Feature ${step}`}
      body={`This is the explanation for step ${step}.`}
      step={step}
      totalSteps={totalSteps}
      placement="bottom"
      onNext={() => setStep((s) => s + 1)}
      onSkip={() => setOpen(false)}
      onDone={() => setOpen(false)}
    >
      <Button>Target element</Button>
    </Coachmark>
  );
}

export const Interactive: Story = {
  render: () => <MultiStepDemo />,
};

// ── All Placements ───────────────────────────────────────────────

export const AllPlacements: Story = {
  name: 'All Placements',
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ padding: '80px 320px' }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '180px',
      }}
    >
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <Coachmark
          key={placement}
          open
          title={`Placement: ${placement}`}
          body="Arrow points toward the target."
          placement={placement}
        >
          <Button size="sm">{placement}</Button>
        </Coachmark>
      ))}
    </div>
  ),
};
