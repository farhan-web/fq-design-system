import { Fragment } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tab, TabList, TabPanel, Tabs } from '../components/Tabs/Tabs';

const meta = {
  title: 'Foundations/Typography',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Data ──────────────────────────────────────────────────── */

const allowedWeights = [
  { name: 'Regular', value: '400' },
  { name: 'SemiBold', value: '600' },
  { name: 'Bold', value: '700' },
];

// `preview` = next style's name, rendered at current style's size / regular weight
const mobileStyles = [
  {
    name: 'Display',
    size: '32px',
    weight: '700',
    lh: '38px',
    usage: 'Oversized screen title, use only once per page.',
    preview: 'Heading 1',
  },
  {
    name: 'Heading 1',
    size: '22px',
    weight: '700',
    lh: '28px',
    usage: 'Main titles, use only once per page.',
    preview: 'Heading 2',
  },
  {
    name: 'Heading 2',
    size: '18px',
    weight: '700',
    lh: '24px',
    usage: 'Section Title/Heading up a group of list items.',
    preview: 'Heading 3',
  },
  {
    name: 'Heading 3',
    size: '16px',
    weight: '700 / 400',
    lh: '22px',
    usage: 'Large Button, Link, Sub heading.',
    preview: 'Body 1',
  },
  {
    name: 'Body 1',
    size: '14px',
    weight: '700 / 400',
    lh: '20px',
    usage: 'Small Button, Link, Body copy, textfield.',
    preview: 'Body 2',
  },
  {
    name: 'Body 2',
    size: '12px',
    weight: '700 / 400',
    lh: '16px',
    usage: 'Caption, Helper, label on textfield.',
    preview: 'Body 3',
  },
  {
    name: 'Body 3',
    size: '10px',
    weight: '600',
    lh: '14px',
    usage: 'Label only',
    preview: 'Small',
  },
];

const webStyles = [
  {
    name: 'Banner',
    size: '56px',
    weight: '700',
    lh: '62px',
    usage: 'Banner title',
    preview: 'Heading 1',
  },
  {
    name: 'Heading 1',
    size: '38px',
    weight: '700',
    lh: '44px',
    usage: 'Oversized screen title, use only once per page.',
    preview: 'Heading 2',
  },
  {
    name: 'Heading 2',
    size: '28px',
    weight: '700',
    lh: '34px',
    usage: 'Main titles, use only once per page.',
    preview: 'Heading 3',
  },
  {
    name: 'Heading 3',
    size: '18px',
    weight: '700 / 400',
    lh: '24px',
    usage: 'Large Button, Link, Sub heading',
    preview: 'Body 1',
  },
  {
    name: 'Body 1',
    size: '16px',
    weight: '700 / 400',
    lh: '22px',
    usage: 'Small Button, Link, Body copy, textfield',
    preview: 'Body 2',
  },
  {
    name: 'Body 2',
    size: '14px',
    weight: '700 / 400',
    lh: '20px',
    usage: 'Caption, Helper, label on textfield.',
    preview: 'Body 3',
  },
  {
    name: 'Body 3',
    size: '12px',
    weight: '600',
    lh: '16px',
    usage: 'Label only',
    preview: 'Small',
  },
  {
    name: 'Small',
    size: '10px',
    weight: '700 / 400',
    lh: '14px',
    usage: 'Paragraph',
    preview: 'Extra Small',
  },
];

// Diagram: spec format matches tiket.design — "size/lh/ls" (no spaces)
const typographyComparison: Array<{
  mobile: {
    label: string;
    size: string;
    weight: number;
    weightAlt?: number;
    lh: string;
    spec: string;
  } | null;
  desktop: {
    label: string;
    size: string;
    weight: number;
    weightAlt?: number;
    lh: string;
    spec: string;
    note?: string;
  };
}> = [
  {
    mobile: {
      label: 'Heading 1',
      size: '22px',
      weight: 700,
      lh: '28px',
      spec: '22/28/0',
    },
    desktop: {
      label: 'Heading 1',
      size: '38px',
      weight: 700,
      lh: '44px',
      spec: '38/44/0',
    },
  },
  {
    mobile: {
      label: 'Heading 2',
      size: '18px',
      weight: 700,
      lh: '24px',
      spec: '18/24/0',
    },
    desktop: {
      label: 'Heading 2',
      size: '28px',
      weight: 700,
      lh: '34px',
      spec: '28/34/0',
    },
  },
  {
    mobile: {
      label: 'Heading 3',
      size: '16px',
      weight: 700,
      weightAlt: 400,
      lh: '22px',
      spec: '16/22/0',
    },
    desktop: {
      label: 'Heading 3',
      size: '18px',
      weight: 700,
      weightAlt: 400,
      lh: '24px',
      spec: '18/24/0',
    },
  },
  {
    mobile: {
      label: 'Body 1',
      size: '14px',
      weight: 700,
      weightAlt: 400,
      lh: '20px',
      spec: '14/20/0',
    },
    desktop: {
      label: 'Body 1',
      size: '16px',
      weight: 700,
      weightAlt: 400,
      lh: '22px',
      spec: '16/22/0',
    },
  },
  {
    mobile: {
      label: 'Body 2',
      size: '12px',
      weight: 700,
      weightAlt: 400,
      lh: '16px',
      spec: '12/16/0',
    },
    desktop: {
      label: 'Body 2',
      size: '14px',
      weight: 700,
      weightAlt: 400,
      lh: '20px',
      spec: '14/20/0',
    },
  },
  {
    mobile: {
      label: 'Body 3',
      size: '10px',
      weight: 600,
      lh: '14px',
      spec: '10/14/0',
    },
    desktop: {
      label: 'Body 3',
      size: '12px',
      weight: 600,
      lh: '16px',
      spec: '12/16/0',
    },
  },
  {
    mobile: {
      label: 'Small',
      size: '10px',
      weight: 400,
      lh: '14px',
      spec: '10/14/0',
    },
    desktop: {
      label: 'Small',
      size: '10px',
      weight: 700,
      weightAlt: 400,
      lh: '14px',
      spec: '12/16/0',
    },
  },
  {
    mobile: null,
    desktop: {
      label: 'Extra Small',
      size: '10px',
      weight: 700,
      weightAlt: 400,
      lh: '14px',
      spec: '10/14/0',
      note: 'will translate to small in mobile',
    },
  },
];

const breakpoints = [
  {
    group: 'Mobile (320-839)',
    color: { bg: '#FECACA', text: '#DC2626' },
    rows: [
      {
        name: 'XSmall',
        range: '320-399',
        margin: '20',
        container: 'Fluid',
        column: '12',
        gutter: '8',
      },
      {
        name: 'Small',
        range: '400-599',
        margin: '20',
        container: 'Fluid',
        column: '12',
        gutter: '12',
      },
      {
        name: 'Medium',
        range: '600-839',
        margin: '40',
        container: 'Fluid',
        column: '12',
        gutter: '16',
      },
    ],
  },
  {
    group: 'Desktop (840-1440+)',
    color: { bg: '#BFDBFE', text: '#1D4ED8' },
    rows: [
      {
        name: 'Large',
        range: '840-959',
        margin: 'Fluid',
        container: '760',
        column: '12',
        gutter: '16',
      },
      {
        name: 'XLarge',
        range: '960-1279',
        margin: '100',
        container: 'Fluid',
        column: '12',
        gutter: '16',
      },
      {
        name: 'XXLarge',
        range: '1280-1439',
        margin: '120',
        container: 'Fluid',
        column: '12',
        gutter: '20',
      },
      {
        name: 'XXXLarge',
        range: '1440+',
        margin: 'Fluid',
        container: '1200',
        column: '12',
        gutter: '24',
      },
    ],
  },
];

/* ── Story ──────────────────────────────────────────────────── */

export const Typography: Story = {
  render: () => (
    <main
      style={{
        padding: '48px',
        background: 'var(--color-surface)',
        minHeight: '100vh',
      }}
    >
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
        Typography
      </h1>
      <p
        style={{
          margin: '0 0 24px',
          fontSize: 'var(--text-body1-size)',
          color: 'var(--color-text-medium)',
          maxWidth: 640,
        }}
      >
        Typography can help create clear logical hierarchies, organize
        information to ensures that elements in the UI are clear and easily
        recognizable when scanning the page.
      </p>

      <Tabs defaultValue="mobile">
        <TabList style={{ marginBottom: '40px' }}>
          <Tab value="mobile">Mobile typography</Tab>
          <Tab value="website">Website typography</Tab>
        </TabList>

        <TabPanel value="mobile">
          <FontShowcase />
          <AllowedWeightSection />
          <StylesTable styles={mobileStyles} />
        </TabPanel>

        <TabPanel value="website">
          <TypographyRulesSection />
          <BreakpointTable />
        </TabPanel>
      </Tabs>
    </main>
  ),
};

/* ── Components ─────────────────────────────────────────────── */

const CHAR_ROWS = [
  ['Aa', 'Bb', 'Cc', 'Dd', 'Ee', 'Ff', 'Gg', 'Hh', 'Ii', 'Jj'],
  ['Kk', 'Ll', 'Mm', 'Nn', 'Oo', 'Pp', 'Qq', 'Rr', 'Ss', 'Tt'],
  ['Uu', 'Vv', 'Ww', 'Xx', 'Yy', 'Zz', '.', ',', '!', '?'],
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  ['#', '@', '&', '%', '(', ')', '{', '}', '[', ']'],
];

function FontShowcase() {
  return (
    <div
      style={{
        background: '#7A1060',
        borderRadius: '16px',
        padding: '40px',
        marginBottom: '48px',
      }}
    >
      <h2
        style={{
          margin: '0 0 32px',
          fontSize: '32px',
          fontWeight: 700,
          textAlign: 'center',
          color: '#FFFFFF',
          fontFamily: 'var(--font-family)',
        }}
      >
        Inter
      </h2>
      {CHAR_ROWS.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: ri < CHAR_ROWS.length - 1 ? '12px' : 0,
          }}
        >
          {row.map((ch, ci) => (
            <span
              key={ci}
              style={{
                fontSize: '20px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: 'var(--font-family)',
                minWidth: '28px',
                textAlign: 'center',
                paddingBottom: '4px',
                borderBottom: '1px dashed rgba(255,255,255,0.35)',
              }}
            >
              {ch}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function AllowedWeightSection() {
  return (
    <>
      <h2
        style={{
          margin: '0 0 16px',
          fontSize: 'var(--text-h2-size)',
          fontWeight: 'var(--text-h2-weight)',
          color: 'var(--color-text-high)',
        }}
      >
        Allowed weight
      </h2>
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '48px',
          flexWrap: 'wrap',
        }}
      >
        {allowedWeights.map((w) => (
          <div
            key={w.name}
            style={{
              background: '#2F3135',
              borderRadius: '8px',
              padding: '20px 32px',
              textAlign: 'center',
              flex: 1,
              minWidth: '120px',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                fontWeight: Number(w.value),
                color: '#FFFFFF',
                marginBottom: '4px',
              }}
            >
              {w.name}
            </div>
            <div
              style={{
                fontSize: 'var(--text-body1-size)',
                color: '#9CA3AF',
              }}
            >
              {w.value}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function StylesTable({ styles }: { styles: typeof mobileStyles }) {
  const cols = '200px 1fr 1fr';
  const headers = ['Properties', 'Use for', 'Styles'];

  return (
    <>
      <h2
        style={{
          margin: '0 0 20px',
          fontSize: 'var(--text-h2-size)',
          fontWeight: 'var(--text-h2-weight)',
          color: 'var(--color-text-high)',
        }}
      >
        Styles
      </h2>
      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'var(--elevation-01)',
          marginBottom: '48px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: cols,
            background: '#171918',
            padding: '12px 20px',
            gap: '16px',
          }}
        >
          {headers.map((h) => (
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

        {/* Rows — all white background, no alternating */}
        {styles.map((s, i) => (
          <div
            key={s.name}
            style={{
              display: 'grid',
              gridTemplateColumns: cols,
              padding: '16px 20px',
              gap: '16px',
              alignItems: 'center',
              background: 'var(--color-background)',
              borderBottom:
                i < styles.length - 1
                  ? '1px solid var(--color-border)'
                  : 'none',
            }}
          >
            {/* Properties */}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}
            >
              <span
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-medium)',
                }}
              >
                Size :{' '}
                <strong style={{ color: 'var(--color-text-high)' }}>
                  {s.size}
                </strong>
              </span>
              <span
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-medium)',
                }}
              >
                Weight :{' '}
                <strong style={{ color: 'var(--color-text-high)' }}>
                  {s.weight}
                </strong>
              </span>
              <span
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-medium)',
                }}
              >
                Line height :{' '}
                <strong style={{ color: 'var(--color-text-high)' }}>
                  {s.lh}
                </strong>
              </span>
            </div>

            {/* Use for */}
            <span
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-medium)',
                lineHeight: 1.5,
              }}
            >
              {s.usage}
            </span>

            {/* Styles preview — next style name at current size, regular weight */}
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-family)',
                fontSize: s.size,
                fontWeight: 'var(--font-weight-regular)',
                lineHeight: s.lh,
                color: 'var(--color-text-high)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {s.preview}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

