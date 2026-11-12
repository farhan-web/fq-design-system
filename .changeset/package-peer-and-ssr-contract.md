---
'fq-design-system': minor
---

Require the MUI v6 and Emotion peers used by the public entry and bound React to
18.3.1/19.2.8 families. Remove the Lucide runtime peer and align Node requirements
with the build/test toolchain. Consumers must update unsupported runtimes/peers.

Preserve ESM/CSS entry names, fix native Node ESM imports, bundle public types,
and build fresh artifacts on pack. Add opt-in FqThemeProvider enableCssLayer for
SSR hydration/CSS overrides; its default remains false to preserve legacy styles.
Enabling it changes cascade precedence and can change dimensions, so verify the
consumer theme when adopting it.
