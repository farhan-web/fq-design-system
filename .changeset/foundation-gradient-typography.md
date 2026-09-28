---
"fq-design-system": minor
---

Add gradient color palette tokens and complete typography scale.

**New tokens in `colors.css`:**
- `--color-gradient-{green,violet,orange,red,tosca,blue,purple,light-blue}-{100,200}` — 8 gradient color pairs from Passport design system
- `--color-gradient-tier-{silver,gold,platinum,diamond}-{100,200}` — 4 tier gradient pairs

**Updated tokens in `typography.css`:**
- Fixed `--text-display-line-height`: 40px → 38px (per Passport mobile spec)
- Fixed `--text-body2-line-height`: 18px → 16px (per Passport mobile spec)
- Expanded font-size raw scale: added `--font-size-{3xl→28px, 4xl→32px, 5xl→38px, 6xl→56px}`
- Added complete website typography scale: `--text-web-{banner,h1,h2,h3,body1,body2,body3,small}-{size,weight,line-height}`