function TypographyRulesSection() {
  return (
    <>
      <h2
        style={{
          margin: '0 0 20px',
          fontSize: 'var(--text-h2-size)',
          fontWeight: 'var(--text-h2-weight)',
          color: 'var(--color-text-high)',
        }}
      >
        Typography rules
      </h2>

      {/* Mobile ↔ Desktop comparison diagram */}
      <div
        style={{
          background: 'var(--color-background)',
          borderRadius: '12px',
          boxShadow: 'var(--elevation-01)',
          padding: '24px',
          marginBottom: '48px',
        }}
      >
        {/* Column headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '16px',
            alignItems: 'center',
            marginBottom: '4px',
          }}
        >
          <span
            style={{
              fontSize: 'var(--text-body1-size)',
              fontWeight: 700,
              color: 'var(--color-text-high)',
            }}
          >
            Mobile design
          </span>
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-low)',
              whiteSpace: 'nowrap',
            }}
          >
            directly translate →
          </span>
          <span
            style={{
              fontSize: 'var(--text-body1-size)',
              fontWeight: 700,
              color: 'var(--color-text-high)',
            }}
          >
            Desktop design
          </span>
        </div>

        {/* Color bars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '16px',
            marginBottom: '4px',
          }}
        >
          <div
            style={{
              height: '3px',
              borderRadius: '2px',
              background:
                'linear-gradient(90deg, var(--color-gradient-orange-100), var(--color-gradient-orange-200))',
            }}
          />
          <span />
          <div
            style={{
              height: '3px',
              borderRadius: '2px',
              background:
                'linear-gradient(90deg, var(--color-gradient-blue-100), var(--color-gradient-blue-200))',
            }}
          />
        </div>

        {/* Range labels */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '16px',
            marginBottom: '4px',
          }}
        >
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-low)',
            }}
          >
            320px-839px
          </span>
          <span />
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-low)',
            }}
          >
            &gt;840px
          </span>
        </div>

        {/* Comparison rows */}
        {typographyComparison.map((pair, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: '16px',
              alignItems: 'center',
              padding: '10px 0',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            {/* Mobile side */}
            <div>
              {pair.mobile ? (
                <>
                  <div
                    style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: pair.mobile.size,
                      lineHeight: pair.mobile.lh,
                      color: 'var(--color-text-high)',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span style={{ fontWeight: pair.mobile.weight }}>
                      {pair.mobile.label}
                    </span>
                    {pair.mobile.weightAlt != null && (
                      <>
                        <span
                          style={{
                            fontWeight: 400,
                            color: 'var(--color-text-low)',
                          }}
                        >
                          {'/'}
                        </span>
                        <span style={{ fontWeight: pair.mobile.weightAlt }}>
                          {pair.mobile.label}
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-low)',
                      fontFamily: 'monospace',
                      marginTop: '4px',
                    }}
                  >
                    {pair.mobile.spec}
                  </div>
                </>
              ) : null}
            </div>

            <span />

            {/* Desktop side */}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: pair.desktop.size,
                  lineHeight: pair.desktop.lh,
                  color: 'var(--color-text-high)',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontWeight: pair.desktop.weight }}>
                  {pair.desktop.label}
                </span>
                {pair.desktop.weightAlt != null && (
                  <>
                    <span
                      style={{
                        fontWeight: 400,
                        color: 'var(--color-text-low)',
                      }}
                    >
                      {'/'}
                    </span>
                    <span style={{ fontWeight: pair.desktop.weightAlt }}>
                      {pair.desktop.label}
                    </span>
                  </>
                )}
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-low)',
                  fontFamily: 'monospace',
                  marginTop: '4px',
                }}
              >
                {pair.desktop.spec}
              </div>
              {pair.desktop.note && (
                <div
                  style={{
                    fontSize: '10px',
                    color: 'var(--color-text-low)',
                    marginTop: '2px',
                    fontStyle: 'italic',
                  }}
                >
                  {pair.desktop.note}
                </div>
              )}
            </div>
          </div>
        ))}

        <p
          style={{
            margin: '12px 0 0',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-low)',
          }}
        >
          size / line height / letter spacing
        </p>
      </div>

      <AllowedWeightSection />
      <StylesTable styles={webStyles} />
    </>
  );
}

