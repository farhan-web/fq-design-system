import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Form } from './Form';

describe('Form', () => {
  it('renders native form element', () => {
    render(
      <Form aria-label="Login form">
        <input aria-label="Email" />
      </Form>,
    );

    expect(
      screen.getByRole('form', {
        name: 'Login form',
      }),
    ).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Form aria-label="Login form">
        <input aria-label="Email" />
        <button type="submit">Submit</button>
      </Form>,
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Email',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Submit',
      }),
    ).toBeInTheDocument();
  });

  it('forwards onSubmit event', () => {
    const handleSubmit = vi.fn((event) => {
      event.preventDefault();
    });

    render(
      <Form
        aria-label="Login form"
        onSubmit={handleSubmit}
      >
        <button type="submit">Submit</button>
      </Form>,
    );

    fireEvent.submit(
      screen.getByRole('form', {
        name: 'Login form',
      }),
    );

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('forwards ref to native form', () => {
    const ref = createRef<HTMLFormElement>();

    render(
      <Form
        ref={ref}
        aria-label="Login form"
      />,
    );

    expect(ref.current).toBe(
      screen.getByRole('form', {
        name: 'Login form',
      }),
    );
  });

  it('supports custom className', () => {
    render(
      <Form
        aria-label="Login form"
        className="custom-form"
      />,
    );

    expect(
      screen.getByRole('form', {
        name: 'Login form',
      }),
    ).toHaveClass('custom-form');
  });

  it('supports Field children', () => {
    render(
      <Form>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" />
        </div>
      </Form>,
    );

    expect(
      screen.getByLabelText('Email'),
    ).toBeInTheDocument();
  });

  it('forwards native form attributes', () => {
    render(
      <Form
        aria-label="Login form"
        id="login-form"
        noValidate
      />,
    );

    const form = screen.getByRole('form', {
      name: 'Login form',
    });

    expect(form).toHaveAttribute(
      'id',
      'login-form',
    );

    expect(form).toHaveAttribute(
      'novalidate',
    );
  });
});
