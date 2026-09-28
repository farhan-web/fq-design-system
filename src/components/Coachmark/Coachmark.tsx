import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type MutableRefObject,
  type ReactNode,
} from 'react';

import './Coachmark.css';

export type CoachmarkPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export interface CoachmarkProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  title: string;
  body: ReactNode;
  /** Optional illustration shown above the title */
  illustration?: ReactNode;
  step?: number;
  totalSteps?: number;
  nextLabel?: string;
  doneLabel?: string;
  skipLabel?: string;
  onNext?: () => void;
  onSkip?: () => void;
  onDone?: () => void;
  placement?: CoachmarkPlacement;
  /** The target element to anchor the coachmark to */
  children?: ReactNode;
}

const getFocusable = (el: HTMLElement): HTMLElement[] =>
  Array.from(
    el.querySelectorAll<HTMLElement>(
      'button:not(:disabled),[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])',
    ),
  );

export const Coachmark = forwardRef<HTMLDivElement, CoachmarkProps>(
  (
    {
      open,
      title,
      body,
      illustration,
      step,
      totalSteps,
      nextLabel = 'Next',
      doneLabel = 'Done',
      skipLabel = 'Skip',
      onNext,
      onSkip,
      onDone,
      placement = 'bottom',
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const isLastStep =
      step !== undefined && totalSteps !== undefined && step >= totalSteps;
    const showSteps = step !== undefined && totalSteps !== undefined;

    const coachmarkRef = useRef<HTMLDivElement>(null);
    const titleId = useId();

    // Escape to dismiss + Tab focus trap
    useEffect(() => {
      if (!open) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          (onSkip ?? onDone)?.();
          return;
        }
        if (e.key === 'Tab') {
          const el = coachmarkRef.current;
          if (!el) return;
          const focusable = getFocusable(el);
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, [open, onSkip, onDone]);

    // A4: Auto-focus first interactive element when coachmark opens
    useEffect(() => {
      if (!open) return;
      const el = coachmarkRef.current;
      if (!el) return;
      const firstButton = el.querySelector<HTMLButtonElement>(
        'button:not(:disabled)',
      );
      firstButton?.focus();
    }, [open]);

    return (
      <div className="fq-coachmark-anchor">
        {children}

        {open && (
          <div
            {...props}
            ref={(node) => {
              (
                coachmarkRef as MutableRefObject<HTMLDivElement | null>
              ).current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref)
                (ref as MutableRefObject<HTMLDivElement | null>).current = node;
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={['fq-coachmark', `fq-coachmark--${placement}`, className]
              .filter(Boolean)
              .join(' ')}
          >
            {illustration && (
              <div className="fq-coachmark__illustration">{illustration}</div>
            )}
            <div className="fq-coachmark__arrow" aria-hidden="true" />
            {showSteps && (
              <p
                className="fq-coachmark__steps"
                aria-label={`Step ${step} of ${totalSteps}`}
                aria-live="polite"
              >
                {step} / {totalSteps}
              </p>
            )}
            <h3 id={titleId} className="fq-coachmark__title">
              {title}
            </h3>
            <div className="fq-coachmark__body">{body}</div>
            <div className="fq-coachmark__actions">
              {onSkip && !isLastStep && (
                <button
                  type="button"
                  className="fq-coachmark__skip"
                  onClick={onSkip}
                >
                  {skipLabel}
                </button>
              )}
              {isLastStep ? (
                <button
                  type="button"
                  className="fq-coachmark__next fq-coachmark__next--done"
                  onClick={onDone}
                >
                  {doneLabel}
                </button>
              ) : (
                <button
                  type="button"
                  className="fq-coachmark__next"
                  onClick={onNext}
                >
                  {nextLabel}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

Coachmark.displayName = 'Coachmark';
