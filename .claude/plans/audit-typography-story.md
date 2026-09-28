# Audit: Typography.stories.tsx — vs tiket.design/system/foundation/typography-mobile

---

## 1. Page structure

| Section | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Hero illustration | 3D "Aa" icon | None | ❌ |
| "Foundations" + "Typography" heading | ✅ | ✅ | ✅ |
| Description text | ✅ | ✅ | ✅ |
| Tabs: Mobile / Website | "Mobile typography" \| "Website typography" | "Mobile" \| "Website" | ✅ (close) |
| Font showcase card | ✅ purple/magenta card | ✅ dark card | ✅ (different color) |
| Allowed weight section | ✅ | ✅ | ✅ |
| Styles table | ✅ | ✅ | ✅ |
| Typography rules section | ❌ not present | ✅ our addition | (our addition) |

---

## 2. Font showcase card

| Detail | tiket.design | Ours | Match? |
|--------|-------------|------|--------|
| Font name | "Tiket Odyssey Text" | "Inter" | ❌ (by design — we use Inter) |
| Card color | Purple/magenta (#8B1A6B-ish) | Dark (#1C1C1C) | ❌ |
| Character display | Aa Bb Cc… + 0-9 + special chars on dashed baseline | Aa Bb Cc… | ✅ similar |

**Note**: Font difference is intentional — FQ DS uses Inter. Color of showcase card could be updated to be more visually interesting (not just dark).

---

## 3. Allowed weight section

| Detail | tiket.design | Ours | Match? |
|--------|-------------|------|--------|
| 3 dark cards | Regular (400) \| SemiBold (600) \| Bold (700) | ✅ same | ✅ |
| Card bg color | ~#1E1E1E dark | ✅ similar | ✅ |
| Weight name rendered in actual weight | ✅ | ✅ | ✅ |
| Weight value below name | Lighter gray text | ✅ similar | ✅ |

---

## 4. Styles table — column structure

| Column | tiket.design | Ours | Match? |
|--------|-------------|------|--------|
| Col 1 | "Properties" → Size/Weight/Line height | ✅ | ✅ |
| Col 2 | "Use for" → description | ✅ | ✅ |
| Col 3 | "Styles" → live text preview | ✅ | ✅ |
| Row style | White bg, thin border separator | ✅ | ✅ |
| Header | Dark (#171918) | ✅ | ✅ |

---

## 5. Type scale values — IMPORTANT DIFFERENCE

| Style | tiket.design size | Our token | Our size |
|-------|------------------|-----------|----------|
| Heading 1 | **32px** / 700 / 38px lh | `--text-display-size` | 32px ✅ |
| Heading 2 | **22px** / 700 / 28px lh | `--font-size-2xl` | 22px ✅ |
| Heading 3 | **18px** / 700 / 24px lh | `--text-h2-size` | 18px ✅ (close) |
| Body 1 | **16px** / 700+400 / 22px lh | `--text-body1-size` | **14px** ❌ |
| Body 2 | **14px** / 700+400 / 20px lh | `--text-body2-size` | **12px** ❌ |
| Body 3 | **12px** / 700+400 / 16px lh | `--font-size-sm` | 12px ✅ |
| Small | **10px** / 600 / 14px lh | `--font-size-xs` | 10px ✅ |

**Key discrepancy**: tiket.design body1=16px, body2=14px. Our body1=14px, body2=12px. This cascades to all components using these tokens.

**Decision needed**: Do we align our scale (14→16, 12→14) or keep our current scale intentionally? This would be a breaking change across all components.

---

## 6. Remaining token gaps in story code

| Location | Current | Proposed |
|----------|---------|----------|
| StylesTable header `<span>` | `fontSize: '12px', fontWeight: 600` | `var(--font-size-sm)`, `var(--font-weight-semibold)` |
| StylesTable Properties rows | `fontSize: '12px'` (×3 lines) | `var(--font-size-sm)` |
| StylesTable Use for column | `fontSize: '12px'` | `var(--font-size-sm)` |
| StylesTable preview `fontWeight` | `400` (numeric) | `var(--font-weight-regular)` |
| TypographyRules "directly translate" | `fontSize: '11px'` | `var(--font-size-xs)` |
| TypographyRules range labels | `fontSize: '11px'` (×2) | `var(--font-size-xs)` |
| TypographyRules spec labels | `fontSize: '11px'` | `var(--font-size-xs)` |
| AllowedWeightSection `fontWeight` | `fontWeight: Number(w.value)` | ⛔ keep dynamic |

---

## Priority fixes (ranked)

1. **DECISION** Body1/Body2 scale: align to tiket (16/14) or keep (14/12)? Affects all components.
2. **MEDIUM** Font size token cleanups (11px/12px → xs/sm tokens)
3. **LOW** Font showcase card color (dark → more vibrant?)
