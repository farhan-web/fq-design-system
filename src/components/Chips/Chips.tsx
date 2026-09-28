import {
  forwardRef,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import './Chips.css';

export interface ChipsProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  error?: boolean;
  invert?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  badge?: ReactNode;
  /** Called when the dismiss (×) button is clicked or activated via keyboard. */
  onDismiss?: () => void;
  children?: ReactNode;
}

export const Chips = forwardRef<HTMLButtonElement, ChipsProps>(
  (
    {
      active = false,
      error = false,
      invert = false,
      startIcon,
      endIcon,
      badge,
      onDismiss,
      disabled,
      children,
      className,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const cls = [
      'fq-chips',
      active ? 'fq-chips--active' : '',
      error ? 'fq-chips--error' : '',
      invert ? 'fq-chips--invert' : '',
      disabled ? 'fq-chips--disabled' : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    function handleDismissKey(e: KeyboardEvent<HTMLSpanElement>) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        onDismiss?.();
      }
    }

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={cls}
        disabled={disabled}
        aria-pressed={active}
      >
        {startIcon && (
          <span className="fq-chips__icon" aria-hidden="true">
            {startIcon}
          </span>
        )}

        {children}

        {badge && (
          <span className="fq-chips__badge" aria-hidden="true">
            {badge}
          </span>
        )}

        {endIcon && (
          <span
            className="fq-chips__icon fq-chips__icon--end"
            aria-hidden="true"
          >
            {endIcon}
          </span>
        )}

        {onDismiss && (
          <span
            role="button"
            tabIndex={disabled ? -1 : 0}
            className="fq-chips__dismiss"
            aria-label="Remove"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            onKeyDown={handleDismissKey}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 3L3 9M3 3l6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
      </button>
    );
  },
);

Chips.displayName = 'Chips';
