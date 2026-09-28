import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge/Badge';
import {
  NavigationBottom,
  type NavigationBottomProps,
} from './NavigationBottom';

// ── Shared icons ───────────────────────────────────────────

const HomeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const TripsIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const AccountIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const DealsIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12.79 21L3 11.21v2c0 .53.21 1.04.59 1.41l7.79 7.79c.78.78 2.05.78 2.83 0l6.21-6.21c.78-.78.78-2.05 0-2.83L12.79 21zM11.38 17.59c.78.78 2.05.78 2.83 0l6.21-6.21c.78-.78.78-2.05 0-2.83L12.63.76A2.007 2.007 0 0 0 11.21.17H5c-1.1 0-2 .9-2 2v6.21c0 .53.21 1.04.59 1.41l7.79 7.8zM7.5 7C6.67 7 6 6.33 6 5.5S6.67 4 7.5 4 9 4.67 9 5.5 8.33 7 7.5 7z" />
  </svg>
);

// ── Meta ──────────────────────────────────────────────────

const meta = {
  title: 'Components/NavigationBottom',
  component: NavigationBottom,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Mobile bottom navigation bar. Full-width, 64px fixed height, ripple on tap, elevation-01 shadow.',
      },
    },
  },
  args: {
    value: 'home',
    onValueChange: () => {},
    items: [],
  },
} satisfies Meta<typeof NavigationBottom>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Demo wrapper (interactive active state) ────────────────

function NavDemo(props: NavigationBottomProps) {
  const [value, setValue] = useState(props.value);
  return (
    <div style={{ position: 'relative', height: 120, background: '#f4f7fe' }}>
      <NavigationBottom {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

// ── Base items ─────────────────────────────────────────────

const fourItems = [
  { value: 'home', label: 'Home', icon: <HomeIcon /> },
  { value: 'search', label: 'Search', icon: <SearchIcon /> },
  { value: 'trips', label: 'Trips', icon: <TripsIcon /> },
  { value: 'account', label: 'Account', icon: <AccountIcon /> },
];

// ── Stories ────────────────────────────────────────────────

export const Default: Story = {
  name: '4 Tabs – Default',
  args: { items: fourItems, value: 'home' },
  render: (args) => <NavDemo {...args} />,
};

export const SecondActive: Story = {
  name: '4 Tabs – Search Active',
  args: { items: fourItems, value: 'search' },
  render: (args) => <NavDemo {...args} />,
};

export const ThreeItems: Story = {
  name: '3 Tabs',
  args: {
    items: [
      { value: 'home', label: 'Home', icon: <HomeIcon /> },
      { value: 'trips', label: 'Trips', icon: <TripsIcon /> },
      { value: 'account', label: 'Account', icon: <AccountIcon /> },
    ],
    value: 'home',
  },
  render: (args) => <NavDemo {...args} />,
};

export const FiveItems: Story = {
  name: '5 Tabs',
  args: {
    items: [
      { value: 'home', label: 'Home', icon: <HomeIcon /> },
      { value: 'search', label: 'Search', icon: <SearchIcon /> },
      { value: 'deals', label: 'Deals', icon: <DealsIcon /> },
      { value: 'trips', label: 'Trips', icon: <TripsIcon /> },
      { value: 'account', label: 'Account', icon: <AccountIcon /> },
    ],
    value: 'home',
  },
  render: (args) => <NavDemo {...args} />,
};

export const WithBadge: Story = {
  name: 'With Badge',
  args: {
    items: [
      { value: 'home', label: 'Home', icon: <HomeIcon /> },
      {
        value: 'search',
        label: 'Search',
        icon: <SearchIcon />,
        badge: <Badge variant="solid-danger">3</Badge>,
      },
      { value: 'trips', label: 'Trips', icon: <TripsIcon /> },
      { value: 'account', label: 'Account', icon: <AccountIcon /> },
    ],
    value: 'home',
  },
  render: (args) => <NavDemo {...args} />,
};

export const WithDisabled: Story = {
  name: 'With Disabled Item',
  args: {
    items: [
      { value: 'home', label: 'Home', icon: <HomeIcon /> },
      { value: 'search', label: 'Search', icon: <SearchIcon /> },
      { value: 'trips', label: 'Trips', icon: <TripsIcon /> },
      {
        value: 'account',
        label: 'Account',
        icon: <AccountIcon />,
        disabled: true,
      },
    ],
    value: 'home',
  },
  render: (args) => <NavDemo {...args} />,
};
