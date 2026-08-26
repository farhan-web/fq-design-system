import { forwardRef, type SelectHTMLAttributes } from 'react';

import { useFieldContext } from '../Field/FieldContext';
import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

import './Select.css';

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>, FormFieldProps {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      id,
      required,
      className,
      children,
      'aria-describedby': externalDescribedBy,
      ...props
    },
    ref,
  ) => {
    const fieldContext = useFieldContext();

    const {
      id: selectId,
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
        className={['fq-select-field', error ? 'fq-select-field--error' : '']
          .filter(Boolean)
          .join(' ')}
      >
        {label && (
          <label className="fq-select-field__label" htmlFor={selectId}>
            {label}

            {isRequired && (
              <span className="fq-select-field__required" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <select
          {...props}
          ref={ref}
          id={selectId}
          required={isRequired}
          className={['fq-select', className ?? ''].filter(Boolean).join(' ')}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        >
          {children}
        </select>

        {message && (
          <div id={messageId} className="fq-select-field__message">
            {message}
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
