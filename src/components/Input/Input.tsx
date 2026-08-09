import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

import './Input.css';

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    FormFieldProps {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      helperText,
      error,
      startIcon,
      endIcon,
      disabled,
      required,
      className,
      'aria-describedby': externalDescribedBy,
      'aria-invalid': externalInvalid,
      ...props
    },
    ref,
  ) => {
    const {
      id: inputId,
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

    const inputClassName = [
      'fq-input',
      error ? 'fq-input--error' : '',
      startIcon ? 'fq-input--has-start-icon' : '',
      endIcon ? 'fq-input--has-end-icon' : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="fq-input-field">
        {label && (
          <label
            className="fq-input-field__label"
            htmlFor={inputId}
          >
            {label}

            {required && (
              <span
                className="fq-input-field__required"
                aria-hidden="true"
              >
                *
              </span>
            )}
          </label>
        )}

        <div className="fq-input-field__control">
          {startIcon && (
            <span
              className="fq-input-field__icon fq-input-field__icon--start"
              aria-hidden="true"
            >
              {startIcon}
            </span>
          )}

          <input
            {...props}
            ref={ref}
            id={inputId}
            className={inputClassName}
            disabled={disabled}
            required={required}
            aria-invalid={
              invalid || externalInvalid
                ? true
                : undefined
            }
            aria-describedby={describedBy}
          />

          {endIcon && (
            <span
              className="fq-input-field__icon fq-input-field__icon--end"
              aria-hidden="true"
            >
              {endIcon}
            </span>
          )}
        </div>

        {message && (
          <p
            id={messageId}
            className={[
              'fq-input-field__message',
              error
                ? 'fq-input-field__message--error'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {message}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
