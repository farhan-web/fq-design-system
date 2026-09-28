# Audit: Tooltip — vs tiket.design/system/component/tooltip

---

## Variants comparison

| Variant | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Default (dark) | N800 bg, N0 text | ✅ | ✅ |

## Properties

| Property | tiket.design | Ours | Match? |
|----------|-------------|------|--------|
| Background | N800 (`--color-neutral-800`) | check CSS | ⚠️ check |
| Text color | N0 / text-invert | check CSS | ⚠️ check |
| Border radius | 8px (`--radius-md`) | check CSS | ⚠️ check |
| Max width | 280px | check CSS | ⚠️ check |
| Typography | body3-regular | check CSS | ⚠️ check |
| Placement top | ✅ pointer points down | ✅ `placement="top"` | ✅ |
| Placement bottom | ✅ pointer points up | ✅ `placement="bottom"` | ✅ |
| Placement left | ✅ pointer points right | ✅ `placement="left"` | ✅ |
| Placement right | ✅ pointer points left | ✅ `placement="right"` | ✅ |
| Delay | ✅ | ✅ `delayMs` prop | ✅ |
| Pointer/arrow | ✅ directional triangle | check implementation | ⚠️ check |

---

## Gaps to fix

| Priority | Gap | Fix needed |
|----------|-----|-----------|
| **LOW** | Verify bg uses `--color-neutral-800` token | Confirm no hardcoded `#1A1A1A` or similar in tooltip CSS |
| **LOW** | Verify max-width is 280px | Confirm `max-width: 280px` in tooltip CSS |
| **LOW** | Verify body3 typography token | Confirm `var(--text-body3-size)` or equivalent |

---

## No-action items

- Placement API (top/bottom/left/right) — matches tiket.design exactly
- `delayMs` — our addition, tiket.design shows delay behavior without named prop
- Dark background (no light variant) — matches tiket.design, only one style
