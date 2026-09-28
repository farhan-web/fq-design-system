# Audit: Coachmark — vs tiket.design/system/component/coachmark

---

## Variants comparison

| Variant | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Default | ✅ | ✅ | ✅ |

## Properties

| Property | tiket.design | Ours | Match? |
|----------|-------------|------|--------|
| Max width | 280px | check CSS | ⚠️ check |
| Border radius | 8px (`--radius-md`) | check CSS | ⚠️ check |
| Placement | top/bottom/left/right | ✅ `placement` prop | ✅ |
| Title | heading3-bold | ✅ `title` prop | ✅ (verify font token) |
| Body text | body3-regular / body3-bold | ✅ `body` prop | ✅ (verify font token) |
| Illustration slot | removable image/icon at top | ❌ missing | **GAP** |
| Step indicator | `{step}/{totalSteps}` text | ✅ `step` + `totalSteps` | ✅ |
| Primary button | `primary` size `sm` | ✅ `onNext` → button | ✅ |
| Skip text link | body3-bold, B400 color | ✅ `onSkip` prop | ⚠️ verify style |
| Done callback | ✅ last step | ✅ `onDone` prop | ✅ |
| Text link vs Skip | tiket.design has separate text link CTA | our `onSkip` covers it | ⚠️ check |
| Pointer/arrow | directional, matches placement | check implementation | ⚠️ check |
| open prop | ✅ | ✅ `open` prop | ✅ |

---

## Gaps to fix

| Priority | Gap | Fix needed |
|----------|-----|-----------|
| **MEDIUM** | Missing illustration slot | Add `illustration` prop (ReactNode) — renders at top of coachmark above title |
| **LOW** | Skip link style | Verify `onSkip` renders as body3-bold with `var(--color-primary)` / B400, not a button |

---

## No-action items

- `step` / `totalSteps` / `onNext` / `onSkip` / `onDone` — our API matches tiket.design flow
- Placement API — matches tiket.design's directional options
- `open` prop — matches tiket.design's show/hide control
