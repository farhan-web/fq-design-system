import './Checkbox.css';

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
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
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!, []);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const messageId = `${checkboxId}-message`;
    const message = error ?? helperText;

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
            aria-invalid={error ? true : undefined}
            aria-describedby={message ? messageId : undefined}
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
