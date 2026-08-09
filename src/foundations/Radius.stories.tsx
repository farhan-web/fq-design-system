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
  },
  {
    name: 'Medium',
    variable: '--radius-md',
    value: '8px',
  },
  {
    name: 'Large',
    variable: '--radius-lg',
    value: '12px',
  },
  {
    name: 'Extra Large',
    variable: '--radius-xl',
    value: '16px',
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
          Radius
        </h1>

        <p
          style={{
            marginTop: '8px',
            color: 'var(--color-text-secondary)',
          }}
        >
          Border radius tokens used to create consistent
          component shapes.
        </p>
      </header>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '24px',
        }}
      >
        {radiusTokens.map((token) => (
          <RadiusToken
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

function RadiusToken({
  name,
  variable,
  value,
}: {
  name: string;
  variable: string;
  value: string;
}) {
  return (
    <article
      style={{
        padding: '24px',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-background)',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '120px',
          borderRadius: `var(${variable})`,
          background: 'var(--color-primary)',
        }}
      />

      <div
        style={{
          marginTop: '20px',
        }}
      >
        <strong>{name}</strong>

        <code
          style={{
            display: 'block',
            marginTop: '6px',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
          }}
        >
          {variable}
        </code>

        <span
          style={{
            display: 'block',
            marginTop: '4px',
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
          }}
        >
          {value}
        </span>
      </div>
    </article>
  );
}
