# Audit: Accordion — vs tiket.design/system/component/accordion

---

## Variants comparison

| Variant | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Default | ✅ | ✅ | ✅ |

## States

| State | tiket.design | Ours | Match? |
|-------|-------------|------|--------|
| Collapsed | ✅ | ✅ | ✅ |
| Expanded | ✅ | ✅ | ✅ |

## Properties

| Property | tiket.design | Ours | Match? |
|----------|-------------|------|--------|
| Border radius | 8px (`--radius-md`) | check CSS | ⚠️ check |
| Chevron icon | right side, fixed (un-removable) | check implementation | ⚠️ check |
| Chevron rotation | rotates on expand | check CSS | ⚠️ check |
| Dynamic header | any content (ReactNode) | check `header` prop | ⚠️ check |
| Multiple open | ✅ | ✅ `multiple` prop | ✅ |
| Default open | ✅ | ✅ `defaultOpen` prop | ✅ |
| Body/content | any ReactNode | ✅ children | ✅ |
| Divider between items | ✅ 1px `--color-border` | check CSS | ⚠️ check |

---

## Gaps to fix

| Priority | Gap | Fix needed |
|----------|-----|-----------|
| **LOW** | Verify border-radius uses `--radius-md` (8px) token | Confirm no hardcoded `8px` in accordion CSS |
| **LOW** | Verify chevron is right-aligned and non-removable | Confirm implementation matches tiket.design |

---

## No-action items

- `multiple` + `defaultOpen` props — our API matches
- ReactNode children — our pattern matches tiket.design's "dynamic body" approach
