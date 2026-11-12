---
'fq-design-system': patch
---

Preserve existing Tooltip descriptions and child/wrapper event handlers; cancel
stale timers, coordinate hover/focus/touch, and dismiss immediately with Escape
without closing a containing Dialog. Keep tooltip content hoverable across its
placement gap. Use white text on the fixed dark tooltip surface and the semantic
raised surface for Dialog to correct unreadable dark-mode contrast.
