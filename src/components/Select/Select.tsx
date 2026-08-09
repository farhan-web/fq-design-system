import {
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';

import { useFormField } from '../../hooks/useFormField';

import './Select.css';

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
}

export function Select({
  label,
  helperText,
  error,
  id,
  children,
  'aria-describedby': externalDescribedBy,
  ...props
}: SelectProps) {
  const {
    id: selectId,
    message,
    messageId,
    describedBy,
    invalid,
  } = useFormField({
    id,
    helperText,
    error,
    describedBy: externalDescribedBy,
  });

  return (
    <div
      className={[
        'fq-select-field',
        error ? 'fq-select-field--error' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <label
        className="fq-select-field__label"
        htmlFor={selectId}
      >
        {label}

        {props.required && (
          <span
            className="fq-select-field__required"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      <select
        {...props}
        id={selectId}
        className="fq-select"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      >
        {children}
      </select>

      {message && (
        <div
          id={messageId}
          className="fq-select-field__message"
        >
          {message}
        </div>
      )}
    </div>
  );
}