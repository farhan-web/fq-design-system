import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {

  it('preserves custom className', () => {
    render(
      <Checkbox
        label="Remember me"
        className="custom-checkbox"
      />,
    );

    expect(
      screen.getByRole('checkbox', {
        name: 'Remember me',
      }),
    ).toHaveClass(
      'fq-checkbox__input',
      'custom-checkbox',
    );
  });

  it('renders label and checkbox', () => {
    render(
      <Checkbox label="Remember me" />,
    );

    expect(
      screen.getByRole('checkbox', {
        name: 'Remember me',
      }),
    ).toBeInTheDocument();
  });

  it('associates label with checkbox', () => {
    render(
      <Checkbox label="Remember me" />,
    );

    const checkbox = screen.getByRole('checkbox', {
      name: 'Remember me',
    });

    expect(checkbox).toHaveAttribute('id');

    expect(
      document.querySelector(
        `label[for="${checkbox.id}"]`,
      ),
    ).toBeInTheDocument();
  });

  it('generates unique ids for multiple checkboxes', () => {
    render(
      <>
        <Checkbox label="Option A" />
        <Checkbox label="Option B" />
      </>,
    );

    const first = screen.getByRole('checkbox', {
      name: 'Option A',
    });

    const second = screen.getByRole('checkbox', {
      name: 'Option B',
    });

    expect(first.id).not.toBe('');
    expect(second.id).not.toBe('');
    expect(first.id).not.toBe(second.id);
  });

  it('supports checked state', () => {
    render(
      <Checkbox
        label="Remember me"
        checked
        readOnly
      />,
    );

    expect(
      screen.getByRole('checkbox', {
        name: 'Remember me',
      }),
    ).toBeChecked();
  });

  it('supports disabled state', () => {
    render(
      <Checkbox
        label="Remember me"
        disabled
      />,
    );

    expect(
      screen.getByRole('checkbox', {
        name: 'Remember me',
      }),
    ).toBeDisabled();
  });

  it('supports required state', () => {
    render(
      <Checkbox
        label="Accept terms"
        required
      />,
    );

    expect(
      screen.getByRole('checkbox', {
        name: 'Accept terms',
      }),
    ).toBeRequired();
  });

  it('supports helper text', () => {
    render(
      <Checkbox
        label="Subscribe"
        helperText="Receive product updates."
      />,
    );

    const checkbox = screen.getByRole('checkbox', {
      name: 'Subscribe',
    });

    const message = screen.getByText(
      'Receive product updates.',
    );

    expect(message).toBeInTheDocument();

    expect(checkbox).toHaveAttribute(
      'aria-describedby',
      message.id,
    );
  });

  it('exposes error state', () => {
    render(
      <Checkbox
        label="Accept terms"
        error="You must accept the terms."
      />,
    );

    const checkbox = screen.getByRole('checkbox', {
      name: 'Accept terms',
    });

    const message = screen.getByText(
      'You must accept the terms.',
    );

    expect(checkbox).toHaveAttribute(
      'aria-invalid',
      'true',
    );

    expect(checkbox).toHaveAttribute(
      'aria-describedby',
      message.id,
    );
  });

  it('prioritizes error message over helper text', () => {
    render(
      <Checkbox
        label="Accept terms"
        helperText="Please review the terms."
        error="You must accept the terms."
      />,
    );

    expect(
      screen.getByText(
        'You must accept the terms.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        'Please review the terms.',
      ),
    ).not.toBeInTheDocument();
  });

  it('supports indeterminate state', () => {
    render(
      <Checkbox
        label="Select all"
        indeterminate
      />,
    );

    const checkbox = screen.getByRole('checkbox', {
      name: 'Select all',
    });

    expect(
      (checkbox as HTMLInputElement).indeterminate,
    ).toBe(true);
  });
  it('supports ReactNode label', () => {
    render(
      <Checkbox
        label={
          <>
            Accept <strong>terms</strong>
          </>
        }
      />,
    );

    expect(
      screen.getByText('terms'),
    ).toBeInTheDocument();
  });

  it('supports ReactNode helper text', () => {
    render(
      <Checkbox
        label="Subscribe"
        helperText={
          <>
            Receive <strong>product updates</strong>.
          </>
        }
      />,
    );

    expect(
      screen.getByText('product updates'),
    ).toBeInTheDocument();
  });

  it('supports ReactNode error', () => {
    render(
      <Checkbox
        label="Accept terms"
        error={
          <>
            You must accept the terms.{' '}
            <a href="/terms">Review terms</a>
          </>
        }
      />,
    );

    expect(
      screen.getByRole('link', {
        name: 'Review terms',
      }),
    ).toBeInTheDocument();
  });

  it('forwards ref to the native checkbox', () => {
    const ref = {
      current: null,
    } as {
      current: HTMLInputElement | null;
    };

    render(
      <Checkbox
        ref={ref}
        label="Remember me"
      />,
    );

    expect(ref.current).toBe(
      screen.getByRole('checkbox', {
        name: 'Remember me',
      }),
    );
  });


  it('forwards onChange event', () => {
    let checked = false;

    const handleChange = vi.fn((event) => {
      checked = event.target.checked;
    });

    render(
      <Checkbox
        label="Remember me"
        onChange={handleChange}
      />,
    );

    fireEvent.click(
      screen.getByRole('checkbox'),
    );

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checked).toBe(true);
  });


  it('supports defaultChecked', () => {
    render(
      <Checkbox
        label="Remember me"
        defaultChecked
      />,
    );

    expect(
      screen.getByRole('checkbox'),
    ).toBeChecked();
  });

  it('supports controlled checked state', () => {
    let checked = true;

    const handleChange = vi.fn((event) => {
      checked = event.target.checked;
    });

    render(
      <Checkbox
        label="Remember me"
        checked
        onChange={handleChange}
      />,
    );

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checked).toBe(false);

    expect(checkbox).toBeChecked();
  });

});
