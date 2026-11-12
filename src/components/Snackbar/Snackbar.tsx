import {
  usePortalScope,
  type FqPortalContainer,
} from '../../theme/portalScope';
import { getSlotProps, type FqSlotCustomization } from '../../types/slots';
/**
 * Snackbar — MUI Snackbar base + fq-* visual layer.
 *
 * MUI handles auto-hide and transitions; optional Portal handles DOM placement.
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
import {
  forwardRef,
  type CSSProperties,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import {
  Portal,
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

export interface SnackbarProps extends FqSlotCustomization<
  'root' | 'content' | 'message' | 'action'
> {
  /** Portal target. Prefer a callback when the target is created after mount. */
  container?: FqPortalContainer;
  /** Render inline. Inline overlays remain subject to ancestor clipping/stacking. */
  disablePortal?: boolean;
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
  style?: CSSProperties;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
  (
    {
      open,
      container,
      disablePortal = true,
      message,
      variant = 'default',
      action,
      autoHideDuration = 4000,
      onClose,
      anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
      className,
      style,
      classNames,
      slotProps,
    },
    ref,
  ) => {
    const portalScope = usePortalScope();
    const slots = { classNames, slotProps };
    const contentCls = [
      'fq-snackbar',
      variant !== 'default' ? `fq-snackbar--${variant}` : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Portal container={container} disablePortal={disablePortal}>
        <MuiSnackbar
          {...portalScope}
          {...getSlotProps(
            slots,
            'root',
            undefined,
            slotProps?.root?.style || portalScope?.style
              ? { ...portalScope?.style, ...slotProps?.root?.style }
              : undefined,
          )}
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
          <div
            {...getSlotProps(slots, 'content', contentCls, style)}
            role="status"
            aria-live="polite"
          >
            <span {...getSlotProps(slots, 'message', 'fq-snackbar__message')}>
              {message}
            </span>
            {action && (
              <div {...getSlotProps(slots, 'action', 'fq-snackbar__action')}>
                {action}
              </div>
            )}
          </div>
        </MuiSnackbar>
      </Portal>
    );
  },
);

Snackbar.displayName = 'Snackbar';
