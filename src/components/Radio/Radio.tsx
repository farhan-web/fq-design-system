import { getSlotProps, type FqSlotCustomization } from '../../types/slots';
import { forwardRef, type InputHTMLAttributes } from 'react';

import { useFieldContext } from '../Field/FieldContext';
import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

import './Radio.css';

export interface RadioProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>,
    FormFieldProps,
    FqSlotCustomization<
      'root' | 'label' | 'input' | 'helperText' | 'control'
    > {}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
      'aria-describedby': externalDescribedBy,
      ...props
    },
    ref,
  ) => {
    const slots = { classNames, slotProps };
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
        {...getSlotProps(
          slots,
          'root',
          ['fq-radio-field', error ? 'fq-radio-field--error' : '']
            .filter(Boolean)
            .join(' '),
        )}
      >
        <label className="fq-radio" htmlFor={radioId}>
          <input
            {...props}
            ref={ref}
            id={radioId}
            type="radio"
            required={isRequired}
            {...getSlotProps(
              slots,
              'input',
              ['fq-radio__input', className ?? ''].filter(Boolean).join(' '),
              style,
            )}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
          />

          <span
            {...getSlotProps(slots, 'control', 'fq-radio__control')}
            aria-hidden="true"
          />

          <span {...getSlotProps(slots, 'label', 'fq-radio__label')}>
            {label}
          </span>
        </label>

        {message && (
          <div
            id={messageId}
            {...getSlotProps(slots, 'helperText', 'fq-radio-field__message')}
          >
            {message}
          </div>
        )}
      </div>
    );
  },
);

Radio.displayName = 'Radio';
