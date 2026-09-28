import {
  cloneElement,
  forwardRef,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';

import './Tooltip.css';

export type TooltipPlacement =
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

/** Arrow position within the tooltip edge. Spec safe space = 12px from each edge. */
export type TooltipArrowAlignment = 'start' | 'center' | 'end';

// Omit 'content' because HTMLAttributes<HTMLDivElement> already has content?: string
export interface TooltipProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'content' | 'onOpen' | 'onClose'
> {
  content: ReactNode;
  placement?: TooltipPlacement;
  /** Where the arrow sits along the tooltip edge. Default: 'center'. */
  arrowAlignment?: TooltipArrowAlignment;
  /** Delay before showing in ms. Default: 300. */
  enterDelay?: number;
  /** @deprecated Use enterDelay instead. */
  delayMs?: number;
  /** Delay before hiding in ms. Default: 0. */
  leaveDelay?: number;
  /** Use body3-bold font weight (spec: body3-regular default). */
  bold?: boolean;
  /** Show or hide the arrow. Default: true. */
  arrow?: boolean;
  /** Override the max-width of the tooltip bubble. */
  maxWidth?: number | string;
  /** Controlled open state. When provided, open/close is driven externally. */
  open?: boolean;
  /** Called when the tooltip requests to open (uncontrolled: also updates internal state). */
  onOpen?: () => void;
  /** Called when the tooltip requests to close (uncontrolled: also updates internal state). */
  onClose?: () => void;
  /** Disable hover (mouseenter/mouseleave) trigger. Default: false. */
  disableHoverListener?: boolean;
  /** Disable keyboard focus/blur trigger. Default: false. */
  disableFocusListener?: boolean;
  /** Disable touch (touchstart/touchend) trigger. Default: false. */
  disableTouchListener?: boolean;
  children: ReactElement;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      placement = 'bottom',
      arrowAlignment = 'center',
      enterDelay,
      delayMs,
      leaveDelay = 0,
      bold = false,
      arrow = true,
      maxWidth,
      open,
      onOpen,
      onClose,
      disableHoverListener = false,
      disableFocusListener = false,
      disableTouchListener = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = open !== undefined;
    const [internalVisible, setInternalVisible] = useState(false);
    const visible = isControlled ? (open as boolean) : internalVisible;

    const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tooltipId = useId();

    if (delayMs !== undefined && process.env.NODE_ENV !== 'production') {
      console.warn(
        '[Tooltip] `delayMs` is deprecated — use `enterDelay` instead.',
      );
    }
    const resolvedEnterDelay = enterDelay ?? delayMs ?? 300;

    const show = () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
      enterTimerRef.current = setTimeout(() => {
        if (!isControlled) setInternalVisible(true);
        onOpen?.();
      }, resolvedEnterDelay);
    };

    const hide = () => {
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      leaveTimerRef.current = setTimeout(() => {
        if (!isControlled) setInternalVisible(false);
        onClose?.();
      }, leaveDelay);
    };

    // Cast to access props safely — cloneElement merges, not replaces
    const childProps = children.props as React.HTMLAttributes<HTMLElement>;

    const extraProps: Record<string, unknown> = {
      'aria-describedby': visible ? tooltipId : undefined,
    };

    if (!disableHoverListener) {
      extraProps.onMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        show();
        childProps.onMouseEnter?.(e);
      };
      extraProps.onMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
        hide();
        childProps.onMouseLeave?.(e);
      };
    }

    if (!disableFocusListener) {
      extraProps.onFocus = (e: React.FocusEvent<HTMLElement>) => {
        show();
        childProps.onFocus?.(e);
      };
      extraProps.onBlur = (e: React.FocusEvent<HTMLElement>) => {
        hide();
        childProps.onBlur?.(e);
      };
    }

    if (!disableTouchListener) {
      extraProps.onTouchStart = (e: React.TouchEvent<HTMLElement>) => {
        show();
        childProps.onTouchStart?.(e);
      };
      extraProps.onTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
        hide();
        childProps.onTouchEnd?.(e);
      };
    }

    const trigger = cloneElement(
      children as ReactElement<Record<string, unknown>>,
      extraProps,
    );

    const contentStyle: React.CSSProperties | undefined =
      maxWidth !== undefined
        ? {
            maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
          }
        : undefined;

    return (
      <div
        {...props}
        ref={ref}
        className={['fq-tooltip', className].filter(Boolean).join(' ')}
      >
        {trigger}
        <div
          id={tooltipId}
          role="tooltip"
          style={contentStyle}
          className={[
            'fq-tooltip__content',
            `fq-tooltip__content--${placement}`,
            visible ? 'fq-tooltip__content--visible' : '',
            bold ? 'fq-tooltip__content--bold' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden={!visible}
        >
          {content}
          {arrow && (
            <span
              className={`fq-tooltip__arrow fq-tooltip__arrow--${arrowAlignment}`}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    );
  },
);

Tooltip.displayName = 'Tooltip';
