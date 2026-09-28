# Audit: Shadows.stories.tsx — No tiket.design counterpart

**Note**: tiket.design does NOT have a Shadows foundation page. This is our original addition.
No 1:1 comparison possible. Audit focuses on internal token adoption only.

---

## Token gaps in story code

| Line | Element | Current | Proposed | Token |
|------|---------|---------|----------|-------|
| ~142 | Token variable `<code>` fontSize | `'12px'` | `'var(--font-size-sm)'` | `--font-size-sm` |
| ~147 | Token value `<code>` fontSize | `'11px'` | `'var(--font-size-xs)'` | `--font-size-xs` |

---

## Page structure

| Section | Status |
|---------|--------|
| 2 shadow tokens (sm, md) | ✅ correct |
| Note banner linking to Elevation | ✅ good UX |
| Card uses `var(${variable})` | ✅ correct |

---

## Priority

**VERY LOW** — only 2 minor font-size token swaps. Cleanest story file.
