import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner } from './Banner';

const meta = {
  title: 'Components/Banner',
  component: Banner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Notification strip for info, success, warning, and error states. ' +
          'Two layouts: **sectional** (8px radius, optional × dismiss) and ' +
          '**full-width** (0px radius, chevron, entire banner tappable via `onClick`).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
    },
    layout: { control: 'select', options: ['sectional', 'full-width'] },
    dismissible: { control: 'boolean' },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Flight update',
    description: 'Your flight has been rescheduled to 14:30.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Booking confirmed',
    description: 'Your ticket has been sent to your email.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Check-in closes soon',
    description: 'Online check-in closes in 2 hours.',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'Payment failed',
    description: 'We could not process your payment. Please try again.',
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'info',
    title: 'New feature available',
    description: 'Try our redesigned search experience.',
    dismissible: true,
  },
};

export const WithAction: Story = {
  args: {
    variant: 'warning',
    title: 'Check-in closes soon',
    description: 'Online check-in closes in 2 hours.',
    action: { label: 'Check in now', onClick: () => {} },
  },
};

export const NoTitle: Story = {
  args: { variant: 'success', description: 'Changes saved successfully.' },
};

export const FullWidthInfo: Story = {
  name: 'Full Width / Info',
  args: {
    variant: 'info',
    layout: 'full-width',
    title: 'Flight update',
    description: 'Your flight has been rescheduled to 14:30.',
    onClick: () => alert('banner tapped'),
  },
};

export const FullWidthSuccess: Story = {
  name: 'Full Width / Success',
  args: {
    variant: 'success',
    layout: 'full-width',
    title: 'Booking confirmed',
    description: 'Your ticket has been sent to your email.',
    onClick: () => {},
  },
};

export const FullWidthWithAction: Story = {
  name: 'Full Width / With action link',
  args: {
    variant: 'danger',
    layout: 'full-width',
    title: 'Payment failed',
    description: 'We could not process your payment.',
    action: { label: 'Try again', onClick: () => {} },
    onClick: () => {},
  },
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {(['info', 'success', 'warning', 'danger'] as const).map((v) => (
        <Banner
          key={v}
          variant={v}
          title={v.charAt(0).toUpperCase() + v.slice(1)}
          description={`This is a ${v} banner notification.`}
        />
      ))}
    </div>
  ),
};
