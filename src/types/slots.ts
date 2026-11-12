import type { CSSProperties } from 'react';

/** Inline CSS, including consumer-defined custom properties. */
export type FqSlotStyle = CSSProperties & {
  [property: `--${string}`]: string | number | undefined;
};

/** Decoration only. State, events, refs and ARIA remain component-owned. */
export interface FqSlotProps {
  className?: string;
  style?: FqSlotStyle;
  [attribute: `data-${string}`]: string | number | boolean | undefined;
}

export interface FqSlotCustomization<Slot extends string> {
  classNames?: Partial<Record<Slot, string>>;
  slotProps?: Partial<Record<Slot, FqSlotProps>>;
}

/** Filter at runtime too: untyped callers cannot replace required behavior. */
export function getSlotProps<Slot extends string>(
  customization: FqSlotCustomization<Slot>,
  slot: Slot,
  className?: string,
  style?: CSSProperties,
): FqSlotProps {
  const props = customization.slotProps?.[slot];
  const result: FqSlotProps = {};
  for (const [key, value] of Object.entries(props ?? {})) {
    if (
      /^data-[a-z0-9_.-]+$/.test(key) &&
      (typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean')
    ) {
      result[key as `data-${string}`] = value;
    }
  }
  result.className =
    [className, customization.classNames?.[slot], props?.className]
      .filter(Boolean)
      .join(' ') || undefined;
  if (props?.style || style) result.style = { ...props?.style, ...style };
  return result;
}
