import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Radio } from './Radio';

describe('Radio', () => {
  it('renders label and radio', () => {
    render(
      <Radio
        label="Cash"
        name="payment"
      />,
    );

    expect(
      screen.getByRole('radio', {
        name: 'Cash',
      }),
    ).toBeInTheDocument();
  });

  it('associates label with radio', () => {
    render(
      <Radio
        label="Cash"
        name="payment"
      />,
    );

    const radio = screen.getByRole('radio', {
      name: 'Cash',
    });

    expect(radio).toHaveAttribute('id');

    expect(
      document.querySelector(
        `label[for="${radio.id}"]`,
      ),
    ).toBeInTheDocument();
  });

  it('generates unique ids for multiple radios', () => {
    render(
      <>
        <Radio
          label="Cash"
          name="payment"
        />

        <Radio
          label="Card"
          name="payment"
        />
      </>,
    );

    const cash = screen.getByRole('radio', {
      name: 'Cash',
    });

    const card = screen.getByRole('radio', {
      name: 'Card',
    });

    expect(cash.id).not.toBe('');
    expect(card.id).not.toBe('');
    expect(cash.id).not.toBe(card.id);
  });

  it('supports checked state', () => {
    render(
      <Radio
        label="Cash"
        name="payment"
        checked
        readOnly
      />,
    );

    expect(
      screen.getByRole('radio', {
        name: 'Cash',
      }),
    ).toBeChecked();
  });

  it('supports disabled state', () => {
    render(
      <Radio
        label="Cash"
        name="payment"
        disabled
      />,
    );

    expect(
      screen.getByRole('radio', {
        name: 'Cash',
      }),
    ).toBeDisabled();
  });

  it('supports required state', () => {
    render(
      <Radio
        label="Cash"
        name="payment"
        required
      />,
    );

    expect(
      screen.getByRole('radio', {
        name: 'Cash',
      }),
    ).toBeRequired();
  });

  it('supports helper text', () => {
    render(
      <Radio
        label="Cash"
        name="payment"
        helperText="Pay when your order arrives."
      />,
    );

    const radio = screen.getByRole('radio', {
      name: 'Cash',
    });

    const message = screen.getByText(
      'Pay when your order arrives.',
    );

    expect(message).toBeInTheDocument();

    expect(radio).toHaveAttribute(
      'aria-describedby',
      message.id,
    );
  });

  it('exposes error state', () => {
    render(
      <Radio
        label="Cash"
        name="payment"
        error="Please select a payment method."
      />,
    );

    const radio = screen.getByRole('radio', {
      name: 'Cash',
    });

    const message = screen.getByText(
      'Please select a payment method.',
    );

    expect(radio).toHaveAttribute(
      'aria-invalid',
      'true',
    );

    expect(radio).toHaveAttribute(
      'aria-describedby',
      message.id,
    );
  });

  it('prioritizes error message over helper text', () => {
    render(
      <Radio
        label="Cash"
        name="payment"
        helperText="Choose your preferred method."
        error="Please select a payment method."
      />,
    );

    expect(
      screen.getByText(
        'Please select a payment method.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        'Choose your preferred method.',
      ),
    ).not.toBeInTheDocument();
  });

  it('preserves radio group name and value', () => {
    render(
      <Radio
        label="Cash"
        name="payment"
        value="cash"
      />,
    );

    const radio = screen.getByRole('radio', {
      name: 'Cash',
    });

    expect(radio).toHaveAttribute(
      'name',
      'payment',
    );

    expect(radio).toHaveAttribute(
      'value',
      'cash',
    );
  });
});
