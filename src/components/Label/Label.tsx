import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import './Label.css';

export type LabelVariant =
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'neutral'
  | 'outline-primary'
  | 'outline-success'
  | 'outline-danger'
  | 'outline-neutral'
  | 'solid-red'
  | 'solid-orange'
  | 'solid-green'
  | 'solid-blue'
  | 'gradient-red'
  | 'gradient-orange'
  | 'gradient-green'
  | 'gradient-tosca'
  | 'gradient-violet';

export type LabelSize = 'sm' | 'md';

export interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: LabelVariant;
  size?: LabelSize;
  startIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  /**
   * Countdown slot — rendered after text.
   * Pass a `<Countdown display="unboxed-small" />` for spec-aligned output.
   */
  countdown?: ReactNode;
  /**
   * Called when the embedded countdown expires.
   * Wire this to the `onExpire` prop of the Countdown you pass as `countdown`.
   */
  onExpire?: () => void;
  children?: ReactNode;
}

export const Label = forwardRef<HTMLSpanElement, LabelProps>(
  (
    {
      variant = 'neutral',
      size = 'md',
      startIcon,
      loading = false,
      disabled = false,
      countdown,
      onExpire: _onExpire,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const cls = [
      'fq-label',
      `fq-label--${variant}`,
      `fq-label--${size}`,
      loading ? 'fq-label--loading' : '',
      disabled ? 'fq-label--disabled' : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span {...props} ref={ref} className={cls}>
        {!loading && startIcon && (
          <span className="fq-label__icon" aria-hidden="true">
            {startIcon}
          </span>
        )}
        {!loading && children}
        {!loading && countdown && (
          <span className="fq-label__countdown">{countdown}</span>
        )}
      </span>
    );
  },
);

Label.displayName = 'Label';
