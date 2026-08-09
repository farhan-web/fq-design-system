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
    usage: 'Subtle elevation for small components',
  },
  {
    name: 'Medium',
    variable: '--shadow-md',
    usage: 'Elevation for cards and floating surfaces',
  },
];

export const Overview: Story = {
  render: () => (
    <main
      style={{
        padding: '48px',
        background: 'var(--color-surface)',
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
          Shadows
        </h1>

        <p
          style={{
            marginTop: '8px',
            color: 'var(--color-text-secondary)',
          }}
        >
          Elevation tokens used to communicate hierarchy
          between surfaces.
        </p>
      </header>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '32px',
        }}
      >
        {shadowTokens.map((token) => (
          <ShadowToken
            key={token.variable}
            name={token.name}
            variable={token.variable}
            usage={token.usage}
          />
        ))}
      </section>
    </main>
  ),
};

function ShadowToken({
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
        padding: '24px',
        minHeight: '180px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-background)',
        boxShadow: `var(${variable})`,
      }}
    >
      <strong>{name}</strong>

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
          marginTop: '16px',
          marginBottom: 0,
          fontSize: '14px',
          lineHeight: '1.5',
          color: 'var(--color-text-secondary)',
        }}
      >
        {usage}
      </p>
    </article>
  );
}
