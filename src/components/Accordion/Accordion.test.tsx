import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './Accordion';

function BasicAccordion({ multiple = false }: { multiple?: boolean }) {
  return (
    <Accordion multiple={multiple}>
      <AccordionItem value="a">
        <AccordionTrigger value="a">Item A</AccordionTrigger>
        <AccordionContent value="a">Content A</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger value="b">Item B</AccordionTrigger>
        <AccordionContent value="b">Content B</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('renders triggers', () => {
    render(<BasicAccordion />);
    expect(screen.getByRole('button', { name: /Item A/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Item B/ })).toBeInTheDocument();
  });

  it('panels are hidden by default', () => {
    render(<BasicAccordion />);
    expect(screen.queryByText('Content A')).not.toBeVisible();
  });

  it('expands on trigger click', () => {
    render(<BasicAccordion />);
    fireEvent.click(screen.getByRole('button', { name: /Item A/ }));
    expect(screen.getByRole('button', { name: /Item A/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('collapses on second click', () => {
    render(<BasicAccordion />);
    fireEvent.click(screen.getByRole('button', { name: /Item A/ }));
    fireEvent.click(screen.getByRole('button', { name: /Item A/ }));
    expect(screen.getByRole('button', { name: /Item A/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('closes other items in single mode', () => {
    render(<BasicAccordion />);
    fireEvent.click(screen.getByRole('button', { name: /Item A/ }));
    fireEvent.click(screen.getByRole('button', { name: /Item B/ }));
    expect(screen.getByRole('button', { name: /Item A/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('button', { name: /Item B/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('keeps multiple items open in multiple mode', () => {
    render(<BasicAccordion multiple />);
    fireEvent.click(screen.getByRole('button', { name: /Item A/ }));
    fireEvent.click(screen.getByRole('button', { name: /Item B/ }));
    expect(screen.getByRole('button', { name: /Item A/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: /Item B/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('defaultOpen pre-opens an item', () => {
    render(
      <Accordion defaultOpen="a">
        <AccordionItem value="a">
          <AccordionTrigger value="a">Item A</AccordionTrigger>
          <AccordionContent value="a">Content A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole('button', { name: /Item A/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('trigger aria-controls points to panel id', () => {
    render(<BasicAccordion />);
    const trigger = screen.getByRole('button', { name: /Item A/ });
    const panelId = trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId!)).toBeInTheDocument();
  });

  // ── A3: Arrow key navigation ─────────────────────────────────

  it('ArrowDown moves focus to next trigger', () => {
    render(<BasicAccordion />);
    const triggerA = screen.getByRole('button', { name: /Item A/ });
    triggerA.focus();
    fireEvent.keyDown(triggerA, { key: 'ArrowDown' });
    expect(screen.getByRole('button', { name: /Item B/ })).toHaveFocus();
  });

  it('ArrowDown wraps from last to first trigger', () => {
    render(<BasicAccordion />);
    const triggerB = screen.getByRole('button', { name: /Item B/ });
    triggerB.focus();
    fireEvent.keyDown(triggerB, { key: 'ArrowDown' });
    expect(screen.getByRole('button', { name: /Item A/ })).toHaveFocus();
  });

  it('ArrowUp moves focus to previous trigger', () => {
    render(<BasicAccordion />);
    const triggerB = screen.getByRole('button', { name: /Item B/ });
    triggerB.focus();
    fireEvent.keyDown(triggerB, { key: 'ArrowUp' });
    expect(screen.getByRole('button', { name: /Item A/ })).toHaveFocus();
  });

  it('Home moves focus to first trigger', () => {
    render(<BasicAccordion />);
    const triggerB = screen.getByRole('button', { name: /Item B/ });
    triggerB.focus();
    fireEvent.keyDown(triggerB, { key: 'Home' });
    expect(screen.getByRole('button', { name: /Item A/ })).toHaveFocus();
  });

  it('End moves focus to last trigger', () => {
    render(<BasicAccordion />);
    const triggerA = screen.getByRole('button', { name: /Item A/ });
    triggerA.focus();
    fireEvent.keyDown(triggerA, { key: 'End' });
    expect(screen.getByRole('button', { name: /Item B/ })).toHaveFocus();
  });

  it('arrow keys do not expand/collapse (only Enter/Space/Click does)', () => {
    render(<BasicAccordion />);
    const triggerA = screen.getByRole('button', { name: /Item A/ });
    triggerA.focus();
    fireEvent.keyDown(triggerA, { key: 'ArrowDown' });
    // triggerA still collapsed, only focus moved
    expect(triggerA).toHaveAttribute('aria-expanded', 'false');
  });

  // ── B1: Controlled mode ───────────────────────────────────────

  it('controlled: respects expanded prop', () => {
    render(
      <Accordion expanded="a">
        <AccordionItem value="a">
          <AccordionTrigger value="a">Item A</AccordionTrigger>
          <AccordionContent value="a">Content A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger value="b">Item B</AccordionTrigger>
          <AccordionContent value="b">Content B</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole('button', { name: /Item A/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: /Item B/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('controlled: clicking does not change state without updating expanded prop', () => {
    render(
      <Accordion expanded="a">
        <AccordionItem value="a">
          <AccordionTrigger value="a">Item A</AccordionTrigger>
          <AccordionContent value="a">Content A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Item A/ }));
    // Still open because controlled from outside
    expect(screen.getByRole('button', { name: /Item A/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('controlled: calls onExpandedChange with next values', () => {
    const onChange = vi.fn();
    render(
      <Accordion expanded={[]} onExpandedChange={onChange}>
        <AccordionItem value="a">
          <AccordionTrigger value="a">Item A</AccordionTrigger>
          <AccordionContent value="a">Content A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Item A/ }));
    expect(onChange).toHaveBeenCalledWith(['a']);
  });

  it('controlled: full two-way binding', () => {
    function Controlled() {
      const [open, setOpen] = useState<(string | number)[]>([]);
      return (
        <Accordion expanded={open} onExpandedChange={setOpen}>
          <AccordionItem value="a">
            <AccordionTrigger value="a">Item A</AccordionTrigger>
            <AccordionContent value="a">Content A</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger value="b">Item B</AccordionTrigger>
            <AccordionContent value="b">Content B</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }
    render(<Controlled />);
    fireEvent.click(screen.getByRole('button', { name: /Item A/ }));
    expect(screen.getByRole('button', { name: /Item A/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    fireEvent.click(screen.getByRole('button', { name: /Item B/ }));
    // Single mode: A should close when B opens
    expect(screen.getByRole('button', { name: /Item A/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('button', { name: /Item B/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('uncontrolled: onExpandedChange fires as change observer', () => {
    const onChange = vi.fn();
    render(
      <Accordion onExpandedChange={onChange}>
        <AccordionItem value="a">
          <AccordionTrigger value="a">Item A</AccordionTrigger>
          <AccordionContent value="a">Content A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Item A/ }));
    expect(onChange).toHaveBeenCalledWith(['a']);
  });
});

describe('Accordion — insideCard variant', () => {
  it('applies fq-accordion--inside-card class when insideCard=true', () => {
    const { container } = render(
      <Accordion insideCard>
        <AccordionItem value="a">
          <AccordionTrigger value="a">Item A</AccordionTrigger>
          <AccordionContent value="a">Content A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(
      container.querySelector('.fq-accordion--inside-card'),
    ).toBeInTheDocument();
  });

  it('does not apply fq-accordion--inside-card when insideCard=false (default)', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger value="a">Item A</AccordionTrigger>
          <AccordionContent value="a">Content A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(container.querySelector('.fq-accordion--inside-card')).toBeNull();
  });

  it('insideCard accordion still expands and collapses correctly', () => {
    render(
      <Accordion insideCard>
        <AccordionItem value="a">
          <AccordionTrigger value="a">Item A</AccordionTrigger>
          <AccordionContent value="a">Content A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole('button', { name: /Item A/ });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
