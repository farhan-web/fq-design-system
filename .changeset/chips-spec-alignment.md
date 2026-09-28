---
"fq-design-system": minor
---

feat(Chips): align with tiket.design spec 1:1

- **Border radius**: `--radius-xs` (4px) → `--radius-full` (999px pill shape) per visual spec
- **Typography**: body3 → body2 (`--text-body2-size`/weight); active state uses `--text-body2-bold-weight`
- **Active text color**: `--color-primary` → `--color-text-activity` per spec
- **Disabled state**: replace `opacity: 0.4` with explicit `background: --color-surface`, `border: transparent`, `color: --color-text-disabled`
- **Invert active**: correct background to `rgba(255,255,255,0.4)` + `--color-border` border (was N800 same as inactive)
- **Invert error**: no red border in invert mode (same as invert inactive per spec)
- **Icon colors**: explicit per-state color tokens (high/activity/disabled/inverse) instead of inherit
- **Dismiss HTML fix**: replace invalid nested `<button>` inside chip `<button>` with `<span role="button" tabIndex={0}>` + keyboard handler (Enter/Space); fix tap area to full 32px height via `align-self: stretch`
- **`onDismiss` signature**: changed from `(e: MouseEvent<HTMLButtonElement>) => void` → `() => void` (breaking — event object was not needed)
- **Stories**: added AllStates, Invert, InvertActive, InvertDisabled, InvertError, AllInvertStates, WithStartIcon, WithEndIcon, WithBothIcons, WithBadge, FullFeatured, Dismissible variants
