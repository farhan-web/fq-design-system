import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import './Button.css';

export type ButtonVariant =
  'primary' | 'secondary' | 'ghost' | 'danger' | 'invert';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  iconOnly?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      startIcon,
      endIcon,
      iconOnly = false,
      disabled,
      type = 'button',
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const buttonClassName = [
      'fq-button',
      `fq-button--${variant}`,
      `fq-button--${size}`,
      fullWidth ? 'fq-button--full-width' : '',
      iconOnly ? 'fq-button--icon-only' : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={buttonClassName}
        disabled={isDisabled}
        aria-busy={loading || undefined}
      >
        {loading ? (
          <span className="fq-button__spinner" aria-hidden="true" />
        ) : (
          startIcon
        )}

        <span className="fq-button__content">{children}</span>

        {!loading && endIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';
