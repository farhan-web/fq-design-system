import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Typography',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

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
          Typography
        </h1>

        <p
          style={{
            marginTop: '8px',
            color: 'var(--color-text-secondary)',
          }}
        >
          Typography tokens and hierarchy used throughout
          the FQ Design System.
        </p>
      </header>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
        }}
      >
        <TypographyExample
          name="Heading 1"
          variable="--font-size-2xl"
          size="var(--font-size-2xl)"
          weight="var(--font-weight-bold)"
          lineHeight="var(--line-height-tight)"
        >
          Build better products.
        </TypographyExample>

        <TypographyExample
          name="Heading 2"
          variable="--font-size-xl"
          size="var(--font-size-xl)"
          weight="var(--font-weight-bold)"
          lineHeight="var(--line-height-tight)"
        >
          Design systems scale.
        </TypographyExample>

        <TypographyExample
          name="Heading 3"
          variable="--font-size-lg"
          size="var(--font-size-lg)"
          weight="var(--font-weight-semibold)"
          lineHeight="var(--line-height-tight)"
        >
          Components should be predictable.
        </TypographyExample>

        <TypographyExample
          name="Body"
          variable="--font-size-md"
          size="var(--font-size-md)"
          weight="var(--font-weight-regular)"
          lineHeight="var(--line-height-normal)"
        >
          A good design system provides consistent
          visual language, predictable components, and
          reusable patterns.
        </TypographyExample>

        <TypographyExample
          name="Small"
          variable="--font-size-sm"
          size="var(--font-size-sm)"
          weight="var(--font-weight-regular)"
          lineHeight="var(--line-height-normal)"
        >
          Supporting information and secondary content.
        </TypographyExample>

        <TypographyExample
          name="Caption"
          variable="--font-size-xs"
          size="var(--font-size-xs)"
          weight="var(--font-weight-medium)"
          lineHeight="var(--line-height-normal)"
        >
          Metadata and supporting labels.
        </TypographyExample>
      </section>
    </main>
  ),
};

function TypographyExample({
  name,
  variable,
  size,
  weight,
  lineHeight,
  children,
}: {
  name: string;
  variable: string;
  size: string;
  weight: string;
  lineHeight: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        borderBottom:
          '1px solid var(--color-border)',
        paddingBottom: '32px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <strong>{name}</strong>

        <code
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '12px',
          }}
        >
          {variable}
        </code>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-family)',
          fontSize: size,
          fontWeight: weight,
          lineHeight,
        }}
      >
        {children}
      </div>
    </div>
  );
}
