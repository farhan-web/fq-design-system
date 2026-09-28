# Audit: BannerGradient — vs tiket.design/system/component/banner-gradient

---

## Sub-type comparison

| Sub-type | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Small strip (48px) | ✅ single-line, right chevron | ⚠️ partial | ⚠️ |
| Big rounded | ✅ card-style, rounded corners | ⚠️ partial | ⚠️ |
| Big rectangle | ✅ full-bleed rectangle | ⚠️ partial | ⚠️ |

## Properties

| Property | tiket.design | Ours | Match? |
|----------|-------------|------|--------|
| Title | heading2 (big) / body1-bold (small) | ✅ `title` prop | ✅ |
| Subtitle | body3-regular | ✅ `subtitle` prop | ✅ |
| Left icon/media slot | removable, any ReactNode | ✅ `media` slot | ✅ |
| Action slot | right side, any ReactNode | ✅ `action` slot | ✅ |
| Right chevron | fixed chevron icon on small strip | ❌ missing dedicated prop | **GAP** |
| Embedded countdown | ✅ Countdown component inside | ❌ missing | **GAP** |
| Carousel behavior | swipeable multiple banners | ❌ out of scope | — |
| Sub-type prop | small / big-rounded / big-rect | ❌ missing | **GAP** |
| Background gradient | CSS gradient tokens | check CSS | ⚠️ check |

---

## Gaps to fix

| Priority | Gap | Fix needed |
|----------|-----|-----------|
| **HIGH** | Missing `size` / sub-type prop | Add `size="sm" | "lg"` to switch between strip (48px) and card layout |
| **MEDIUM** | Missing embedded countdown slot | Add `countdown` prop (ReactNode / Countdown component slot) |
| **LOW** | Right chevron on small strip | Add chevron icon automatically when `size="sm"` |
| **LOW** | Carousel — out of scope for this library | Skip |

---

## No-action items

- `media` slot — our implementation maps to tiket.design's left icon slot
- `action` slot — our pattern matches tiket.design's action area
- Carousel behavior — multi-instance orchestration, not a component concern
