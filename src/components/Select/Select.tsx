import {
  useId,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';

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
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  const messageId =
    helperText || error
      ? `${selectId}-message`
      : undefined;

  const describedBy =
    props['aria-describedby'] ?? messageId;

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
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
      >
        {children}
      </select>

      {(error || helperText) && (
        <div
          id={messageId}
          className="fq-select-field__message"
        >
          {error ?? helperText}
        </div>
      )}
    </div>
  );
}
