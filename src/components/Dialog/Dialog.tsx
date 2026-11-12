import {
  usePortalScope,
  type FqPortalContainer,
} from '../../theme/portalScope';
import { getSlotProps, type FqSlotCustomization } from '../../types/slots';
/**
 * Dialog — MUI Dialog base + fq-* visual layer.
 *
 * MUI handles: portal, focus trap, backdrop,
 *              Escape key, enter/exit transitions.
 * Shared useModalScrollLock handles document scroll ownership.
 * Our CSS handles: layout, size, radius, colors, typography.
 *
 * Usage:
 *   <Dialog open={open} onClose={() => setOpen(false)} title="Confirm">
 *     <p>Are you sure?</p>
 *     <Dialog.Actions>
 *       <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
 *       <Button variant="danger" onClick={handleConfirm}>Delete</Button>
 *     </Dialog.Actions>
 *   </Dialog>
 */
import {
  forwardRef,
  useCallback,
  useRef,
  useId,
  type CSSProperties,
  type AriaAttributes,
  type ReactNode,
} from 'react';
import { Dialog as MuiDialog } from '@mui/material';

import './Dialog.css';
import { useModalScrollLock } from '../../hooks/useModalScrollLock';

// ── Types ─────────────────────────────────────────────────────────────────────

export type DialogSize = 'sm' | 'md' | 'lg' | 'fullscreen';

export interface DialogProps
  extends
    Pick<AriaAttributes, 'aria-label' | 'aria-labelledby' | 'aria-describedby'>,
    FqSlotCustomization<
      | 'paper'
      | 'backdrop'
      | 'title'
      | 'heading'
      | 'closeButton'
      | 'content'
      | 'actions'
    > {
  /** Portal target. Prefer a callback when the target is created after mount. */
  container?: FqPortalContainer;
  /** Render inline. Inline overlays remain subject to ancestor clipping/stacking. */
  disablePortal?: boolean;
  open: boolean;
  /** Called when the dialog requests to close (Escape or backdrop click). */
  onClose?: () => void;
  /** Heading text or element rendered in the header area. */
  title?: ReactNode;
  /** Main content of the dialog. */
  children?: ReactNode;
  /** Bottom action area — typically Button(s). */
  actions?: ReactNode;
  /** Controls the width of the dialog paper. Default: 'md'. */
  size?: DialogSize;
  /**
   * When true, clicking the backdrop does not call onClose.
   * Escape key still works.
   */
  disableBackdropClick?: boolean;
  className?: string;
  style?: CSSProperties;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const MUI_MAX_WIDTH: Record<
  Exclude<DialogSize, 'fullscreen'>,
  'xs' | 'sm' | 'md'
> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

// ── Component ─────────────────────────────────────────────────────────────────

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      container,
      disablePortal = false,
      onClose,
      title,
      children,
      actions,
      size = 'md',
      disableBackdropClick = false,
      className,
      style,
      classNames,
      slotProps,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
    },
    ref,
  ) => {
    const modalRootRef = useRef<HTMLDivElement>(null);
    const inlineContainer = useCallback(
      () => modalRootRef.current?.parentElement ?? document.body,
      [],
    );
    const portalScope = usePortalScope();
    const slots = { classNames, slotProps };
    const releaseScrollLock = useModalScrollLock(open, true);
    const titleId = useId();
    const isFullscreen = size === 'fullscreen';

    const handleClose = (
      _event: object,
      reason: 'backdropClick' | 'escapeKeyDown',
    ) => {
      if (disableBackdropClick && reason === 'backdropClick') return;
      onClose?.();
    };

    const paperCls = ['fq-dialog', `fq-dialog--${size}`, className ?? '']
      .filter(Boolean)
      .join(' ');

    return (
      <MuiDialog
        {...portalScope}
        ref={modalRootRef}
        container={disablePortal ? inlineContainer : container}
        disablePortal={disablePortal}
        open={open}
        disableScrollLock
        TransitionProps={{ onExited: releaseScrollLock }}
        onClose={handleClose}
        fullScreen={isFullscreen}
        maxWidth={isFullscreen ? false : MUI_MAX_WIDTH[size]}
        fullWidth
        BackdropProps={getSlotProps(slots, 'backdrop')}
        PaperProps={{
          ref,
          ...getSlotProps(slots, 'paper', paperCls, style),
          'aria-label': ariaLabel,
          'aria-labelledby':
            ariaLabelledBy ??
            (ariaLabel == null && title != null ? titleId : undefined),
          'aria-describedby': ariaDescribedBy,
        }}
      >
        {title != null && (
          <div {...getSlotProps(slots, 'title', 'fq-dialog__title')}>
            <h2
              id={titleId}
              {...getSlotProps(slots, 'heading', 'fq-dialog__title-text')}
            >
              {title}
            </h2>
            {onClose && (
              <button
                type="button"
                {...getSlotProps(slots, 'closeButton', 'fq-dialog__close')}
                aria-label="Close dialog"
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
            )}
          </div>
        )}

        <div {...getSlotProps(slots, 'content', 'fq-dialog__content')}>
          {children}
        </div>

        {actions != null && (
          <div {...getSlotProps(slots, 'actions', 'fq-dialog__actions')}>
            {actions}
          </div>
        )}
      </MuiDialog>
    );
  },
);

Dialog.displayName = 'Dialog';
