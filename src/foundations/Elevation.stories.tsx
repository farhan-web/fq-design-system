import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Elevation',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Data ──────────────────────────────────────────────────── */

const layers = [
  {
    index: '00',
    label: 'Background',
    usage: ['Background'],
    elevation: null,
    zIndex: '--z-index-base',
  },
  {
    index: '01',
    label: 'Raised',
    usage: [
      'Card',
      'App menu bar (scrolled state)',
      'Navigation menu bar',
      'Snackbar',
      'Notification Badge',
      'Sticky button',
    ],
    elevation: '--elevation-01',
    zIndex: '--z-index-raised',
  },
  {
    index: '02',
    label: 'Overlay',
    usage: [
      'Dropdown menu',
      'Button raised (on hover)',
      'Card raised (on hold)',
      'Pop Over',
      'Floating action button (FAB)',
      'Drawer',
      'Bottom sheet',
      'Modals',
      'Dialogs',
    ],
    elevation: '--elevation-02',
    zIndex: '--z-index-dropdown',
  },
];

const shadowScale = [
  {
    token: '--elevation-01',
    label: 'Elevation 01',
    usage: 'Nav bottom, Bottom sheet',
  },
  {
    token: '--elevation-02',
    label: 'Elevation 02',
    usage: 'Cards, Dropdowns, Popovers',
  },
  {
    token: '--elevation-03',
    label: 'Elevation 03',
    usage: 'Modals, Dialogs, Drawers',
  },
  {
    token: '--elevation-04',
    label: 'Elevation 04',
    usage: 'Tooltips, Coachmarks',
  },
];

const zIndexTokens = [
  {
    token: '--z-index-base',
    value: '0',
    layer: '00',
    usage: 'Background content',
  },
  {
    token: '--z-index-raised',
    value: '100',
    layer: '01',
    usage: 'Cards, sticky nav, snackbar, badges',
  },
  {
    token: '--z-index-dropdown',
    value: '200',
    layer: '02',
    usage: 'Dropdowns, popovers, FAB',
  },
  {
    token: '--z-index-overlay',
    value: '400',
    layer: '02',
    usage: 'Bottom sheet backdrop',
  },
  {
    token: '--z-index-overlay-content',
    value: '401',
    layer: '02',
    usage: 'Bottom sheet panel, drawer',
  },
  {
    token: '--z-index-modal',
    value: '500',
    layer: '02',
    usage: 'Modals, dialogs',
  },
  {
    token: '--z-index-tooltip',
    value: '1000',
    layer: '—',
    usage: 'Tooltips, coachmarks (always on top)',
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
        Elevation
      </h1>
      <p
        style={{
          margin: '0 0 48px',
          fontSize: 'var(--text-body1-size)',
          color: 'var(--color-text-medium)',
          maxWidth: 640,
        }}
      >
        Shadows help to define the various levels of elevation (z-index) in the
        product's environment.
      </p>

      {/* Layers */}
      <h2
        style={{
          margin: '0 0 24px',
          fontSize: 'var(--text-h2-size)',
          fontWeight: 'var(--text-h2-weight)',
          color: 'var(--color-text-high)',
        }}
      >
        Layers
      </h2>
      <div
        style={{
          background: 'var(--color-neutral-100)',
          borderRadius: '12px',
          padding: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '64px',
        }}
      >
        {layers.map((layer) => (
          <LayerCard key={layer.index} {...layer} />
        ))}
      </div>

      {/* Shadow Scale */}
      <h2
        style={{
          margin: '0 0 8px',
          fontSize: 'var(--text-h2-size)',
          fontWeight: 'var(--text-h2-weight)',
          color: 'var(--color-text-high)',
        }}
      >
        Shadow Scale
      </h2>
      <p
        style={{
          margin: '0 0 24px',
          fontSize: 'var(--text-body1-size)',
          color: 'var(--color-text-medium)',
        }}
      >
        Each elevation level has a matching shadow token.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '24px',
          marginBottom: '64px',
        }}
      >
        {shadowScale.map((s) => (
          <ShadowCard key={s.token} {...s} />
        ))}
      </div>

      {/* Z-Index reference */}
      <h2
        style={{
          margin: '0 0 8px',
          fontSize: 'var(--text-h2-size)',
          fontWeight: 'var(--text-h2-weight)',
          color: 'var(--color-text-high)',
        }}
      >
        Z-Index Tokens
      </h2>
      <p
        style={{
          margin: '0 0 24px',
          fontSize: 'var(--text-body1-size)',
          color: 'var(--color-text-medium)',
        }}
      >
        Semantic z-index tokens map component types to the correct layer.
      </p>
      <ZIndexTable />

      {/* Overlaps */}
      <h2
        style={{
          margin: '64px 0 8px',
          fontSize: 'var(--text-h2-size)',
          fontWeight: 'var(--text-h2-weight)',
          color: 'var(--color-text-high)',
        }}
      >
        Overlaps
      </h2>
      <p
        style={{
          margin: '0 0 24px',
          fontSize: 'var(--text-body1-size)',
          color: 'var(--color-text-medium)',
        }}
      >
        Higher-layer components visually overlap lower-layer ones.
      </p>
      <OverlapsDiagram />

      {/* Stacks */}
      <h2
        style={{
          margin: '64px 0 8px',
          fontSize: 'var(--text-h2-size)',
          fontWeight: 'var(--text-h2-weight)',
          color: 'var(--color-text-high)',
        }}
      >
        Stacks
      </h2>
      <p
        style={{
          margin: '0 0 24px',
          fontSize: 'var(--text-body1-size)',
          color: 'var(--color-text-medium)',
        }}
      >
        When multiple elevated components are active simultaneously, each
        maintains its relative z-index.
      </p>
      <StacksDiagram />
    </main>
  ),
};

