---
'fq-design-system': minor
---

Add isolated.css with actual foundation/component cascade layers and no application
reset. Pair it with FqThemeProvider enableCssLayer; unlayered consumer CSS can
override it in either import order. Add reset.css as an explicit application
reset and compat.css as an alias of the existing style.css behavior. Keep the
legacy global reset and default geometry intact, with scoped internal sizing
and typography for isolated mode. No important declarations are used.
