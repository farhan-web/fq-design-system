# Audit: Badge — vs tiket.design/system/component/badge

---

## Variants comparison

| Variant | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Solid Primary | ✅ (B400 bg, N0 text) | ✅ `variant="solid-primary"` | ✅ |
| Solid Success | ✅ (G500 bg, N0 text) | ✅ `variant="solid-success"` | ✅ |
| Solid Danger | ✅ (R500 bg, N0 text) | ✅ `variant="solid-danger"` | ✅ |
| Solid Warning | ✅ (GR100/GG100 bg, N800 text) | ✅ `variant="solid-warning"` | ✅ |
| Solid Neutral | ✅ (N400 bg, N0 text) | ✅ `variant="solid-neutral"` | ✅ |
| Soft Primary | ✅ | ✅ `variant="soft-primary"` | ✅ |
| Soft Success | ✅ | ✅ `variant="soft-success"` | ✅ |
| Soft Danger | ✅ | ✅ `variant="soft-danger"` | ✅ |
| Soft Warning | ✅ | ✅ `variant="soft-warning"` | ✅ |
| Soft Neutral | ✅ | ✅ `variant="soft-neutral"` | ✅ |

## States

| State | tiket.design | Ours | Match? |
|-------|-------------|------|--------|
| Default | ✅ | ✅ | ✅ |
| Shimmer/Loading | ✅ ON/OFF toggle | ❌ missing | **GAP** |

## Properties

| Property | tiket.design | Ours | Match? |
|----------|-------------|------|--------|
| Height | 18px | check CSS | ⚠️ check |
| Border radius | 999px (`--radius-full`) | check CSS | ⚠️ check |
| Count display | ✅ number prop | ✅ `count` prop | ✅ |
| Dot display | ✅ | ✅ `dot` prop | ✅ |
| Solid outline | 2px N0 (white border) | check CSS | ⚠️ check |
| Typography | body3 / caption | check CSS | ⚠️ check |

---

## Gaps to fix

| Priority | Gap | Fix needed |
|----------|-----|-----------|
| **HIGH** | Missing shimmer/loading state | Add CSS skeleton animation on badge when `loading` prop is true |
| **MEDIUM** | Solid badge missing 2px white outline | Add `outline: 2px solid var(--color-neutral-0)` to solid variants |

---

## No-action items

- `soft-*` naming — our pattern, maps to tiket.design's "Soft" palette
- Count/dot — our API matches tiket.design logic
