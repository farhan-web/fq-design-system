---
'fq-design-system': minor
---

feat(Label): align with tiket.design spec 1:1

**Breaking changes**

- `LabelSize`: removed `'lg'` → now `'sm' | 'md'` only (spec has exactly 2 sizes)
- Typography: `font-weight` changed from bold (700) → regular (400) per "body3-regular" spec

**Dimension fixes**

- Height is now hug (padding-based) instead of fixed px
- Medium (`md`): `padding: 4px 8px`, icon `16×16`
- Small (`sm`): `padding: 2px 8px`, icon `12×12`, font `9px`

**New props**

- `disabled?: boolean` — explicit disabled state: N100 bg, `--color-text-disabled`, icon opacity 30%
- `countdown?: ReactNode` — inline countdown slot (pass `<Countdown display="unboxed-small" />`); countdown inherits label text color
- `onExpire?: () => void` — callback hook for when embedded countdown expires (wire to Countdown's own `onExpire`)

**New variants** (all with white text, for small product labels)

- Solid: `solid-red` (R400), `solid-orange` (O500), `solid-green` (G500), `solid-blue` (B400)
- Gradient: `gradient-red` (GR100), `gradient-orange` (GO100), `gradient-green` (GG100), `gradient-tosca` (GT100), `gradient-violet` (GV100)

**Stories**: added AllSolidSubVariants, AllGradientSubVariants, WithCountdown, AllSubVariantsWithCountdown, Disabled, Loading, sizes
