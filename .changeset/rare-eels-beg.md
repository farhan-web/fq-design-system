---
'fq-design-system': patch
---

Use the shared MUI modal manager for BottomSheet focus trapping, focus restore,
topmost Escape handling and backdrop dismissal alongside Dialog. Share a
document scroll lock between both components, including inline sheets.
Wait for portal content before choosing initial focus, support an empty sheet
focus fallback, preserve consumer ARIA naming, and cancel pending animation
frames and exit timers during rapid open/close or unmount. Keep the existing
sheet styles, ref target and exit animation; modal isolation and scroll locking
remain active through the exit animation.
