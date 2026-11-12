import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Save</Button>);

    expect(
      screen.getByRole('button', {
        name: 'Save',
      }),
    ).toBeInTheDocument();
  });

  it('uses button type by default', () => {
    render(<Button>Save</Button>);

    expect(
      screen.getByRole('button', {
        name: 'Save',
      }),
    ).toHaveAttribute('type', 'button');
  });

  it('supports native button type', () => {
    render(<Button type="submit">Save</Button>);

    expect(
      screen.getByRole('button', {
        name: 'Save',
      }),
    ).toHaveAttribute('type', 'submit');
  });

  it('is disabled when disabled is true', () => {
    render(<Button disabled>Save</Button>);

    expect(
      screen.getByRole('button', {
        name: 'Save',
      }),
    ).toBeDisabled();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Save</Button>);

    const button = screen.getByRole('button', {
      name: 'Save',
    });

    expect(button).toBeDisabled();

    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('does not expose aria-busy when not loading', () => {
    render(<Button>Save</Button>);

    expect(
      screen.getByRole('button', {
        name: 'Save',
      }),
    ).not.toHaveAttribute('aria-busy');
  });

  it('supports an accessible name for icon-only buttons', () => {
    render(
      <Button iconOnly aria-label="Delete">
        🗑️
      </Button>,
    );

    expect(
      screen.getByRole('button', {
        name: 'Delete',
      }),
    ).toBeInTheDocument();
  });

  it('supports variants', () => {
    render(<Button variant="danger">Delete</Button>);

    expect(
      screen.getByRole('button', {
        name: 'Delete',
      }),
    ).toHaveClass('fq-button', 'fq-button--danger');
  });

  it('supports sizes', () => {
    render(<Button size="lg">Save</Button>);

    expect(
      screen.getByRole('button', {
        name: 'Save',
      }),
    ).toHaveClass('fq-button--lg');
  });

  it('supports full width', () => {
    render(<Button fullWidth>Save</Button>);

    expect(
      screen.getByRole('button', {
        name: 'Save',
      }),
    ).toHaveClass('fq-button--full-width');
  });

  it('supports start icon', () => {
    render(
      <Button startIcon={<span data-testid="start-icon">+</span>}>Add</Button>,
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  it('supports end icon', () => {
    render(
      <Button endIcon={<span data-testid="end-icon">→</span>}>Next</Button>,
    );

    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('supports ReactNode children', () => {
    render(
      <Button>
        <span data-testid="button-content">Save changes</span>
      </Button>,
    );

    expect(screen.getByTestId('button-content')).toBeInTheDocument();
  });

  it('hides icons while loading', () => {
    render(
      <Button
        loading
        startIcon={<span data-testid="start-icon">+</span>}
        endIcon={<span data-testid="end-icon">→</span>}
      >
        Saving
      </Button>,
    );

    expect(screen.queryByTestId('start-icon')).not.toBeInTheDocument();

    expect(screen.queryByTestId('end-icon')).not.toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Saving',
      }),
    ).toBeDisabled();
  });

  it('supports custom className', () => {
    render(<Button className="custom-button">Save</Button>);

    expect(
      screen.getByRole('button', {
        name: 'Save',
      }),
    ).toHaveClass('fq-button', 'custom-button');
  });

  it('forwards ref to the native button', () => {
    const ref = { current: null } as {
      current: HTMLButtonElement | null;
    };

    render(<Button ref={ref}>Save</Button>);

    expect(ref.current).toBe(
      screen.getByRole('button', {
        name: 'Save',
      }),
    );
  });

  it('applies icon-only class', () => {
    render(
      <Button iconOnly aria-label="Save">
        +
      </Button>,
    );

    expect(
      screen.getByRole('button', {
        name: 'Save',
      }),
    ).toHaveClass('fq-button', 'fq-button--icon-only');
  });

  it('supports both start and end icons', () => {
    render(
      <Button
        startIcon={<span data-testid="start-icon">+</span>}
        endIcon={<span data-testid="end-icon">→</span>}
      >
        Continue
      </Button>,
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();

    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('forwards native attributes', () => {
    render(
      <Button
        data-testid="custom-button"
        aria-label="Save action"
        name="save"
        value="save"
      >
        Save
      </Button>,
    );

    const button = screen.getByTestId('custom-button');

    expect(button).toHaveAttribute('aria-label', 'Save action');

    expect(button).toHaveAttribute('name', 'save');

    expect(button).toHaveAttribute('value', 'save');
  });

  it('remains disabled when both disabled and loading are true', () => {
    render(
      <Button disabled loading>
        Saving
      </Button>,
    );

    const button = screen.getByRole('button', {
      name: 'Saving',
    });

    expect(button).toBeDisabled();

    expect(button).toHaveAttribute('aria-busy', 'true');
  });
});
