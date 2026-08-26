import { createContext, useContext } from 'react';

export interface FieldContextValue {
  id: string;
  required: boolean;
  invalid: boolean;
  describedBy: string | undefined;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}
