import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import './BannerInfo.css';

export interface BannerInfoProps extends HTMLAttributes<HTMLDivElement> {
  /** Card title — body 1 bold */
  title?: string;
  /** Card body text — body 2 regular. Supports ReactNode for mixed content. */
  description: ReactNode;
  /** Text link CTA shown below description — body 3 bold, activity color */
  action?: { label: string; onClick: () => void };
  /** Callback for the × close button. When provided, the button is rendered. */
  onClose?: () => void;
  /** Left illustration slot — 80×80 container */
  illustration?: ReactNode;
  /**
   * Decorative top-right super graphic — 96×93 absolute container.
   * Behind the close button. Purely visual.
   */
  superGraphic?: ReactNode;
}

const CloseIcon = () => (
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
);

export const BannerInfo = forwardRef<HTMLDivElement, BannerInfoProps>(
  (
    {
      title,
      description,
      action,
      onClose,
      illustration,
      superGraphic,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        {...props}
        ref={ref}
        className={[
          'fq-banner-info',
          onClose ? 'fq-banner-info--closable' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {superGraphic && (
          <div className="fq-banner-info__super-graphic" aria-hidden="true">
            {superGraphic}
          </div>
        )}

        {onClose && (
          <button
            type="button"
            className="fq-banner-info__close"
            aria-label="Close"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        )}

        <div className="fq-banner-info__body">
          {illustration && (
            <div className="fq-banner-info__illustration">{illustration}</div>
          )}

          <div className="fq-banner-info__content">
            {title && <p className="fq-banner-info__title">{title}</p>}
            <div className="fq-banner-info__description">{description}</div>
            {action && (
              <button
                type="button"
                className="fq-banner-info__action"
                onClick={action.onClick}
              >
                {action.label}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  },
);

BannerInfo.displayName = 'BannerInfo';
