import { getSlotProps, type FqSlotCustomization } from '../../types/slots';
import {
  forwardRef,
  useState,
  type ChangeEvent,
  type TextareaHTMLAttributes,
} from 'react';

import { useFieldContext } from '../Field/FieldContext';
import { useFormField } from '../../hooks/useFormField';
import type { FormFieldProps } from '../../types/form';

import './Textarea.css';

export interface TextareaProps
  extends
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    FormFieldProps,
    FqSlotCustomization<
      | 'root'
      | 'label'
      | 'required'
      | 'textarea'
      | 'footer'
      | 'helperText'
      | 'count'
    > {
  /** Show character count below the textarea (uses maxLength if provided) */
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      id,
      required,
      showCount = false,
      className,
      style,
      classNames,
      slotProps,
      onChange,
      'aria-describedby': externalDescribedBy,
      ...props
    },
    ref,
  ) => {
    const slots = { classNames, slotProps };
    const fieldContext = useFieldContext();
    const [charCount, setCharCount] = useState(
      () => String(props.defaultValue ?? props.value ?? '').length,
    );

    const {
      id: textareaId,
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
          ['fq-textarea-field', error ? 'fq-textarea-field--error' : '']
            .filter(Boolean)
            .join(' '),
        )}
      >
        <label
          {...getSlotProps(slots, 'label', 'fq-textarea-field__label')}
          htmlFor={textareaId}
        >
          {label}

          {isRequired && (
            <span
              {...getSlotProps(
                slots,
                'required',
                'fq-textarea-field__required',
              )}
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>

        <textarea
          {...props}
          ref={ref}
          id={textareaId}
          required={isRequired}
          {...getSlotProps(
            slots,
            'textarea',
            ['fq-textarea', className ?? ''].filter(Boolean).join(' '),
            style,
          )}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setCharCount(e.target.value.length);
            onChange?.(e);
          }}
        />

        <div {...getSlotProps(slots, 'footer', 'fq-textarea-field__footer')}>
          {message && (
            <div
              id={messageId}
              {...getSlotProps(
                slots,
                'helperText',
                'fq-textarea-field__message',
              )}
            >
              {message}
            </div>
          )}
          {showCount && (
            <span {...getSlotProps(slots, 'count', 'fq-textarea-field__count')}>
              {charCount}
              {props.maxLength != null ? `/${props.maxLength}` : ''}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
