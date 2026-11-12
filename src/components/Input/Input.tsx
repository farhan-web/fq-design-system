import { getSlotProps, type FqSlotCustomization } from '../../types/slots';
import {
  forwardRef,
  useCallback,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { useFieldContext } from '../Field/FieldContext';
import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

import './Input.css';

export interface InputProps
  extends
    InputHTMLAttributes<HTMLInputElement>,
    FormFieldProps,
    FqSlotCustomization<
      | 'root'
      | 'container'
      | 'inner'
      | 'row'
      | 'label'
      | 'input'
      | 'helperText'
      | 'prefix'
      | 'startIcon'
      | 'endIcon'
      | 'clearButton'
      | 'required'
    > {
  /** Text prefix shown before input when focused/filled (e.g. "IDR" for currency) */
  prefix?: string;
  /** Icon on the left side inside the container */
  startIcon?: ReactNode;
  /** Icon on the right side inside the container (overrides built-in clear button) */
  endIcon?: ReactNode;
  /** When provided, a clear (✕) button appears inside the field while focused and value is non-empty */
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      helperText,
      error,
      prefix,
      startIcon,
      endIcon,
      onClear,
      disabled,
      readOnly,
      required,
      className,
      style,
      classNames,
      slotProps,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      'aria-describedby': externalDescribedBy,
      'aria-invalid': externalInvalid,
      ...props
    },
    ref,
  ) => {
    const slots = { classNames, slotProps };
    // ── Fill / focus state ───────────────────────────────────────────────────
    const isControlled = value !== undefined;
    const [uncontrolledFilled, setUncontrolledFilled] = useState(
      Boolean(defaultValue),
    );
    const [isFocused, setIsFocused] = useState(false);

    const isFilled = isControlled ? Boolean(value) : uncontrolledFilled;

    // ── Form field hooks ─────────────────────────────────────────────────────
    const fieldContext = useFieldContext();

    const {
      id: inputId,
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

    // Spec: label floats when focused, filled, OR when there is an error
    // (error unfilled state shows floated label + prefix per spec variants table)
    const hasError = invalid || !!error;
    const isFloated = isFocused || isFilled || hasError;

    // Clear button: only when focused + filled + no custom endIcon
    const showClearBtn = isFocused && isFilled && !endIcon && Boolean(onClear);
    // Prefix: only when field is floated (focused, filled, or error)
    const showPrefix = Boolean(prefix) && isFloated;
    // Reserve end-slot space when endIcon is always present or onClear might appear
    const hasEndSlot = Boolean(endIcon) || Boolean(onClear);

    // ── Event handlers ───────────────────────────────────────────────────────
    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(e);
      },
      [onBlur],
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setUncontrolledFilled(Boolean(e.target.value));
        }
        onChange?.(e);
      },
      [isControlled, onChange],
    );

    // ── Container class ──────────────────────────────────────────────────────
    const containerClass = [
      'fq-input-container',
      isFocused ? 'fq-input-container--focused' : '',
      isFilled ? 'fq-input-container--filled' : '',
      isFloated ? 'fq-input-container--floated' : '',
      hasError ? 'fq-input-container--error' : '',
      disabled ? 'fq-input-container--disabled' : '',
      readOnly ? 'fq-input-container--readonly' : '',
      startIcon ? 'fq-input-container--has-start' : '',
      hasEndSlot ? 'fq-input-container--has-end' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div {...getSlotProps(slots, 'root', 'fq-input-field')}>
        <div {...getSlotProps(slots, 'container', containerClass)}>
          {/* ── Left icon ─────────────────────────────────────────── */}
          {startIcon && (
            <span
              {...getSlotProps(
                slots,
                'startIcon',
                'fq-input-field__icon fq-input-field__icon--start',
              )}
              aria-hidden="true"
            >
              {startIcon}
            </span>
          )}

          {/* ── Inner: floating label + input row ─────────────────── */}
          <div {...getSlotProps(slots, 'inner', 'fq-input-container__inner')}>
            {label && (
              <label
                {...getSlotProps(slots, 'label', 'fq-input__label')}
                htmlFor={inputId}
              >
                {label}
                {isRequired && (
                  <span
                    {...getSlotProps(
                      slots,
                      'required',
                      'fq-input-field__required',
                    )}
                    aria-hidden="true"
                  >
                    {' *'}
                  </span>
                )}
              </label>
            )}

            <div {...getSlotProps(slots, 'row', 'fq-input-container__row')}>
              {showPrefix && (
                <span
                  {...getSlotProps(slots, 'prefix', 'fq-input__prefix')}
                  aria-hidden="true"
                >
                  {prefix}
                </span>
              )}
              <input
                {...props}
                ref={ref}
                id={inputId}
                {...getSlotProps(
                  slots,
                  'input',
                  ['fq-input', className].filter(Boolean).join(' '),
                  style,
                )}
                disabled={disabled}
                readOnly={readOnly}
                required={isRequired}
                value={value}
                defaultValue={defaultValue}
                aria-invalid={invalid || externalInvalid ? true : undefined}
                aria-describedby={describedBy}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ── Right: clear button or end icon ───────────────────── */}
          {(showClearBtn || endIcon) && (
            <span
              {...getSlotProps(
                slots,
                'endIcon',
                'fq-input-field__icon fq-input-field__icon--end',
              )}
              aria-hidden={!showClearBtn ? true : undefined}
            >
              {showClearBtn ? (
                <button
                  type="button"
                  {...getSlotProps(slots, 'clearButton', 'fq-input__clear-btn')}
                  onClick={onClear}
                  aria-label="Clear"
                  tabIndex={-1}
                >
                  {/* tds_ic_oval_cross */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10 1.667a8.333 8.333 0 1 0 0 16.666A8.333 8.333 0 0 0 10 1.667Zm3.09 10.577-.94.94L10 11.02l-2.15 2.164-.94-.94L9.06 10 6.91 7.836l.94-.94L10 9.06l2.15-2.164.94.94L10.94 10l2.15 2.244Z" />
                  </svg>
                </button>
              ) : (
                endIcon
              )}
            </span>
          )}
        </div>

        {message && (
          <p
            id={messageId}
            {...getSlotProps(
              slots,
              'helperText',
              [
                'fq-input-field__message',
                error ? 'fq-input-field__message--error' : '',
              ]
                .filter(Boolean)
                .join(' '),
            )}
          >
            {message}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
