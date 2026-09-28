import type { Meta, StoryObj } from '@storybook/react-vite';
import { Countdown } from '../Countdown/Countdown';
import { Label } from './Label';

// ── Shared icon ───────────────────────────────────────────

const DotIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="5" />
  </svg>
);

// ── Meta ──────────────────────────────────────────────────

const meta = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Product label / status indicator. Supports icon, text, and optional inline countdown.',
      },
    },
  },
  args: { children: 'Label' },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Soft-tint variants ────────────────────────────────────

export const Primary: Story = { args: { variant: 'primary' } };
export const Success: Story = { args: { variant: 'success' } };
export const Danger: Story = { args: { variant: 'danger' } };
export const Warning: Story = { args: { variant: 'warning' } };
export const Neutral: Story = { args: { variant: 'neutral' } };

// ── Outline variants ──────────────────────────────────────

export const OutlinePrimary: Story = { args: { variant: 'outline-primary' } };
export const OutlineSuccess: Story = { args: { variant: 'outline-success' } };
export const OutlineDanger: Story = { args: { variant: 'outline-danger' } };
export const OutlineNeutral: Story = { args: { variant: 'outline-neutral' } };

// ── Sizes ─────────────────────────────────────────────────

export const SizeMd: Story = {
  name: 'Size – Medium',
  args: { size: 'md', variant: 'primary', startIcon: <DotIcon /> },
};

export const SizeSm: Story = {
  name: 'Size – Small',
  args: { size: 'sm', variant: 'solid-red', startIcon: <DotIcon /> },
};

// ── States ────────────────────────────────────────────────

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, startIcon: <DotIcon /> },
};

export const Loading: Story = {
  args: { loading: true },
};

// ── With icon ─────────────────────────────────────────────

export const WithStartIcon: Story = {
  name: 'With Start Icon',
  args: { variant: 'primary', startIcon: <DotIcon /> },
};

export const WithStartIconSmall: Story = {
  name: 'With Start Icon – Small',
  args: { size: 'sm', variant: 'solid-green', startIcon: <DotIcon /> },
};

// ── Solid sub-variants (small, white text) ────────────────

export const SolidRed: Story = {
  name: 'Solid – Red (Campaign)',
  args: { variant: 'solid-red', size: 'sm', startIcon: <DotIcon /> },
};

export const SolidOrange: Story = {
  name: 'Solid – Orange (Non-Campaign)',
  args: { variant: 'solid-orange', size: 'sm', startIcon: <DotIcon /> },
};

export const SolidGreen: Story = {
  name: 'Solid – Green (Social Nudges)',
  args: { variant: 'solid-green', size: 'sm', startIcon: <DotIcon /> },
};

export const SolidBlue: Story = {
  name: 'Solid – Blue (New Products)',
  args: { variant: 'solid-blue', size: 'sm', startIcon: <DotIcon /> },
};

export const AllSolidSubVariants: Story = {
  name: 'All Solid Sub-Variants',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Label variant="solid-red" size="sm" startIcon={<DotIcon />}>
        Campaign
      </Label>
      <Label variant="solid-orange" size="sm" startIcon={<DotIcon />}>
        Non-Campaign
      </Label>
      <Label variant="solid-green" size="sm" startIcon={<DotIcon />}>
        Social Nudges
      </Label>
      <Label variant="solid-blue" size="sm" startIcon={<DotIcon />}>
        New Products
      </Label>
    </div>
  ),
};

// ── Gradient sub-variants (small, white text) ─────────────

export const GradientRed: Story = {
  name: 'Gradient – Red (Campaign)',
  args: { variant: 'gradient-red', size: 'sm', startIcon: <DotIcon /> },
};

export const GradientOrange: Story = {
  name: 'Gradient – Orange (Non-Campaign)',
  args: { variant: 'gradient-orange', size: 'sm', startIcon: <DotIcon /> },
};

export const GradientGreen: Story = {
  name: 'Gradient – Green (Social Nudges)',
  args: { variant: 'gradient-green', size: 'sm', startIcon: <DotIcon /> },
};

export const GradientTosca: Story = {
  name: 'Gradient – Tosca (New Products)',
  args: { variant: 'gradient-tosca', size: 'sm', startIcon: <DotIcon /> },
};

export const GradientViolet: Story = {
  name: 'Gradient – Violet (Lowest Price)',
  args: { variant: 'gradient-violet', size: 'sm', startIcon: <DotIcon /> },
};

export const AllGradientSubVariants: Story = {
  name: 'All Gradient Sub-Variants',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Label variant="gradient-red" size="sm" startIcon={<DotIcon />}>
        Campaign
      </Label>
      <Label variant="gradient-orange" size="sm" startIcon={<DotIcon />}>
        Non-Campaign
      </Label>
      <Label variant="gradient-green" size="sm" startIcon={<DotIcon />}>
        Social Nudges
      </Label>
      <Label variant="gradient-tosca" size="sm" startIcon={<DotIcon />}>
        New Products
      </Label>
      <Label variant="gradient-violet" size="sm" startIcon={<DotIcon />}>
        Lowest Price
      </Label>
    </div>
  ),
};

// ── With countdown (small only per spec) ─────────────────

export const WithCountdown: Story = {
  name: 'With Countdown',
  args: {
    variant: 'solid-red',
    size: 'sm',
    startIcon: <DotIcon />,
    children: 'Promo Tunjangan',
    countdown: (
      <Countdown seconds={3661} display="unboxed-small" variant="danger" />
    ),
  },
};

export const WithCountdownGradient: Story = {
  name: 'With Countdown – Gradient',
  args: {
    variant: 'gradient-red',
    size: 'sm',
    startIcon: <DotIcon />,
    children: 'Discount Promo',
    countdown: (
      <Countdown seconds={90} display="unboxed-small" variant="danger" />
    ),
  },
};

export const AllSubVariantsWithCountdown: Story = {
  name: 'All Sub-Variants with Countdown',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Label
        variant="solid-red"
        size="sm"
        startIcon={<DotIcon />}
        countdown={
          <Countdown seconds={3661} display="unboxed-small" variant="danger" />
        }
      >
        Campaign
      </Label>
      <Label
        variant="solid-orange"
        size="sm"
        startIcon={<DotIcon />}
        countdown={
          <Countdown seconds={3661} display="unboxed-small" variant="warning" />
        }
      >
        Non-Campaign
      </Label>
      <Label
        variant="solid-green"
        size="sm"
        startIcon={<DotIcon />}
        countdown={
          <Countdown seconds={3661} display="unboxed-small" variant="neutral" />
        }
      >
        Social Nudges
      </Label>
      <Label
        variant="gradient-red"
        size="sm"
        startIcon={<DotIcon />}
        countdown={
          <Countdown seconds={90} display="unboxed-small" variant="danger" />
        }
      >
        Flash Sale
      </Label>
      <Label
        variant="gradient-violet"
        size="sm"
        startIcon={<DotIcon />}
        countdown={
          <Countdown seconds={90} display="unboxed-small" variant="danger" />
        }
      >
        Lowest Price
      </Label>
    </div>
  ),
};
