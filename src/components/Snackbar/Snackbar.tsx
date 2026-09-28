/**
 * Snackbar — MUI Snackbar base + fq-* visual layer.
 *
 * MUI handles: auto-hide timer, portal, enter/exit transitions.
 * Our CSS handles: layout, colors, radius, typography.
 *
 * Usage:
 *   <Snackbar
 *     open={open}
 *     message="Item deleted"
 *     variant="success"
 *     action={<button onClick={handleUndo}>Undo</button>}
 *     onClose={() => setOpen(false)}
 *   />
 */
import { forwardRef, type ReactNode, type SyntheticEvent } from 'react';
import {
  Snackbar as MuiSnackbar,
  type SnackbarCloseReason,
} from '@mui/material';

import './Snackbar.css';

// ── Types ─────────────────────────────────────────────────────────────────────

export type SnackbarVariant =
  'default' | 'info' | 'success' | 'warning' | 'error';

export type SnackbarPlacement = {
  vertical?: 'top' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
};

export interface SnackbarProps {
  open: boolean;
  message: ReactNode;
  /** Visual intent. Default: 'default' (neutral dark). */
  variant?: SnackbarVariant;
  /** Optional action element shown on the right (e.g. an Undo button). */
  action?: ReactNode;
  /** Milliseconds before auto-hide. Pass null to disable. Default: 4000. */
  autoHideDuration?: number | null;
  /** Called when the snackbar requests to close. */
  onClose?: (
    event: SyntheticEvent | Event,
    reason: SnackbarCloseReason,
  ) => void;
  /** Screen position. Default: bottom-center. */
  anchorOrigin?: SnackbarPlacement;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
  (
    {
      open,
      message,
      variant = 'default',
      action,
      autoHideDuration = 4000,
      onClose,
      anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
      className,
    },
    ref,
  ) => {
    const contentCls = [
      'fq-snackbar',
      variant !== 'default' ? `fq-snackbar--${variant}` : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <MuiSnackbar
        ref={ref}
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        anchorOrigin={{
          vertical: anchorOrigin.vertical ?? 'bottom',
          horizontal: anchorOrigin.horizontal ?? 'center',
        }}
      >
        {/* MuiSnackbar requires a single child element */}
        <div className={contentCls} role="status" aria-live="polite">
          <span className="fq-snackbar__message">{message}</span>
          {action && <div className="fq-snackbar__action">{action}</div>}
        </div>
      </MuiSnackbar>
    );
  },
);

Snackbar.displayName = 'Snackbar';
