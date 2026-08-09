import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Radio } from './Radio';

describe('Radio', () => {

  it('preserves custom className', () => {
    render(
      <Radio
        label="Cash"
        name="payment"
        className="custom-radio"
      />,
    );

    expect(
      screen.getByRole('radio', {
        name: 'Cash',
      }),
    ).toHaveClass(
      'fq-radio__input',
      'custom-radio',
    );
  });

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

  it('groups radios by name', () => {
    render(
      <>
        <Radio
          label="Cash"
          name="payment"
          value="cash"
        />

        <Radio
          label="Card"
          name="payment"
          value="card"
        />
      </>,
    );

    const cash = screen.getByRole('radio', {
      name: 'Cash',
    });

    const card = screen.getByRole('radio', {
      name: 'Card',
    });

    expect(cash).toHaveAttribute(
      'name',
      'payment',
    );

    expect(card).toHaveAttribute(
      'name',
      'payment',
    );
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

  it('supports ReactNode label', () => {
    render(
      <Radio
        label={
          <>
            Payment <strong>method</strong>
          </>
        }
        name="payment"
      />,
    );

    expect(
      screen.getByText('method'),
    ).toBeInTheDocument();
  });

  it('supports ReactNode helper text', () => {
    render(
      <Radio
        label="Cash"
        name="payment"
        helperText={
          <>
            Pay with <strong>cash</strong>.
          </>
        }
      />,
    );

    expect(
      screen.getByText('cash'),
    ).toBeInTheDocument();
  });

  it('supports ReactNode error', () => {
    render(
      <Radio
        label="Cash"
        name="payment"
        error={
          <>
            Invalid payment.{' '}
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

  it('forwards ref to the native radio', () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <Radio
        ref={ref}
        label="Cash"
        name="payment"
      />,
    );

    expect(ref.current).toBe(
      screen.getByRole('radio', {
        name: 'Cash',
      }),
    );
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

  it('forwards onChange event', () => {
    let selectedValue = '';
    let checked = false;

    const handleChange = vi.fn((event) => {
      selectedValue = event.target.value;
      checked = event.target.checked;
    });

    render(
      <Radio
        label="Cash"
        name="payment"
        value="cash"
        onChange={handleChange}
      />,
    );

    fireEvent.click(
      screen.getByRole('radio'),
    );

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(selectedValue).toBe('cash');
    expect(checked).toBe(true);
  });


  it('supports defaultChecked', () => {
    render(
      <Radio
        label="Cash"
        name="payment"
        value="cash"
        defaultChecked
      />,
    );

    expect(
      screen.getByRole('radio'),
    ).toBeChecked();
  });

  it('supports controlled checked state', () => {
    let checked = false;

    const handleChange = vi.fn((event) => {
      checked = event.target.checked;
    });

    render(
      <Radio
        label="Cash"
        name="payment"
        value="cash"
        checked={false}
        onChange={handleChange}
      />,
    );

    const radio = screen.getByRole('radio');

    expect(radio).not.toBeChecked();

    fireEvent.click(radio);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checked).toBe(true);

    expect(radio).not.toBeChecked();
  });

});
