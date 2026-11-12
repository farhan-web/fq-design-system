---
'fq-design-system': minor
---

feat(Countdown): add display prop with Unboxed and Unboxed_Small variants

- Add `display` prop (`'boxed' | 'unboxed' | 'unboxed-small'`, default `'boxed'`) for 1:1 alignment with tiket.design spec
- **Boxed** (existing): pill segments with colored backgrounds, height 20px
- **Unboxed**: plain text without pill container, adapts color per variant (`danger`/`warning`/`neutral`)
- **Unboxed_Small**: plain text with smaller typography (9px / 12px line-height)
- Fix asymmetric gap between segments and separator: 3px before separator, 1px after (was 3px uniform)
- Export new `CountdownDisplay` type from package root
