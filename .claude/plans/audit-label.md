# Audit: Label — vs tiket.design/system/component/label

---

## Variants comparison

| Variant | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Primary | ✅ | ✅ `variant="primary"` | ✅ |
| Success | ✅ | ✅ `variant="success"` | ✅ |
| Danger | ✅ | ✅ `variant="danger"` | ✅ |
| Warning | ✅ | ✅ `variant="warning"` | ✅ |
| Neutral | ✅ | ✅ `variant="neutral"` | ✅ |
| Outline Primary | ✅ | ✅ `variant="outline-primary"` | ✅ |
| Outline Danger | ✅ | ✅ `variant="outline-danger"` | ✅ |

## States

| State | tiket.design | Ours | Match? |
|-------|-------------|------|--------|
| Default | ✅ | ✅ | ✅ |
| Shimmer/Loading | ✅ ON/OFF toggle | ❌ missing | **GAP** |

## Properties

| Property | tiket.design | Ours | Match? |
|----------|-------------|------|--------|
| Size Medium | body3 text, 16x16 icon | ✅ default | ✅ |
| Size Small | caption text, 12x12 icon | ✅ `size="sm"` | ✅ |
| Left icon | 16x16 (md) / 12x12 (sm), removable | ❌ missing | **GAP** |
| Embedded countdown | ✅ countdown inside label | ❌ missing | **GAP** |
| Typography Medium | body3-regular | check CSS | ⚠️ check |
| Typography Small | caption | check CSS | ⚠️ check |

---

## Gaps to fix

| Priority | Gap | Fix needed |
|----------|-----|-----------|
| **HIGH** | Missing icon support | Add `startIcon` prop (ReactNode), render 16x16 (md) / 12x12 (sm) container |
| **MEDIUM** | Missing shimmer/loading state | Add `loading` prop with CSS skeleton animation |
| **LOW** | Embedded countdown | Add `countdown` prop (renders Countdown component inline) — optional, can defer |

---

## No-action items

- Variant naming — our pattern maps cleanly to tiket.design
- Size sm/default — matches tiket.design medium/small split
