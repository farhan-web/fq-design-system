import { getSlotProps, type FqSlotCustomization } from '../../types/slots';
import { forwardRef, type SelectHTMLAttributes } from 'react';

import { useFieldContext } from '../Field/FieldContext';
import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

import './Select.css';

export interface SelectProps
  extends
    SelectHTMLAttributes<HTMLSelectElement>,
    FormFieldProps,
    FqSlotCustomization<
      'root' | 'label' | 'required' | 'select' | 'helperText'
    > {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      id,
      required,
      className,
      style,
      classNames,
      slotProps,
      children,
      'aria-describedby': externalDescribedBy,
      ...props
    },
    ref,
  ) => {
    const slots = { classNames, slotProps };
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
        {...getSlotProps(
          slots,
          'root',
          ['fq-select-field', error ? 'fq-select-field--error' : '']
            .filter(Boolean)
            .join(' '),
        )}
      >
        {label && (
          <label
            {...getSlotProps(slots, 'label', 'fq-select-field__label')}
            htmlFor={selectId}
          >
            {label}

            {isRequired && (
              <span
                {...getSlotProps(
                  slots,
                  'required',
                  'fq-select-field__required',
                )}
                aria-hidden="true"
              >
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
          {...getSlotProps(
            slots,
            'select',
            ['fq-select', className ?? ''].filter(Boolean).join(' '),
            style,
          )}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        >
          {children}
        </select>

        {message && (
          <div
            id={messageId}
            {...getSlotProps(slots, 'helperText', 'fq-select-field__message')}
          >
            {message}
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
