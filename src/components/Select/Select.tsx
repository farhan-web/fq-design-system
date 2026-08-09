import {
  forwardRef,
  type SelectHTMLAttributes,
} from 'react';

import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

import './Select.css';

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>,
    FormFieldProps {}

export const Select = forwardRef<
  HTMLSelectElement,
  SelectProps
>(
  (
    {
      label,
      helperText,
      error,
      id,
      className,
      children,
      'aria-describedby': externalDescribedBy,
      ...props
    },
    ref,
  ) => {
    const {
      id: selectId,
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
          'fq-select-field',
          error ? 'fq-select-field--error' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <label
          className="fq-select-field__label"
          htmlFor={selectId}
        >
          {label}

          {props.required && (
            <span
              className="fq-select-field__required"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>

        <select
          {...props}
          ref={ref}
          id={selectId}
          className={[
            'fq-select',
            className ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        >
          {children}
        </select>

        {message && (
          <div
            id={messageId}
            className="fq-select-field__message"
          >
            {message}
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
