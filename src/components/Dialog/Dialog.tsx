/**
 * Dialog — MUI Dialog base + fq-* visual layer.
 *
 * MUI handles: portal, focus trap, scroll lock, backdrop,
 *              Escape key, enter/exit transitions.
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
import { forwardRef, type ReactNode } from 'react';
import { Dialog as MuiDialog } from '@mui/material';

import './Dialog.css';

// ── Types ─────────────────────────────────────────────────────────────────────

export type DialogSize = 'sm' | 'md' | 'lg' | 'fullscreen';

export interface DialogProps {
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
      onClose,
      title,
      children,
      actions,
      size = 'md',
      disableBackdropClick = false,
      className,
    },
    ref,
  ) => {
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
        open={open}
        onClose={handleClose}
        fullScreen={isFullscreen}
        maxWidth={isFullscreen ? false : MUI_MAX_WIDTH[size]}
        fullWidth
        PaperProps={{ ref, className: paperCls }}
      >
        {title != null && (
          <div className="fq-dialog__title">
            <h2 className="fq-dialog__title-text">{title}</h2>
            {onClose && (
              <button
                type="button"
                className="fq-dialog__close"
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

        <div className="fq-dialog__content">{children}</div>

        {actions != null && <div className="fq-dialog__actions">{actions}</div>}
      </MuiDialog>
    );
  },
);

Dialog.displayName = 'Dialog';
