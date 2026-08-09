import { useId, type ReactNode } from 'react';

type UseFormFieldOptions = {
  id?: string;
  helperText?: ReactNode;
  error?: ReactNode;
  describedBy?: string;
};

export function useFormField({
  id,
  helperText,
  error,
  describedBy,
}: UseFormFieldOptions) {
  const generatedId = useId();

  const fieldId = id ?? generatedId;

  const message = error ?? helperText;

  const messageId = message
    ? `${fieldId}-message`
    : undefined;

  const combinedDescribedBy = [
    describedBy,
    messageId,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return {
    id: fieldId,
    message,
    messageId,
    describedBy: combinedDescribedBy,
    invalid: Boolean(error),
  };
}