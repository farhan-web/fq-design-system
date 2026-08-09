import {
  Children,
  cloneElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';

import { useFormField } from '../../hooks/useFormField';

export interface FieldProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactElement;
}

export function Field({
  label,
  description,
  error,
  required = false,
  children,
}: FieldProps) {
  const field = useFormField({
    helperText: description,
    error,
  });

  const child = Children.only(children) as ReactElement<
    HTMLAttributes<HTMLElement>
  >;

  const childProps = child.props;

  const controlId =
    childProps.id ?? field.id;

  const descriptionId = description
    ? `${controlId}-description`
    : undefined;

  const errorId = error
    ? `${controlId}-error`
    : undefined;

  const describedBy = [
    childProps['aria-describedby'],
    descriptionId,
    errorId,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  const control = cloneElement(child, {
    id: controlId,
    'aria-invalid': error
      ? true
      : undefined,
    'aria-describedby': describedBy,
  });

  return (
    <div
      className={[
        'fq-field',
        error ? 'fq-field--error' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label && (
        <label
          className="fq-field__label"
          htmlFor={controlId}
        >
          {label}

          {required && (
            <span
              className="fq-field__required"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      {control}

      {description && (
        <div
          id={descriptionId}
          className="fq-field__description"
        >
          {description}
        </div>
      )}

      {error && (
        <div
          id={errorId}
          className="fq-field__error"
        >
          {error}
        </div>
      )}
    </div>
  );
}
