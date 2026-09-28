# Audit: NavigationBottom — vs tiket.design/system/component/navigation-bottom

---

## Variants comparison

| Variant | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Default | ✅ | ✅ | ✅ |

## Properties

| Property | tiket.design | Ours | Match? |
|----------|-------------|------|--------|
| Height | 64px | check CSS | ⚠️ check |
| Elevation | `--elevation-01` | check CSS | ⚠️ check |
| Icon size | 24x24 | check CSS | ⚠️ check |
| Label typography | body3-regular | check CSS | ⚠️ check |
| Active label color | B400 / `--color-primary` | check CSS | ⚠️ check |
| Active icon color | B400 / `--color-primary` | check CSS | ⚠️ check |
| Inactive color | N400 / `--color-text-low` | check CSS | ⚠️ check |
| value prop | ✅ active tab key | ✅ `value` prop | ✅ |
| onValueChange | ✅ | ✅ `onValueChange` prop | ✅ |
| items[].icon | ✅ ReactNode icon | ✅ | ✅ |
| items[].label | ✅ string | ✅ | ✅ |
| items[].badge | ✅ Badge number overlay | ✅ `badge` in item | ✅ |
| items[].disabled | ✅ | ✅ | ✅ |
| Max items | 5 tabs | check (no enforcement) | ⚠️ |

---

## Gaps to fix

| Priority | Gap | Fix needed |
|----------|-----|-----------|
| **LOW** | Verify height 64px uses no hardcoded value | Confirm `height: 64px` comes from a spacing token or is documented |
| **LOW** | Verify icon 24x24 size enforced | Check that item icons are constrained to 24x24 in CSS |

---

## No-action items

- `value` / `onValueChange` — our API matches tiket.design controlled pattern
- `items[]` shape (icon, label, badge, disabled) — our API matches
- Max 5 tabs — soft convention, no hard enforcement needed
