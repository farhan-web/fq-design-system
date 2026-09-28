# Audit: Textfield — vs tiket.design/system/component/textfield
# Covers: Input, Select, Textarea

---

## States comparison

| State | tiket.design | Ours | Match? |
|-------|-------------|------|--------|
| Default (empty) | N0 bg, N200 border | ✅ | ✅ |
| Focused | N0 bg, B400 border (2px) | ✅ (CSS :focus) | ✅ |
| Filled (has value) | N0 bg, N200 border | ✅ | ✅ |
| Error | N0 bg, R400 border | ✅ `error` prop | ✅ |
| Disabled | N100 bg, N200 border, N200 text | ✅ `disabled` prop | ✅ |
| Read-only | N50 bg, N200 border | ⚠️ check bg token | ⚠️ check |

## Properties

| Property | tiket.design | Ours | Match? |
|----------|-------------|------|--------|
| Height | 52px (Input/Select) | check CSS | ⚠️ check |
| Border radius | 8px (`--radius-md`) | ✅ | ✅ |
| Label | body2-bold, N800 text | ✅ `label` prop | ✅ (verify token) |
| Placeholder | body3-regular, N200 text | ✅ | ✅ (verify token) |
| Input text | body2-regular, N800 text | ✅ | ✅ (verify token) |
| Helper text | body3-regular, N400 text | ✅ `helperText` prop | ✅ (verify token) |
| Error text | body3-regular, R400 text | ✅ `error` prop | ✅ (verify token) |
| Left icon | 20x20, N400 color | ✅ `startIcon` | ✅ |
| Right icon | 20x20, N400 color | ✅ `endIcon` | ✅ |
| Required asterisk | ✅ red asterisk | ✅ `required` prop | ✅ |
| Textarea resize | none (fixed height) | check CSS | ⚠️ check |
| Character count | optional below textarea | ❌ missing | **GAP** |

---

## Gaps to fix

| Priority | Gap | Fix needed |
|----------|-----|-----------|
| **MEDIUM** | Read-only bg may be wrong | Confirm `--color-neutral-50` / `var(--color-surface)` used for read-only state, not N0 |
| **MEDIUM** | Missing character count | Add `maxLength` display below Textarea: `{currentLength}/{maxLength}` in body3, N400 |
| **LOW** | Verify icon color uses `--color-text-low` or N400 token | Check startIcon/endIcon color in Input.css |

---

## No-action items

- Input + Select + Textarea all follow same Field pattern — intentional, matches tiket.design "textfield" grouping
- `useFormField` / `FieldContext` pattern — internal, not visible to tiket.design
- Required asterisk behavior — our pattern matches
