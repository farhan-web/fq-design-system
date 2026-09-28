import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { IconButton } from './IconButton';

const DummySvg = () => <svg data-testid="icon-svg" />;

describe('IconButton', () => {
  // ── Rendering ──────────────────────────────────────────────────────────

  it('renders a <button> element', () => {
    const { container } = render(
      <IconButton aria-label="Search">
        <DummySvg />
      </IconButton>,
    );
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('renders with fq-icon-btn base class', () => {
    const { container } = render(
      <IconButton aria-label="Search">
        <DummySvg />
      </IconButton>,
    );
    expect(container.firstChild).toHaveClass('fq-icon-btn');
  });

  // ── Size ───────────────────────────────────────────────────────────────

  it.each([
    ['xs', 'fq-icon-btn--xs'],
    ['sm', 'fq-icon-btn--sm'],
    ['md', 'fq-icon-btn--md'],
    ['lg', 'fq-icon-btn--lg'],
    ['xl', 'fq-icon-btn--xl'],
  ] as const)('applies size class for size="%s"', (size, cls) => {
    const { container } = render(
      <IconButton size={size} aria-label="icon">
        <DummySvg />
      </IconButton>,
    );
    expect(container.firstChild).toHaveClass(cls);
  });

  it('defaults to size="md"', () => {
    const { container } = render(
      <IconButton aria-label="icon">
        <DummySvg />
      </IconButton>,
    );
    expect(container.firstChild).toHaveClass('fq-icon-btn--md');
  });

  // ── Variant ────────────────────────────────────────────────────────────

  it('does NOT add a variant class for the default "standard" variant', () => {
    const { container } = render(
      <IconButton aria-label="icon">
        <DummySvg />
      </IconButton>,
    );
    expect(container.firstChild).not.toHaveClass('fq-icon-btn--standard');
  });

  it.each(['filled', 'outlined', 'ghost'] as const)(
    'applies variant class for variant="%s"',
    (variant) => {
      const { container } = render(
        <IconButton variant={variant} aria-label="icon">
          <DummySvg />
        </IconButton>,
      );
      expect(container.firstChild).toHaveClass(`fq-icon-btn--${variant}`);
    },
  );

  // ── Color ──────────────────────────────────────────────────────────────

  it('does NOT add a color class for the default "inherit" color', () => {
    const { container } = render(
      <IconButton aria-label="icon">
        <DummySvg />
      </IconButton>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).not.toMatch(/fq-icon-btn--inherit/);
  });

  it.each([
    'primary',
    'secondary',
    'error',
    'success',
    'warning',
    'muted',
  ] as const)('applies color class for color="%s"', (color) => {
    const { container } = render(
      <IconButton color={color} aria-label="icon">
        <DummySvg />
      </IconButton>,
    );
    expect(container.firstChild).toHaveClass(`fq-icon-btn--${color}`);
  });

  // ── Accessibility ──────────────────────────────────────────────────────

  it('exposes the aria-label on the button', () => {
    render(
      <IconButton aria-label="Close dialog">
        <DummySvg />
      </IconButton>,
    );
    expect(
      screen.getByRole('button', { name: 'Close dialog' }),
    ).toBeInTheDocument();
  });

  it('renders the icon with aria-hidden inside', () => {
    const { container } = render(
      <IconButton aria-label="Search">
        <DummySvg />
      </IconButton>,
    );
    // IconBase renders a span; that span should be aria-hidden
    const iconSpan = container.querySelector('.fq-icon');
    expect(iconSpan).toHaveAttribute('aria-hidden', 'true');
  });

  // ── Disabled ───────────────────────────────────────────────────────────

  it('is disabled when disabled prop is true', () => {
    render(
      <IconButton disabled aria-label="icon">
        <DummySvg />
      </IconButton>,
    );
    expect(screen.getByRole('button', { name: 'icon' })).toBeDisabled();
  });

  it('does not fire onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <IconButton disabled onClick={handleClick} aria-label="icon">
        <DummySvg />
      </IconButton>,
    );
    // fireEvent.click respects the native disabled attribute in jsdom
    fireEvent.click(screen.getByRole('button', { name: 'icon' }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // ── Forwarded ref ──────────────────────────────────────────────────────

  it('forwards ref to the button element', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(
      <IconButton ref={ref} aria-label="icon">
        <DummySvg />
      </IconButton>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  // ── Custom className ───────────────────────────────────────────────────

  it('merges custom className', () => {
    const { container } = render(
      <IconButton className="extra" aria-label="icon">
        <DummySvg />
      </IconButton>,
    );
    expect(container.firstChild).toHaveClass('fq-icon-btn', 'extra');
  });

  // ── onClick ────────────────────────────────────────────────────────────

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <IconButton onClick={handleClick} aria-label="icon">
        <DummySvg />
      </IconButton>,
    );
    await user.click(screen.getByRole('button', { name: 'icon' }));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
