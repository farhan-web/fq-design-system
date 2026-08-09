import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

import './Button.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger';

export type ButtonSize =
  | 'sm'
  | 'md'
  | 'lg';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  iconOnly?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  iconOnly = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
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
      type="button"
      className={buttonClassName}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span
          className="fq-button__spinner"
          aria-hidden="true"
        />
      ) : (
        startIcon
      )}

      <span className="fq-button__content">
        {children}
      </span>

      {!loading && endIcon}
    </button>
  );
}