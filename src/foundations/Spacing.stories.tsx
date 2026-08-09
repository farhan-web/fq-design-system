import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Spacing',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const spacingTokens = [
  {
    name: 'Space 1',
    variable: '--space-1',
    value: '4px',
  },
  {
    name: 'Space 2',
    variable: '--space-2',
    value: '8px',
  },
  {
    name: 'Space 3',
    variable: '--space-3',
    value: '12px',
  },
  {
    name: 'Space 4',
    variable: '--space-4',
    value: '16px',
  },
  {
    name: 'Space 5',
    variable: '--space-5',
    value: '20px',
  },
  {
    name: 'Space 6',
    variable: '--space-6',
    value: '24px',
  },
  {
    name: 'Space 8',
    variable: '--space-8',
    value: '32px',
  },
  {
    name: 'Space 10',
    variable: '--space-10',
    value: '40px',
  },
  {
    name: 'Space 12',
    variable: '--space-12',
    value: '48px',
  },
];

export const Overview: Story = {
  render: () => (
    <main
      style={{
        padding: '48px',
        background: 'var(--color-background)',
        color: 'var(--color-text-primary)',
        minHeight: '100vh',
      }}
    >
      <header
        style={{
          marginBottom: '48px',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '32px',
            lineHeight: '1.2',
          }}
        >
          Spacing
        </h1>

        <p
          style={{
            marginTop: '8px',
            color: 'var(--color-text-secondary)',
          }}
        >
          Consistent spacing scale used for layout,
          padding, margin, and component gaps.
        </p>
      </header>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {spacingTokens.map((token) => (
          <SpacingToken
            key={token.variable}
            name={token.name}
            variable={token.variable}
            value={token.value}
          />
        ))}
      </section>
    </main>
  ),
};

function SpacingToken({
  name,
  variable,
  value,
}: {
  name: string;
  variable: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          '120px 180px 1fr',
        alignItems: 'center',
        gap: '24px',
      }}
    >
      <div>
        <strong>{name}</strong>

        <code
          style={{
            display: 'block',
            marginTop: '4px',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
          }}
        >
          {variable}
        </code>
      </div>

      <div
        style={{
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
        }}
      >
        {value}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div
          style={{
            width: `var(${variable})`,
            minWidth: '4px',
            height: '24px',
            background: 'var(--color-primary)',
            borderRadius: 'var(--radius-sm)',
          }}
        />

        <span
          style={{
            fontSize: '12px',
            color: 'var(--color-text-muted)',
          }}
        >
          visual scale
        </span>
      </div>
    </div>
  );
}
