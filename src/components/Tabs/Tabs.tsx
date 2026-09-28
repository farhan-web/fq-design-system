import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { ButtonBase } from '@mui/material';

import './Tabs.css';

// ── Context ─────────────────────────────────────────────────────────────────

interface TabsContextValue {
  value: string | number;
  onSelect: (value: string | number) => void;
  baseId: string;
  activationMode: 'auto' | 'manual';
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs sub-components must be used inside <Tabs>');
  return ctx;
}

// ── Tabs (root) ──────────────────────────────────────────────────────────────

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  /** Controlled selected tab value */
  value?: string | number;
  /** Default selected tab for uncontrolled usage */
  defaultValue?: string | number;
  onValueChange?: (value: string | number) => void;
  /**
   * How arrow-key navigation activates tabs.
   * - 'auto' (default): focus + immediately selects the tab (ARIA recommended).
   * - 'manual': focus only — user must press Enter/Space to activate.
   */
  activationMode?: 'auto' | 'manual';
  /** Dark/inverted surface variant */
  invert?: boolean;
  children?: ReactNode;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value: controlledValue,
      defaultValue = '',
      onValueChange,
      activationMode = 'auto',
      invert = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const current = isControlled ? controlledValue : uncontrolled;
    const baseId = useId();

    const handleSelect = useCallback(
      (v: string | number) => {
        if (!isControlled) setUncontrolled(v);
        onValueChange?.(v);
      },
      [isControlled, onValueChange],
    );

    return (
      <TabsContext.Provider
        value={{
          value: current,
          onSelect: handleSelect,
          baseId,
          activationMode,
        }}
      >
        <div
          {...props}
          ref={ref}
          className={['fq-tabs', invert ? 'fq-tabs--invert' : '', className]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);
Tabs.displayName = 'Tabs';

// ── TabList ──────────────────────────────────────────────────────────────────

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  /** Distribute tabs equally across full width (Equally Distributed: True per spec) */
  equallyDistributed?: boolean;
  children?: ReactNode;
}

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ children, className, equallyDistributed = false, ...props }, ref) => {
    const listRef = useRef<HTMLDivElement>(null);
    const { activationMode, onSelect } = useTabsContext();

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const triggers = Array.from(
        (
          listRef.current ?? (e.currentTarget as HTMLDivElement)
        ).querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
      );
      const idx = triggers.indexOf(document.activeElement as HTMLButtonElement);
      if (idx === -1) return;

      let target: HTMLButtonElement | null = null;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        target = triggers[(idx + 1) % triggers.length];
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        target = triggers[(idx - 1 + triggers.length) % triggers.length];
      } else if (e.key === 'Home') {
        e.preventDefault();
        target = triggers[0];
      } else if (e.key === 'End') {
        e.preventDefault();
        target = triggers[triggers.length - 1];
      }

      if (target) {
        target.focus();
        if (activationMode === 'auto') {
          // Read value from the tab button's aria-controls attribute indirection,
          // or from data-value set by Tab component.
          const tabValue = target.getAttribute('data-tab-value');
          if (tabValue) onSelect(tabValue);
        }
      }
    };

    return (
      <div
        {...props}
        ref={(node) => {
          (listRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
          if (typeof ref === 'function') ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
        }}
        role="tablist"
        className={[
          'fq-tabs__list',
          equallyDistributed ? 'fq-tabs__list--equal' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    );
  },
);
TabList.displayName = 'TabList';

// ── Tab ──────────────────────────────────────────────────────────────────────

export interface TabProps extends HTMLAttributes<HTMLButtonElement> {
  value: string | number;
  disabled?: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
  children?: ReactNode;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ value, disabled, icon, badge, children, className, ...props }, ref) => {
    const { value: selected, onSelect, baseId } = useTabsContext();
    const isSelected = selected === value;

    return (
      <ButtonBase
        component="button"
        {...props}
        ref={ref}
        role="tab"
        type="button"
        data-tab-value={value}
        className={['fq-tabs__trigger', className].filter(Boolean).join(' ')}
        aria-selected={isSelected}
        aria-controls={`${baseId}-panel-${value}`}
        id={`${baseId}-tab-${value}`}
        tabIndex={isSelected ? 0 : -1}
        disabled={disabled}
        disableRipple
        onClick={() => onSelect(value)}
      >
        {icon && (
          <span className="fq-tabs__trigger-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="fq-tabs__trigger-label">{children}</span>
        {badge && <span className="fq-tabs__badge">{badge}</span>}
      </ButtonBase>
    );
  },
);
Tab.displayName = 'Tab';

// ── TabPanel ─────────────────────────────────────────────────────────────────

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number;
  children?: ReactNode;
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ value, children, className, ...props }, ref) => {
    const { value: selected, baseId } = useTabsContext();
    const isSelected = selected === value;

    if (!isSelected) return null;

    return (
      <div
        {...props}
        ref={ref}
        role="tabpanel"
        id={`${baseId}-panel-${value}`}
        aria-labelledby={`${baseId}-tab-${value}`}
        tabIndex={0}
        className={['fq-tabs__panel', className].filter(Boolean).join(' ')}
      >
        {children}
      </div>
    );
  },
);
TabPanel.displayName = 'TabPanel';
