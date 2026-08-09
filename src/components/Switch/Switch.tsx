import {
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { useFormField } from '../../hooks/useFormField';

import './Switch.css';

export interface SwitchProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type'
  > {
  label: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
}

export function Switch({
  label,
  helperText,
  error,
  id,
  'aria-describedby': ariaDescribedBy,
  ...props
}: SwitchProps) {
  const {
    id: switchId,
    message,
    messageId,
    describedBy,
    invalid,
  } = useFormField({
    id,
    helperText,
    error,
    describedBy: ariaDescribedBy,
  });

  return (
    <div
      className={[
        'fq-switch-field',
        error ? 'fq-switch-field--error' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <label
        className="fq-switch"
        htmlFor={switchId}
      >
        <input
          {...props}
          id={switchId}
          type="checkbox"
          role="switch"
          className="fq-switch__input"
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />

        <span
          className="fq-switch__control"
          aria-hidden="true"
        >
          <span className="fq-switch__thumb" />
        </span>

        <span className="fq-switch__label">
          {label}
        </span>
      </label>

      {message && (
        <div
          id={messageId}
          className="fq-switch-field__message"
        >
          {message}
        </div>
      )}
    </div>
  );
}
