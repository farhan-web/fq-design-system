import './CheckboxGroup.css';

import { forwardRef, type HTMLAttributes } from 'react';

import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

export interface CheckboxGroupProps
  extends HTMLAttributes<HTMLFieldSetElement>, FormFieldProps {
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
      children,
      ...props
    },
    ref,
  ) => {
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
        className={[
          'fq-checkbox-group',
          invalid ? 'fq-checkbox-group--error' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {label && (
          <legend className="fq-checkbox-group__legend">
            {label}
            {required && (
              <span className="fq-checkbox-group__required" aria-hidden="true">
                *
              </span>
            )}
          </legend>
        )}

        <div className="fq-checkbox-group__items">{children}</div>

        {message && (
          <div id={messageId} className="fq-checkbox-group__message">
            {message}
          </div>
        )}
      </fieldset>
    );
  },
);

CheckboxGroup.displayName = 'CheckboxGroup';
