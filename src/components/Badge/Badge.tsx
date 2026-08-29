import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import './Badge.css';

export type BadgeVariant =
  | 'solid-primary'
  | 'solid-success'
  | 'solid-danger'
  | 'solid-warning'
  | 'solid-neutral'
  | 'soft-primary'
  | 'soft-success'
  | 'soft-danger'
  | 'soft-warning'
  | 'soft-neutral'
  | 'gradient-red'
  | 'gradient-green';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  count?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'solid-primary',
      dot = false,
      count = false,
      loading = false,
      disabled = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const cls = [
      'fq-badge',
      `fq-badge--${variant}`,
      dot ? 'fq-badge--dot' : '',
      count ? 'fq-badge--count' : '',
      loading ? 'fq-badge--loading' : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span
        {...props}
        ref={ref}
        className={cls}
        data-disabled={disabled || undefined}
      >
        {!dot && !loading && children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
