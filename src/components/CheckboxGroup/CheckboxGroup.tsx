import { getSlotProps, type FqSlotCustomization } from '../../types/slots';
import './CheckboxGroup.css';

import { forwardRef, type HTMLAttributes } from 'react';

import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

export interface CheckboxGroupProps
  extends
    HTMLAttributes<HTMLFieldSetElement>,
    FormFieldProps,
    FqSlotCustomization<
      'root' | 'legend' | 'required' | 'items' | 'helperText'
    > {
  required?: boolean;
  disabled?: boolean;
}

export const CheckboxGroup = forwardRef<
  HTMLFieldSetElement,
  CheckboxGroupProps
>(
  (
    {
      id,
      label,
      helperText,
      error,
      required,
      disabled,
      className,
      style,
      classNames,
      slotProps,
      children,
      ...props
    },
    ref,
  ) => {
    const slots = { classNames, slotProps };
    const { message, messageId, invalid } = useFormField({
      id,
      helperText,
      error,
    });

    return (
      <fieldset
        {...props}
        ref={ref}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={messageId}
        {...getSlotProps(
          slots,
          'root',
          [
            'fq-checkbox-group',
            invalid ? 'fq-checkbox-group--error' : '',
            className,
          ]
            .filter(Boolean)
            .join(' '),
          style,
        )}
      >
        {label && (
          <legend
            {...getSlotProps(slots, 'legend', 'fq-checkbox-group__legend')}
          >
            {label}
            {required && (
              <span
                {...getSlotProps(
                  slots,
                  'required',
                  'fq-checkbox-group__required',
                )}
                aria-hidden="true"
              >
                *
              </span>
            )}
          </legend>
        )}

        <div {...getSlotProps(slots, 'items', 'fq-checkbox-group__items')}>
          {children}
        </div>

        {message && (
          <div
            id={messageId}
            {...getSlotProps(slots, 'helperText', 'fq-checkbox-group__message')}
          >
            {message}
          </div>
        )}
      </fieldset>
    );
  },
);

CheckboxGroup.displayName = 'CheckboxGroup';
