import {
  render,
  screen,
} from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Field } from './Field';

describe('Field', () => {
  it('renders label and control', () => {
    render(
      <Field label="Email">
        <input id="email" />
      </Field>,
    );

    expect(
      screen.getByText('Email'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('textbox'),
    ).toBeInTheDocument();
  });

  it('associates label with control', () => {
    render(
      <Field label="Email">
        <input id="email" />
      </Field>,
    );

    expect(
      screen.getByText('Email'),
    ).toHaveAttribute(
      'for',
      'email',
    );
  });

  it('renders description', () => {
    render(
      <Field
        label="Email"
        description="Use your work email."
      >
        <input
          id="email"
          aria-describedby="email-description"
        />
      </Field>,
    );

    expect(
      screen.getByText(
        'Use your work email.',
      ),
    ).toBeInTheDocument();
  });

  it('renders error', () => {
    render(
      <Field
        label="Email"
        error="Email is invalid"
      >
        <input
          id="email"
          aria-invalid="true"
        />
      </Field>,
    );

    expect(
      screen.getByText(
        'Email is invalid',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('textbox'),
    ).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('generates an id for a control without one', () => {
    render(
      <Field label="Email">
        <input />
      </Field>,
    );

    const input = screen.getByRole('textbox');
    const label = screen.getByText('Email');

    expect(input).toHaveAttribute('id');
    expect(label).toHaveAttribute(
      'for',
      input.getAttribute('id'),
    );
  });

  it('preserves external aria-describedby', () => {
    render(
      <Field
        label="Email"
        description="Use your work email."
        error="Email is invalid"
      >
        <input
          id="email"
          aria-describedby="external-description"
        />
      </Field>,
    );

    expect(
      screen.getByRole('textbox'),
    ).toHaveAttribute(
      'aria-describedby',
      'external-description email-description email-error',
    );
  });

  it('preserves control props', () => {
    render(
      <Field label="Email">
        <input
          disabled
          name="email"
          className="custom-input"
          value="test"
          readOnly
        />
      </Field>,
    );

    const input = screen.getByRole('textbox');

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute(
      'name',
      'email',
    );
    expect(input).toHaveClass(
      'custom-input',
    );
    expect(input).toHaveValue('test');
  });

  it('preserves control ref', () => {
    const ref = { current: null };

    render(
      <Field label="Email">
        <input ref={ref} />
      </Field>,
    );

    expect(ref.current).toBeInstanceOf(
      HTMLInputElement,
    );
  });

  it('renders required indicator', () => {
    render(
      <Field
        label="Email"
        required
      >
        <input id="email" />
      </Field>,
    );

    expect(
      screen.getByText('*'),
    ).toBeInTheDocument();
  });
});
