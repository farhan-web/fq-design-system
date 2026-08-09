import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useRef } from 'react';
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

  it('forwards ref to the native input', () => {
    const TestComponent = () => {
      const ref = useRef<HTMLInputElement>(null);

      return (
        <Input
          ref={ref}
          label="Email"
        />
      );
    };

    render(<TestComponent />);

    const input = screen.getByLabelText('Email');

    expect(input).toHaveAttribute('id');
  });

  it('forwards ref to the native input', () => {
    const ref = {
      current: null,
    } as {
      current: HTMLInputElement | null;
    };

    render(
      <Input
        ref={ref}
        label="Email"
      />,
    );

    expect(ref.current).toBe(
      screen.getByLabelText('Email'),
    );
  });

  it('supports ReactNode label', () => {
    render(
      <Input
        label={
          <>
            Email <strong>address</strong>
          </>
        }
      />,
    );

    expect(
      screen.getByText('address'),
    ).toBeInTheDocument();
  });

  it('supports ReactNode helper text', () => {
    render(
      <Input
        label="Email"
        helperText={
          <>
            We will never share your{' '}
            <strong>email</strong>.
          </>
        }
      />,
    );

    expect(
      screen.getByText('email'),
    ).toBeInTheDocument();
  });

  it('supports ReactNode error', () => {
    render(
      <Input
        label="Email"
        error={
          <>
            Invalid email.{' '}
            <a href="/help">Learn more</a>
          </>
        }
      />,
    );

    expect(
      screen.getByRole('link', {
        name: 'Learn more',
      }),
    ).toBeInTheDocument();
  });


  it('forwards onChange event', () => {
    const handleChange = vi.fn();

    render(
      <Input
        aria-label="Email"
        onChange={handleChange}
      />,
    );

    fireEvent.change(
      screen.getByRole('textbox'),
      { target: { value: 'hello@example.com' } },
    );

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('forwards onBlur event', () => {
    const handleBlur = vi.fn();

    render(
      <Input
        aria-label="Email"
        onBlur={handleBlur}
      />,
    );

    fireEvent.blur(screen.getByRole('textbox'));

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('forwards onFocus event', () => {
    const handleFocus = vi.fn();

    render(
      <Input
        aria-label="Email"
        onFocus={handleFocus}
      />,
    );

    fireEvent.focus(screen.getByRole('textbox'));

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });


  it('supports defaultValue', () => {
    render(
      <Input
        aria-label="Email"
        defaultValue="hello@example.com"
      />,
    );

    expect(
      screen.getByRole('textbox'),
    ).toHaveValue('hello@example.com');
  });

  it('supports controlled value', () => {
    const handleChange = vi.fn();

    render(
      <Input
        aria-label="Email"
        value="hello@example.com"
        onChange={handleChange}
      />,
    );

    expect(
      screen.getByRole('textbox'),
    ).toHaveValue('hello@example.com');
  });

});
