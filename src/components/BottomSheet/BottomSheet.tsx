import {
  usePortalScope,
  type FqPortalContainer,
} from '../../theme/portalScope';
import { getSlotProps, type FqSlotCustomization } from '../../types/slots';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { ButtonBase, Modal } from '@mui/material';

import './BottomSheet.css';
import { useModalScrollLock } from '../../hooks/useModalScrollLock';

export interface BottomSheetIconAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

export interface BottomSheetProps
  extends
    HTMLAttributes<HTMLDivElement>,
    FqSlotCustomization<
      | 'root'
      | 'backdrop'
      | 'handle'
      | 'handleBar'
      | 'image'
      | 'header'
      | 'title'
      | 'closeButton'
      | 'actions'
      | 'action'
      | 'iconAction'
      | 'body'
    > {
  /** Portal target. Prefer a callback when the target is created after mount. */
  container?: FqPortalContainer;
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Show the drag handle bar (default: true) */
  handle?: boolean;
  /** Dismiss when clicking the backdrop (default: true) */
  backdropDismiss?: boolean;
  /** Text link action shown in the header right side */
  action?: { label: string; onClick: () => void };
  /** Up to 2 icon-button actions shown in the header right side */
  iconActions?: BottomSheetIconAction[];
  /** Image slot rendered between handle and title (With Image variant) */
  image?: ReactNode;
  /** Override the maximum height of the sheet (default: '90vh') */
  maxHeight?: string;
  /**
   * Disable portal rendering. When false (default), the sheet renders into
   * document.body so it is never clipped by overflow:hidden ancestors.
   */
  disablePortal?: boolean;
  children?: ReactNode;
}

