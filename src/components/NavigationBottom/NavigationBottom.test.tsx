import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { NavigationBottom } from './NavigationBottom';

const items = [
  { value: 'home', label: 'Home', icon: <span>🏠</span> },
  { value: 'search', label: 'Search', icon: <span>🔍</span> },
  { value: 'trips', label: 'Trips', icon: <span>✈️</span> },
  { value: 'account', label: 'Account', icon: <span>👤</span> },
];

describe('NavigationBottom', () => {
  it('renders all nav items as buttons', () => {
    render(
      <NavigationBottom items={items} value="home" onValueChange={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Trips' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Account' })).toBeInTheDocument();
  });

  it('marks active item with aria-current="page"', () => {
    render(
      <NavigationBottom items={items} value="search" onValueChange={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Search' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: 'Home' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('inactive items do not have aria-current', () => {
    render(
      <NavigationBottom items={items} value="home" onValueChange={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Search' })).not.toHaveAttribute(
      'aria-current',
    );
    expect(screen.getByRole('button', { name: 'Trips' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('applies active class to selected item', () => {
    render(
      <NavigationBottom items={items} value="home" onValueChange={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Home' })).toHaveClass(
      'fq-nav-bottom__item--active',
    );
  });

  it('calls onValueChange when item is clicked', () => {
    const onChange = vi.fn();
    render(
      <NavigationBottom items={items} value="home" onValueChange={onChange} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onChange).toHaveBeenCalledWith('search');
  });

  it('renders as nav landmark', () => {
    render(
      <NavigationBottom items={items} value="home" onValueChange={vi.fn()} />,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('disabled item cannot be clicked', () => {
    const onChange = vi.fn();
    const withDisabled = [
      ...items,
      { value: 'more', label: 'More', icon: <span>⋯</span>, disabled: true },
    ];
    render(
      <NavigationBottom
        items={withDisabled}
        value="home"
        onValueChange={onChange}
      />,
    );
    expect(screen.getByRole('button', { name: 'More' })).toBeDisabled();
  });

  it('forwards ref', () => {
    const ref = { current: null } as { current: HTMLElement | null };
    render(
      <NavigationBottom
        items={items}
        value="home"
        onValueChange={vi.fn()}
        ref={ref}
      />,
    );
    expect(ref.current).toBe(screen.getByRole('navigation'));
  });
});
