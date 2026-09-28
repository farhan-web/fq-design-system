// Raw shadow utility tokens. For the semantic elevation scale and z-index
// layer system see Foundations/Elevation.
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Shadows',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const shadowTokens = [
  {
    name: 'Small',
    variable: '--shadow-sm',
    value: '0 1px 2px rgb(0 0 0 / 5%)',
    usage:
      'Subtle depth for micro-elements. Not a Passport semantic token — use --elevation-* for components.',
  },
  {
    name: 'Medium',
    variable: '--shadow-md',
    value: '0 4px 12px rgb(0 0 0 / 8%)',
    usage:
      'General-purpose floating surface. Not a Passport semantic token — use --elevation-* for components.',
  },
];

export const Overview: Story = {
  render: () => (
    <main
      style={{
        padding: '48px',
        background: 'var(--color-surface)',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <p
        style={{
          margin: '0 0 4px',
          fontSize: 'var(--text-body1-size)',
          color: 'var(--color-text-low)',
        }}
      >
        Foundations
      </p>
      <h1
        style={{
          margin: '0 0 12px',
          fontSize: 'var(--text-display-size)',
          fontWeight: 'var(--text-display-weight)',
          lineHeight: 'var(--text-display-line-height)',
          color: 'var(--color-text-high)',
        }}
      >
        Shadows
      </h1>
      <p
        style={{
          margin: '0 0 8px',
          fontSize: 'var(--text-body1-size)',
          color: 'var(--color-text-medium)',
          maxWidth: 640,
        }}
      >
        Raw shadow utilities for one-off use. These are <strong>not</strong>{' '}
        Passport semantic tokens.
      </p>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          marginBottom: '40px',
          background: 'var(--color-primary-subtle)',
          borderRadius: '6px',
          fontSize: 'var(--text-body2-size)',
          color: 'var(--color-primary)',
        }}
      >
        <span>💡</span>
        <span>
          For component elevation (Bottom Sheet, Modal, Tooltip…) use{' '}
          <strong>Foundations/Elevation</strong> → <code>--elevation-01</code>{' '}
          through <code>--elevation-04</code>.
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '32px',
        }}
      >
        {shadowTokens.map((token) => (
          <ShadowToken key={token.variable} {...token} />
        ))}
      </div>
    </main>
  ),
};

function ShadowToken({
  name,
  variable,
  value,
  usage,
}: {
  name: string;
  variable: string;
  value: string;
  usage: string;
}) {
  return (
    <article
      style={{
        padding: '24px',
        minHeight: '180px',
        borderRadius: '8px',
        background: 'var(--color-background)',
        boxShadow: `var(${variable})`,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <strong
        style={{
          fontSize: 'var(--text-body1-size)',
          color: 'var(--color-text-high)',
        }}
      >
        {name}
      </strong>
      <code
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-primary)',
        }}
      >
        {variable}
      </code>
      <code
        style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-low)',
          lineHeight: 1.5,
        }}
      >
        {value}
      </code>
      <p
        style={{
          margin: '8px 0 0',
          fontSize: 'var(--text-body2-size)',
          color: 'var(--color-text-medium)',
          lineHeight: 1.5,
        }}
      >
        {usage}
      </p>
    </article>
  );
}
