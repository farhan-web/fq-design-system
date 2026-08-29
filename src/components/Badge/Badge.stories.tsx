import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: { component: 'Visual cue for alerts, counts, and status.' },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SolidPrimary: Story = {
  args: { variant: 'solid-primary', children: 'New' },
};
export const SolidSuccess: Story = {
  args: { variant: 'solid-success', children: 'Active' },
};
export const SolidDanger: Story = {
  args: { variant: 'solid-danger', children: 'Error' },
};
export const SolidWarning: Story = {
  args: { variant: 'solid-warning', children: 'Warn' },
};
export const SolidNeutral: Story = {
  args: { variant: 'solid-neutral', children: 'Draft' },
};
export const SoftPrimary: Story = {
  args: { variant: 'soft-primary', children: 'New' },
};
export const SoftSuccess: Story = {
  args: { variant: 'soft-success', children: 'Active' },
};
export const SoftDanger: Story = {
  args: { variant: 'soft-danger', children: 'Error' },
};
export const SoftWarning: Story = {
  args: { variant: 'soft-warning', children: 'Warn' },
};
export const SoftNeutral: Story = {
  args: { variant: 'soft-neutral', children: 'Draft' },
};
export const Count: Story = {
  args: { variant: 'solid-danger', count: true, children: '99+' },
};
export const Dot: Story = { args: { variant: 'solid-danger', dot: true } };
export const GradientRed: Story = {
  name: 'Gradient Red (GR100)',
  args: { variant: 'gradient-red', children: 'New' },
};
export const GradientGreen: Story = {
  name: 'Gradient Green (GG100)',
  args: { variant: 'gradient-green', children: 'Active' },
};
export const Loading: Story = {
  args: { loading: true },
};
export const Disabled: Story = {
  args: { variant: 'solid-danger', disabled: true, children: 'Error' },
};
