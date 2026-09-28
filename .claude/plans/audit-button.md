# Audit: Button — vs tiket.design/system/component/button

---

## Variants comparison

| Variant | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Primary | ✅ | ✅ `variant="primary"` | ✅ |
| Secondary | ✅ | ✅ `variant="secondary"` | ✅ |
| Tertiary | ✅ (text + icon, no bg) | ✅ `variant="ghost"` | ✅ (name differs) |
| Alert | ✅ (red) | ✅ `variant="danger"` | ✅ (name differs) |
| **Invert** | ✅ (dark bg, white text/icon) | ❌ missing | **GAP** |

## States

| State | tiket.design | Ours | Match? |
|-------|-------------|------|--------|
| Enabled | ✅ | ✅ | ✅ |
| Pressed | ✅ | ✅ (CSS :active) | ✅ |
| Loading | ✅ | ✅ `loading` prop | ✅ |
| Disabled | ✅ | ✅ `disabled` prop | ✅ |

## Properties

| Property | tiket.design | Ours | Match? |
|----------|-------------|------|--------|
| Width | full-width / hug | ✅ `fullWidth` prop | ✅ |
| Radius | 8px (`--radius-md`) | ✅ | ✅ |
| Left icon | removable | ✅ `startIcon` | ✅ |
| Right icon | removable | ✅ `endIcon` | ✅ |
| Icon-only | — | ✅ `iconOnly` | ✅ (our addition) |
| Size sm | body3-bold, 32px height | ✅ `size="sm"` | ✅ |
| Size md | body2-bold, 40px height | ✅ `size="md"` | ✅ |
| Size lg | body1-bold, 48px height | ✅ `size="lg"` | ✅ |
| Typography | body1/2/3-bold per size | check CSS tokens | ✅ |

---

## Gaps to fix

| Priority | Gap | Fix needed |
|----------|-----|-----------|
| **HIGH** | Missing `variant="invert"` | Add: dark bg (`--color-neutral-800`), white text/icon, white pressed state |

---

## No-action items

- `ghost` vs `Tertiary` name — intentional rename, keep as-is
- `danger` vs `Alert` name — intentional rename, keep as-is
- `iconOnly` prop — our addition, not in tiket.design, keep
