import {
  type TextareaHTMLAttributes,
  type ReactNode,
} from 'react';

import { useFormField } from '../../hooks/useFormField';

import './Textarea.css';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
}

export function Textarea({
  label,
  helperText,
  error,
  id,
  'aria-describedby': ariaDescribedBy,
  ...props
}: TextareaProps) {
  const {
    id: textareaId,
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
        'fq-textarea-field',
        error ? 'fq-textarea-field--error' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <label
        className="fq-textarea-field__label"
        htmlFor={textareaId}
      >
        {label}

        {props.required && (
          <span
            className="fq-textarea-field__required"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      <textarea
        {...props}
        id={textareaId}
        className="fq-textarea"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      />

      {message && (
        <div
          id={messageId}
          className="fq-textarea-field__message"
        >
          {message}
        </div>
      )}
    </div>
  );
}
