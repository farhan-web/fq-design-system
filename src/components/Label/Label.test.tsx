import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Label } from './Label';

describe('Label', () => {
  it('renders children', () => {
    render(<Label>Active</Label>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies default variant and size', () => {
    render(<Label>Active</Label>);
    const el = screen.getByText('Active');
    expect(el).toHaveClass('fq-label', 'fq-label--neutral', 'fq-label--md');
  });

  it('applies variant class', () => {
    render(<Label variant="success">Active</Label>);
    expect(screen.getByText('Active')).toHaveClass('fq-label--success');
  });

  it('applies outline variant class', () => {
    render(<Label variant="outline-danger">Error</Label>);
    expect(screen.getByText('Error')).toHaveClass('fq-label--outline-danger');
  });

  it('applies size class', () => {
    render(<Label size="sm">Active</Label>);
    expect(screen.getByText('Active')).toHaveClass('fq-label--sm');
  });

  it('supports custom className', () => {
    render(<Label className="custom">X</Label>);
    expect(screen.getByText('X')).toHaveClass('fq-label', 'custom');
  });

  it('forwards ref', () => {
    const ref = { current: null } as { current: HTMLSpanElement | null };
    render(<Label ref={ref}>Ref</Label>);
    expect(ref.current).toBe(screen.getByText('Ref'));
  });

  it('forwards native attributes', () => {
    render(
      <Label data-testid="lbl" aria-label="status">
        OK
      </Label>,
    );
    expect(screen.getByTestId('lbl')).toHaveAttribute('aria-label', 'status');
  });
});
