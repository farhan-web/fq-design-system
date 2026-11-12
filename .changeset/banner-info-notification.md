---
'fq-design-system': minor
---

Add BannerInfo component; update Banner (Notification) to spec

**BannerInfo** (new component):

- White card with `elevation-01` shadow, 8px radius, 12px padding
- Props: `title`, `description` (ReactNode), `action`, `onClose`, `illustration` (80×80 slot), `superGraphic` (96×93 decorative top-right)
- Close button positioned absolutely at top-right; `padding-right: 44px` applied when closable
- Fully keyboard-accessible; illustration slot is AT-accessible (consumer controls `alt` text)

**Banner** (notification) — spec alignment:

- Added `layout` prop: `'sectional'` (default, 8px radius + optional × dismiss) | `'full-width'` (0px radius + chevron, tappable)
- `full-width` layout is keyboard-accessible: `tabIndex={0}`, Enter/Space fire `onClick`
- Removed border from all variants
- Padding corrected to `12px` all sides (was `12px 16px`)
- Icon corrected to `24×24` (was `20×20`)
- Description color corrected to `--color-text-high` (was `--color-text-medium`)
- Action link color corrected to `--color-text-activity` (was `--color-primary`)
- Added `:active` press states on dismiss and action buttons
