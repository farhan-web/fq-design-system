import './Checkbox.css';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
} from 'react';

import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    FormFieldProps {
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      label,
      helperText,
      error,
      indeterminate = false,
      disabled,
      'aria-describedby': externalDescribedBy,
      ...props
    },
    ref,
  ) => {
    const {
      id: checkboxId,
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

    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!, []);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <div
        className={[
          'fq-checkbox-field',
          error ? 'fq-checkbox-field--error' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <label
          className="fq-checkbox"
          htmlFor={checkboxId}
        >
          <input
            {...props}
            {...(disabled !== undefined ? { disabled } : {})}
            ref={inputRef}
            id={checkboxId}
            type="checkbox"
            className="fq-checkbox__input"
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
          />

          {label && (
            <span className="fq-checkbox__label">
              {label}
            </span>
          )}
        </label>

        {message && (
          <div
            id={messageId}
            className="fq-checkbox-field__message"
          >
            {message}
          </div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';