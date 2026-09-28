/**
 * IconButton — ButtonBase + IconBase integration.
 *
 * Renders a square, accessible icon-only button that follows the HMG
 * icon-button pattern: MUI ButtonBase provides behaviour/a11y, our
 * fq-* CSS owns 100% of the visual output.
 *
 * Usage:
 *   import { IconButton } from 'fq-design-system';
 *   import { Search } from 'lucide-react';
 *
 *   <IconButton size="md" variant="ghost" aria-label="Search">
 *     <Search />
 *   </IconButton>
 */
import { forwardRef, type ReactNode } from 'react';
import { ButtonBase, type ButtonBaseProps } from '@mui/material';

import { IconBase, type IconSize, type IconColor } from '../Icon/IconBase';
import './IconButton.css';

// ── Types ─────────────────────────────────────────────────────────────────────

export type IconButtonVariant = 'standard' | 'filled' | 'outlined' | 'ghost';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Maps IconButton size → IconBase size token so the icon scales
 * proportionally inside the button.
 */
const ICON_SIZE_MAP: Record<IconButtonSize, IconSize> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
};

export interface IconButtonProps extends Omit<
  ButtonBaseProps<'button'>,
  'component' | 'color' | 'children'
> {
  /** Visual variant */
  variant?: IconButtonVariant;
  /** Button + icon size */
  size?: IconButtonSize;
  /** Semantic color for the icon (and tinted bg in filled/outlined variants) */
  color?: IconColor;
  /** Accessible label — required for icon-only controls */
  'aria-label': string;
  /** The SVG icon to render (lucide-react or inline <svg>) */
  children: ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'standard',
      size = 'md',
      color = 'inherit',
      disabled,
      className,
      children,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const cls = [
      'fq-icon-btn',
      `fq-icon-btn--${size}`,
      variant !== 'standard' ? `fq-icon-btn--${variant}` : '',
      color !== 'inherit' ? `fq-icon-btn--${color}` : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <ButtonBase
        component="button"
        ref={ref}
        type="button"
        className={cls}
        disabled={disabled}
        aria-label={ariaLabel}
        disableRipple
        {...props}
      >
        <IconBase size={ICON_SIZE_MAP[size]} color={color} aria-hidden>
          {children}
        </IconBase>
      </ButtonBase>
    );
  },
);

IconButton.displayName = 'IconButton';
