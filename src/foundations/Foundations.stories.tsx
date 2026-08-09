import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Overview',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div
      style={{
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}
    >
      <div>
        <h1>FQ Design System</h1>
        <p>
          Design foundations and reusable UI components.
        </p>
      </div>

      <section>
        <h2>Colors</h2>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <ColorToken
            name="Primary"
            variable="--color-primary"
          />

          <ColorToken
            name="Surface"
            variable="--color-surface"
          />

          <ColorToken
            name="Text Primary"
            variable="--color-text-primary"
          />

          <ColorToken
            name="Border"
            variable="--color-border"
          />
        </div>
      </section>
    </div>
  ),
};

function ColorToken({
  name,
  variable,
}: {
  name: string;
  variable: string;
}) {
  return (
    <div
      style={{
        width: '180px',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '80px',
          background: `var(${variable})`,
        }}
      />

      <div
        style={{
          padding: '12px',
        }}
      >
        <strong>{name}</strong>

        <div
          style={{
            marginTop: '4px',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
          }}
        >
          {variable}
        </div>
      </div>
    </div>
  );
}