import './Checkbox.css';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
} from 'react';

import { useFieldContext } from '../Field/FieldContext';
import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, FormFieldProps {
  indeterminate?: boolean;
  readOnly?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      label,
      helperText,
      error,
      indeterminate = false,
      readOnly = false,
      disabled,
      required,
      className,
      'aria-describedby': externalDescribedBy,
      ...props
    },
    ref,
  ) => {
    const fieldContext = useFieldContext();

    const {
      id: checkboxId,
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
          invalid ? 'fq-checkbox-field--error' : '',
          readOnly ? 'fq-checkbox-field--readonly' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <label className="fq-checkbox" htmlFor={checkboxId}>
          <input
            {...props}
            ref={inputRef}
            id={checkboxId}
            type="checkbox"
            disabled={disabled}
            required={isRequired}
            className={['fq-checkbox__input', className ?? '']
              .filter(Boolean)
              .join(' ')}
            aria-invalid={invalid || undefined}
            aria-readonly={readOnly || undefined}
            aria-describedby={describedBy}
          />

          {label && <span className="fq-checkbox__label">{label}</span>}
        </label>

        {message && (
          <div id={messageId} className="fq-checkbox-field__message">
            {message}
          </div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
