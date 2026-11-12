import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Select } from './Select';

const renderOptions = () => (
  <>
    <option value="">Select a country</option>
    <option value="id">Indonesia</option>
    <option value="sg">Singapore</option>
  </>
);

describe('Select', () => {
  it('preserves custom className', () => {
    render(<Select className="custom-select" aria-label="Country" />);

    expect(screen.getByRole('combobox')).toHaveClass(
      'fq-select',
      'custom-select',
    );
  });

  it('renders label and select', () => {
    render(<Select label="Country">{renderOptions()}</Select>);

    expect(
      screen.getByRole('combobox', {
        name: 'Country',
      }),
    ).toBeInTheDocument();
  });

  it('associates label with select', () => {
    render(<Select label="Country">{renderOptions()}</Select>);

    const select = screen.getByRole('combobox', {
      name: 'Country',
    });

    expect(select.id).not.toBe('');

    expect(
      document.querySelector(`label[for="${select.id}"]`),
    ).toBeInTheDocument();
  });

  it('supports custom id', () => {
    render(
      <Select id="country" label="Country">
        {renderOptions()}
      </Select>,
    );

    expect(
      screen.getByRole('combobox', {
        name: 'Country',
      }),
    ).toHaveAttribute('id', 'country');
  });

  it('generates unique ids for multiple selects', () => {
    render(
      <>
        <Select label="Country">{renderOptions()}</Select>

        <Select label="Language">
          <option value="">Select a language</option>
          <option value="id">Indonesian</option>
          <option value="en">English</option>
        </Select>
      </>,
    );

    const country = screen.getByRole('combobox', {
      name: 'Country',
    });

    const language = screen.getByRole('combobox', {
      name: 'Language',
    });

    expect(country.id).not.toBe('');
    expect(language.id).not.toBe('');
    expect(country.id).not.toBe(language.id);
  });

  it('supports selected value', () => {
    render(
      <Select label="Country" defaultValue="id">
        {renderOptions()}
      </Select>,
    );

    expect(
      screen.getByRole('combobox', {
        name: 'Country',
      }),
    ).toHaveValue('id');
  });

  it('supports required state', () => {
    render(
      <Select label="Country" required>
        {renderOptions()}
      </Select>,
    );

    expect(
      screen.getByRole('combobox', {
        name: 'Country',
      }),
    ).toBeRequired();
  });

  it('supports disabled state', () => {
    render(
      <Select label="Country" disabled>
        {renderOptions()}
      </Select>,
    );

    expect(
      screen.getByRole('combobox', {
        name: 'Country',
      }),
    ).toBeDisabled();
  });

  it('supports helper text', () => {
    render(
      <Select label="Country" helperText="Select your current country.">
        {renderOptions()}
      </Select>,
    );

    const select = screen.getByRole('combobox', {
      name: 'Country',
    });

    const message = screen.getByText('Select your current country.');

    expect(message).toBeInTheDocument();

    expect(select).toHaveAttribute('aria-describedby', message.id);
  });

  it('exposes error state', () => {
    render(
      <Select label="Country" error="Country is required.">
        {renderOptions()}
      </Select>,
    );

    const select = screen.getByRole('combobox', {
      name: 'Country',
    });

    const message = screen.getByText('Country is required.');

    expect(select).toHaveAttribute('aria-invalid', 'true');

    expect(select).toHaveAttribute('aria-describedby', message.id);
  });

  it('prioritizes error message over helper text', () => {
    render(
      <Select
        label="Country"
        helperText="Select your current country."
        error="Country is required."
      >
        {renderOptions()}
      </Select>,
    );

    expect(screen.getByText('Country is required.')).toBeInTheDocument();

    expect(
      screen.queryByText('Select your current country.'),
    ).not.toBeInTheDocument();
  });

  it('preserves custom aria-describedby', () => {
    render(
      <Select label="Country" aria-describedby="custom-description">
        {renderOptions()}
      </Select>,
    );

    expect(
      screen.getByRole('combobox', {
        name: 'Country',
      }),
    ).toHaveAttribute('aria-describedby', 'custom-description');
  });

  it('renders provided options', () => {
    render(<Select label="Country">{renderOptions()}</Select>);

    expect(
      screen.getByRole('option', {
        name: 'Indonesia',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: 'Singapore',
      }),
    ).toBeInTheDocument();
  });
  it('supports ReactNode label', () => {
    render(
      <Select
        label={
          <>
            Country <strong>selection</strong>
          </>
        }
      >
        {renderOptions()}
      </Select>,
    );

    expect(screen.getByText('selection')).toBeInTheDocument();
  });

  it('supports ReactNode helper text', () => {
    render(
      <Select
        label="Country"
        helperText={
          <>
            Choose your <strong>country</strong>.
          </>
        }
      >
        {renderOptions()}
      </Select>,
    );

    expect(screen.getByText('country')).toBeInTheDocument();
  });

  it('supports ReactNode error', () => {
    render(
      <Select
        label="Country"
        error={
          <>
            Country is required. <a href="/help">Learn more</a>
          </>
        }
      >
        {renderOptions()}
      </Select>,
    );

    expect(
      screen.getByRole('link', {
        name: 'Learn more',
      }),
    ).toBeInTheDocument();
  });

  it('forwards ref to the native select', () => {
    const ref = {
      current: null,
    } as {
      current: HTMLSelectElement | null;
    };

    render(
      <Select ref={ref} label="Country">
        {renderOptions()}
      </Select>,
    );

    expect(ref.current).toBe(
      screen.getByRole('combobox', {
        name: 'Country',
      }),
    );
  });

  it('forwards onChange event', () => {
    let changedValue = '';

    const handleChange = vi.fn((event) => {
      changedValue = event.target.value;
    });

    render(
      <Select aria-label="Country" defaultValue="" onChange={handleChange}>
        <option value="">Select</option>
        <option value="id">Indonesia</option>
      </Select>,
    );

    fireEvent.change(screen.getByRole('combobox'), {
      target: {
        value: 'id',
      },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(changedValue).toBe('id');
  });

  it('supports controlled value', () => {
    let changedValue = '';

    const handleChange = vi.fn((event) => {
      changedValue = event.target.value;
    });

    render(
      <Select aria-label="Country" value="id" onChange={handleChange}>
        <option value="">Select</option>
        <option value="id">Indonesia</option>
        <option value="sg">Singapore</option>
      </Select>,
    );

    const select = screen.getByRole('combobox');

    expect(select).toHaveValue('id');

    fireEvent.change(select, {
      target: {
        value: 'sg',
      },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(changedValue).toBe('sg');
    expect(select).toHaveValue('id');
  });
});
