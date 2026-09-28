import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import './BannerGradient.css';

export type BannerGradientVariant = 'small' | 'big-rounded' | 'big-rectangle';

export type BannerGradientGradient =
  | 'violet'
  | 'green'
  | 'orange'
  | 'red'
  | 'tosca'
  | 'blue'
  | 'purple'
  | 'light-blue';

export interface BannerGradientPageControl {
  /** Total number of pages */
  count: number;
  /** Currently active page index (0-based) */
  current: number;
  /** Dot color variant (default: 'white') */
  variant?: 'white' | 'blue';
}

export interface BannerGradientProps extends HTMLAttributes<HTMLDivElement> {
  /** Shape and size variant (default: 'big-rounded') */
  variant?: BannerGradientVariant;
  /** Gradient color (default: 'violet') */
  gradient?: BannerGradientGradient;
  /** Left icon — unremovable per spec; strongly recommended */
  icon?: ReactNode;
  /** Main text content — body 3 style. Supports ReactNode for bold+regular mixed content. */
  text: ReactNode;
  /** Use bold weight instead of semibold (default: false) */
  bold?: boolean;
  /** Countdown slot — small variant only */
  countdown?: ReactNode;
  /**
   * Show right chevron icon.
   * Default: true for 'small', false for big variants.
   */
  showChevron?: boolean;
  /** Page indicator dots — big-rounded and big-rectangle only */
  pageControl?: BannerGradientPageControl;
}

const ChevronIcon = () => (
  <svg
    className="fq-banner-gradient__chevron"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 4l4 4-4 4" />
  </svg>
);

export const BannerGradient = forwardRef<HTMLDivElement, BannerGradientProps>(
  (
    {
      variant = 'big-rounded',
      gradient = 'violet',
      icon,
      text,
      bold = false,
      countdown,
      showChevron,
      pageControl,
      className,
      ...props
    },
    ref,
  ) => {
    const isSmall = variant === 'small';
    const chevronVisible = showChevron ?? isSmall;

    return (
      <div
        {...props}
        ref={ref}
        className={[
          'fq-banner-gradient',
          `fq-banner-gradient--${variant}`,
          `fq-banner-gradient--${gradient}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="fq-banner-gradient__main">
          {icon && (
            <span className="fq-banner-gradient__icon" aria-hidden="true">
              {icon}
            </span>
          )}

          <span
            className={[
              'fq-banner-gradient__text',
              bold ? 'fq-banner-gradient__text--bold' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {text}
          </span>

          {isSmall && countdown && (
            <div className="fq-banner-gradient__countdown">{countdown}</div>
          )}

          {chevronVisible && <ChevronIcon />}
        </div>

        {!isSmall && pageControl && pageControl.count > 1 && (
          <div
            className={[
              'fq-banner-gradient__page-control',
              pageControl.variant === 'blue'
                ? 'fq-banner-gradient__page-control--blue'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            role="tablist"
            aria-label="Banner pages"
          >
            {Array.from({ length: pageControl.count }, (_, i) => (
              <span
                key={i}
                role="tab"
                aria-selected={i === pageControl.current}
                className={[
                  'fq-banner-gradient__dot',
                  i === pageControl.current
                    ? 'fq-banner-gradient__dot--active'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

BannerGradient.displayName = 'BannerGradient';
