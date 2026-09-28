import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import './Accordion.css';

// ── Context ──────────────────────────────────────────────────────────────────

interface AccordionContextValue {
  openItems: Set<string | number>;
  toggle: (id: string | number) => void;
  insideCard: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('AccordionItem must be used inside <Accordion>');
  return ctx;
}

// ── Accordion (root) ─────────────────────────────────────────────────────────

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow multiple items open simultaneously */
  multiple?: boolean;
  /** Initial open item(s) for uncontrolled usage */
  defaultOpen?: string | number | (string | number)[];
  /**
   * Controlled open items. When provided, open/close is driven externally.
   * Use with onExpandedChange.
   */
  expanded?: string | number | (string | number)[];
  /**
   * Called when an item is toggled.
   * Receives the full array of currently open item values.
   * Also fires in uncontrolled mode as a change observer.
   */
  onExpandedChange?: (values: (string | number)[]) => void;
  /**
   * When true each item renders as an elevated card (shadow, no border).
   * When false (default) each item has a 1px border, no shadow.
   * Matches tiket.design "Inside Card: True / False" variants.
   */
  insideCard?: boolean;
  children?: ReactNode;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      multiple = false,
      defaultOpen,
      expanded,
      onExpandedChange,
      insideCard = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = expanded !== undefined;

    const initial = defaultOpen
      ? new Set(Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen])
      : new Set<string | number>();

    const [internalOpen, setInternalOpen] =
      useState<Set<string | number>>(initial);

    const openItems: Set<string | number> = isControlled
      ? new Set(
          Array.isArray(expanded) ? expanded : [expanded as string | number],
        )
      : internalOpen;

    // Stable ref so toggle callback never goes stale
    const openItemsRef = useRef(openItems);
    openItemsRef.current = openItems;

    const toggle = useCallback(
      (id: string | number) => {
        const current = openItemsRef.current;
        const next = new Set(current);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!multiple) next.clear();
          next.add(id);
        }
        if (!isControlled) setInternalOpen(next);
        onExpandedChange?.([...next]);
      },
      [multiple, isControlled, onExpandedChange],
    );

    return (
      <AccordionContext.Provider value={{ openItems, toggle, insideCard }}>
        <div
          {...props}
          ref={ref}
          className={[
            'fq-accordion',
            insideCard ? 'fq-accordion--inside-card' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);
Accordion.displayName = 'Accordion';

// ── AccordionItem ─────────────────────────────────────────────────────────────

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number;
  disabled?: boolean;
  children?: ReactNode;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled, children, className, ...props }, ref) => {
    const { openItems } = useAccordionContext();
    const isOpen = openItems.has(value);

    return (
      <div
        {...props}
        ref={ref}
        data-value={value}
        data-disabled={disabled || undefined}
        className={[
          'fq-accordion__item',
          isOpen ? 'fq-accordion__item--open' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    );
  },
);
AccordionItem.displayName = 'AccordionItem';

// ── AccordionTrigger ──────────────────────────────────────────────────────────

export interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  children?: ReactNode;
}

export const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ value, disabled, children, className, onKeyDown, ...props }, ref) => {
  const { openItems, toggle } = useAccordionContext();
  const isOpen = openItems.has(value);
  const panelId = `accordion-panel-${value}`;
  const triggerId = `accordion-trigger-${value}`;

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const accordion = e.currentTarget.closest('.fq-accordion');
    if (accordion) {
      const triggers = Array.from(
        accordion.querySelectorAll<HTMLButtonElement>(
          '.fq-accordion__trigger:not(:disabled)',
        ),
      );
      const idx = triggers.indexOf(e.currentTarget);

      if (idx !== -1) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          triggers[(idx + 1) % triggers.length].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          triggers[(idx - 1 + triggers.length) % triggers.length].focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          triggers[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          triggers[triggers.length - 1].focus();
        }
      }
    }
    onKeyDown?.(e);
  };

  return (
    <button
      {...props}
      ref={ref}
      id={triggerId}
      type="button"
      className={['fq-accordion__trigger', className].filter(Boolean).join(' ')}
      aria-expanded={isOpen}
      aria-controls={panelId}
      disabled={disabled}
      onClick={() => toggle(value)}
      onKeyDown={handleKeyDown}
    >
      <span>{children}</span>
      <svg
        className="fq-accordion__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

// ── AccordionContent ──────────────────────────────────────────────────────────

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children?: ReactNode;
}

export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ value, children, className, ...props }, ref) => {
  const { openItems } = useAccordionContext();
  const isOpen = openItems.has(value);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(
    isOpen ? undefined : 0,
  );
  const triggerId = `accordion-trigger-${value}`;
  const panelId = `accordion-panel-${value}`;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (isOpen) {
      setHeight(el.scrollHeight);
      const timer = setTimeout(() => setHeight(undefined), 210);
      return () => clearTimeout(timer);
    } else {
      setHeight(el.scrollHeight);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [isOpen]);

  return (
    <div
      ref={(node) => {
        (contentRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
        if (typeof ref === 'function') ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      id={panelId}
      role="region"
      aria-labelledby={triggerId}
      className={['fq-accordion__content', className].filter(Boolean).join(' ')}
      style={{ height: height === undefined ? 'auto' : `${height}px` }}
      hidden={!isOpen && height === 0}
    >
      <div {...props} className="fq-accordion__body">
        {children}
      </div>
    </div>
  );
});
AccordionContent.displayName = 'AccordionContent';
