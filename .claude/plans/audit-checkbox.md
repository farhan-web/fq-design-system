# Audit: Checkbox — vs tiket.design/system/component/checkbox

---

## States comparison

| State | tiket.design | Ours | Match? |
|-------|-------------|------|--------|
| Default (unchecked) | N0 bg, N400 border | ✅ | ✅ |
| Checked | B400 bg, B400 border, N0 checkmark | ✅ `checked` prop | ✅ |
| Indeterminate | B400 bg, B400 border, N0 dash | ✅ `indeterminate` prop | ✅ |
| Disabled unchecked | N100 bg, N200 border | ✅ `disabled` prop | ✅ |
| Disabled checked | N100 bg, N200 border, N200 checkmark | ✅ `disabled + checked` | ✅ |
| Error unchecked | N0 bg, R400 border | ✅ `error` prop | ✅ |
| Error checked | R400 bg, R400 border, N0 checkmark | ✅ `error + checked` | ✅ |
| **Read-only** | N100 bg, N200 border, N200 checkmark | ❌ missing | **GAP** |

## Properties

| Property | tiket.design | Ours | Match? |
|----------|-------------|------|--------|
| Box size | 20x20px | check CSS | ⚠️ check |
| Border radius | 4px (`--radius-sm` equivalent) | check CSS | ⚠️ check |
| Label | body2-regular, N800 | ✅ `label` prop | ✅ |
| Helper text | body3-regular, N400 | ✅ `helperText` prop | ✅ |
| Error text | body3-regular, R400 | ✅ `error` prop | ✅ |
| Required | asterisk, R400 | ✅ `required` prop | ✅ |
| Checkmark icon | N0 check SVG | check CSS | ⚠️ check |
| Group layout | vertical / horizontal stack | check if supported | ⚠️ check |

---

## Gaps to fix

| Priority | Gap | Fix needed |
|----------|-----|-----------|
| **MEDIUM** | Missing read-only state | Add `readOnly` prop: N100 bg, N200 border, N200 checkmark icon, pointer-events none |

---

## No-action items

- `checked` / `indeterminate` / `disabled` / `required` / `error` — our API matches tiket.design
- `label` / `helperText` / `error` string — our Field pattern covers this
- Group layout — consumer responsibility, not component concern
