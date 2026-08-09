import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import './Radio.css';

export interface RadioProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type'
  > {
  label: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
}

export function Radio({
  label,
  helperText,
  error,
  id,
  ...props
}: RadioProps) {
  const generatedId = useId();
  const radioId = id ?? generatedId;

  const messageId = helperText || error
    ? `${radioId}-message`
    : undefined;

  const describedBy = props['aria-describedby'] ?? messageId;

  return (
    <div
      className={[
        'fq-radio-field',
        error ? 'fq-radio-field--error' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <label
        className="fq-radio"
        htmlFor={radioId}
      >
        <input
          {...props}
          id={radioId}
          type="radio"
          className="fq-radio__input"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
        />

        <span className="fq-radio__control" aria-hidden="true" />

        <span className="fq-radio__label">
          {label}
        </span>
      </label>

      {(error || helperText) && (
        <div
          id={messageId}
          className="fq-radio-field__message"
        >
          {error ?? helperText}
        </div>
      )}
    </div>
  );
}
