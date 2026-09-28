import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Spacing',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Data ──────────────────────────────────────────────────── */

const layoutScale = [
  { token: '--spacing-8', name: 'Small', multiplier: 'x', px: 8 },
  { token: '--spacing-12', name: 'Medium', multiplier: '1.5 x', px: 12 },
  { token: '--spacing-16', name: 'Large', multiplier: '2 x', px: 16 },
  { token: '--spacing-24', name: 'X-Large', multiplier: '3 x', px: 24 },
  { token: '--spacing-32', name: 'X-Large', multiplier: '4 x', px: 32 },
  { token: '--spacing-48', name: 'X-Large', multiplier: '6 x', px: 48 },
  { token: '--spacing-64', name: 'X-Large', multiplier: '8 x', px: 64 },
  { token: '--spacing-96', name: 'X-Large', multiplier: '12 x', px: 96 },
  { token: '--spacing-128', name: 'X-Large', multiplier: '16 x', px: 128 },
];

const usageExamples = [
  {
    title: 'Product detail page (PDP)',
    range: '16–24px',
    tokens: ['--spacing-16', '--spacing-24'],
    description: `Use well spacing (16–24px), because the users intention is for exploration. More breathing room helps users read and compare content.`,
    density: 'Well',
  },
  {
    title: 'Search result page (SRP)',
    range: '8–12px',
    tokens: ['--spacing-8', '--spacing-12'],
    description: `Use compact spacing (8–12px), because the user's intention is to choose the product. Tighter layout lets users scan more items.`,
    density: 'Compact',
  },
  {
    title: 'Landing page',
    range: '8–24px',
    tokens: ['--spacing-8', '--spacing-12', '--spacing-16', '--spacing-24'],
    description:
      'Use a combination of compact spacing (8–12px) and well spacing (16–24px) to create visual hierarchy between sections.',
    density: 'Mixed',
  },
];

/* ── Story ─────────────────────────────────────────────────── */

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
        Spacing
      </h1>
      <p
        style={{
          margin: '0 0 48px',
          fontSize: 'var(--text-body1-size)',
          color: 'var(--color-text-medium)',
          maxWidth: 640,
        }}
      >
        Spacing helps deliver effective and valuable layouts. It gives the page
        a harmonic look and directs what users should pay attention to.
      </p>

      {/* Layout scale */}
      <h2
        style={{
          margin: '0 0 8px',
          fontSize: 'var(--text-h2-size)',
          fontWeight: 'var(--text-h2-weight)',
          color: 'var(--color-text-high)',
        }}
      >
        Layout scale
      </h2>
      <p
        style={{
          margin: '0 0 24px',
          fontSize: 'var(--text-body1-size)',
          color: 'var(--color-text-medium)',
        }}
      >
        Layout scale is used for arranging components and other UI parts into a
        full page layout. It has larger increments that are used to control the
        density of a design.
      </p>

      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'var(--elevation-01)',
          marginBottom: '64px',
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '160px 100px 80px 1fr',
            background: 'var(--color-neutral-800)',
            padding: '12px 20px',
            gap: '16px',
          }}
        >
          {['Token', 'Multiplier', 'px', 'Example'].map((h) => (
            <span
              key={h}
              style={{
                fontSize: 'var(--text-body2-size)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-neutral-0)',
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Table rows */}
        {layoutScale.map((row, i) => (
          <div
            key={row.token}
            style={{
              display: 'grid',
              gridTemplateColumns: '160px 100px 80px 1fr',
              padding: '14px 20px',
              gap: '16px',
              alignItems: 'center',
              background:
                i % 2 === 0
                  ? 'var(--color-background)'
                  : 'var(--color-neutral-100)',
              borderBottom:
                i < layoutScale.length - 1
                  ? '1px solid var(--color-border)'
                  : 'none',
            }}
          >
            {/* Token name */}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
            >
              <span
                style={{
                  fontSize: 'var(--text-body2-size)',
                  color: 'var(--color-text-medium)',
                }}
              >
                {row.name}
              </span>
              <code
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-primary)',
                }}
              >
                {row.token}
              </code>
            </div>

            {/* Multiplier */}
            <span
              style={{
                fontSize: 'var(--text-body2-size)',
                color: 'var(--color-text-medium)',
                fontFamily: 'monospace',
              }}
            >
              {row.multiplier}
            </span>

            {/* px value */}
            <span
              style={{
                fontSize: 'var(--text-body2-size)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-high)',
              }}
            >
              {row.px}
            </span>

            {/* Visual square */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: `${row.px}px`,
                  height: `${row.px}px`,
                  background: 'var(--color-warning)',
                  borderRadius: '2px',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-low)',
                }}
              >
                {row.px}px
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Implementation examples */}
      <h2
        style={{
          margin: '0 0 8px',
          fontSize: 'var(--text-h2-size)',
          fontWeight: 'var(--text-h2-weight)',
          color: 'var(--color-text-high)',
        }}
      >
        Implementation examples
      </h2>
      <p
        style={{
          margin: '0 0 24px',
          fontSize: 'var(--text-body1-size)',
          color: 'var(--color-text-medium)',
        }}
      >
        Choose spacing density based on the user's intention on the page.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {usageExamples.map((ex) => (
          <UsageCard key={ex.title} {...ex} />
        ))}
      </div>

      {/* Full token reference */}
      <h2
        style={{
          margin: '64px 0 8px',
          fontSize: 'var(--text-h2-size)',
          fontWeight: 'var(--text-h2-weight)',
          color: 'var(--color-text-high)',
        }}
      >
        All spacing tokens
      </h2>
      <p
        style={{
          margin: '0 0 24px',
          fontSize: 'var(--text-body1-size)',
          color: 'var(--color-text-medium)',
        }}
      >
        Includes semantic aliases and the base 4px unit.
      </p>
      <AllTokensTable />
    </main>
  ),
};

