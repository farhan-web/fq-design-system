import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies default variant class', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toHaveClass(
      'fq-badge',
      'fq-badge--solid-primary',
    );
  });

  it('applies variant class', () => {
    render(<Badge variant="soft-success">OK</Badge>);
    expect(screen.getByText('OK')).toHaveClass('fq-badge--soft-success');
  });

  it('dot mode renders no children', () => {
    render(<Badge dot data-testid="dot" />);
    expect(screen.getByTestId('dot')).toBeInTheDocument();
    expect(screen.getByTestId('dot')).toHaveClass('fq-badge--dot');
    expect(screen.getByTestId('dot')).toBeEmptyDOMElement();
  });

  it('applies count class', () => {
    render(<Badge count>3</Badge>);
    expect(screen.getByText('3')).toHaveClass('fq-badge--count');
  });

  it('supports custom className', () => {
    render(<Badge className="custom">X</Badge>);
    expect(screen.getByText('X')).toHaveClass('fq-badge', 'custom');
  });

  it('forwards ref', () => {
    const ref = { current: null } as { current: HTMLSpanElement | null };
    render(<Badge ref={ref}>Ref</Badge>);
    expect(ref.current).toBe(screen.getByText('Ref'));
  });

  it('forwards native attributes', () => {
    render(
      <Badge data-testid="badge" aria-label="notification count">
        5
      </Badge>,
    );
    expect(screen.getByTestId('badge')).toHaveAttribute(
      'aria-label',
      'notification count',
    );
  });

  it('applies gradient-red variant class', () => {
    render(<Badge variant="gradient-red">New</Badge>);
    expect(screen.getByText('New')).toHaveClass('fq-badge--gradient-red');
  });

  it('applies gradient-green variant class', () => {
    render(<Badge variant="gradient-green">Active</Badge>);
    expect(screen.getByText('Active')).toHaveClass('fq-badge--gradient-green');
  });

  it('disabled prop sets data-disabled attribute', () => {
    render(
      <Badge disabled data-testid="badge-disabled">
        Error
      </Badge>,
    );
    expect(screen.getByTestId('badge-disabled')).toHaveAttribute(
      'data-disabled',
    );
  });

  it('loading renders no children and applies shimmer class', () => {
    render(<Badge loading data-testid="badge-loading" />);
    const el = screen.getByTestId('badge-loading');
    expect(el).toHaveClass('fq-badge--loading');
    expect(el).toBeEmptyDOMElement();
  });
});
