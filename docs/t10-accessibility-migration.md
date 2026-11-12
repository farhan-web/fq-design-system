# T10 accessibility migration

Status: local accessibility repairs and intentional baseline review implemented;
negative probes and hosted enforcement are being verified.

This change intentionally repairs default contrast and invalid nested controls.
It changes visible defaults; inspect custom themes before upgrading. Existing
component override keys, primary native props and ref targets remain available.

- Default primary blue changes from `#007CFF` to `#0062CC` so small white text
  reaches 4.5:1. Neutral 600 changes from `#71747D` to `#6B6E77`.
- Success/danger text and surfaces now use semantic roles with explicit dark
  variants. Consumers customizing both modes should override both semantic maps.
  New semantic roles remain optional in version-1 definitions.
- Warning, invert, expired timers and dark feedback use foreground/background
  pairs. Original component aliases take precedence over the new fallbacks.
- Gradient Badge/Label text gains a semantic opaque background; BannerGradient
  text also has a background. Gradient stops remain customizable. Descendant
  text is no longer guaranteed to be a direct text node of Badge/Label roots.
- Dismissible Chips gains a passive `.fq-chips-group` around two sibling native
  buttons. Ref, className, style and native props still target the primary button.
  CSS custom properties on its style are also inherited by the dismiss action.
  Remove uses native Enter/Space activation, is disabled with the primary action,
  and has a 24 by 32 CSS-pixel target. Its width increases intentionally. Update
  selectors that expected `.fq-chips__dismiss` inside the primary button.
- BannerGradient page dots describe the current page; they are not tabs because
  the API provides no page-selection action. Coachmark steps are a live status.
  NavigationBottom derives names from visible labels and hides decorative icons.
- Loading Badge/Label honor reduced motion and expose busy/disabled states.

`npm run verify:a11y` builds stamped Storybook and audits all component/icon
stories in light and dark using a real Chromium browser. It fails on WCAG
2.0/2.1/2.2 A/AA violations and unresolved axe incomplete results. Storybook uses
`test: error` and the same rule selection. Full desktop coverage does not certify
arbitrary custom themes, every interactive state, mobile accessibility or manual
screen-reader behavior.

Axe's selected-Tab pseudo-element diagnostic is resolved only when browser
measurements prove opaque computed paint contrast of at least 4.5:1, underline
placement below the text, and unobscured hit testing. Measurements remain in the
report. All other incomplete diagnostics fail. No global rule exclusions or
screenshot baselines are used.

Existing DOM/style expected files are retained until each intentional difference
has been reviewed. T10 requires negative probes for style/layout, behavior,
accessibility and package exports plus successful hosted enforcement before it
can close. These requirements are not satisfied by a passing accessibility run.

## Reviewed baseline changes

Exactly 130 of 260 existing expected files change. Complete expected/actual JSON
comparison preserves DOM, classes, ARIA, geometry, scroll dimensions and non-paint
styles. The other 130 files remain byte-for-byte unchanged. The baseline metadata
records the previous fingerprint, affected scenario IDs and exact approved pairs.
Original values and full per-property diffs remain in the browser review artifact.

| Role/state          | Before                    | After                                         |
| ------------------- | ------------------------- | --------------------------------------------- |
| Default primary     | `#007CFF`                 | `#0062CC`                                     |
| Light primary hover | `#5BAAFF`                 | `#004B9C`                                     |
| Dark activity/hover | `#5BAAFF` or `#007CFF`    | `#A3CFFF`                                     |
| Light danger        | `#F15C59`                 | `#B52B2B`                                     |
| Dark danger         | `#F15C59`                 | `#FFBCBC`                                     |
| Dark danger subtle  | `#FFDFDF`                 | red at 15% on the inherited surface           |
| Neutral 600         | `#71747D`                 | `#6B6E77`                                     |
| Dark invert surface | white                     | semantic raised surface `#334155`             |
| Gradient text       | white/inverse on gradient | high-contrast text on semantic raised surface |

Primary subtle paint follows the updated primary palette. Color inheritance also
changes computed border/outline colors on elements without a visible border or
outline. BannerGradient's text background adds the existing 4px semantic radius
and a 2px spread of the same background; geometry remains identical. No layout,
ARIA or behavior failure was accepted through these baseline updates.
