---
"fq-design-system": minor
---

Enterprise readiness — Phase A, B, C, D

**Accessibility (Phase A)**
- `NavigationBottom`: replaced `role="tab"` / `aria-selected` with `role="button"` / `aria-current="page"` (WCAG 2.1 §4.1.2)
- `BottomSheet`: combined Escape + Tab focus-trap handler; `aria-labelledby` from `useId()` instead of `aria-label`
- `Accordion`: keyboard nav (ArrowDown/Up/Home/End) across triggers
- `Coachmark`: auto-focuses first interactive button on open; Escape calls `onSkip`/`onDone`
- `Tabs`: `activationMode` prop (`'auto'` default | `'manual'`); `data-tab-value` for keyboard activation

**API gaps (Phase B)**
- `Accordion`: `expanded?: string | string[]` + `onExpandedChange` for controlled mode
- `Tooltip`: 12 placements, `open`/`onOpen`/`onClose` controlled mode, `leaveDelay`, `arrow`, `maxWidth`, `disableHoverListener`/`disableFocusListener`/`disableTouchListener`
- `Coachmark`: 12 placements (`top-start/end`, `bottom-start/end`, `left-start/end`, `right-start/end`)

**Token audit (Phase C)**
- Added `--font-size-2xs: 9px` and `--text-label-sm-size` to typography tokens
- Added `--color-warning-solid: #F5A623` to color tokens
- `Badge` solid-warning and `Label` small size now use tokens instead of hardcoded values

**Portal rendering (Phase C)**
- `BottomSheet`: renders into `document.body` via `ReactDOM.createPortal` by default; opt-out with `disablePortal` prop

> ⚠️ **Breaking behaviour**: `BottomSheet` now mounts outside its parent DOM tree by default. Code that relies on `closest()` traversal from within the sheet, scoped CSS selectors, or positional inheritance from a parent container will need to pass `disablePortal` to restore inline rendering.

**Exports (Phase D)**
- `BottomSheetIconAction` type now exported from package root
