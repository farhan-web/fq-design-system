# Audit: BottomSheet — vs tiket.design/system/component/bottom-sheet

---

## Variants comparison

| Variant | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Default | ✅ | ✅ | ✅ |

## States

| State | tiket.design | Ours | Match? |
|-------|-------------|------|--------|
| Closed | ✅ | ✅ | ✅ |
| Open | ✅ | ✅ `open` prop | ✅ |
| Backdrop dismiss | ✅ | ✅ `backdropDismiss` prop | ✅ |

## Properties

| Property | tiket.design | Ours | Match? |
|----------|-------------|------|--------|
| Border radius | 16px top / 0px bottom | check CSS | ⚠️ check |
| Elevation | `--elevation-01` on sheet | check CSS | ⚠️ check |
| Handle | fixed (always present, un-removable) | ✅ `handle` prop (but should default true) | ⚠️ check |
| Title | heading2 (default) → heading3 (on scroll) | ✅ `title` prop | ⚠️ scrolling behavior missing |
| Scroll title resize | title shrinks on body scroll | ❌ missing | **GAP** |
| Link action | body1-bold, text-activity color | ❌ missing | **GAP** |
| onClose | ✅ | ✅ `onClose` prop | ✅ |
| Backdrop overlay | ✅ semi-transparent | check CSS | ⚠️ check |

---

## Gaps to fix

| Priority | Gap | Fix needed |
|----------|-----|-----------|
| **MEDIUM** | Missing link action in header | Add `action` prop (`{ label: string; onClick: () => void }`) — renders body1-bold, `var(--color-text-activity)` in top-right of header |
| **LOW** | Missing scroll-triggered title size change | On body scroll, title transitions heading2 → heading3 — can defer |
| **LOW** | Handle should default to `true` | Verify `handle` prop defaults to showing the drag handle |

---

## No-action items

- `open` / `onClose` / `backdropDismiss` props — our API matches tiket.design
- Elevation + backdrop — implementation detail, confirm tokens used
