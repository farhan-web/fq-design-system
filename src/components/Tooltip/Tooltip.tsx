import { getSlotProps, type FqSlotCustomization } from '../../types/slots';
import {
  cloneElement,
  forwardRef,
  useCallback,
  useEffect,
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
export interface TooltipProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, 'content' | 'onOpen' | 'onClose'>,
    FqSlotCustomization<'root' | 'content' | 'arrow'> {
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
      style,
      classNames,
      slotProps,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      onTouchStart,
      onTouchEnd,
      onTouchCancel,
      onKeyDown,
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
    const callbacks = useRef({ onOpen, onClose });
    useEffect(() => {
      callbacks.current = { onOpen, onClose };
    }, [onOpen, onClose]);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const handleRef = useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );
    const activity = useRef({
      hover: false,
      focus: false,
      touch: false,
      dismissed: false,
    });
    const clearTimers = useCallback(() => {
      if (enterTimerRef.current !== null) clearTimeout(enterTimerRef.current);
      if (leaveTimerRef.current !== null) clearTimeout(leaveTimerRef.current);
      enterTimerRef.current = null;
      leaveTimerRef.current = null;
    }, []);
    const dismiss = useCallback(() => {
      clearTimers();
      activity.current.dismissed = true;
      if (!isControlled) setInternalVisible(false);
      callbacks.current.onClose?.();
    }, [clearTimers, isControlled]);

    if (delayMs !== undefined && import.meta.env.DEV) {
      console.warn(
        '[Tooltip] `delayMs` is deprecated — use `enterDelay` instead.',
      );
    }
    const resolvedEnterDelay = enterDelay ?? delayMs ?? 300;

    useEffect(
      () => clearTimers,
      [clearTimers, open, resolvedEnterDelay, leaveDelay],
    );

    // Inside the wrapper, bubble so child key handlers still run. Outside it,
    // capture so Escape dismisses a hovered tooltip before an enclosing modal.
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (
          event.key !== 'Escape' ||
          event.defaultPrevented ||
          rootRef.current?.contains(event.target as Node)
        )
          return;
        if (visible || enterTimerRef.current !== null) {
          dismiss();
          event.preventDefault();
          event.stopPropagation();
        }
      };
      document.addEventListener('keydown', handleEscape, true);
      return () => document.removeEventListener('keydown', handleEscape, true);
    }, [visible, dismiss]);

    const show = () => {
      clearTimers();
      if (activity.current.dismissed || visible) return;
      enterTimerRef.current = setTimeout(() => {
        enterTimerRef.current = null;
        if (!isControlled) setInternalVisible(true);
        callbacks.current.onOpen?.();
      }, resolvedEnterDelay);
    };

    const hide = () => {
      if (
        activity.current.hover ||
        activity.current.focus ||
        activity.current.touch
      )
        return;
      activity.current.dismissed = false;
      clearTimers();
      leaveTimerRef.current = setTimeout(() => {
        leaveTimerRef.current = null;
        if (!isControlled) setInternalVisible(false);
        callbacks.current.onClose?.();
      }, leaveDelay);
    };

    const childProps = children.props as React.HTMLAttributes<HTMLElement>;
    const describedBy =
      [childProps['aria-describedby'], visible ? tooltipId : undefined]
        .filter(Boolean)
        .join(' ') || undefined;
    const extraProps = { 'aria-describedby': describedBy };

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
        ref={handleRef}
        onMouseEnter={(event) => {
          if (!disableHoverListener) {
            activity.current.hover = true;
            show();
          }
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          if (!disableHoverListener) {
            activity.current.hover = false;
            hide();
          }
          onMouseLeave?.(event);
        }}
        onFocus={(event) => {
          if (!disableFocusListener) {
            activity.current.focus = true;
            show();
          }
          onFocus?.(event);
        }}
        onBlur={(event) => {
          if (
            !disableFocusListener &&
            !event.currentTarget.contains(event.relatedTarget)
          ) {
            activity.current.focus = false;
            hide();
          }
          onBlur?.(event);
        }}
        onTouchStart={(event) => {
          if (!disableTouchListener) {
            activity.current.touch = true;
            show();
          }
          onTouchStart?.(event);
        }}
        onTouchEnd={(event) => {
          if (!disableTouchListener) {
            activity.current.touch = false;
            hide();
          }
          onTouchEnd?.(event);
        }}
        onTouchCancel={(event) => {
          if (!disableTouchListener) {
            activity.current.touch = false;
            hide();
          }
          onTouchCancel?.(event);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (
            !event.defaultPrevented &&
            event.key === 'Escape' &&
            (visible || enterTimerRef.current !== null)
          ) {
            dismiss();
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        {...getSlotProps(
          { classNames, slotProps },
          'root',
          ['fq-tooltip', className].filter(Boolean).join(' '),
          style,
        )}
      >
        {trigger}
        <div
          id={tooltipId}
          role="tooltip"
          {...getSlotProps(
            { classNames, slotProps },
            'content',
            [
              'fq-tooltip__content',
              `fq-tooltip__content--${placement}`,
              visible ? 'fq-tooltip__content--visible' : '',
              bold ? 'fq-tooltip__content--bold' : '',
            ]
              .filter(Boolean)
              .join(' '),
            contentStyle,
          )}
          aria-hidden={!visible}
        >
          {content}
          {arrow && (
            <span
              {...getSlotProps(
                { classNames, slotProps },
                'arrow',
                `fq-tooltip__arrow fq-tooltip__arrow--${arrowAlignment}`,
              )}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    );
  },
);

Tooltip.displayName = 'Tooltip';
