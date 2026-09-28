import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge/Badge';
import { Chips } from './Chips';

// ── Shared icon ───────────────────────────────────────────

const StarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8 1.5L9.664 5.215l3.836.594-2.75 2.785.65 3.906L8 10.25l-3.4 2.25.65-3.906-2.75-2.785 3.836-.594z" />
  </svg>
);

// ── Meta ──────────────────────────────────────────────────

const meta = {
  title: 'Components/Chips',
  component: Chips,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Selection, filter, or action trigger. Pill-shaped, 32px tall. Supports icons, badge, and dismiss.',
      },
    },
  },
  args: { children: 'Filter' },
} satisfies Meta<typeof Chips>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default states ────────────────────────────────────────

export const Default: Story = {};

export const Active: Story = {
  args: { active: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Error: Story = {
  args: { error: true },
};

// ── With icons ────────────────────────────────────────────

export const WithStartIcon: Story = {
  name: 'With Start Icon',
  args: { startIcon: <StarIcon /> },
};

export const WithEndIcon: Story = {
  name: 'With End Icon',
  args: { endIcon: <StarIcon /> },
};

export const WithBothIcons: Story = {
  name: 'With Both Icons',
  args: { startIcon: <StarIcon />, endIcon: <StarIcon /> },
};

export const WithStartIconActive: Story = {
  name: 'With Start Icon – Active',
  args: { startIcon: <StarIcon />, active: true },
};

// ── With badge ────────────────────────────────────────────

export const WithBadge: Story = {
  name: 'With Badge',
  args: { badge: <Badge variant="solid-danger">3</Badge> },
};

export const WithBadgeActive: Story = {
  name: 'With Badge – Active',
  args: { badge: <Badge variant="solid-danger">3</Badge>, active: true },
};

// ── Dismiss ───────────────────────────────────────────────

export const Dismissible: Story = {
  args: { onDismiss: () => {}, children: 'Tag' },
};

export const DismissibleActive: Story = {
  name: 'Dismissible – Active',
  args: { onDismiss: () => {}, children: 'Tag', active: true },
};

// ── Full-featured ─────────────────────────────────────────

export const FullFeatured: Story = {
  name: 'Full Featured',
  args: {
    startIcon: <StarIcon />,
    badge: <Badge variant="solid-danger">2</Badge>,
    onDismiss: () => {},
    children: 'Category',
  },
};

// ── All default states ────────────────────────────────────

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Chips>Inactive</Chips>
      <Chips active>Active</Chips>
      <Chips disabled>Disabled</Chips>
      <Chips error>Error</Chips>
      <Chips startIcon={<StarIcon />}>With Icon</Chips>
      <Chips active startIcon={<StarIcon />}>
        Icon Active
      </Chips>
      <Chips badge={<Badge variant="solid-danger">3</Badge>}>With Badge</Chips>
      <Chips onDismiss={() => {}}>Dismissible</Chips>
    </div>
  ),
};

// ── Invert variant ────────────────────────────────────────

export const Invert: Story = {
  name: 'Invert – Inactive',
  args: { invert: true },
  parameters: { backgrounds: { default: 'dark' } },
};

export const InvertActive: Story = {
  name: 'Invert – Active',
  args: { invert: true, active: true },
  parameters: { backgrounds: { default: 'dark' } },
};

export const InvertDisabled: Story = {
  name: 'Invert – Disabled',
  args: { invert: true, disabled: true },
  parameters: { backgrounds: { default: 'dark' } },
};

export const InvertError: Story = {
  name: 'Invert – Error',
  args: { invert: true, error: true },
  parameters: { backgrounds: { default: 'dark' } },
};

export const InvertDismissible: Story = {
  name: 'Invert – Dismissible',
  args: { invert: true, onDismiss: () => {}, children: 'Tag' },
  parameters: { backgrounds: { default: 'dark' } },
};

export const AllInvertStates: Story = {
  name: 'All Invert States',
  parameters: { backgrounds: { default: 'dark' } },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Chips invert>Inactive</Chips>
      <Chips invert active>
        Active
      </Chips>
      <Chips invert disabled>
        Disabled
      </Chips>
      <Chips invert error>
        Error
      </Chips>
      <Chips invert startIcon={<StarIcon />}>
        With Icon
      </Chips>
      <Chips invert active startIcon={<StarIcon />}>
        Icon Active
      </Chips>
      <Chips invert onDismiss={() => {}}>
        Dismissible
      </Chips>
    </div>
  ),
};
