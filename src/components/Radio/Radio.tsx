import {
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { useFormField } from '../../hooks/useFormField';

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
  'aria-describedby': ariaDescribedBy,
  ...props
}: RadioProps) {
  const {
    id: radioId,
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
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />

        <span
          className="fq-radio__control"
          aria-hidden="true"
        />

        <span className="fq-radio__label">
          {label}
        </span>
      </label>

      {message && (
        <div
          id={messageId}
          className="fq-radio-field__message"
        >
          {message}
        </div>
      )}
    </div>
  );
}
