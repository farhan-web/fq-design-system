import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';

import './Banner.css';

export type BannerVariant = 'info' | 'success' | 'warning' | 'danger';
export type BannerLayout = 'sectional' | 'full-width';

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BannerVariant;
  /**
   * Layout mode.
   * - `sectional` (default): 8px radius, optional × dismiss button.
   * - `full-width`: 0px radius, chevron on right, entire banner is tappable via `onClick`.
   */
  layout?: BannerLayout;
  title?: string;
  description?: ReactNode;
  icon?: ReactNode;
  /** Show × dismiss button. Only applies to `sectional` layout. */
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Text link CTA shown below description */
  action?: { label: string; onClick: () => void };
  children?: ReactNode;
}

const defaultIcons: Record<BannerVariant, ReactNode> = {
  info: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  success: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  warning: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  danger: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};

const ChevronIcon = () => (
  <svg
    className="fq-banner__chevron"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export const Banner = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      variant = 'info',
      layout = 'sectional',
      title,
      description,
      icon,
      dismissible = false,
      onDismiss,
      action,
      children,
      className,
      onClick,
      onKeyDown,
      tabIndex,
      ...props
    },
    ref,
  ) => {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    const handleDismiss = () => {
      setDismissed(true);
      onDismiss?.();
    };

    const resolvedIcon = icon ?? defaultIcons[variant];
    const isFullWidth = layout === 'full-width';

    const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (isFullWidth && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick?.(e as unknown as ReactMouseEvent<HTMLDivElement>);
      }
      onKeyDown?.(e);
    };

    return (
      <div
        {...props}
        ref={ref}
        role="alert"
        tabIndex={isFullWidth ? (tabIndex ?? 0) : tabIndex}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={[
          'fq-banner',
          `fq-banner--${variant}`,
          isFullWidth ? 'fq-banner--full-width' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="fq-banner__icon" aria-hidden="true">
          {resolvedIcon}
        </span>

        <div className="fq-banner__body">
          {title && <p className="fq-banner__title">{title}</p>}
          {description && (
            <p className="fq-banner__description">{description}</p>
          )}
          {action && (
            <button
              type="button"
              className="fq-banner__action"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          )}
          {children}
        </div>

        {isFullWidth ? (
          <ChevronIcon />
        ) : (
          dismissible && (
            <button
              type="button"
              className="fq-banner__dismiss"
              aria-label="Dismiss"
              onClick={handleDismiss}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                aria-hidden="true"
                width={16}
                height={16}
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )
        )}
      </div>
    );
  },
);

Banner.displayName = 'Banner';
