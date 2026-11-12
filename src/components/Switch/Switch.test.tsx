import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from './Switch';

describe('Switch', () => {
  it('preserves custom className', () => {
    render(<Switch label="Notifications" className="custom-switch" />);

    expect(
      screen.getByRole('switch', {
        name: 'Notifications',
      }),
    ).toHaveClass('fq-switch__input', 'custom-switch');
  });

  it('renders label and switch', () => {
    render(<Switch label="Notifications" />);

    expect(
      screen.getByRole('switch', {
        name: 'Notifications',
      }),
    ).toBeInTheDocument();
  });

  it('associates label with switch', () => {
    render(<Switch label="Notifications" />);

    const switchElement = screen.getByRole('switch', {
      name: 'Notifications',
    });

    expect(switchElement).toHaveAttribute('id');

    expect(
      document.querySelector(`label[for="${switchElement.id}"]`),
    ).toBeInTheDocument();
  });

  it('generates unique ids for multiple switches', () => {
    render(
      <>
        <Switch label="Email" />
        <Switch label="Push" />
      </>,
    );

    const email = screen.getByRole('switch', {
      name: 'Email',
    });

    const push = screen.getByRole('switch', {
      name: 'Push',
    });

    expect(email.id).not.toBe('');
    expect(push.id).not.toBe('');
    expect(email.id).not.toBe(push.id);
  });

  it('supports checked state', () => {
    render(<Switch label="Notifications" checked readOnly />);

    expect(
      screen.getByRole('switch', {
        name: 'Notifications',
      }),
    ).toBeChecked();
  });

  it('supports disabled state', () => {
    render(<Switch label="Notifications" disabled />);

    expect(
      screen.getByRole('switch', {
        name: 'Notifications',
      }),
    ).toBeDisabled();
  });

  it('supports required state', () => {
    render(<Switch label="Notifications" required />);

    expect(
      screen.getByRole('switch', {
        name: 'Notifications',
      }),
    ).toBeRequired();
  });

  it('supports helper text', () => {
    render(
      <Switch label="Notifications" helperText="Receive activity updates." />,
    );

    const switchElement = screen.getByRole('switch', {
      name: 'Notifications',
    });

    const message = screen.getByText('Receive activity updates.');

    expect(message).toBeInTheDocument();

    expect(switchElement).toHaveAttribute('aria-describedby', message.id);
  });

  it('exposes error state', () => {
    render(
      <Switch
        label="Notifications"
        error="Notification preference is required."
      />,
    );

    const switchElement = screen.getByRole('switch', {
      name: 'Notifications',
    });

    const message = screen.getByText('Notification preference is required.');

    expect(switchElement).toHaveAttribute('aria-invalid', 'true');

    expect(switchElement).toHaveAttribute('aria-describedby', message.id);
  });

  it('prioritizes error message over helper text', () => {
    render(
      <Switch
        label="Notifications"
        helperText="Choose whether to receive updates."
        error="Notification preference is required."
      />,
    );

    expect(
      screen.getByText('Notification preference is required.'),
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Choose whether to receive updates.'),
    ).not.toBeInTheDocument();
  });

  it('supports ReactNode label', () => {
    render(
      <Switch label={<span data-testid="switch-label">Notifications</span>} />,
    );

    expect(screen.getByTestId('switch-label')).toBeInTheDocument();
  });

  it('supports ReactNode helper text', () => {
    render(
      <Switch
        label="Notifications"
        helperText={<span data-testid="switch-helper">Receive updates.</span>}
      />,
    );

    expect(screen.getByTestId('switch-helper')).toBeInTheDocument();
  });

  it('supports ReactNode error', () => {
    render(
      <Switch
        label="Notifications"
        error={<span data-testid="switch-error">Preference is required.</span>}
      />,
    );

    expect(screen.getByTestId('switch-error')).toBeInTheDocument();

    expect(
      screen.getByRole('switch', {
        name: 'Notifications',
      }),
    ).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards ref to the native switch', () => {
    const ref = createRef<HTMLInputElement>();

    render(<Switch ref={ref} label="Notifications" />);

    expect(ref.current).toBe(
      screen.getByRole('switch', {
        name: 'Notifications',
      }),
    );
  });

  it('uses switch semantics', () => {
    render(<Switch label="Notifications" />);

    const switchElement = screen.getByRole('switch', {
      name: 'Notifications',
    });

    expect(switchElement).toHaveAttribute('role', 'switch');

    expect(switchElement).toHaveAttribute('type', 'checkbox');
  });

  it('forwards onChange event', () => {
    const handleChange = vi.fn();

    render(<Switch label="Notifications" onChange={handleChange} />);

    fireEvent.click(screen.getByRole('switch'));

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('supports defaultChecked', () => {
    render(<Switch label="Notifications" defaultChecked />);

    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('supports controlled checked state', () => {
    let checked = false;

    const handleChange = vi.fn((event) => {
      checked = event.target.checked;
    });

    render(
      <Switch label="Notifications" checked={false} onChange={handleChange} />,
    );

    const switchElement = screen.getByRole('switch');

    expect(switchElement).not.toBeChecked();

    fireEvent.click(switchElement);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checked).toBe(true);

    expect(switchElement).not.toBeChecked();
  });
});
