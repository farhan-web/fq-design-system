import type { Meta, StoryObj } from '@storybook/react-vite';
import { Countdown } from './Countdown';

const meta = {
  title: 'Components/Countdown',
  component: Countdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Countdown timer displaying remaining time as MM:SS or HH:MM:SS.',
      },
    },
  },
  args: {
    seconds: 90,
  },
} satisfies Meta<typeof Countdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { seconds: 90 },
};

export const Danger: Story = {
  args: { seconds: 30, variant: 'danger' },
};

export const Warning: Story = {
  args: { seconds: 300, variant: 'warning' },
};

export const Neutral: Story = {
  args: { seconds: 600, variant: 'neutral' },
};

export const WithHours: Story = {
  args: { seconds: 3661, showHours: true },
};

export const Expired: Story = {
  args: { seconds: 0 },
};

export const WithMilliseconds: Story = {
  name: 'With Milliseconds',
  args: { seconds: 30, showMilliseconds: true },
};

export const WithTargetDate: Story = {
  args: {
    targetDate: new Date(Date.now() + 60_000),
    seconds: undefined,
  },
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Countdown seconds={90} variant="danger" />
      <Countdown seconds={90} variant="warning" />
      <Countdown seconds={90} variant="neutral" />
    </div>
  ),
};

// ── Unboxed ─────────────────────────────────────────────

export const Unboxed: Story = {
  name: 'Unboxed',
  args: { seconds: 90, display: 'unboxed' },
};

export const UnboxedAllVariants: Story = {
  name: 'Unboxed – All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Countdown seconds={90} variant="danger" display="unboxed" />
      <Countdown seconds={90} variant="warning" display="unboxed" />
      <Countdown seconds={90} variant="neutral" display="unboxed" />
    </div>
  ),
};

export const UnboxedWithMilliseconds: Story = {
  name: 'Unboxed – With Milliseconds',
  args: { seconds: 30, display: 'unboxed', showMilliseconds: true },
};

// ── Unboxed Small ────────────────────────────────────────

export const UnboxedSmall: Story = {
  name: 'Unboxed Small',
  args: { seconds: 90, display: 'unboxed-small' },
};

export const UnboxedSmallAllVariants: Story = {
  name: 'Unboxed Small – All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Countdown seconds={90} variant="danger" display="unboxed-small" />
      <Countdown seconds={90} variant="warning" display="unboxed-small" />
      <Countdown seconds={90} variant="neutral" display="unboxed-small" />
    </div>
  ),
};