/* ── Sub-components ─────────────────────────────────────────── */

function LayerCard({
  index,
  label,
  usage,
  elevation,
  zIndex,
}: {
  index: string;
  label: string;
  usage: string[];
  elevation: string | null;
  zIndex: string;
}) {
  return (
    <div
      style={{
        background: 'var(--color-background)',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: elevation ? `var(${elevation})` : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div>
        <span
          style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--color-text-low)',
          }}
        >
          {index}
        </span>
        <span
          style={{
            display: 'inline-block',
            marginLeft: '8px',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-primary)',
            background: 'var(--color-primary-subtle)',
            borderRadius: '4px',
            padding: '2px 8px',
          }}
        >
          {label}
        </span>
      </div>

      <div>
        <p
          style={{
            margin: '0 0 6px',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-low)',
          }}
        >
          Usage :
        </p>
        <ul
          style={{
            margin: 0,
            padding: '0 0 0 16px',
            fontSize: 'var(--text-body2-size)',
            color: 'var(--color-text-medium)',
            lineHeight: 1.7,
          }}
        >
          {usage.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </div>

      <code
        style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-low)',
          background: 'var(--color-surface)',
          borderRadius: '4px',
          padding: '4px 8px',
          marginTop: 'auto',
        }}
      >
        {zIndex}
      </code>
    </div>
  );
}

function ShadowCard({
  token,
  label,
  usage,
}: {
  token: string;
  label: string;
  usage: string;
}) {
  return (
    <div
      style={{
        background: 'var(--color-background)',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: `var(${token})`,
        minHeight: '140px',
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
        {label}
      </strong>
      <code
        style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-low)',
        }}
      >
        {token}
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
    </div>
  );
}

