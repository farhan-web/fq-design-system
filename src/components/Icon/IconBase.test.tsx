import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IconBase } from './IconBase';

const DummySvg = () => <svg data-testid="svg" />;

describe('IconBase', () => {
  it('renders children inside a span', () => {
    const { container } = render(
      <IconBase>
        <DummySvg />
      </IconBase>,
    );
    expect(container.querySelector('span.fq-icon')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="svg"]')).toBeInTheDocument();
  });

  // ── Size ─────────────────────────────────────────────────────────────────

  it.each([
    ['xs', 'fq-icon--xs'],
    ['sm', 'fq-icon--sm'],
    ['md', 'fq-icon--md'],
    ['lg', 'fq-icon--lg'],
    ['xl', 'fq-icon--xl'],
    ['2xl', 'fq-icon--2xl'],
    ['3xl', 'fq-icon--3xl'],
  ] as const)('applies size class for size="%s"', (size, expectedClass) => {
    const { container } = render(
      <IconBase size={size}>
        <DummySvg />
      </IconBase>,
    );
    expect(container.firstChild).toHaveClass(expectedClass);
  });

  it('defaults to size="lg"', () => {
    const { container } = render(
      <IconBase>
        <DummySvg />
      </IconBase>,
    );
    expect(container.firstChild).toHaveClass('fq-icon--lg');
  });

  // ── Color ─────────────────────────────────────────────────────────────────

  it.each([
    'primary',
    'secondary',
    'error',
    'success',
    'warning',
    'muted',
  ] as const)('applies color class for color="%s"', (color) => {
    const { container } = render(
      <IconBase color={color}>
        <DummySvg />
      </IconBase>,
    );
    expect(container.firstChild).toHaveClass(`fq-icon--${color}`);
  });

  it('does not add color class when color="inherit"', () => {
    const { container } = render(
      <IconBase color="inherit">
        <DummySvg />
      </IconBase>,
    );
    const span = container.firstChild as HTMLElement;
    expect(span.className).not.toMatch(/fq-icon--inherit/);
  });

  it('defaults to color="inherit" (no color class)', () => {
    const { container } = render(
      <IconBase>
        <DummySvg />
      </IconBase>,
    );
    const span = container.firstChild as HTMLElement;
    const classes = span.className.split(' ');
    expect(
      classes.filter((c) => c.startsWith('fq-icon--') && c !== 'fq-icon--lg'),
    ).toHaveLength(0);
  });

  // ── Accessibility ─────────────────────────────────────────────────────────

  it('adds role="img" and aria-label when aria-label is provided', () => {
    render(
      <IconBase aria-label="Search icon">
        <DummySvg />
      </IconBase>,
    );
    const icon = screen.getByRole('img', { name: 'Search icon' });
    expect(icon).toBeInTheDocument();
  });

  it('adds aria-hidden="true" when no aria-label is provided', () => {
    const { container } = render(
      <IconBase>
        <DummySvg />
      </IconBase>,
    );
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not add aria-hidden when aria-label is provided', () => {
    const { container } = render(
      <IconBase aria-label="Icon">
        <DummySvg />
      </IconBase>,
    );
    expect(container.firstChild).not.toHaveAttribute('aria-hidden');
  });

  // ── Forwarded ref ─────────────────────────────────────────────────────────

  it('forwards ref to the span element', () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(
      <IconBase ref={ref}>
        <DummySvg />
      </IconBase>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  // ── Custom className ──────────────────────────────────────────────────────

  it('merges custom className', () => {
    const { container } = render(
      <IconBase className="my-custom">
        <DummySvg />
      </IconBase>,
    );
    expect(container.firstChild).toHaveClass('fq-icon', 'my-custom');
  });

  // ── Extra props passthrough ───────────────────────────────────────────────

  it('passes additional HTML attributes to the span', () => {
    const { container } = render(
      <IconBase data-testid="icon-wrapper">
        <DummySvg />
      </IconBase>,
    );
    expect(
      container.querySelector('[data-testid="icon-wrapper"]'),
    ).toBeInTheDocument();
  });
});
