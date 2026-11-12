import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Chips } from './Chips';

describe('Chips', () => {
  it('renders children', () => {
    render(<Chips>Filter</Chips>);
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
  });

  it('has type="button" by default', () => {
    render(<Chips>Filter</Chips>);
    expect(screen.getByRole('button', { name: 'Filter' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('sets aria-pressed when active', () => {
    render(<Chips active>Filter</Chips>);
    expect(screen.getByRole('button', { name: 'Filter' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('sets aria-pressed=false when inactive', () => {
    render(<Chips>Filter</Chips>);
    expect(screen.getByRole('button', { name: 'Filter' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('applies active class', () => {
    render(<Chips active>Filter</Chips>);
    expect(screen.getByRole('button', { name: 'Filter' })).toHaveClass(
      'fq-chips--active',
    );
  });

  it('applies error class', () => {
    render(<Chips error>Filter</Chips>);
    expect(screen.getByRole('button', { name: 'Filter' })).toHaveClass(
      'fq-chips--error',
    );
  });

  it('is disabled when disabled prop is set', () => {
    render(<Chips disabled>Filter</Chips>);
    expect(screen.getByRole('button', { name: 'Filter' })).toBeDisabled();
  });

  it('shows dismiss button when onDismiss is provided', () => {
    render(<Chips onDismiss={vi.fn()}>Tag</Chips>);
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss is clicked', () => {
    const onDismiss = vi.fn();
    render(<Chips onDismiss={onDismiss}>Tag</Chips>);
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('forwards ref', () => {
    const ref = { current: null } as { current: HTMLButtonElement | null };
    render(<Chips ref={ref}>Chip</Chips>);
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Chip' }));
  });
  it('keeps the primary ref and native props while dismiss is a sibling action', () => {
    const ref = { current: null } as { current: HTMLButtonElement | null };
    const click = vi.fn();
    const dismiss = vi.fn();
    render(
      <Chips
        ref={ref}
        id="filter"
        name="filter"
        onClick={click}
        onDismiss={dismiss}
      >
        Filter
      </Chips>,
    );
    const primary = screen.getByRole('button', { name: 'Filter' });
    const remove = screen.getByRole('button', { name: 'Remove' });
    expect(ref.current).toBe(primary);
    expect(primary).toHaveAttribute('name', 'filter');
    expect(primary).toHaveAttribute('id', 'filter');
    expect(primary).not.toContainElement(remove);
    expect(primary.nextElementSibling).toBe(remove);
    fireEvent.click(remove);
    expect(dismiss).toHaveBeenCalledTimes(1);
    expect(click).not.toHaveBeenCalled();
  });
  it('disables both native actions', () => {
    const dismiss = vi.fn();
    render(
      <Chips disabled onDismiss={dismiss}>
        Filter
      </Chips>,
    );
    for (const button of screen.getAllByRole('button'))
      expect(button).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(dismiss).not.toHaveBeenCalled();
  });
});
