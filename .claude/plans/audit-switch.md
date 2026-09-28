# Audit: Switch — vs tiket.design

> Note: Switch is not listed as a standalone component on tiket.design/system/component/overview. This is our own addition following the same form field pattern as Checkbox. Audit is against general tiket.design form field conventions.

---

## States comparison

| State | tiket.design equivalent | Ours | Match? |
|-------|------------------------|------|--------|
| Default (off) | N200 track, N0 thumb | ✅ | ✅ |
| On | B400 track, N0 thumb | ✅ `checked` prop | ✅ |
| Disabled off | N100 track, N0 thumb, muted | ✅ `disabled` prop | ✅ |
| Disabled on | B200/muted track, N0 thumb | ✅ `disabled + checked` | ✅ |

## Properties

| Property | tiket.design equivalent | Ours | Match? |
|----------|------------------------|------|--------|
| Label | body2-regular | ✅ `label` prop | ✅ |
| Helper text | body3-regular, N400 | ✅ `helperText` prop | ✅ |
| Error text | body3-regular, R400 | ✅ `error` prop | ✅ |
| Required | asterisk | ✅ `required` prop | ✅ |
| Track dimensions | ~44x24px typical | check CSS | ⚠️ check |
| Thumb dimensions | ~20x20px, circular | check CSS | ⚠️ check |
| Transition | smooth slide animation | check CSS | ⚠️ check |

---

## Gaps to fix

| Priority | Gap | Fix needed |
|----------|-----|-----------|
| **LOW** | Verify track/thumb use token-based colors | Confirm no hardcoded color values in Switch.css |

---

## No-action items

- Not present on tiket.design overview — our addition, keep as-is
- All states/props follow same pattern as Checkbox — intentionally consistent
