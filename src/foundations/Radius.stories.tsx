import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Radius',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const radiusTokens = [
  {
    name: 'Small',
    variable: '--radius-sm',
    value: '6px',
    usage: 'Badges, chips, tags, small inline elements.',
  },
  {
    name: 'Medium',
    variable: '--radius-md',
    value: '8px',
    usage: 'Inputs, selects, textareas, checkboxes, switches.',
  },
  {
    name: 'Large',
    variable: '--radius-lg',
    value: '12px',
    usage: 'Cards, panels, accordions, banners.',
  },
  {
    name: 'Extra Large',
    variable: '--radius-xl',
    value: '16px',
    usage: 'Bottom sheets, modals, drawers, large containers.',
  },
  {
    name: 'Full',
    variable: '--radius-full',
    value: '999px',
    usage: 'Pills, buttons with fully-rounded ends, avatars.',
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
        Radius
      </h1>
      <p
        style={{
          margin: '0 0 48px',
          fontSize: 'var(--text-body1-size)',
          color: 'var(--color-text-medium)',
          maxWidth: 640,
        }}
      >
        Border radius tokens create consistent corner shapes across all
        components. Always use a token — never a hardcoded pixel value.
      </p>

      {/* Token table */}
      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'var(--elevation-01)',
          marginBottom: '48px',
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 100px 80px 1fr 1fr',
            background: 'var(--color-neutral-800)',
            padding: '12px 20px',
            gap: '16px',
          }}
        >
          {['Name', 'Token', 'Value', 'Usage', 'Preview'].map((h) => (
            <span
              key={h}
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: '#FFFFFF',
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Table rows */}
        {radiusTokens.map((token, i) => (
          <div
            key={token.variable}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 100px 80px 1fr 1fr',
              padding: '16px 20px',
              gap: '16px',
              alignItems: 'center',
              background:
                i % 2 === 0
                  ? 'var(--color-background)'
                  : 'var(--color-neutral-100)',
              borderBottom:
                i < radiusTokens.length - 1
                  ? '1px solid var(--color-border)'
                  : 'none',
            }}
          >
            {/* Name */}
            <strong
              style={{
                fontSize: 'var(--text-body2-size)',
                color: 'var(--color-text-high)',
              }}
            >
              {token.name}
            </strong>

            {/* Token */}
            <code
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-primary)',
              }}
            >
              {token.variable}
            </code>

            {/* Value */}
            <span
              style={{
                fontSize: 'var(--text-body2-size)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-high)',
                fontFamily: 'monospace',
              }}
            >
              {token.value}
            </span>

            {/* Usage */}
            <span
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-medium)',
                lineHeight: 1.5,
              }}
            >
              {token.usage}
            </span>

            {/* Preview */}
            <div
              style={{
                width: '80px',
                height: '48px',
                background: 'var(--color-primary-subtle)',
                border: '2px solid var(--color-primary)',
                borderRadius: `var(${token.variable})`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Live card grid */}
      <h2
        style={{
          margin: '0 0 8px',
          fontSize: 'var(--text-h2-size)',
          fontWeight: 'var(--text-h2-weight)',
          color: 'var(--color-text-high)',
        }}
      >
        Visual comparison
      </h2>
      <p
        style={{
          margin: '0 0 24px',
          fontSize: 'var(--text-body2-size)',
          color: 'var(--color-text-medium)',
        }}
      >
        Each token applied to an identical block at full size.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
        }}
      >
        {radiusTokens.map((token) => (
          <RadiusCard key={token.variable} {...token} />
        ))}
      </div>
    </main>
  ),
};

function RadiusCard({
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
    <div
      style={{
        background: 'var(--color-background)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--elevation-01)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Preview block */}
      <div
        style={{
          padding: '24px',
          background: 'var(--color-neutral-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100px',
            height: '64px',
            background: 'var(--color-primary-subtle)',
            border: '2px solid var(--color-primary)',
            borderRadius: `var(${variable})`,
          }}
        />
      </div>

      {/* Info */}
      <div
        style={{
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
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
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-primary)',
          }}
        >
          {variable}
        </code>
        <span
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-medium)',
            fontFamily: 'monospace',
          }}
        >
          {value}
        </span>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-low)',
            lineHeight: 1.5,
          }}
        >
          {usage}
        </p>
      </div>
    </div>
  );
}
