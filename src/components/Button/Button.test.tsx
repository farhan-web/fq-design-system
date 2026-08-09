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

  it('is disabled when disabled is true', () => {
    render(
      <Button disabled>
        Save
      </Button>,
    );

    expect(
      screen.getByRole('button', {
        name: 'Save',
      }),
    ).toBeDisabled();
  });

  it('is disabled when loading', () => {
    render(
      <Button loading>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', {
      name: 'Save',
    });

    expect(button).toBeDisabled();

    expect(button).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });
});
