import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import './BottomSheet.css';

export interface BottomSheetIconAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

export interface BottomSheetProps extends HTMLAttributes<HTMLDivElement> {
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
  children?: ReactNode;
}

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    {
      open,
      onClose,
      title,
      handle = true,
      backdropDismiss = true,
      action,
      iconActions,
      image,
      maxHeight,
      children,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const dragStartY = useRef<number | null>(null);

    useEffect(() => {
      if (open) {
        setMounted(true);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setVisible(true)),
        );
      } else {
        setVisible(false);
        setIsScrolled(false);
        const timer = setTimeout(() => setMounted(false), 280);
        return () => clearTimeout(timer);
      }
    }, [open]);

    // Trap focus & close on Escape
    useEffect(() => {
      if (!open) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', onKeyDown);
      closeButtonRef.current?.focus();
      return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    // Drag-to-dismiss: global listeners active only while dragging
    useEffect(() => {
      if (!isDragging) return;

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
    }, [isDragging, onClose]);

    const handleBodyScroll = useCallback(() => {
      setIsScrolled((bodyRef.current?.scrollTop ?? 0) > 0);
    }, []);

    const handleDragStart = useCallback((e: React.TouchEvent) => {
      dragStartY.current = e.touches[0].clientY;
      setIsDragging(true);
    }, []);

    if (!mounted) return null;

    return (
      <>
        <div
          className={[
            'fq-bottom-sheet__overlay',
            visible ? 'fq-bottom-sheet__overlay--visible' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden="true"
          onClick={backdropDismiss ? onClose : undefined}
        />
        <div
          {...props}
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          style={{
            maxHeight: maxHeight ?? '90vh',
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
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {handle && (
            <div
              className="fq-bottom-sheet__handle"
              aria-hidden="true"
              onTouchStart={handleDragStart}
            >
              <div className="fq-bottom-sheet__handle-bar" />
            </div>
          )}

          {image && <div className="fq-bottom-sheet__image">{image}</div>}

          {title != null && (
            <div
              className="fq-bottom-sheet__header"
              onTouchStart={handleDragStart}
            >
              <button
                ref={closeButtonRef}
                type="button"
                className="fq-bottom-sheet__close"
                aria-label="Close"
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
              </button>

              <h2 className="fq-bottom-sheet__title">{title}</h2>

              <div className="fq-bottom-sheet__header-end">
                {action && (
                  <button
                    type="button"
                    className="fq-bottom-sheet__action"
                    onClick={action.onClick}
                  >
                    {action.label}
                  </button>
                )}
                {iconActions?.slice(0, 2).map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    className="fq-bottom-sheet__icon-action"
                    aria-label={a.label}
                    onClick={a.onClick}
                  >
                    {a.icon}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div
            ref={bodyRef}
            className="fq-bottom-sheet__body"
            onScroll={handleBodyScroll}
          >
            {children}
          </div>
        </div>
      </>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';
