import {
  forwardRef,
  type InputHTMLAttributes,
} from 'react';

import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

import './Radio.css';

export interface RadioProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'type'
    >,
    FormFieldProps {}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      helperText,
      error,
      id,
      'aria-describedby': externalDescribedBy,
      ...props
    },
    ref,
  ) => {
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
      describedBy: externalDescribedBy,
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
            ref={ref}
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
  },
);

Radio.displayName = 'Radio';
