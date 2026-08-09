import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

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
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;

  const messageId =
    helperText || error
      ? `${switchId}-message`
      : undefined;

  const describedBy =
    props['aria-describedby'] ?? messageId;

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
          aria-invalid={error ? 'true' : undefined}
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

      {(error || helperText) && (
        <div
          id={messageId}
          className="fq-switch-field__message"
        >
          {error ?? helperText}
        </div>
      )}
    </div>
  );
}
