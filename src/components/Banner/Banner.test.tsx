import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Banner } from './Banner';

describe('Banner', () => {
  it('renders title and description', () => {
    render(<Banner title="Info" description="Something happened" />);
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('has role="alert"', () => {
    render(<Banner title="Alert" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    render(<Banner variant="success" title="OK" />);
    expect(screen.getByRole('alert')).toHaveClass('fq-banner--success');
  });

  it('shows dismiss button when dismissible', () => {
    render(<Banner title="Info" dismissible />);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('hides banner after dismiss click', () => {
    render(<Banner title="Info" dismissible />);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('calls onDismiss callback', () => {
    const onDismiss = vi.fn();
    render(<Banner title="Info" dismissible onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not show dismiss button by default', () => {
    render(<Banner title="Info" />);
    expect(
      screen.queryByRole('button', { name: 'Dismiss' }),
    ).not.toBeInTheDocument();
  });

  it('renders children as body content', () => {
    render(
      <Banner variant="info">
        <span data-testid="custom">Custom</span>
      </Banner>,
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = { current: null } as { current: HTMLDivElement | null };
    render(<Banner ref={ref} title="Test" />);
    expect(ref.current).toBe(screen.getByRole('alert'));
  });

  it('renders action button', () => {
    const onClick = vi.fn();
    render(<Banner title="Info" action={{ label: 'View details', onClick }} />);
    const btn = screen.getByRole('button', { name: 'View details' });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // ── layout ─────────────────────────────────────────────────

  it('applies fq-banner--full-width class when layout="full-width"', () => {
    render(<Banner title="Info" layout="full-width" />);
    expect(screen.getByRole('alert')).toHaveClass('fq-banner--full-width');
  });

  it('does not apply full-width class by default', () => {
    render(<Banner title="Info" />);
    expect(screen.getByRole('alert')).not.toHaveClass('fq-banner--full-width');
  });

  it('shows chevron for full-width layout', () => {
    const { container } = render(<Banner title="Info" layout="full-width" />);
    expect(container.querySelector('.fq-banner__chevron')).toBeInTheDocument();
  });

  it('does not show chevron for sectional layout', () => {
    const { container } = render(<Banner title="Info" />);
    expect(
      container.querySelector('.fq-banner__chevron'),
    ).not.toBeInTheDocument();
  });

  it('does not show dismiss button for full-width even when dismissible=true', () => {
    render(<Banner title="Info" layout="full-width" dismissible />);
    expect(
      screen.queryByRole('button', { name: 'Dismiss' }),
    ).not.toBeInTheDocument();
  });

  // ── full-width keyboard accessibility ──────────────────────

  it('full-width banner is focusable (tabIndex=0)', () => {
    render(<Banner title="Info" layout="full-width" />);
    expect(screen.getByRole('alert')).toHaveAttribute('tabindex', '0');
  });

  it('sectional banner has no tabIndex by default', () => {
    render(<Banner title="Info" />);
    expect(screen.getByRole('alert')).not.toHaveAttribute('tabindex');
  });

  it('full-width Enter key fires onClick', () => {
    const onClick = vi.fn();
    render(<Banner title="Info" layout="full-width" onClick={onClick} />);
    fireEvent.keyDown(screen.getByRole('alert'), { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('full-width Space key fires onClick', () => {
    const onClick = vi.fn();
    render(<Banner title="Info" layout="full-width" onClick={onClick} />);
    fireEvent.keyDown(screen.getByRole('alert'), { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('sectional banner does not fire onClick on Enter keydown', () => {
    const onClick = vi.fn();
    render(<Banner title="Info" onClick={onClick} />);
    fireEvent.keyDown(screen.getByRole('alert'), { key: 'Enter' });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('consumer-supplied tabIndex overrides full-width default', () => {
    render(<Banner title="Info" layout="full-width" tabIndex={-1} />);
    expect(screen.getByRole('alert')).toHaveAttribute('tabindex', '-1');
  });
});
