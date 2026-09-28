# Audit: Radius.stories.tsx — No tiket.design counterpart

**Note**: tiket.design does NOT have a Radius foundation page. This is our original addition.
No 1:1 comparison possible. Audit focuses on internal token adoption only.

---

## Token gaps in story code

| Line | Element | Current | Proposed | Token |
|------|---------|---------|----------|-------|
| ~111 | Table header `<span>` fontSize | `'12px'` | `'var(--font-size-sm)'` | `--font-size-sm` |
| ~111 | Table header `<span>` fontWeight | `600` | `'var(--font-weight-semibold)'` | `--font-weight-semibold` |
| ~149 | Token `<code>` fontSize | `'11px'` | `'var(--font-size-xs)'` | `--font-size-xs` |
| ~159 | Value `<span>` fontWeight | `600` | `'var(--font-weight-semibold)'` | `--font-weight-semibold` |
| ~168 | Usage `<span>` fontSize | `'12px'` | `'var(--font-size-sm)'` | `--font-size-sm` |
| ~238 | RadiusCard outer wrapper `borderRadius` | `'12px'` | `'var(--radius-lg)'` | `--radius-lg` |

---

## Page structure (self-consistent, no external reference)

| Section | Status |
|---------|--------|
| Token reference table | ✅ good structure |
| Visual comparison grid | ✅ good |
| Preview block in RadiusCard | ✅ uses `var(${variable})` correctly |

---

## Priority

**LOW** — all changes are token-cleanup only. No structural changes needed.