function ZIndexTable() {
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 'var(--text-body2-size)',
        background: 'var(--color-background)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: 'var(--elevation-01)',
      }}
    >
      <thead>
        <tr style={{ background: 'var(--color-surface)' }}>
          {['Token', 'Value', 'Layer', 'Usage'].map((h) => (
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
        {zIndexTokens.map((row, i) => (
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
                padding: '12px 16px',
                fontFamily: 'monospace',
                color: 'var(--color-primary)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              {row.token}
            </td>
            <td
              style={{
                padding: '12px 16px',
                fontFamily: 'monospace',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-high)',
              }}
            >
              {row.value}
            </td>
            <td
              style={{
                padding: '12px 16px',
                color: 'var(--color-text-medium)',
              }}
            >
              {row.layer}
            </td>
            <td
              style={{
                padding: '12px 16px',
                color: 'var(--color-text-medium)',
              }}
            >
              {row.usage}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OverlapsDiagram() {
  const columns = [
    { index: '00', label: 'Background', shadow: null as string | null },
    { index: '01', label: 'Raised', shadow: '--elevation-01' },
    { index: '02', label: 'Overlay', shadow: '--elevation-02' },
  ];

  return (
    <div
      style={{
        background: 'var(--color-neutral-100)',
        borderRadius: '12px',
        padding: '32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
      }}
    >
      {columns.map((col) => (
        <div
          key={col.index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0',
          }}
        >
          {/* Large muted index number */}
          <span
            style={{
              fontSize: 'var(--font-size-4xl)',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--color-text-low)',
              lineHeight: 1,
              marginBottom: '8px',
            }}
          >
            {col.index}
          </span>

          {/* Dashed connector line */}
          <div
            style={{
              width: '1px',
              height: '24px',
              borderLeft: '2px dashed var(--color-border)',
            }}
          />

          {/* Floating white card */}
          <div
            style={{
              width: '100%',
              maxWidth: 160,
              height: 80,
              background: 'var(--color-background)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: col.shadow ? `var(${col.shadow})` : 'none',
              border: col.shadow ? 'none' : '1px solid var(--color-border)',
            }}
          />

          {/* Label */}
          <span
            style={{
              marginTop: '12px',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-low)',
            }}
          >
            {col.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function StacksDiagram() {
  const stackItems = [
    {
      label: 'Tooltip',
      zToken: '--z-index-tooltip',
      value: 1000,
      color: 'var(--color-primary)',
      shadow: '--elevation-04',
    },
    {
      label: 'Modal',
      zToken: '--z-index-modal',
      value: 500,
      color: '#6E54EF',
      shadow: '--elevation-03',
    },
    {
      label: 'Dropdown',
      zToken: '--z-index-dropdown',
      value: 200,
      color: '#0BAE54',
      shadow: '--elevation-02',
    },
    {
      label: 'Card',
      zToken: '--z-index-raised',
      value: 100,
      color: '#F15C59',
      shadow: '--elevation-01',
    },
    {
      label: 'Background',
      zToken: '--z-index-base',
      value: 0,
      color: 'var(--color-border-strong)',
      shadow: null,
    },
  ];

  return (
    <div
      style={{
        background: 'var(--color-background)',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: 'var(--elevation-01)',
        display: 'flex',
        gap: '48px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {/* Stacked layers visual */}
      <div style={{ position: 'relative', width: 200, height: 200 }}>
        {stackItems.map((item, i) => (
          <div
            key={item.label}
            style={{
              position: 'absolute',
              left: i * 10,
              top: i * 10,
              width: 160,
              height: 50,
              background: 'var(--color-background)',
              borderRadius: '6px',
              boxShadow: item.shadow ? `var(${item.shadow})` : 'none',
              border: `2px solid ${item.color}`,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '12px',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: item.color,
              zIndex: item.value,
            }}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {stackItems.map((item) => (
          <div
            key={item.label}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '2px',
                background: item.color,
                flexShrink: 0,
              }}
            />
            <div>
              <span
                style={{
                  fontSize: 'var(--text-body2-size)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-high)',
                }}
              >
                {item.label}
              </span>
              <code
                style={{
                  marginLeft: '8px',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-low)',
                }}
              >
                {item.zToken} = {item.value}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
