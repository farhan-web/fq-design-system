# Audit: Spacing.stories.tsx — vs tiket.design/system/foundation/spacing

---

## 1. Page structure

| Section | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Hero illustration | 3D spacing blocks | None | ❌ |
| "Foundations" + "Spacing" heading | ✅ | ✅ | ✅ |
| Description text | ✅ | ✅ | ✅ |
| Layout scale section | ✅ | ✅ | ✅ |
| Implementation examples | ✅ (real product screenshots) | ✅ (abstract cards) | ❌ |
| All spacing tokens table | ❌ | ✅ | (our addition) |

---

## 2. Layout scale table — column structure

| Column | tiket.design | Ours | Match? |
|--------|-------------|------|--------|
| Col 1 header | "Token" | "Token" | ✅ (name same) |
| Col 1 data | "Small", "Medium", "Large"… (semantic names) | `--spacing-8` (CSS vars) | ❌ |
| Col 2 header | "Name" | "Name" | ✅ |
| Col 2 data | "x", "1.5 x", "2 x"… (multipliers) | "Small", "Medium"… (semantic names) | ❌ (swapped!) |
| Col 3 header | "px" | "px" | ✅ |
| Col 3 data | 8, 12, 16… | 8, 12, 16… | ✅ |
| Col 4 header | "Example" | "Example" | ✅ |
| Col 4 visual | **Square block** (W = H = px value) | **Horizontal bar** (fixed height 16px, width = px) | ❌ |

### Fix for Example column:
```tsx
// Current (horizontal bar):
<div style={{ width: `${row.px}px`, height: '16px', background: 'var(--color-warning)' }} />

// Should be (square):
<div style={{ width: `${row.px}px`, height: `${row.px}px`, background: 'var(--color-warning)' }} />
```

### Fix for column data mapping:
In tiket.design, "Token" column = semantic name, "Name" = multiplier.
Our mapping currently puts CSS var in Token, semantic name in Name.
**Options**: swap our column data, or rename headers to match what we show.
Recommended: rename col 1 header to "Name", col 2 to "Multiplier" to match what we display.

---

## 3. Implementation examples — MAJOR DIFFERENCE

### tiket.design:
- Shows **real product UI screenshots** (PDP hotel page, SRP search results)
- Pink spacing measurement annotations overlaid on actual product UI
- Numbers (4, 8, 16, 20) shown as measurement markers
- Extremely visual and concrete

### Ours:
- Abstract description cards (PDP / SRP / Landing)
- Each card shows a horizontal bar chart of the tokens used
- Much more abstract, less visually informative

### Fix options:
| Option | Effort | Impact |
|--------|--------|--------|
| Replace with real product screenshot images (static) | Low-medium | High |
| Keep abstract cards but improve visual | Low | Medium |
| Add spacing overlay demo on mock UI | High | Highest |

**Recommended**: Add one real product screenshot image with spacing annotations, or at minimum change the abstract card visual to be more illustrative.

---

## 4. Token reference (our addition, not in tiket.design)

Our "All spacing tokens" section at the bottom is an original addition. tiket.design doesn't have it. Keep as-is — it's a useful developer reference.

---

## 5. Remaining token gaps (font sizes in story)

| Line | Element | Current | Proposed | Token |
|------|---------|---------|----------|-------|
| Table header | `fontWeight` in `<span>` | `600` | `'var(--font-weight-semibold)'` | `--font-weight-semibold` |
| ~184 | Code in table rows | `fontSize: '11px'` | `'var(--font-size-xs)'` | `--font-size-xs` |
| ~204 | px value `fontWeight` | `600` | `'var(--font-weight-semibold)'` | `--font-weight-semibold` |
| ~223 | Bar annotation | `fontSize: '11px'` | `'var(--font-size-xs)'` | `--font-size-xs` |
| UsageCard density chip | `fontSize: '11px'` | `'var(--font-size-xs)'` | `--font-size-xs` |
| AllTokensTable `<th>` | `fontWeight: 600` | `'var(--font-weight-semibold)'` | `--font-weight-semibold` |
| AllTokensTable token td | `fontSize: '12px'` | `'var(--font-size-sm)'` | `--font-size-sm` |

---

## Priority fixes (ranked)

1. **HIGH** Example column: horizontal bar → square block (1-line CSS change)
2. **HIGH** Table column mapping: fix Token/Name column data alignment with tiket.design
3. **MEDIUM** Implementation examples: add real product context
4. **LOW** Font size token cleanups above
