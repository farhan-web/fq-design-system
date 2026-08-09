import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Input } from './Input';

describe('Input', () => {
  it('renders label and input', () => {
    render(
      <Input
        label="Email"
        placeholder="Enter your email"
      />,
    );

    expect(
      screen.getByLabelText('Email'),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('Enter your email'),
    ).toBeInTheDocument();
  });

  it('associates label with input', () => {
    render(
      <Input label="Email" />,
    );

    const input = screen.getByLabelText('Email');
    const label = screen.getByText('Email');

    expect(input).toHaveAttribute('id');
    expect(label).toHaveAttribute(
      'for',
      input.getAttribute('id'),
    );
  });

  it('generates unique ids for multiple inputs', () => {
    render(
      <>
        <Input label="First name" />
        <Input label="Last name" />
      </>,
    );

    const firstInput = screen.getByLabelText('First name');
    const lastInput = screen.getByLabelText('Last name');

    expect(firstInput.id).not.toBe('');
    expect(lastInput.id).not.toBe('');
    expect(firstInput.id).not.toBe(lastInput.id);
  });

  it('supports helper text', () => {
    render(
      <Input
        label="Email"
        helperText="We'll never share your email."
      />,
    );

    const input = screen.getByLabelText('Email');
    const helperText = screen.getByText(
      "We'll never share your email.",
    );

    expect(helperText).toBeInTheDocument();

    expect(input).toHaveAttribute(
      'aria-describedby',
      helperText.id,
    );
  });

  it('exposes error state', () => {
    render(
      <Input
        label="Email"
        error="Invalid email address."
      />,
    );

    const input = screen.getByLabelText('Email');
    const errorMessage = screen.getByText(
      'Invalid email address.',
    );

    expect(input).toHaveAttribute(
      'aria-invalid',
      'true',
    );

    expect(input).toHaveAttribute(
      'aria-describedby',
      errorMessage.id,
    );
  });

  it('supports required state', () => {
    render(
      <Input
        label="Email"
        required
      />,
    );

    expect(
      screen.getByRole('textbox', {
        name: /Email/,
      }),
    ).toBeRequired();
  });

  it('supports disabled state', () => {
    render(
      <Input
        label="Email"
        disabled
      />,
    );

    expect(
      screen.getByLabelText('Email'),
    ).toBeDisabled();
  });

  it('supports readOnly state', () => {
    render(
      <Input
        label="Email"
        readOnly
      />,
    );

    expect(
      screen.getByLabelText('Email'),
    ).toHaveAttribute(
      'readonly',
    );
  });

  it('renders start icon', () => {
    render(
      <Input
        label="Search"
        startIcon={<span data-testid="start-icon">🔍</span>}
      />,
    );

    expect(
      screen.getByTestId('start-icon'),
    ).toBeInTheDocument();
  });

  it('renders end icon', () => {
    render(
      <Input
        label="Email"
        endIcon={<span data-testid="end-icon">✉</span>}
      />,
    );

    expect(
      screen.getByTestId('end-icon'),
    ).toBeInTheDocument();
  });
});
