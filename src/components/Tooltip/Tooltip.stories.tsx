import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../Button/Button';
import {
  Tooltip,
  type TooltipArrowAlignment,
  type TooltipPlacement,
} from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Contextual information shown on hover, focus, or touch. N800 background, body3-regular text, 12px padding, max 280px width (configurable), 8px radius. 12 placement positions, controlled/uncontrolled modes.',
      },
    },
  },
  args: {
    content: 'Tooltip text',
    children: <button type="button">Hover me</button>,
  },
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ] satisfies TooltipPlacement[],
    },
    arrowAlignment: {
      control: 'select',
      options: ['start', 'center', 'end'] satisfies TooltipArrowAlignment[],
    },
    bold: { control: 'boolean' },
    arrow: { control: 'boolean' },
    enterDelay: { control: 'number' },
    leaveDelay: { control: 'number' },
    maxWidth: { control: 'text' },
    disableHoverListener: { control: 'boolean' },
    disableFocusListener: { control: 'boolean' },
    disableTouchListener: { control: 'boolean' },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Base placements ──────────────────────────────────────────────

export const Top: Story = {
  name: 'Placement: Top',
  render: () => (
    <Tooltip content="This is a tooltip" placement="top" enterDelay={0}>
      <Button>Hover me (top)</Button>
    </Tooltip>
  ),
};

export const Bottom: Story = {
  name: 'Placement: Bottom',
  render: () => (
    <Tooltip content="Tooltip on the bottom" placement="bottom" enterDelay={0}>
      <Button>Hover me (bottom)</Button>
    </Tooltip>
  ),
};

export const Left: Story = {
  name: 'Placement: Left',
  render: () => (
    <Tooltip content="Tooltip on the left" placement="left" enterDelay={0}>
      <Button>Hover me (left)</Button>
    </Tooltip>
  ),
};

export const Right: Story = {
  name: 'Placement: Right',
  render: () => (
    <Tooltip content="Tooltip on the right" placement="right" enterDelay={0}>
      <Button>Hover me (right)</Button>
    </Tooltip>
  ),
};

// ── All 12 placements grid ───────────────────────────────────────

export const AllPlacements: Story = {
  name: 'All 12 Placements',
  parameters: { layout: 'padded' },
  render: () => {
    const placements: TooltipPlacement[] = [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
    ];
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, auto)',
          gap: '48px 32px',
          padding: '64px',
          justifyContent: 'center',
        }}
      >
        {placements.map((p) => (
          <Tooltip
            key={p}
            content={`placement="${p}"`}
            placement={p}
            enterDelay={0}
          >
            <Button variant="secondary" size="sm">
              {p}
            </Button>
          </Tooltip>
        ))}
      </div>
    );
  },
};

// ── Text style variants ─────────────────────────────────────────

export const RegularText: Story = {
  name: 'Body3 Regular (default)',
  render: () => (
    <Tooltip
      content="body3-regular — default tooltip style"
      placement="top"
      enterDelay={0}
    >
      <Button>Regular text</Button>
    </Tooltip>
  ),
};

export const BoldText: Story = {
  name: 'Body3 Bold',
  render: () => (
    <Tooltip
      content="body3-bold — emphasis tooltip"
      placement="top"
      bold
      enterDelay={0}
    >
      <Button>Bold text</Button>
    </Tooltip>
  ),
};

// ── Content variants ────────────────────────────────────────────

export const LongContent: Story = {
  name: 'Long Content (wraps at 280px)',
  render: () => (
    <Tooltip
      content="This is a longer tooltip message that wraps to multiple lines when it exceeds the max width of 280px."
      enterDelay={0}
    >
      <Button>Long tooltip</Button>
    </Tooltip>
  ),
};

export const CustomMaxWidth: Story = {
  name: 'Custom maxWidth',
  render: () => (
    <Tooltip
      content="This tooltip has a wider max-width of 400px set via the maxWidth prop."
      placement="bottom"
      enterDelay={0}
      maxWidth={400}
    >
      <Button>maxWidth=400</Button>
    </Tooltip>
  ),
};

export const NarrowMaxWidth: Story = {
  name: 'Narrow maxWidth',
  render: () => (
    <Tooltip
      content="Narrow tooltip constrained to 140px."
      placement="bottom"
      enterDelay={0}
      maxWidth={140}
    >
      <Button>maxWidth=140</Button>
    </Tooltip>
  ),
};

