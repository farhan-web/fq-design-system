import {
  forwardRef,
  type InputHTMLAttributes,
} from 'react';

import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

import './Switch.css';

export interface SwitchProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'type'
    >,
    FormFieldProps {}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      helperText,
      error,
      id,
      className,
      'aria-describedby': externalDescribedBy,
      ...props
    },
    ref,
  ) => {
    const {
      id: switchId,
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
          'fq-switch-field',
          error ? 'fq-switch-field--error' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <label
          className="fq-switch"
          htmlFor={switchId}
        >
          <input
            {...props}
            ref={ref}
            id={switchId}
            type="checkbox"
            role="switch"
            className={[
              'fq-switch__input',
              className ?? '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
          />

          <span
            className="fq-switch__control"
            aria-hidden="true"
          >
            <span className="fq-switch__thumb" />
          </span>

          <span className="fq-switch__label">
            {label}
          </span>
        </label>

        {message && (
          <div
            id={messageId}
            className="fq-switch-field__message"
          >
            {message}
          </div>
        )}
      </div>
    );
  },
);

Switch.displayName = 'Switch';
