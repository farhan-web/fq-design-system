import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const colors = [
  {
    name: 'Primary',
    variable: '--color-primary',
    usage: 'Primary actions and interactive elements',
  },
  {
    name: 'Primary Hover',
    variable: '--color-primary-hover',
    usage: 'Hover state for primary actions',
  },
  {
    name: 'Background',
    variable: '--color-background',
    usage: 'Main application background',
  },
  {
    name: 'Surface',
    variable: '--color-surface',
    usage: 'Cards, panels and elevated surfaces',
  },
  {
    name: 'Text Primary',
    variable: '--color-text-primary',
    usage: 'Main content text',
  },
  {
    name: 'Text Secondary',
    variable: '--color-text-secondary',
    usage: 'Secondary content and descriptions',
  },
  {
    name: 'Text Muted',
    variable: '--color-text-muted',
    usage: 'Low emphasis content',
  },
  {
    name: 'Border',
    variable: '--color-border',
    usage: 'Borders and dividers',
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
          marginBottom: '40px',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '32px',
          }}
        >
          Colors
        </h1>

        <p
          style={{
            marginTop: '8px',
            color: 'var(--color-text-secondary)',
          }}
        >
          Color tokens used throughout the FQ Design System.
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
        {colors.map((color) => (
          <ColorCard
            key={color.variable}
            name={color.name}
            variable={color.variable}
            usage={color.usage}
          />
        ))}
      </section>
    </main>
  ),
};

function ColorCard({
  name,
  variable,
  usage,
}: {
  name: string;
  variable: string;
  usage: string;
}) {
  return (
    <article
      style={{
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-background)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          height: '100px',
          background: `var(${variable})`,
          borderBottom: '1px solid var(--color-border)',
        }}
      />

      <div
        style={{
          padding: '16px',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '16px',
          }}
        >
          {name}
        </h3>

        <code
          style={{
            display: 'block',
            marginTop: '8px',
            fontSize: '12px',
          }}
        >
          {variable}
        </code>

        <p
          style={{
            margin: '12px 0 0',
            color: 'var(--color-text-secondary)',
            fontSize: '14px',
            lineHeight: 1.5,
          }}
        >
          {usage}
        </p>
      </div>
    </article>
  );
}
