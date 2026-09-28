# Audit: Chips — vs tiket.design/system/component/chips

---

## Variants comparison

| Variant | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Default | ✅ (N0 bg, N800 text, N200 border) | ✅ | ✅ |
| Active | ✅ (B400 bg, N0 text, no border) | ✅ | ✅ |
| Disabled | ✅ (N100 bg, N200 text) | ✅ | ✅ |
| Error | ✅ (R50 bg, R400 border, R400 text) | ✅ | ✅ |
| **Invert** | ✅ (N800 bg, N0 text — dark mode) | ❌ missing | **GAP** |

## States

| State | tiket.design | Ours | Match? |
|-------|-------------|------|--------|
| Default | ✅ | ✅ | ✅ |
| Active | ✅ | ✅ | ✅ |
| Disabled | ✅ | ✅ | ✅ |
| Error | ✅ | ✅ | ✅ |
| Dismissible | ✅ | ✅ `onDismiss` prop | ✅ |

## Properties

| Property | tiket.design | Ours | Match? |
|----------|-------------|------|--------|
| Height | 32px | check CSS | ⚠️ check |
| Border radius | 4px (`--radius-sm` equivalent) | check CSS | ⚠️ check |
| Left icon | removable, any ReactNode | ❌ missing | **GAP** |
| Right icon | removable, any ReactNode | ❌ missing | **GAP** |
| Badge in chip | ✅ removable badge inside chip | ❌ missing | **GAP** |
| Dismiss button | ✅ X icon right side | ✅ `onDismiss` | ✅ |
| Typography | body3-regular | check CSS | ⚠️ check |

---

## Gaps to fix

| Priority | Gap | Fix needed |
|----------|-----|-----------|
| **HIGH** | Missing `variant="invert"` | Add: N800 bg, N0 text/icon, for dark surface usage |
| **MEDIUM** | Missing left/right icon support | Add `startIcon` / `endIcon` props (ReactNode) |
| **MEDIUM** | Missing badge inside chip | Add `badge` prop (renders Badge component inline, right side before dismiss) |

---

## No-action items

- `onDismiss` prop — our pattern maps to tiket.design's dismissible X button
- Error state — kept as-is, matches tiket.design