/* ── Breakpoint table ────────────────────────────────────────── */

function BreakpointTable() {
  const cols = '200px 80px 100px 70px 70px';
  const headers = ['Screen size', 'Margin', 'Container', 'Column', 'Gutter'];

  return (
    <>
      <h2
        style={{
          margin: '0 0 8px',
          fontSize: 'var(--text-h2-size)',
          fontWeight: 'var(--text-h2-weight)',
          color: 'var(--color-text-high)',
        }}
      >
        Responsive breakpoint
      </h2>
      <p
        style={{
          margin: '0 0 20px',
          fontSize: '13px',
          color: 'var(--color-text-medium)',
        }}
      >
        These breakpoints describe column and width specifications for different
        screen size.
      </p>
      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'var(--elevation-01)',
          marginBottom: '48px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: cols,
            background: '#171918',
            padding: '12px 20px',
            gap: '16px',
          }}
        >
          {headers.map((h) => (
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

        {breakpoints.map((group) => (
          <Fragment key={group.group}>
            {/* Group header */}
            <div
              style={{
                padding: '8px 20px',
                background: group.color.bg,
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: group.color.text,
                }}
              >
                {group.group}
              </span>
            </div>

            {group.rows.map((row) => (
              <div
                key={row.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: cols,
                  padding: '12px 20px',
                  gap: '16px',
                  alignItems: 'center',
                  background: 'var(--color-background)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                {/* Screen size: bold name + regular range in one cell */}
                <span
                  style={{ fontSize: '13px', color: 'var(--color-text-high)' }}
                >
                  <strong>{row.name}</strong>{' '}
                  <span
                    style={{
                      fontWeight: 400,
                      color: 'var(--color-text-medium)',
                    }}
                  >
                    {row.range}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-medium)',
                  }}
                >
                  {row.margin}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-medium)',
                  }}
                >
                  {row.container}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-medium)',
                  }}
                >
                  {row.column}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-medium)',
                  }}
                >
                  {row.gutter}
                </span>
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </>
  );
}
