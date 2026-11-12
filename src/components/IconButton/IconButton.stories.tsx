/**
 * IconButton stories — HMG-style icon button gallery
 */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  IconButton,
  type IconButtonSize,
  type IconButtonVariant,
} from './IconButton';
import type { IconColor } from '../Icon/IconBase';

// ── Sample icons ──────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const HeartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// ── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['standard', 'filled', 'outlined', 'ghost'],
    },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    color: {
      control: 'select',
      options: [
        'inherit',
        'primary',
        'secondary',
        'error',
        'success',
        'warning',
        'muted',
      ],
    },
  },
};
export default meta;
type Story = StoryObj<typeof IconButton>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { size: 'md', variant: 'standard', 'aria-label': 'Search' },
  render: (args) => (
    <IconButton {...args}>
      <SearchIcon />
    </IconButton>
  ),
};

// ── Variant Gallery ───────────────────────────────────────────────────────────

const VARIANTS: IconButtonVariant[] = [
  'standard',
  'filled',
  'outlined',
  'ghost',
];

const cellStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
};
const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--color-text-medium)',
};

export const VariantGallery: Story = {
  name: 'Variant Gallery',
  render: () => (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', padding: 16 }}>
      {VARIANTS.map((variant) => (
        <div key={variant} style={cellStyle}>
          <IconButton size="md" variant={variant} aria-label={variant}>
            <SearchIcon />
          </IconButton>
          <span style={labelStyle}>{variant}</span>
        </div>
      ))}
    </div>
  ),
};

// ── Size Gallery ──────────────────────────────────────────────────────────────

const SIZES: IconButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const SIZE_PX: Record<IconButtonSize, string> = {
  xs: '24px',
  sm: '28px',
  md: '32px',
  lg: '40px',
  xl: '48px',
};

export const SizeGallery: Story = {
  name: 'Size Gallery',
  render: () => (
    <div
      style={{ display: 'flex', gap: 24, alignItems: 'flex-end', padding: 16 }}
    >
      {SIZES.map((size) => (
        <div key={size} style={cellStyle}>
          <IconButton size={size} variant="filled" aria-label={size}>
            <SearchIcon />
          </IconButton>
          <span style={labelStyle}>{SIZE_PX[size]}</span>
        </div>
      ))}
    </div>
  ),
};

// ── Color Gallery ─────────────────────────────────────────────────────────────

const COLORS: { color: IconColor; label: string }[] = [
  { color: 'inherit', label: 'inherit' },
  { color: 'primary', label: 'primary' },
  { color: 'secondary', label: 'secondary' },
  { color: 'error', label: 'error' },
  { color: 'success', label: 'success' },
  { color: 'warning', label: 'warning' },
  { color: 'muted', label: 'muted' },
];

export const ColorGallery: Story = {
  name: 'Color Gallery',
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: 16 }}>
      {COLORS.map(({ color, label }) => (
        <div key={color} style={cellStyle}>
          <IconButton size="lg" color={color} aria-label={label}>
            <HeartIcon />
          </IconButton>
          <span style={labelStyle}>{label}</span>
        </div>
      ))}
    </div>
  ),
};

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  name: 'States (enabled / disabled)',
  render: () => (
    <div style={{ display: 'flex', gap: 24, padding: 16 }}>
      {(['standard', 'filled', 'outlined', 'ghost'] as const).map((v) => (
        <React.Fragment key={v}>
          <div style={cellStyle}>
            <IconButton size="md" variant={v} aria-label="enabled">
              <SettingsIcon />
            </IconButton>
            <span style={labelStyle}>{v}</span>
          </div>
          <div style={cellStyle}>
            <IconButton size="md" variant={v} disabled aria-label="disabled">
              <SettingsIcon />
            </IconButton>
            <span style={labelStyle}>disabled</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  ),
};

// ── Mixed Combo ───────────────────────────────────────────────────────────────

export const CommonPatterns: Story = {
  name: 'Common Patterns',
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}
    >
      {/* Toolbar row */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          background: '#f5f5f5',
          padding: 8,
          borderRadius: 8,
        }}
      >
        <IconButton
          size="sm"
          variant="ghost"
          color="secondary"
          aria-label="Search"
        >
          <SearchIcon />
        </IconButton>
        <IconButton
          size="sm"
          variant="ghost"
          color="secondary"
          aria-label="Settings"
        >
          <SettingsIcon />
        </IconButton>
        <IconButton size="sm" variant="ghost" color="error" aria-label="Close">
          <CloseIcon />
        </IconButton>
      </div>

      {/* Action icons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <IconButton
          size="md"
          variant="filled"
          color="primary"
          aria-label="Like"
        >
          <HeartIcon />
        </IconButton>
        <IconButton
          size="md"
          variant="outlined"
          color="secondary"
          aria-label="Settings"
        >
          <SettingsIcon />
        </IconButton>
      </div>
    </div>
  ),
};
