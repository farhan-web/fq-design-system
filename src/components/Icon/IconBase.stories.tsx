/**
 * IconBase stories — HMG-style icon gallery
 *
 * Shows every icon at all 7 sizes (xs → 3xl) and all 6 semantic colors,
 * mirroring the grid format from HMG-System Design's IconBase2 story.
 */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IconBase, type IconSize, type IconColor } from './IconBase';

// ── Sample SVG icons (subset) ────────────────────────────────────────────────

const UploadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    <polyline points="8 12 12 16 16 12" />
    <line x1="12" y1="2" x2="12" y2="16" />
  </svg>
);

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

const AlertIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof IconBase> = {
  title: 'Icons/IconBase',
  component: IconBase,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof IconBase>;

// ── Default (Controls) ────────────────────────────────────────────────────────

export const Default: Story = {
  args: { size: 'lg', color: 'primary', 'aria-label': 'Upload' },
  render: (args) => (
    <IconBase {...args}>
      <UploadIcon />
    </IconBase>
  ),
};

// ── Size Gallery ──────────────────────────────────────────────────────────────
// Mirrors HMG IconBase2: columns = sizes, rows = icons

const SIZES: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
const SIZE_PX: Record<IconSize, string> = {
  xs: '12px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
  '2xl': '40px',
  '3xl': '48px',
};

const cellStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 8,
  border: '1px solid #eee',
};
const headerStyle: React.CSSProperties = {
  ...cellStyle,
  background: '#f5f5f5',
  fontWeight: 600,
  fontSize: 11,
  color: '#666',
};

const ICON_ROWS = [
  { name: 'upload', icon: <UploadIcon /> },
  { name: 'download', icon: <DownloadIcon /> },
  { name: 'search', icon: <SearchIcon /> },
  { name: 'heart', icon: <HeartIcon /> },
  { name: 'alert', icon: <AlertIcon /> },
  { name: 'check', icon: <CheckIcon /> },
];

export const SizeGallery: Story = {
  name: 'Size Gallery (HMG-style)',
  render: () => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', minWidth: 600 }}>
        <thead>
          <tr>
            <th
              style={{
                ...headerStyle,
                width: 80,
                textAlign: 'left',
                paddingLeft: 12,
              }}
            >
              Icon
            </th>
            {SIZES.map((s) => (
              <th key={s} style={headerStyle}>
                {SIZE_PX[s]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ICON_ROWS.map(({ name, icon }) => (
            <tr key={name}>
              <td
                style={{
                  ...cellStyle,
                  justifyContent: 'flex-start',
                  paddingLeft: 12,
                  fontSize: 12,
                  color: '#444',
                }}
              >
                {name}
              </td>
              {SIZES.map((s) => (
                <td key={s} style={cellStyle}>
                  <IconBase size={s} aria-label={name}>
                    {icon}
                  </IconBase>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

// ── Color Gallery ─────────────────────────────────────────────────────────────

const COLORS: { color: IconColor; label: string; bg?: string }[] = [
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
    <div
      style={{
        display: 'flex',
        gap: 24,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {COLORS.map(({ color, label, bg }) => (
        <div
          key={color}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            background: bg,
            padding: bg ? 8 : 0,
            borderRadius: 4,
          }}
        >
          <IconBase size="xl" color={color} aria-label={label}>
            <SearchIcon />
          </IconBase>
          <span style={{ fontSize: 11, color: '#666' }}>{label}</span>
        </div>
      ))}
    </div>
  ),
};

// ── Accessibility Demo ────────────────────────────────────────────────────────

export const Accessibility: Story = {
  name: 'Accessibility (role & aria)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconBase size="lg" aria-label="Upload file">
          <UploadIcon />
        </IconBase>
        <code style={{ fontSize: 12 }}>
          {'aria-label="Upload file" → role="img"'}
        </code>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconBase size="lg">
          <DownloadIcon />
        </IconBase>
        <code style={{ fontSize: 12 }}>
          {'no aria-label → aria-hidden="true"'}
        </code>
      </div>
    </div>
  ),
};
