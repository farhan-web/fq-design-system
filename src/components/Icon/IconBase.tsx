/**
 * IconBase — HMG-inspired SVG normalizer.
 *
 * Wraps any SVG (or lucide-react icon) and normalises:
 *   - size  : xs(12) / sm(16) / md(20) / lg(24, default) / xl(32) / 2xl(40) / 3xl(48)
 *   - color : inherit(default) / primary / secondary / error / success / warning / muted
 *   - a11y  : role="img" + aria-label when label is provided; aria-hidden otherwise
 *
 * Usage:
 *   import { IconBase } from 'fq-design-system';
 *   import { Search } from 'lucide-react';
 *
 *   <IconBase size="lg" color="primary" aria-label="Search">
 *     <Search />
 *   </IconBase>
 */
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import './IconBase.css';

// ── Types ─────────────────────────────────────────────────────────────────────

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export type IconColor =
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'success'
  | 'warning'
  | 'muted';

export interface IconBaseProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Icon size token → actual px:
   * xs=12 | sm=16 | md=20 | lg=24 (default) | xl=32 | 2xl=40 | 3xl=48
   */
  size?: IconSize;
  /**
   * Semantic color token. Defaults to `inherit` (uses the parent's color).
   */
  color?: IconColor;
  /** Accessible label. When provided: role="img". When omitted: aria-hidden="true". */
  'aria-label'?: string;
  /** The SVG icon element (e.g. a lucide-react component or inline <svg>). */
  children: ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const IconBase = forwardRef<HTMLSpanElement, IconBaseProps>(
  (
    {
      size = 'lg',
      color = 'inherit',
      className,
      children,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const cls = [
      'fq-icon',
      `fq-icon--${size}`,
      color !== 'inherit' ? `fq-icon--${color}` : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    const a11y = ariaLabel
      ? { role: 'img' as const, 'aria-label': ariaLabel }
      : { 'aria-hidden': true as const };

    return (
      <span ref={ref} className={cls} {...a11y} {...props}>
        {children}
      </span>
    );
  },
);

IconBase.displayName = 'IconBase';
