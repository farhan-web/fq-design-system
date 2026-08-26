import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { useFieldContext } from '../Field/FieldContext';
import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

import './Textarea.css';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>, FormFieldProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      id,
      required,
      className,
      'aria-describedby': externalDescribedBy,
      ...props
    },
    ref,
  ) => {
    const fieldContext = useFieldContext();

    const {
      id: textareaId,
      message,
      messageId,
      describedBy: localDescribedBy,
      invalid: localInvalid,
    } = useFormField({
      id: fieldContext?.id ?? id,
      helperText,
      error,
      describedBy: externalDescribedBy,
    });

    const describedBy =
      [fieldContext?.describedBy, localDescribedBy].filter(Boolean).join(' ') ||
      undefined;

    const invalid = (fieldContext?.invalid ?? false) || localInvalid;

    const isRequired = (fieldContext?.required ?? false) || required;

    return (
      <div
        className={[
          'fq-textarea-field',
          error ? 'fq-textarea-field--error' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <label className="fq-textarea-field__label" htmlFor={textareaId}>
          {label}

          {isRequired && (
            <span className="fq-textarea-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <textarea
          {...props}
          ref={ref}
          id={textareaId}
          required={isRequired}
          className={['fq-textarea', className ?? ''].filter(Boolean).join(' ')}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />

        {message && (
          <div id={messageId} className="fq-textarea-field__message">
            {message}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
