import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { ButtonBase } from '@mui/material';

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
      <ButtonBase
        ref={ref}
        // ButtonBase defaults to <button> — keep explicit for clarity
        component="button"
        type={type}
        className={buttonClassName}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        disableRipple
        {...props}
      >
        {loading ? (
          <span className="fq-button__spinner" aria-hidden="true" />
        ) : (
          startIcon
        )}

        <span className="fq-button__content">{children}</span>

        {!loading && endIcon}
      </ButtonBase>
    );
  },
);

Button.displayName = 'Button';
