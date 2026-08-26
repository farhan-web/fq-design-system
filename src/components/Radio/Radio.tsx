import { forwardRef, type InputHTMLAttributes } from 'react';

import { useFieldContext } from '../Field/FieldContext';
import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

import './Radio.css';

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>, FormFieldProps {}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
      id: radioId,
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
        className={['fq-radio-field', error ? 'fq-radio-field--error' : '']
          .filter(Boolean)
          .join(' ')}
      >
        <label className="fq-radio" htmlFor={radioId}>
          <input
            {...props}
            ref={ref}
            id={radioId}
            type="radio"
            required={isRequired}
            className={['fq-radio__input', className ?? '']
              .filter(Boolean)
              .join(' ')}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
          />

          <span className="fq-radio__control" aria-hidden="true" />

          <span className="fq-radio__label">{label}</span>
        </label>

        {message && (
          <div id={messageId} className="fq-radio-field__message">
            {message}
          </div>
        )}
      </div>
    );
  },
);

Radio.displayName = 'Radio';