// ── Arrow ────────────────────────────────────────────────────────

export const NoArrow: Story = {
  name: 'No Arrow (arrow=false)',
  render: () => (
    <Tooltip
      content="No arrow on this tooltip"
      placement="bottom"
      enterDelay={0}
      arrow={false}
    >
      <Button>No arrow</Button>
    </Tooltip>
  ),
};

export const ArrowCenter: Story = {
  name: 'Arrow Alignment: Center (default)',
  render: () => (
    <Tooltip
      content="Arrow at center (default)"
      placement="bottom"
      arrowAlignment="center"
      enterDelay={0}
    >
      <Button>Arrow center</Button>
    </Tooltip>
  ),
};

export const ArrowStart: Story = {
  name: 'Arrow Alignment: Start',
  render: () => (
    <Tooltip
      content="Arrow at start (left for top/bottom)"
      placement="bottom"
      arrowAlignment="start"
      enterDelay={0}
    >
      <Button>Arrow start</Button>
    </Tooltip>
  ),
};

export const ArrowEnd: Story = {
  name: 'Arrow Alignment: End',
  render: () => (
    <Tooltip
      content="Arrow at end (right for top/bottom)"
      placement="bottom"
      arrowAlignment="end"
      enterDelay={0}
    >
      <Button>Arrow end</Button>
    </Tooltip>
  ),
};

// ── Delays ──────────────────────────────────────────────────────

export const WithLeaveDelay: Story = {
  name: 'Leave Delay (500ms)',
  parameters: {
    docs: {
      description: {
        story:
          'Tooltip stays visible for 500ms after mouse leaves — useful for interactive tooltips.',
      },
    },
  },
  render: () => (
    <Tooltip
      content="I linger 500ms after you leave"
      placement="top"
      enterDelay={0}
      leaveDelay={500}
    >
      <Button>Slow hide</Button>
    </Tooltip>
  ),
};

// ── Controlled mode ──────────────────────────────────────────────

export const Controlled: Story = {
  name: 'Controlled (open prop)',
  parameters: {
    docs: {
      description: {
        story:
          'Tooltip open state is driven by a parent toggle button — demonstrates the `open`, `onOpen`, `onClose` API.',
      },
    },
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Tooltip
          content="I am controlled by the toggle button"
          placement="top"
          open={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
        >
          <Button>Trigger (hover/focus me)</Button>
        </Tooltip>
        <Button variant="secondary" onClick={() => setIsOpen((v) => !v)}>
          {isOpen ? 'Hide tooltip' : 'Show tooltip'}
        </Button>
      </div>
    );
  },
};

// ── Disable listeners ────────────────────────────────────────────

export const FocusOnly: Story = {
  name: 'Focus Only (disableHoverListener)',
  parameters: {
    docs: {
      description: {
        story:
          'Hover does not trigger — tooltip only appears on keyboard focus.',
      },
    },
  },
  render: () => (
    <Tooltip
      content="Only visible on keyboard focus"
      placement="top"
      enterDelay={0}
      disableHoverListener
    >
      <Button>Tab to me</Button>
    </Tooltip>
  ),
};

export const HoverOnly: Story = {
  name: 'Hover Only (disableFocusListener)',
  render: () => (
    <Tooltip
      content="Only visible on hover"
      placement="top"
      enterDelay={0}
      disableFocusListener
    >
      <Button>Hover only</Button>
    </Tooltip>
  ),
};

// ── Interaction tests ────────────────────────────────────────────

export const HoverInteraction: Story = {
  name: 'Interaction: Hover shows tooltip',
  render: () => (
    <Tooltip content="Appeared on hover" placement="top" enterDelay={0}>
      <Button>Hover me</Button>
    </Tooltip>
  ),

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Hover me' });

    await userEvent.hover(trigger);
    const tooltip = canvas.getByRole('tooltip');
    await expect(tooltip).toBeInTheDocument();
    await expect(tooltip).toHaveTextContent('Appeared on hover');
  },
};

export const FocusInteraction: Story = {
  name: 'Interaction: Focus shows tooltip',
  render: () => (
    <Tooltip content="Appeared on focus" placement="top" enterDelay={0}>
      <Button>Focus me</Button>
    </Tooltip>
  ),

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Focus me' });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    const tooltip = canvas.getByRole('tooltip');
    await expect(tooltip).toBeInTheDocument();
  },
};
