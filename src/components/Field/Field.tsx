import { useId, type ReactNode } from 'react';

import { FieldContext } from './FieldContext';

export interface FieldProps {
  id?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
}

export function Field({
  id: providedId,
  label,
  description,
  error,
  required = false,
  children,
}: FieldProps) {
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
        className={['fq-field', error ? 'fq-field--error' : '']
          .filter(Boolean)
          .join(' ')}
      >
        {label && (
          <label className="fq-field__label" htmlFor={id}>
            {label}

            {required && (
              <span className="fq-field__required" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {children}

        {description && (
          <div id={descriptionId} className="fq-field__description">
            {description}
          </div>
        )}

        {error && (
          <div id={errorId} className="fq-field__error">
            {error}
          </div>
        )}
      </div>
    </FieldContext.Provider>
  );
}
