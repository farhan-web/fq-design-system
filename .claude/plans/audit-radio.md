# Audit: Radio — vs tiket.design

> Note: Radio is not listed as a standalone component on tiket.design/system/component/overview. This is our own addition following the same form field pattern as Checkbox. Audit is against general tiket.design form field conventions.

---

## States comparison

| State | tiket.design equivalent | Ours | Match? |
|-------|------------------------|------|--------|
| Default (unselected) | N0 bg, N400 border circle | ✅ | ✅ |
| Selected | B400 bg, B400 border, N0 inner dot | ✅ `checked` prop | ✅ |
| Disabled | N100 bg, N200 border | ✅ `disabled` prop | ✅ |
| Error | R400 border | ✅ `error` prop | ✅ |

## Properties

| Property | tiket.design equivalent | Ours | Match? |
|----------|------------------------|------|--------|
| Label | body2-regular | ✅ `label` prop | ✅ |
| Helper text | body3-regular, N400 | ✅ `helperText` prop | ✅ |
| Error text | body3-regular, R400 | ✅ `error` prop | ✅ |
| Required | asterisk | ✅ `required` prop | ✅ |
| name / value | ✅ native radio group | ✅ `name` + `value` props | ✅ |

---

## Gaps to fix

None — Radio is a custom addition, no direct tiket.design counterpart to audit against.

---

## No-action items

- All states and props follow the same pattern as Checkbox — intentionally consistent
- Not present on tiket.design overview — our addition, keep as-is
