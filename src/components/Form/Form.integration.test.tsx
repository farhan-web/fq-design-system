import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../Button/Button';
import { Field } from '../Field/Field';
import { Input } from '../Input/Input';
import { Form } from './Form';

describe('Form integration', () => {
  it('composes Form, Field, and Input', () => {
    render(
      <Form aria-label="Login form">
        <Field label="Email">
          <Input />
        </Field>
      </Form>,
    );

    const input = screen.getByRole('textbox', {
      name: 'Email',
    });

    expect(input).toBeInTheDocument();

    expect(input).toHaveAttribute('id');

    expect(
      screen.getByText('Email'),
    ).toHaveAttribute(
      'for',
      input.getAttribute('id'),
    );
  });

  it('submits composed form', () => {
    const handleSubmit = vi.fn((event) => {
      event.preventDefault();
    });

    render(
      <Form
        aria-label="Login form"
        onSubmit={handleSubmit}
      >
        <Field label="Email">
          <Input />
        </Field>

        <Button type="submit">
          Login
        </Button>
      </Form>,
    );

    fireEvent.submit(
      screen.getByRole('form', {
        name: 'Login form',
      }),
    );

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
  it('preserves Field validation state inside Form', () => {
    render(
      <Form aria-label="Login form">
        <Field
          label="Email"
          description="Use your work email"
          error="Invalid email"
        >
          <Input />
        </Field>
      </Form>,
    );

    const input = screen.getByRole('textbox', {
      name: 'Email',
    });

    expect(input).toHaveAttribute(
      'aria-invalid',
      'true',
    );

    const describedBy =
      input.getAttribute('aria-describedby');

    expect(describedBy).toContain(
      `${input.getAttribute('id')}-description`,
    );

    expect(describedBy).toContain(
      `${input.getAttribute('id')}-error`,
    );

    expect(
      screen.getByText('Use your work email'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Invalid email'),
    ).toBeInTheDocument();
  });

});
