import { forwardRef, type FormHTMLAttributes } from 'react';

export type FormProps = FormHTMLAttributes<HTMLFormElement>;

export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { className, children, ...props },
  ref,
) {
  return (
    <form ref={ref} className={className} {...props}>
      {children}
    </form>
  );
});