/* ── Sub-components ─────────────────────────────────────────── */

function UsageCard({
  title,
  range,
  tokens,
  description,
  density,
}: {
  title: string;
  range: string;
  tokens: string[];
  description: string;
  density: string;
}) {
  const densityColor =
    density === 'Compact'
      ? 'var(--color-success)'
      : density === 'Well'
        ? 'var(--color-primary)'
        : 'var(--color-warning)';

  return (
    <div
      style={{
        background: 'var(--color-background)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: 'var(--elevation-01)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 'var(--text-body1-size)',
            fontWeight: 700,
            color: 'var(--color-text-high)',
            lineHeight: 1.4,
          }}
        >
          {title}
        </h3>
        <span
          style={{
            flexShrink: 0,
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-semibold)',
            color: densityColor,
            background: `color-mix(in srgb, ${densityColor} 12%, transparent)`,
            borderRadius: '4px',
            padding: '2px 8px',
            whiteSpace: 'nowrap',
          }}
        >
          {density}
        </span>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 'var(--text-body2-size)',
          color: 'var(--color-text-medium)',
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      {/* Visual spacing demo */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          marginTop: '4px',
        }}
      >
        {tokens.map((t) => {
          const entry = layoutScale.find((s) => s.token === t);
          if (!entry) return null;
          return (
            <div
              key={t}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <code
                style={{
                  width: '100px',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-low)',
                  flexShrink: 0,
                }}
              >
                {t}
              </code>
              <div
                style={{
                  width: `${entry.px}px`,
                  height: '10px',
                  background: densityColor,
                  borderRadius: '2px',
                  opacity: 0.7,
                }}
              />
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-low)',
                }}
              >
                {entry.px}px
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: '4px',
          padding: '8px 12px',
          background: 'var(--color-surface)',
          borderRadius: '6px',
          fontSize: 'var(--font-size-xs)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-text-medium)',
        }}
      >
        Range: {range}
      </div>
    </div>
  );
}

const allTokens = [
  { token: '--spacing-4', alias: '--spacing-xs', px: 4 },
  { token: '--spacing-8', alias: '--spacing-sm', px: 8 },
  { token: '--spacing-12', alias: '--spacing-md', px: 12 },
  { token: '--spacing-16', alias: '--spacing-lg', px: 16 },
  { token: '--spacing-24', alias: '--spacing-xl', px: 24 },
  { token: '--spacing-32', alias: '--spacing-2xl', px: 32 },
  { token: '--spacing-48', alias: '--spacing-3xl', px: 48 },
  { token: '--spacing-64', alias: '--spacing-4xl', px: 64 },
  { token: '--spacing-96', alias: '—', px: 96 },
  { token: '--spacing-128', alias: '—', px: 128 },
];

function AllTokensTable() {
  return (
    <div
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: 'var(--elevation-01)',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 'var(--text-body2-size)',
        }}
      >
        <thead>
          <tr style={{ background: 'var(--color-surface)' }}>
            {['Token', 'Alias', 'px', 'Visual'].map((h) => (
              <th
                key={h}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-medium)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allTokens.map((row, i) => (
            <tr
              key={row.token}
              style={{
                background:
                  i % 2 === 0
                    ? 'var(--color-background)'
                    : 'var(--color-surface)',
              }}
            >
              <td
                style={{
                  padding: '10px 16px',
                  fontFamily: 'monospace',
                  color: 'var(--color-primary)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                {row.token}
              </td>
              <td
                style={{
                  padding: '10px 16px',
                  fontFamily: 'monospace',
                  color: 'var(--color-text-low)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                {row.alias}
              </td>
              <td
                style={{
                  padding: '10px 16px',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-high)',
                }}
              >
                {row.px}
              </td>
              <td style={{ padding: '10px 16px' }}>
                <div
                  style={{
                    width: `${Math.min(row.px, 128)}px`,
                    height: '10px',
                    background: 'var(--color-primary)',
                    borderRadius: '2px',
                    opacity: 0.6,
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
