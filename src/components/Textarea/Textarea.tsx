import {
  useId,
  type TextareaHTMLAttributes,
  type ReactNode,
} from 'react';

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
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  const messageId =
    helperText || error
      ? `${textareaId}-message`
      : undefined;

  const describedBy =
    props['aria-describedby'] ?? messageId;

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
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
      />

      {(error || helperText) && (
        <div
          id={messageId}
          className="fq-textarea-field__message"
        >
          {error ?? helperText}
        </div>
      )}
    </div>
  );
}
