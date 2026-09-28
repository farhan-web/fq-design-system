import {
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { ButtonBase } from '@mui/material';

import './NavigationBottom.css';

export interface NavItemProps {
  value: string;
  label: string;
  icon: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface NavigationBottomProps extends HTMLAttributes<HTMLElement> {
  items: NavItemProps[];
  value: string;
  onValueChange: (value: string) => void;
}

function triggerRipple(e: MouseEvent<HTMLButtonElement>) {
  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = 48;
  // e.detail === 0 means keyboard-triggered click — center ripple on the button
  const cx = e.detail === 0 ? rect.left + rect.width / 2 : e.clientX;
  const cy = e.detail === 0 ? rect.top + rect.height / 2 : e.clientY;
  const x = cx - rect.left - size / 2;
  const y = cy - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.className = 'fq-nav-bottom__ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  button.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove(), {
    once: true,
  });
}

export const NavigationBottom = forwardRef<HTMLElement, NavigationBottomProps>(
  ({ items, value, onValueChange, className, ...props }, ref) => {
    return (
      <nav
        {...props}
        ref={ref}
        aria-label="Main navigation"
        className={['fq-nav-bottom', className].filter(Boolean).join(' ')}
      >
        {items.map((item) => {
          const isActive = item.value === value;

          return (
            <ButtonBase
              component="button"
              key={item.value}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              disabled={item.disabled}
              disableRipple
              className={[
                'fq-nav-bottom__item',
                isActive ? 'fq-nav-bottom__item--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                triggerRipple(e);
                onValueChange(item.value);
              }}
            >
              <span className="fq-nav-bottom__icon">
                {item.icon}
                {item.badge && (
                  <span className="fq-nav-bottom__badge">{item.badge}</span>
                )}
              </span>
              <span className="fq-nav-bottom__label">{item.label}</span>
            </ButtonBase>
          );
        })}
      </nav>
    );
  },
);

NavigationBottom.displayName = 'NavigationBottom';
