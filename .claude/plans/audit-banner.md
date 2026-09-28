# Audit: Banner — vs tiket.design/system/component/banner

---

## Variants comparison

| Variant | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Info | ✅ | ✅ `variant="info"` | ✅ |
| Success | ✅ | ✅ `variant="success"` | ✅ |
| Warning | ✅ | ✅ `variant="warning"` | ✅ |
| Danger | ✅ | ✅ `variant="danger"` | ✅ |

## States

| State | tiket.design | Ours | Match? |
|-------|-------------|------|--------|
| Default | ✅ | ✅ | ✅ |
| Dismissible | ✅ | ✅ `dismissible` prop | ✅ |

## Properties

| Property | tiket.design | Ours | Match? |
|----------|-------------|------|--------|
| Border radius | 8px (`--radius-md`) | check CSS | ⚠️ check |
| Elevation | `--elevation-01` | check CSS | ⚠️ check |
| Title | body1-bold | ✅ `title` prop | ✅ (verify font token) |
| Body/description | body3-regular | ✅ `description` prop | ✅ (verify font token) |
| Text link (CTA) | body3-bold, text-activity color | ❌ missing | **GAP** |
| Illustration slot | removable image/icon slot | ❌ missing | **GAP** |
| Super graphic slot | large bg decorative image | ❌ missing | **GAP** |
| Leading icon | variant-colored icon, fixed | check implementation | ⚠️ check |

---

## Gaps to fix

| Priority | Gap | Fix needed |
|----------|-----|-----------|
| **MEDIUM** | Missing text link / CTA action | Add `action` prop (`{ label: string; onClick: () => void }`) — renders body3-bold, `var(--color-text-activity)` |
| **LOW** | Missing illustration slot | Add `illustration` prop (ReactNode) — renders right-side image area |
| **LOW** | Missing super graphic | Decorative bg image support — low priority, can defer |

---

## No-action items

- Variant names (info/success/warning/danger) — our naming matches tiket.design
- `dismissible` prop — our pattern matches tiket.design's X button behavior
