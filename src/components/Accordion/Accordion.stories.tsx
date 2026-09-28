import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Expandable content sections. Supports two variants: flat bordered (default) and elevated card (insideCard).',
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    value: 'baggage',
    title: 'Baggage policy',
    body: 'Each passenger may bring one carry-on bag and one personal item free of charge. Checked baggage fees apply.',
  },
  {
    value: 'cancellation',
    title: 'Cancellation & refund',
    body: 'Tickets purchased more than 24 hours before departure are eligible for a full refund. Changes may incur a fee.',
  },
  {
    value: 'checkin',
    title: 'Check-in information',
    body: 'Online check-in opens 24 hours before departure. Airport check-in closes 45 minutes before the flight.',
  },
];

/* ── Icon helper (inline SVG globe) ─────────────────────────────────────── */
function GlobeIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, color: 'var(--color-text-low)' }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

/* ── Default (Inside Card: False) ────────────────────────────────────────── */
export const Default: Story = {
  render: () => (
    <Accordion style={{ maxWidth: 480 }}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger value={item.value}>{item.title}</AccordionTrigger>
          <AccordionContent value={item.value}>{item.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/* ── Inside Card: True (elevated card per item) ─────────────────────────── */
export const InsideCard: Story = {
  name: 'Inside Card: True',
  render: () => (
    <Accordion insideCard style={{ maxWidth: 480 }}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger value={item.value}>
            <span
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <GlobeIcon />
              {item.title}
            </span>
          </AccordionTrigger>
          <AccordionContent value={item.value}>{item.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/* ── Dynamic Header — any ReactNode in header ───────────────────────────── */
export const DynamicHeader: Story = {
  render: () => (
    <Accordion style={{ maxWidth: 480 }}>
      <AccordionItem value="flight">
        <AccordionTrigger value="flight">
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '2px 8px',
                background: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                borderRadius: 4,
                fontSize: 'var(--text-body3-size)',
                fontWeight: 'var(--font-weight-bold)',
                whiteSpace: 'nowrap',
              }}
            >
              Depart
            </span>
            Sat, 9 May 2022
          </span>
        </AccordionTrigger>
        <AccordionContent value="flight">
          Flight details: CGK → NRT, 7h 30m direct, Economy class.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="hotel">
        <AccordionTrigger value="hotel">
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <GlobeIcon />
            Hotel details
          </span>
        </AccordionTrigger>
        <AccordionContent value="hotel">
          Grand Hyatt Tokyo, Superior Room, 2 nights.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/* ── Multiple Open ───────────────────────────────────────────────────────── */
export const MultipleOpen: Story = {
  render: () => (
    <Accordion multiple style={{ maxWidth: 480 }}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger value={item.value}>{item.title}</AccordionTrigger>
          <AccordionContent value={item.value}>{item.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/* ── Default Open ────────────────────────────────────────────────────────── */
export const DefaultOpen: Story = {
  render: () => (
    <Accordion defaultOpen="baggage" style={{ maxWidth: 480 }}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger value={item.value}>{item.title}</AccordionTrigger>
          <AccordionContent value={item.value}>{item.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/* ── Disabled Item ───────────────────────────────────────────────────────── */
export const WithDisabledItem: Story = {
  render: () => (
    <Accordion style={{ maxWidth: 480 }}>
      <AccordionItem value="baggage">
        <AccordionTrigger value="baggage">Baggage policy</AccordionTrigger>
        <AccordionContent value="baggage">
          Each passenger may bring one carry-on bag free of charge.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="cancellation">
        <AccordionTrigger value="cancellation" disabled>
          Cancellation & refund (disabled)
        </AccordionTrigger>
        <AccordionContent value="cancellation">Hidden</AccordionContent>
      </AccordionItem>
      <AccordionItem value="checkin">
        <AccordionTrigger value="checkin">
          Check-in information
        </AccordionTrigger>
        <AccordionContent value="checkin">
          Online check-in opens 24 hours before departure.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/* ── Controlled ──────────────────────────────────────────────────────────── */
export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `expanded` and `onExpandedChange` for fully controlled state. The parent owns which items are open.',
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = React.useState<(string | number)[]>(["baggage"]);
    return (
      <Accordion
        expanded={open}
        onExpandedChange={setOpen}
        style={{ maxWidth: 480 }}
      >
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger value={item.value}>{item.title}</AccordionTrigger>
            <AccordionContent value={item.value}>{item.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  },
};
