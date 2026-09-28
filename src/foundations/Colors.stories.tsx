import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AlertCircle,
  Bell,
  CheckCircle,
  LayoutGrid,
  Lock,
  Star,
  Sun,
  TrendingUp,
  UserCircle,
} from 'lucide-react';
import { Tab, TabList, TabPanel, Tabs } from '../components/Tabs/Tabs';

const meta = {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/* ── Data — Solid ───────────────────────────────────────────── */

const palettes = [
  {
    name: 'Neutral',
    swatches: [
      {
        label: 'N800',
        hex: '#303135',
        token: '--color-neutral-800',
        textLight: true,
      },
      {
        label: 'N700',
        hex: '#4D4F56',
        token: '--color-neutral-700',
        textLight: true,
      },
      {
        label: 'N600',
        hex: '#71747D',
        token: '--color-neutral-600',
        textLight: true,
      },
      {
        label: 'N400',
        hex: '#AEB2BE',
        token: '--color-neutral-400',
        textLight: false,
      },
      {
        label: 'N200',
        hex: '#D8DCE8',
        token: '--color-neutral-200',
        textLight: false,
      },
      {
        label: 'N100',
        hex: '#F4F7FE',
        token: '--color-neutral-100',
        textLight: false,
      },
      {
        label: 'N0',
        hex: '#FFFFFF',
        token: '--color-neutral-0',
        textLight: false,
        bordered: true,
      },
    ],
  },
  {
    name: 'Brand Blue',
    description:
      "Blue is primary Interactive color. You'll find blue in primary buttons, tabs, file uploader, and chips.",
    swatches: [
      {
        label: 'B400',
        hex: '#007CFF',
        token: '--color-blue-400',
        textLight: true,
      },
      {
        label: 'B300',
        hex: '#5BAAFF',
        token: '--color-blue-300',
        textLight: false,
      },
      {
        label: 'B200',
        hex: '#A3CFFF',
        token: '--color-blue-200',
        textLight: false,
      },
      {
        label: 'B100',
        hex: '#E7F2FF',
        token: '--color-blue-100',
        textLight: false,
      },
    ],
  },
  {
    name: 'Green',
    swatches: [
      {
        label: 'G500',
        hex: '#0BAE54',
        token: '--color-green-500',
        textLight: true,
      },
      {
        label: 'G100',
        hex: '#E2FBED',
        token: '--color-green-100',
        textLight: false,
      },
    ],
  },
  {
    name: 'Yellow',
    swatches: [
      {
        label: 'Y100',
        hex: '#FEF8D0',
        token: '--color-yellow-100',
        textLight: false,
      },
    ],
  },
  {
    name: 'Red',
    swatches: [
      {
        label: 'R400',
        hex: '#F15C59',
        token: '--color-red-400',
        textLight: true,
      },
      {
        label: 'R100',
        hex: '#FFDFDF',
        token: '--color-red-100',
        textLight: false,
      },
    ],
  },
  {
    name: 'Orange',
    swatches: [
      {
        label: 'O400',
        hex: '#FF5C00',
        token: '--color-orange-400',
        textLight: true,
      },
      {
        label: 'O500',
        hex: '#FF7200',
        token: '--color-orange-500',
        textLight: true,
      },
    ],
  },
  {
    name: 'Tosca',
    swatches: [
      {
        label: 'T500',
        hex: '#10A4AF',
        token: '--color-tosca-500',
        textLight: true,
      },
    ],
  },
];

const iconAliases = [
  { name: 'IconHighEmphasis', token: 'N700', hex: '#4D4F56', Icon: UserCircle },
  { name: 'IconLowEmphasis', token: 'N400', hex: '#AEB2BE', Icon: LayoutGrid },
  { name: 'IconDisabled', token: 'N200', hex: '#D8DCE8', Icon: Lock },
  { name: 'IconActivity', token: 'B400', hex: '#007CFF', Icon: Bell },
  { name: 'IconAlert', token: 'R400', hex: '#F15C59', Icon: AlertCircle },
  { name: 'IconAnalytic', token: 'O400', hex: '#FF7200', Icon: TrendingUp },
  { name: 'IconPositive', token: 'G500', hex: '#0BAE54', Icon: CheckCircle },
  { name: 'IconUniqueSellingPoint', token: 'T500', hex: '#10A4AF', Icon: Star },
  { name: 'IconInvert', token: 'N0', hex: '#FFFFFF', Icon: Sun },
];

const textAliases = [
  {
    name: 'High Emphasis Text',
    tokenName: 'TextHighEmphasis',
    base: 'N800',
    cssToken: '--color-text-high',
    hex: '#303135',
  },
  {
    name: 'Low Emphasis Text',
    tokenName: 'TextLowEmphasis',
    base: 'N600',
    cssToken: '--color-text-low',
    hex: '#71747D',
  },
  {
    name: 'Disabled Text',
    tokenName: 'TextDisabled',
    base: 'N400',
    cssToken: '--color-text-disabled',
    hex: '#AEB2BE',
  },
  {
    name: 'Activity Text',
    tokenName: 'TextActivity',
    base: 'B400',
    cssToken: '--color-text-activity',
    hex: '#007CFF',
  },
  {
    name: 'Alert Text',
    tokenName: 'TextAlert',
    base: 'R400',
    cssToken: '--color-text-alert',
    hex: '#F15C59',
  },
  {
    name: 'Analytic Text',
    tokenName: 'TextAnalytic',
    base: 'O500',
    cssToken: '--color-text-analytic',
    hex: '#FF7200',
  },
  {
    name: 'Positive Text',
    tokenName: 'TextPositive',
    base: 'G500',
    cssToken: '--color-text-positive',
    hex: '#0BAE54',
  },
  {
    name: 'USP Text',
    tokenName: 'TextUniquesSellingPoint',
    base: 'T500',
    cssToken: '--color-text-usp',
    hex: '#10A4AF',
  },
  {
    name: 'Invert Text',
    tokenName: 'TextInvert',
    base: 'N0',
    cssToken: '--color-text-inverse',
    hex: '#FFFFFF',
  },
];

const semanticAliases = [
  {
    name: 'Primary',
    cssToken: '--color-primary',
    usage: 'Primary actions, interactive elements',
  },
  {
    name: 'Primary Subtle',
    cssToken: '--color-primary-subtle',
    usage: 'Hover/active state backgrounds',
  },
  {
    name: 'Success',
    cssToken: '--color-success',
    usage: 'Positive feedback, success states',
  },
  {
    name: 'Success Subtle',
    cssToken: '--color-success-subtle',
    usage: 'Success background tints',
  },
  {
    name: 'Warning',
    cssToken: '--color-warning',
    usage: 'Warning states and labels',
  },
  {
    name: 'Danger',
    cssToken: '--color-danger',
    usage: 'Error, destructive actions',
  },
  {
    name: 'Danger Subtle',
    cssToken: '--color-danger-subtle',
    usage: 'Error background tints',
  },
  {
    name: 'Background',
    cssToken: '--color-background',
    usage: 'Main page background',
  },
  {
    name: 'Surface',
    cssToken: '--color-surface',
    usage: 'Card and panel surfaces',
  },
  { name: 'Border', cssToken: '--color-border', usage: 'Borders and dividers' },
  {
    name: 'Border Strong',
    cssToken: '--color-border-strong',
    usage: 'Emphasized borders',
  },
];

/* ── Data — Gradient ────────────────────────────────────────── */

const gradientPalettes = [
  {
    name: 'Gradient Green',
    stop1: {
      label: 'GG100',
      hex: '#01CF6C',
      token: '--color-gradient-green-100',
    },
    stop2: {
      label: 'GG200',
      hex: '#02CD9C',
      token: '--color-gradient-green-200',
    },
  },
  {
    name: 'Gradient Violet',
    stop1: {
      label: 'GV100',
      hex: '#18DC9B',
      token: '--color-gradient-violet-100',
    },
    stop2: {
      label: 'GV200',
      hex: '#6E54EF',
      token: '--color-gradient-violet-200',
    },
  },
  {
    name: 'Gradient Orange',
    stop1: {
      label: 'GO100',
      hex: '#FF7A00',
      token: '--color-gradient-orange-100',
    },
    stop2: {
      label: 'GO200',
      hex: '#FF3E65',
      token: '--color-gradient-orange-200',
    },
  },
  {
    name: 'Gradient Red',
    stop1: {
      label: 'GR100',
      hex: '#FF4062',
      token: '--color-gradient-red-100',
    },
    stop2: {
      label: 'GR200',
      hex: '#FF00B8',
      token: '--color-gradient-red-200',
    },
  },
  {
    name: 'Gradient Tosca',
    stop1: {
      label: 'GT100',
      hex: '#00CC9B',
      token: '--color-gradient-tosca-100',
    },
    stop2: {
      label: 'GT200',
      hex: '#017CFF',
      token: '--color-gradient-tosca-200',
    },
  },
  {
    name: 'Gradient Blue',
    stop1: {
      label: 'GB100',
      hex: '#007BFF',
      token: '--color-gradient-blue-100',
    },
    stop2: {
      label: 'GB200',
      hex: '#00C1EB',
      token: '--color-gradient-blue-200',
    },
  },
  {
    name: 'Gradient Purple',
    stop1: {
      label: 'GP100',
      hex: '#FA00B4',
      token: '--color-gradient-purple-100',
    },
    stop2: {
      label: 'GP200',
      hex: '#7600D2',
      token: '--color-gradient-purple-200',
    },
  },
  {
    name: 'Gradient Light Blue',
    stop1: {
      label: 'GL100',
      hex: '#E7F2FF',
      token: '--color-gradient-light-blue-100',
    },
    stop2: {
      label: 'GL200',
      hex: '#D9EAFE',
      token: '--color-gradient-light-blue-200',
    },
  },
];

const tierGradients = [
  {
    name: 'Gradient Silver',
    stop1: {
      label: 'GTS100',
      hex: '#47506F',
      token: '--color-gradient-tier-silver-100',
    },
    stop2: {
      label: 'GTS200',
      hex: '#CBD6EC',
      token: '--color-gradient-tier-silver-200',
    },
  },
  {
    name: 'Gradient Gold',
    stop1: {
      label: 'GTGO100',
      hex: '#614500',
      token: '--color-gradient-tier-gold-100',
    },
    stop2: {
      label: 'GTGO200',
      hex: '#EBBF4F',
      token: '--color-gradient-tier-gold-200',
    },
  },
  {
    name: 'Gradient Platinum',
    stop1: {
      label: 'GTP100',
      hex: '#0F0F0F',
      token: '--color-gradient-tier-platinum-100',
    },
    stop2: {
      label: 'GTP200',
      hex: '#838990',
      token: '--color-gradient-tier-platinum-200',
    },
  },
  {
    name: 'Gradient Diamond',
    stop1: {
      label: 'GTD100',
      hex: '#000208',
      token: '--color-gradient-tier-diamond-100',
    },
    stop2: {
      label: 'GTD200',
      hex: '#1258C9',
      token: '--color-gradient-tier-diamond-200',
    },
  },
];

/* ── Stories ────────────────────────────────────────────────── */

export const Color: Story = {
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
        Color
      </h1>
      <p
        style={{
          margin: '0 0 24px',
          fontSize: 'var(--text-body1-size)',
          color: 'var(--color-text-medium)',
          maxWidth: 640,
        }}
      >
        We use colors purposefully to communicate how things function in the
        interface, how they relate to other elements, and their level of
        prominence.
      </p>

      <Tabs defaultValue="solid" style={{ marginBottom: '48px' }}>
        <TabList style={{ marginBottom: '40px' }}>
          <Tab value="solid">Solid color</Tab>
          <Tab value="gradient">Gradient color</Tab>
        </TabList>

        {/* ── Solid panel ── */}
        <TabPanel value="solid">
          <p
            style={{
              margin: '0 0 48px',
              fontSize: 'var(--text-body1-size)',
              color: 'var(--color-text-medium)',
              maxWidth: 640,
            }}
          >
            Technically we have 81 color palettes for many purposes. But with
            regards to TDS component usages, we only use 14 palettes.
          </p>

          {/* Solid palettes */}
          {palettes.map((palette) => (
            <section key={palette.name} style={{ marginBottom: '48px' }}>
              <h2
                style={{
                  margin: '0 0 4px',
                  fontSize: 'var(--text-h2-size)',
                  fontWeight: 'var(--text-h2-weight)',
                  color: 'var(--color-text-high)',
                }}
              >
                {palette.name}
              </h2>
              {palette.description ? (
                <p
                  style={{
                    margin: '0 0 16px',
                    fontSize: 'var(--text-body2-size)',
                    color: 'var(--color-text-medium)',
                  }}
                >
                  {palette.description}
                </p>
              ) : (
                <div style={{ marginBottom: '16px' }} />
              )}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '12px',
                }}
              >
                {palette.swatches.map((s) => (
                  <SwatchCard key={s.token} {...s} />
                ))}
              </div>
            </section>
          ))}

          {/* Icon color alias */}
          <h2
            style={{
              margin: '0 0 8px',
              fontSize: 'var(--text-h2-size)',
              fontWeight: 'var(--text-h2-weight)',
              color: 'var(--color-text-high)',
            }}
          >
            Icon color alias
          </h2>
          <div
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: 'var(--elevation-01)',
              marginBottom: '48px',
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
                  {['Visual', 'Token', 'Values'].map((h) => (
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
                {iconAliases.map((a, i) => (
                  <tr
                    key={a.name}
                    style={{
                      background:
                        i % 2 === 0
                          ? 'var(--color-background)'
                          : 'var(--color-surface)',
                    }}
                  >
                    <td style={{ padding: '10px 16px' }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '6px',
                          background:
                            a.token === 'N0'
                              ? 'var(--color-neutral-800)'
                              : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <a.Icon size={20} color={a.hex} />
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '10px 16px',
                        color: 'var(--color-text-medium)',
                      }}
                    >
                      {a.name}
                    </td>
                    <td
                      style={{
                        padding: '10px 16px',
                        fontFamily: 'monospace',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-low)',
                      }}
                    >
                      {a.token}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Text color alias */}
          <h2
            style={{
              margin: '0 0 8px',
              fontSize: 'var(--text-h2-size)',
              fontWeight: 'var(--text-h2-weight)',
              color: 'var(--color-text-high)',
            }}
          >
            Text color alias
          </h2>
          <div
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: 'var(--elevation-01)',
              marginBottom: '48px',
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
                  {['Visual', 'Token', 'Base', 'CSS variable'].map((h) => (
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
                {textAliases.map((row, i) => (
                  <tr
                    key={row.tokenName}
                    style={{
                      background:
                        i % 2 === 0
                          ? 'var(--color-background)'
                          : 'var(--color-surface)',
                    }}
                  >
                    <td style={{ padding: '10px 16px' }}>
                      <span
                        style={{
                          fontSize: 'var(--text-body2-size)',
                          fontWeight: 600,
                          color: row.hex ?? 'var(--color-text-disabled)',
                          background:
                            row.hex === '#FFFFFF'
                              ? 'var(--color-neutral-800)'
                              : 'transparent',
                          padding: row.hex === '#FFFFFF' ? '2px 6px' : '0',
                          borderRadius: '4px',
                        }}
                      >
                        {row.name}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '10px 16px',
                        fontFamily: 'monospace',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-high)',
                      }}
                    >
                      {row.tokenName}
                    </td>
                    <td
                      style={{
                        padding: '10px 16px',
                        fontFamily: 'monospace',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-low)',
                      }}
                    >
                      {row.base}
                    </td>
                    <td
                      style={{
                        padding: '10px 16px',
                        fontFamily: 'monospace',
                        fontSize: 'var(--font-size-sm)',
                        color: row.cssToken
                          ? 'var(--color-primary)'
                          : 'var(--color-text-disabled)',
                      }}
                    >
                      {row.cssToken ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Semantic aliases */}
          <h2
            style={{
              margin: '0 0 8px',
              fontSize: 'var(--text-h2-size)',
              fontWeight: 'var(--text-h2-weight)',
              color: 'var(--color-text-high)',
            }}
          >
            Semantic aliases
          </h2>
          <p
            style={{
              margin: '0 0 16px',
              fontSize: 'var(--text-body2-size)',
              color: 'var(--color-text-medium)',
            }}
          >
            Use these tokens in components — never the raw palette values
            directly.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            {semanticAliases.map((a) => (
              <div
                key={a.cssToken}
                style={{
                  background: 'var(--color-background)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: 'var(--elevation-01)',
                }}
              >
                <div
                  style={{
                    height: '56px',
                    background: `var(${a.cssToken})`,
                    border:
                      a.cssToken === '--color-background'
                        ? '1px solid var(--color-border)'
                        : 'none',
                  }}
                />
                <div style={{ padding: '10px 12px' }}>
                  <strong
                    style={{
                      fontSize: 'var(--text-body2-size)',
                      color: 'var(--color-text-high)',
                    }}
                  >
                    {a.name}
                  </strong>
                  <code
                    style={{
                      display: 'block',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-primary)',
                      margin: '2px 0 4px',
                    }}
                  >
                    {a.cssToken}
                  </code>
                  <span
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-low)',
                    }}
                  >
                    {a.usage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TabPanel>

        {/* ── Gradient panel ── */}
        <TabPanel value="gradient">
          {/* Color palettes */}
          <h2
            style={{
              margin: '0 0 24px',
              fontSize: 'var(--text-h2-size)',
              fontWeight: 'var(--text-h2-weight)',
              color: 'var(--color-text-high)',
            }}
          >
            Color palettes
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px',
              marginBottom: '64px',
            }}
          >
            {gradientPalettes.map((g) => (
              <GradientCard key={g.name} {...g} />
            ))}
          </div>

          {/* Tier gradients */}
          <h2
            style={{
              margin: '0 0 8px',
              fontSize: 'var(--text-h2-size)',
              fontWeight: 'var(--text-h2-weight)',
              color: 'var(--color-text-high)',
            }}
          >
            Tier gradient
          </h2>
          <p
            style={{
              margin: '0 0 24px',
              fontSize: 'var(--text-body2-size)',
              color: 'var(--color-text-medium)',
            }}
          >
            Used for loyalty tier badges and membership indicators.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {tierGradients.map((g) => (
              <GradientCard key={g.name} {...g} />
            ))}
          </div>
        </TabPanel>
      </Tabs>
    </main>
  ),
};

/* ── Sub-components ─────────────────────────────────────────── */

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function SwatchCard({
  label,
  hex,
  token,
  bordered,
}: {
  label: string;
  hex: string;
  token: string;
  textLight: boolean;
  bordered?: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: 'var(--elevation-01)',
        border: bordered ? '1px solid var(--color-border)' : 'none',
        background: 'var(--color-background)',
      }}
    >
      {/* Swatch block */}
      <div style={{ height: 110, background: hex }} />

      {/* Info */}
      <div style={{ padding: '10px 12px' }}>
        <strong
          style={{
            display: 'block',
            fontSize: 'var(--text-body1-size)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-high)',
            marginBottom: '8px',
          }}
        >
          {label}
        </strong>

        {/* HEX row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px',
          }}
        >
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-low)',
            }}
          >
            HEX
          </span>
          <span
            style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-high)',
              fontFamily: 'monospace',
            }}
          >
            {hex}
          </span>
        </div>

        {/* RGB row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
          }}
        >
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-low)',
            }}
          >
            RGB
          </span>
          <span
            style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-high)',
              fontFamily: 'monospace',
            }}
          >
            {hexToRgb(hex)}
          </span>
        </div>

        <code
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-primary)',
            display: 'block',
            lineBreak: 'anywhere',
          }}
        >
          {token}
        </code>
      </div>
    </div>
  );
}

function GradientCard({
  name,
  stop1,
  stop2,
}: {
  name: string;
  stop1: { label: string; hex: string; token: string };
  stop2: { label: string; hex: string; token: string };
}) {
  return (
    <div
      style={{
        background: 'var(--color-background)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--elevation-01)',
      }}
    >
      {/* Gradient preview */}
      <div
        style={{
          height: 100,
          background: `linear-gradient(135deg, ${stop1.hex}, ${stop2.hex})`,
        }}
      />

      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        <strong
          style={{
            fontSize: 'var(--text-body1-size)',
            color: 'var(--color-text-high)',
            display: 'block',
            marginBottom: '12px',
          }}
        >
          {name}
        </strong>

        {/* Stop 1 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '6px',
              background: stop1.hex,
              flexShrink: 0,
              border:
                stop1.hex.toUpperCase() === '#FFFFFF'
                  ? '1px solid var(--color-border)'
                  : 'none',
            }}
          />
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-medium)',
                }}
              >
                {stop1.label}
              </span>
              <span
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontFamily: 'monospace',
                  color: 'var(--color-text-high)',
                }}
              >
                {stop1.hex}
              </span>
            </div>
            <code
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-primary)',
              }}
            >
              {stop1.token}
            </code>
          </div>
        </div>

        {/* Stop 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '6px',
              background: stop2.hex,
              flexShrink: 0,
              border:
                stop2.hex.toUpperCase() === '#FFFFFF'
                  ? '1px solid var(--color-border)'
                  : 'none',
            }}
          />
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-medium)',
                }}
              >
                {stop2.label}
              </span>
              <span
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontFamily: 'monospace',
                  color: 'var(--color-text-high)',
                }}
              >
                {stop2.hex}
              </span>
            </div>
            <code
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-primary)',
              }}
            >
              {stop2.token}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
