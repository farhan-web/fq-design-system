---
'fq-design-system': minor
---

Add versioned, validated theme configuration and a shared source for generated
foundation CSS and MUI values. Export createFqTheme, token parsing/variable helpers,
default definitions, density presets, and the theme-schema.json package entry.
FqThemeProvider can apply tokens, explicit mode and density in a scoped opt-in
boundary; its legacy theme-only path keeps the existing DOM. Preserve legacy
spacing aliases with documented precedence. Add Button/Input component overrides
and initial Button density support; broader component migration remains separate.
