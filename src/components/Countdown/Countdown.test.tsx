import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Countdown } from './Countdown';

describe('Countdown', () => {
  it('renders with seconds', () => {
    render(<Countdown seconds={90} />);
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });

  it('displays minutes and seconds correctly', () => {
    render(<Countdown seconds={90} />);
    const segments = screen.getAllByText(/^\d{2}$/);
    // 01:30
    expect(segments[0]).toHaveTextContent('01');
    expect(segments[1]).toHaveTextContent('30');
  });

  it('shows 00:00 when expired', () => {
    render(<Countdown seconds={0} />);
    const segments = screen.getAllByText('00');
    expect(segments).toHaveLength(2);
  });

  it('calls onExpire when seconds reach 0', () => {
    const onExpire = vi.fn();
    render(<Countdown seconds={0} onExpire={onExpire} />);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('applies variant class', () => {
    render(<Countdown seconds={60} variant="warning" />);
    expect(screen.getByRole('timer')).toHaveClass('fq-countdown--warning');
  });

  it('applies expired class when done', () => {
    render(<Countdown seconds={0} />);
    expect(screen.getByRole('timer')).toHaveClass('fq-countdown--expired');
  });

  it('shows hours segment when showHours is true', () => {
    render(<Countdown seconds={3661} showHours />);
    const segments = screen.getAllByText(/^\d{2}$/);
    // 01:01:01
    expect(segments).toHaveLength(3);
  });

  it('has role="timer"', () => {
    render(<Countdown seconds={30} />);
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = { current: null } as { current: HTMLSpanElement | null };
    render(<Countdown seconds={10} ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('timer'));
  });
});
