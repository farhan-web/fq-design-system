import {
  forwardRef,
  type TextareaHTMLAttributes,
} from 'react';

import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

import './Textarea.css';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    FormFieldProps {}

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(
  (
    {
      label,
      helperText,
      error,
      id,
      className,
      'aria-describedby': externalDescribedBy,
      ...props
    },
    ref,
  ) => {
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
      describedBy: externalDescribedBy,
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
          ref={ref}
          id={textareaId}
          className={[
            'fq-textarea',
            className ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
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
  },
);

Textarea.displayName = 'Textarea';