// Keep the existing backdrop visuals while MUI owns modal interaction/stacking.
const SheetBackdrop = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div
    {...getSlotProps(
      {
        slotProps: {
          root: {
            ...props,
            style: props.style ? { ...props.style } : undefined,
          },
        },
      },
      'root',
    )}
    ref={ref}
    onClick={props.onClick}
    aria-hidden="true"
  />
));
SheetBackdrop.displayName = 'SheetBackdrop';

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    {
      open,
      container,
      onClose,
      title,
      handle = true,
      backdropDismiss = true,
      action,
      iconActions,
      image,
      maxHeight,
      disablePortal = false,
      children,
      className,
      style,
      classNames,
      slotProps,
      ...props
    },
    ref,
  ) => {
    const portalScope = usePortalScope();
    const slots = { classNames, slotProps };
    const modalRootRef = useRef<HTMLDivElement>(null);
    const inlineContainer = useCallback(
      () => modalRootRef.current?.parentElement ?? document.body,
      [],
    );
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    useModalScrollLock(mounted);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [dialogNode, setDialogNode] = useState<HTMLDivElement | null>(null);
    const handleRef = useCallback(
      (node: HTMLDivElement | null) => {
        setDialogNode(node);
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );
    const bodyRef = useRef<HTMLDivElement>(null);
    const dragStartY = useRef<number | null>(null);
    const titleId = useId();

    useEffect(() => {
      if (open) {
        setMounted(true);
        let secondFrame: number | undefined;
        const firstFrame = requestAnimationFrame(() => {
          secondFrame = requestAnimationFrame(() => setVisible(true));
        });
        return () => {
          cancelAnimationFrame(firstFrame);
          if (secondFrame !== undefined) cancelAnimationFrame(secondFrame);
        };
      }
      setVisible(false);
      setIsScrolled(false);
      setIsDragging(false);
      setDragOffset(0);
      dragStartY.current = null;
      const timer = setTimeout(() => setMounted(false), 280);
      return () => clearTimeout(timer);
    }, [open]);

    // Run after the sheet has mounted, including titleless/empty sheets.
    useEffect(() => {
      if (!visible || !open) return;
      const dialog = dialogNode;
      const first = Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]',
        ) ?? [],
      ).find((element) => {
        if (
          element.tabIndex < 0 ||
          element.matches(':disabled') ||
          element.closest('[hidden], [inert], [aria-hidden="true"]')
        )
          return false;
        for (
          let node: HTMLElement | null = element;
          node;
          node = node.parentElement
        ) {
          const computed = getComputedStyle(node);
          if (computed.display === 'none' || computed.visibility === 'hidden')
            return false;
          if (node === dialog) break;
        }
        return true;
      });
      (first ?? dialog)?.focus();
    }, [visible, open, dialogNode]);

    // Drag-to-dismiss: global listeners active only while dragging
    useEffect(() => {
      if (!isDragging || !open) return;

      const onMove = (e: TouchEvent) => {
        if (dragStartY.current === null) return;
        const delta = Math.max(0, e.touches[0].clientY - dragStartY.current);
        setDragOffset(delta);
      };

      const onEnd = (e: TouchEvent) => {
        if (dragStartY.current === null) return;
        const delta = (e.changedTouches[0]?.clientY ?? 0) - dragStartY.current;
        dragStartY.current = null;
        setIsDragging(false);
        setDragOffset(0);
        if (delta > 80) onClose();
      };

      document.addEventListener('touchmove', onMove, { passive: true });
      document.addEventListener('touchend', onEnd);
      return () => {
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
      };
    }, [isDragging, onClose, open]);

    const handleBodyScroll = useCallback(() => {
      setIsScrolled((bodyRef.current?.scrollTop ?? 0) > 0);
    }, []);

    const handleDragStart = useCallback((e: React.TouchEvent) => {
      dragStartY.current = e.touches[0].clientY;
      setIsDragging(true);
    }, []);

    if (!mounted) return null;

    return (
      <Modal
        {...portalScope}
        ref={modalRootRef}
        open={mounted}
        disableScrollLock
        container={disablePortal ? inlineContainer : container}
        disablePortal={disablePortal}
        onClose={(_event, reason) => {
          if (open && (reason !== 'backdropClick' || backdropDismiss))
            onClose();
        }}
        slots={{ backdrop: SheetBackdrop }}
        slotProps={{
          backdrop: {
            ...getSlotProps(
              slots,
              'backdrop',
              [
                'fq-bottom-sheet__overlay',
                visible ? 'fq-bottom-sheet__overlay--visible' : '',
              ]
                .filter(Boolean)
                .join(' '),
            ),
          },
        }}
      >
        <div
          {...props}
          {...getSlotProps(slots, 'root')}
          ref={handleRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          aria-labelledby={
            props['aria-labelledby'] ??
            (props['aria-label'] == null && title != null ? titleId : undefined)
          }
          style={{
            maxHeight: maxHeight ?? '90vh',
            ...slotProps?.root?.style,
            ...style,
            ...(isDragging && {
              transform: `translateY(${dragOffset}px)`,
              transition: 'none',
            }),
          }}
          className={[
            'fq-bottom-sheet',
            visible ? 'fq-bottom-sheet--visible' : '',
            isScrolled ? 'fq-bottom-sheet--scrolled' : '',
            className,
            classNames?.root,
            slotProps?.root?.className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {handle && (
            <div
              {...getSlotProps(slots, 'handle', 'fq-bottom-sheet__handle')}
              aria-hidden="true"
              onTouchStart={handleDragStart}
            >
              <div
                {...getSlotProps(
                  slots,
                  'handleBar',
                  'fq-bottom-sheet__handle-bar',
                )}
              />
            </div>
          )}

          {image && (
            <div {...getSlotProps(slots, 'image', 'fq-bottom-sheet__image')}>
              {image}
            </div>
          )}

          {title != null && (
            <div
              {...getSlotProps(slots, 'header', 'fq-bottom-sheet__header')}
              onTouchStart={handleDragStart}
            >
              <ButtonBase
                component="button"
                type="button"
                {...getSlotProps(
                  slots,
                  'closeButton',
                  'fq-bottom-sheet__close',
                )}
                aria-label="Close"
                disableRipple
                onClick={onClose}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </ButtonBase>

              <h2
                id={titleId}
                {...getSlotProps(slots, 'title', 'fq-bottom-sheet__title')}
              >
                {title}
              </h2>

              <div
                {...getSlotProps(
                  slots,
                  'actions',
                  'fq-bottom-sheet__header-end',
                )}
              >
                {action && (
                  <ButtonBase
                    component="button"
                    type="button"
                    {...getSlotProps(
                      slots,
                      'action',
                      'fq-bottom-sheet__action',
                    )}
                    disableRipple
                    onClick={action.onClick}
                  >
                    {action.label}
                  </ButtonBase>
                )}
                {iconActions?.slice(0, 2).map((a) => (
                  <ButtonBase
                    component="button"
                    key={a.label}
                    type="button"
                    {...getSlotProps(
                      slots,
                      'iconAction',
                      'fq-bottom-sheet__icon-action',
                    )}
                    aria-label={a.label}
                    disableRipple
                    onClick={a.onClick}
                  >
                    {a.icon}
                  </ButtonBase>
                ))}
              </div>
            </div>
          )}

          <div
            ref={bodyRef}
            {...getSlotProps(slots, 'body', 'fq-bottom-sheet__body')}
            onScroll={handleBodyScroll}
          >
            {children}
          </div>
        </div>
      </Modal>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';
