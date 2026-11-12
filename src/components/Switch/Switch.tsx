import { getSlotProps, type FqSlotCustomization } from '../../types/slots';
import { forwardRef, type InputHTMLAttributes } from 'react';

import { useFieldContext } from '../Field/FieldContext';
import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

import './Switch.css';

export interface SwitchProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>,
    FormFieldProps,
    FqSlotCustomization<
      'root' | 'label' | 'input' | 'helperText' | 'control' | 'thumb'
    > {}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
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
      id: switchId,
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
          ['fq-switch-field', error ? 'fq-switch-field--error' : '']
            .filter(Boolean)
            .join(' '),
        )}
      >
        <label className="fq-switch" htmlFor={switchId}>
          <input
            {...props}
            ref={ref}
            id={switchId}
            type="checkbox"
            role="switch"
            required={isRequired}
            {...getSlotProps(
              slots,
              'input',
              ['fq-switch__input', className ?? ''].filter(Boolean).join(' '),
              style,
            )}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
          />

          <span
            {...getSlotProps(slots, 'control', 'fq-switch__control')}
            aria-hidden="true"
          >
            <span {...getSlotProps(slots, 'thumb', 'fq-switch__thumb')} />
          </span>

          <span {...getSlotProps(slots, 'label', 'fq-switch__label')}>
            {label}
          </span>
        </label>

        {message && (
          <div
            id={messageId}
            {...getSlotProps(slots, 'helperText', 'fq-switch-field__message')}
          >
            {message}
          </div>
        )}
      </div>
    );
  },
);

Switch.displayName = 'Switch';
