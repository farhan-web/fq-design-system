import { getSlotProps, type FqSlotCustomization } from '../../types/slots';
import { forwardRef, useId, type CSSProperties, type ReactNode } from 'react';

import { FieldContext } from './FieldContext';

export interface FieldProps extends FqSlotCustomization<
  'root' | 'label' | 'required' | 'description' | 'error'
> {
  className?: string;
  style?: CSSProperties;
  id?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      id: providedId,
      label,
      description,
      error,
      required = false,
      children,
      className,
      style,
      classNames,
      slotProps,
    },
    ref,
  ) => {
    const slots = { classNames, slotProps };
    const generatedId = useId();
    const id = providedId ?? generatedId;

    const descriptionId = description ? `${id}-description` : undefined;

    const errorId = error ? `${id}-error` : undefined;

    const describedBy =
      [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <FieldContext.Provider
        value={{
          id,
          required,
          invalid: Boolean(error),
          describedBy,
        }}
      >
        <div
          ref={ref}
          {...getSlotProps(
            slots,
            'root',
            ['fq-field', error ? 'fq-field--error' : '', className]
              .filter(Boolean)
              .join(' '),
            style,
          )}
        >
          {label && (
            <label
              {...getSlotProps(slots, 'label', 'fq-field__label')}
              htmlFor={id}
            >
              {label}

              {required && (
                <span
                  {...getSlotProps(slots, 'required', 'fq-field__required')}
                  aria-hidden="true"
                >
                  *
                </span>
              )}
            </label>
          )}

          {children}

          {description && (
            <div
              id={descriptionId}
              {...getSlotProps(slots, 'description', 'fq-field__description')}
            >
              {description}
            </div>
          )}

          {error && (
            <div
              id={errorId}
              {...getSlotProps(slots, 'error', 'fq-field__error')}
            >
              {error}
            </div>
          )}
        </div>
      </FieldContext.Provider>
    );
  },
);

Field.displayName = 'Field';
