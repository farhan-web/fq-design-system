# Component token reference

T09 covers 27 families: 25 closed component groups with 349
CSS-consumed override keys. Field and Form remain unstyled context/native
containers. The [registry](../src/theme/componentTokens.ts),
[JSON schema](../src/theme/theme.schema.json) and use-site CSS define exact keys
and fallbacks. `npm run tokens:inventory` checks every registry key has a CSS
consumer and rejects unknown FQ variables or active hex/RGB literals. Its report
is `verification/reports/component-token-inventory.json`. Build and Storybook
prebuild run that guard alongside generated-token drift checks.

## Contract and density

All component overrides are unset by default. CSS falls back to the existing
semantic/foundation/legacy values for that size, variant and state. New aliases
append customization without moving refs, native props or DOM parts. Existing
Button/Input keys keep their precedence: generic radius beats the new underlying
radius-scale alias. Button's original primary key still affects only the primary
background; the new accent key covers focus and primary-colored text. State
selectors still override base properties, including error, disabled and hover.

Override a group with `components: { select: { '--fq-select-radius-md': '13px' } }`.
The table gives a key/value inside each group; the complete lists follow it.
Length, color, font and density categories use the same atomic parser/reference
validation as other tokens. Required version-1 semantic roles and the original
Button/Input definition groups remain assignable; new roles/groups are optional
in the public definition type. Parsed defaults still contain the complete map.

Comfortable uses factor 1; compact 0.75; spacious 1.25. New per-family padding/gap
scale overrides accept only 0.75–1.25; CSS also clamps those factors. Button keeps
its original size-specific padding/gap controls. Explicit component lengths can
override defaults independently of density. Input changes row/helper gap while
retaining its 52px floating-label host, 24px row reservation and label offsets.
Glyph/control sizes and explicit minimum dimensions remain fixed. Badge keeps
its 18px height and 2px vertical padding, scaling horizontal spacing only.
Chips dismiss offsets, control helper indentation and Tab badge correction follow
the corresponding padding/gap scale. Zero layout values, safe-area geometry,
arrow/indicator shapes, motion timings, drag transforms and retained font metrics
remain structural. See the inventory report for each retained declaration.

Use semantic light/dark roles or a complete palette patch for each mode; a light
role override alone retains existing dark-role defaults. Configure foreground and
surface roles together when selecting a brand. Component aliases reach portal
roots via the [portal scope contract](../CONTRIBUTING.md#portal-scope). Native
CSS/slot inline overrides keep their normal cascade. Root/ref and decoration
slot rules remain in the [component contract](../CONTRIBUTING.md#component-roots-and-style-slots).

Token scopes apply family typography to labels, helpers and inherited content;
portal roots carry the same scope marker and variables. The legacy provider path
keeps host font inheritance. Checkbox/Radio helper indentation follows the spacing
alias used by the label row; Switch's gap token drives both its label and helper.
Button action bounds are measured after entry animations settle.

## Per-family usage

| Family / config group                 | Density                           | States                                                       | Example key/value                                    |
| ------------------------------------- | --------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| Accordion / `accordion`               | gap, padding                      | expanded, hover, focus, disabled, card                       | `--fq-accordion-radius-md: 13px`                     |
| Badge / `badge`                       | gap, padding (horizontal padding) | solid/soft variants; fixed 18px height                       | `--fq-badge-primary: #663399`                        |
| Banner / `banner`                     | gap, padding                      | intent, full-width, action, dismiss hover/pressed/focus      | `--fq-banner-radius-md: 13px`                        |
| BannerGradient / `bannerGradient`     | padding, gap                      | gradient, shape, countdown, page controls                    | `--fq-banner-gradient-radius-md: 13px`               |
| BannerInfo / `bannerInfo`             | padding, gap                      | title/action, illustration, close hover/pressed/focus        | `--fq-banner-info-radius-md: 13px`                   |
| BottomSheet / `bottomSheet`           | padding, gap                      | open/close, drag, scroll, actions, portal                    | `--fq-bottom-sheet-primary: #663399`                 |
| Button / `button`                     | original padding/gap              | variant, size, hover, focus, active, disabled, loading       | `--fq-button-radius: 13px`                           |
| Checkbox / `checkbox`                 | gap                               | checked, indeterminate, error, readonly, disabled            | `--fq-checkbox-primary: #663399`                     |
| CheckboxGroup / `checkboxGroup`       | gap                               | group error, required, disabled                              | `--fq-checkbox-group-font-family: Georgia, serif`    |
| Chips / `chips`                       | gap, padding                      | selected, invert, error, hover, disabled, dismiss            | `--fq-chips-primary: #663399`                        |
| Coachmark / `coachmark`               | padding, gap                      | step, placement, next/skip/done, keyboard focus              | `--fq-coachmark-radius-md: 13px`                     |
| Countdown / `countdown`               | padding                           | danger/warning/neutral/plain, centiseconds, expiry           | `--fq-countdown-font-family: Georgia, serif`         |
| Dialog / `dialog`                     | gap, padding                      | size/fullscreen, open/close, modal focus, portal             | `--fq-dialog-primary: #663399`                       |
| Field / no token group                | host layout                       | native attributes and Field relationships                    | native/slot CSS                                      |
| Form / no token group                 | host layout                       | native attributes and Field relationships                    | native/slot CSS                                      |
| Icon / `icon`                         | fixed size geometry               | variant, disabled; size stays explicit                       | `--fq-icon-primary: #663399`                         |
| IconButton / `iconButton`             | fixed size geometry               | variant, hover, focus, active, disabled; size stays explicit | `--fq-icon-button-radius-md: 13px`                   |
| Input / `input`                       | gap                               | focus, filled, prefix/icons, error, readonly, disabled       | `--fq-input-radius: 13px`                            |
| Label / `label`                       | padding                           | soft/solid/gradient, sm/md, icons/countdown                  | `--fq-label-primary: #663399`                        |
| NavigationBottom / `navigationBottom` | gap, padding                      | current, hover, focus, disabled, badge                       | `--fq-navigation-bottom-font-family: Georgia, serif` |
| Radio / `radio`                       | gap                               | checked, focus, error, disabled                              | `--fq-radio-primary: #663399`                        |
| Select / `select`                     | gap, padding                      | hover, focus, error, disabled                                | `--fq-select-radius-md: 13px`                        |
| Snackbar / `snackbar`                 | gap, padding                      | intent, message/action, auto-hide, open/close, portal        | `--fq-snackbar-radius-md: 13px`                      |
| Switch / `switch`                     | gap                               | checked, hover, focus, error, disabled                       | `--fq-switch-primary: #663399`                       |
| Tabs / `tabs`                         | gap, padding                      | selected, hover, focus, disabled, invert, badge              | `--fq-tabs-font-family: Georgia, serif`              |
| Textarea / `textarea`                 | gap, padding                      | hover, focus, error, readonly, disabled, count               | `--fq-textarea-radius-md: 13px`                      |
| Tooltip / `tooltip`                   | padding                           | visible, placement, arrow, hover/focus, timers               | `--fq-tooltip-radius-md: 13px`                       |

### Accordion

CSS/fallbacks: [Accordion.css](../src/components/Accordion/Accordion.css). Styling parts: public compound parts with native root props.

| Token                          | Category |
| ------------------------------ | -------- |
| `--fq-accordion-gap-scale`     | density  |
| `--fq-accordion-background`    | color    |
| `--fq-accordion-border`        | color    |
| `--fq-accordion-radius-md`     | length   |
| `--fq-accordion-padding-scale` | density  |
| `--fq-accordion-text-high`     | color    |
| `--fq-accordion-font-family`   | font     |
| `--fq-accordion-surface`       | color    |
| `--fq-accordion-primary`       | color    |
| `--fq-accordion-text-medium`   | color    |

### Badge

CSS/fallbacks: [Badge.css](../src/components/Badge/Badge.css). Styling parts: native root props and documented CSS classes.

| Token                           | Category |
| ------------------------------- | -------- |
| `--fq-badge-gap-scale`          | density  |
| `--fq-badge-padding-scale`      | density  |
| `--fq-badge-radius-full`        | length   |
| `--fq-badge-font-family`        | font     |
| `--fq-badge-primary`            | color    |
| `--fq-badge-text-inverse`       | color    |
| `--fq-badge-background`         | color    |
| `--fq-badge-success`            | color    |
| `--fq-badge-danger`             | color    |
| `--fq-badge-warning-solid`      | color    |
| `--fq-badge-neutral-700`        | color    |
| `--fq-badge-primary-subtle`     | color    |
| `--fq-badge-success-subtle`     | color    |
| `--fq-badge-danger-subtle`      | color    |
| `--fq-badge-warning`            | color    |
| `--fq-badge-warning-text`       | color    |
| `--fq-badge-surface`            | color    |
| `--fq-badge-text-medium`        | color    |
| `--fq-badge-gradient-red-100`   | color    |
| `--fq-badge-gradient-red-200`   | color    |
| `--fq-badge-gradient-green-100` | color    |
| `--fq-badge-gradient-green-200` | color    |
| `--fq-badge-neutral-400`        | color    |
| `--fq-badge-neutral-200`        | color    |
| `--fq-badge-neutral-100`        | color    |

### Banner

CSS/fallbacks: [Banner.css](../src/components/Banner/Banner.css). Styling parts: native root props and documented CSS classes.

| Token                         | Category |
| ----------------------------- | -------- |
| `--fq-banner-gap-scale`       | density  |
| `--fq-banner-padding-scale`   | density  |
| `--fq-banner-radius-md`       | length   |
| `--fq-banner-primary-subtle`  | color    |
| `--fq-banner-text-high`       | color    |
| `--fq-banner-success-subtle`  | color    |
| `--fq-banner-warning`         | color    |
| `--fq-banner-danger-subtle`   | color    |
| `--fq-banner-primary`         | color    |
| `--fq-banner-success`         | color    |
| `--fq-banner-warning-text`    | color    |
| `--fq-banner-danger`          | color    |
| `--fq-banner-font-family`     | font     |
| `--fq-banner-text-activity`   | color    |
| `--fq-banner-text-low`        | color    |
| `--fq-banner-radius-sm`       | length   |
| `--fq-banner-hover-overlay`   | color    |
| `--fq-banner-pressed-overlay` | color    |

### BannerGradient

CSS/fallbacks: [BannerGradient.css](../src/components/BannerGradient/BannerGradient.css). Styling parts: native root props and documented CSS classes.

| Token                                          | Category |
| ---------------------------------------------- | -------- |
| `--fq-banner-gradient-text-inverse`            | color    |
| `--fq-banner-gradient-padding-scale`           | density  |
| `--fq-banner-gradient-radius-md`               | length   |
| `--fq-banner-gradient-radius-xl`               | length   |
| `--fq-banner-gradient-gap-scale`               | density  |
| `--fq-banner-gradient-font-family`             | font     |
| `--fq-banner-gradient-radius-full`             | length   |
| `--fq-banner-gradient-inverse-inactive`        | color    |
| `--fq-banner-gradient-neutral-0`               | color    |
| `--fq-banner-gradient-accent-inactive`         | color    |
| `--fq-banner-gradient-primary`                 | color    |
| `--fq-banner-gradient-gradient-violet-100`     | color    |
| `--fq-banner-gradient-gradient-violet-200`     | color    |
| `--fq-banner-gradient-gradient-green-100`      | color    |
| `--fq-banner-gradient-gradient-green-200`      | color    |
| `--fq-banner-gradient-gradient-orange-100`     | color    |
| `--fq-banner-gradient-gradient-orange-200`     | color    |
| `--fq-banner-gradient-gradient-red-100`        | color    |
| `--fq-banner-gradient-gradient-red-200`        | color    |
| `--fq-banner-gradient-gradient-tosca-100`      | color    |
| `--fq-banner-gradient-gradient-tosca-200`      | color    |
| `--fq-banner-gradient-gradient-blue-100`       | color    |
| `--fq-banner-gradient-gradient-blue-200`       | color    |
| `--fq-banner-gradient-gradient-purple-100`     | color    |
| `--fq-banner-gradient-gradient-purple-200`     | color    |
| `--fq-banner-gradient-gradient-light-blue-100` | color    |
| `--fq-banner-gradient-gradient-light-blue-200` | color    |
| `--fq-banner-gradient-text-high`               | color    |

### BannerInfo

CSS/fallbacks: [BannerInfo.css](../src/components/BannerInfo/BannerInfo.css). Styling parts: native root props and documented CSS classes.

| Token                              | Category |
| ---------------------------------- | -------- |
| `--fq-banner-info-neutral-0`       | color    |
| `--fq-banner-info-radius-md`       | length   |
| `--fq-banner-info-padding-scale`   | density  |
| `--fq-banner-info-text-low`        | color    |
| `--fq-banner-info-radius-sm`       | length   |
| `--fq-banner-info-hover-overlay`   | color    |
| `--fq-banner-info-text-high`       | color    |
| `--fq-banner-info-pressed-overlay` | color    |
| `--fq-banner-info-primary`         | color    |
| `--fq-banner-info-gap-scale`       | density  |
| `--fq-banner-info-font-family`     | font     |
| `--fq-banner-info-text-activity`   | color    |

### BottomSheet

CSS/fallbacks: [BottomSheet.css](../src/components/BottomSheet/BottomSheet.css). Styling parts: root, backdrop, handle, handleBar, image, header, title, closeButton, actions, action, iconAction, body.

| Token                                | Category |
| ------------------------------------ | -------- |
| `--fq-bottom-sheet-overlay-backdrop` | color    |
| `--fq-bottom-sheet-surface-raised`   | color    |
| `--fq-bottom-sheet-radius-xl`        | length   |
| `--fq-bottom-sheet-padding-scale`    | density  |
| `--fq-bottom-sheet-radius-full`      | length   |
| `--fq-bottom-sheet-border-strong`    | color    |
| `--fq-bottom-sheet-gap-scale`        | density  |
| `--fq-bottom-sheet-font-family`      | font     |
| `--fq-bottom-sheet-text-high`        | color    |
| `--fq-bottom-sheet-border`           | color    |
| `--fq-bottom-sheet-radius-sm`        | length   |
| `--fq-bottom-sheet-surface`          | color    |
| `--fq-bottom-sheet-primary`          | color    |

### Button

CSS/fallbacks: [Button.css](../src/components/Button/Button.css). Styling parts: root, content, spinner.

| Token                        | Category |
| ---------------------------- | -------- |
| `--fq-button-accent`         | color    |
| `--fq-button-radius`         | length   |
| `--fq-button-gap`            | length   |
| `--fq-button-padding-sm`     | length   |
| `--fq-button-padding-md`     | length   |
| `--fq-button-padding-lg`     | length   |
| `--fq-button-primary`        | color    |
| `--fq-button-primary-hover`  | color    |
| `--fq-button-radius-md`      | length   |
| `--fq-button-font-family`    | font     |
| `--fq-button-text-inverse`   | color    |
| `--fq-button-primary-subtle` | color    |
| `--fq-button-blue-200`       | color    |
| `--fq-button-danger-subtle`  | color    |
| `--fq-button-danger`         | color    |
| `--fq-button-red-200`        | color    |
| `--fq-button-neutral-0`      | color    |
| `--fq-button-text-high`      | color    |
| `--fq-button-neutral-200`    | color    |

### Checkbox

CSS/fallbacks: [Checkbox.css](../src/components/Checkbox/Checkbox.css). Styling parts: root, label, input, helperText.

| Token                         | Category |
| ----------------------------- | -------- |
| `--fq-checkbox-gap-scale`     | density  |
| `--fq-checkbox-border`        | color    |
| `--fq-checkbox-radius-sm`     | length   |
| `--fq-checkbox-background`    | color    |
| `--fq-checkbox-primary`       | color    |
| `--fq-checkbox-font-family`   | font     |
| `--fq-checkbox-text-high`     | color    |
| `--fq-checkbox-text-low`      | color    |
| `--fq-checkbox-danger`        | color    |
| `--fq-checkbox-neutral-100`   | color    |
| `--fq-checkbox-text-disabled` | color    |

### CheckboxGroup

CSS/fallbacks: [CheckboxGroup.css](../src/components/CheckboxGroup/CheckboxGroup.css). Styling parts: root, legend, required, items, helperText.

| Token                             | Category |
| --------------------------------- | -------- |
| `--fq-checkbox-group-gap-scale`   | density  |
| `--fq-checkbox-group-font-family` | font     |
| `--fq-checkbox-group-text-high`   | color    |
| `--fq-checkbox-group-danger`      | color    |
| `--fq-checkbox-group-text-low`    | color    |

### Chips

CSS/fallbacks: [Chips.css](../src/components/Chips/Chips.css). Styling parts: native root props and documented CSS classes.

| Token                               | Category |
| ----------------------------------- | -------- |
| `--fq-chips-gap-scale`              | density  |
| `--fq-chips-padding-scale`          | density  |
| `--fq-chips-radius-full`            | length   |
| `--fq-chips-border`                 | color    |
| `--fq-chips-background`             | color    |
| `--fq-chips-text-high`              | color    |
| `--fq-chips-font-family`            | font     |
| `--fq-chips-primary`                | color    |
| `--fq-chips-text-activity`          | color    |
| `--fq-chips-primary-subtle`         | color    |
| `--fq-chips-danger`                 | color    |
| `--fq-chips-surface`                | color    |
| `--fq-chips-text-disabled`          | color    |
| `--fq-chips-border-strong`          | color    |
| `--fq-chips-neutral-800`            | color    |
| `--fq-chips-text-inverse`           | color    |
| `--fq-chips-neutral-700`            | color    |
| `--fq-chips-text-low`               | color    |
| `--fq-chips-inverse-inactive`       | color    |
| `--fq-chips-inverse-selected-hover` | color    |
| `--fq-chips-hover-overlay`          | color    |
| `--fq-chips-inverse-dismiss-hover`  | color    |

### Coachmark

CSS/fallbacks: [Coachmark.css](../src/components/Coachmark/Coachmark.css). Styling parts: native root props and documented CSS classes.

| Token                           | Category |
| ------------------------------- | -------- |
| `--fq-coachmark-padding-scale`  | density  |
| `--fq-coachmark-radius-md`      | length   |
| `--fq-coachmark-surface-raised` | color    |
| `--fq-coachmark-text-high`      | color    |
| `--fq-coachmark-font-family`    | font     |
| `--fq-coachmark-text-low`       | color    |
| `--fq-coachmark-text-medium`    | color    |
| `--fq-coachmark-gap-scale`      | density  |
| `--fq-coachmark-primary`        | color    |
| `--fq-coachmark-radius-sm`      | length   |
| `--fq-coachmark-text-inverse`   | color    |

### Countdown

CSS/fallbacks: [Countdown.css](../src/components/Countdown/Countdown.css). Styling parts: native root props and documented CSS classes.

| Token                          | Category |
| ------------------------------ | -------- |
| `--fq-countdown-font-family`   | font     |
| `--fq-countdown-padding-scale` | density  |
| `--fq-countdown-radius-xs`     | length   |
| `--fq-countdown-danger`        | color    |
| `--fq-countdown-text-inverse`  | color    |
| `--fq-countdown-warning`       | color    |
| `--fq-countdown-warning-text`  | color    |
| `--fq-countdown-surface`       | color    |
| `--fq-countdown-text-high`     | color    |
| `--fq-countdown-text-alert`    | color    |
| `--fq-countdown-text-medium`   | color    |
| `--fq-countdown-neutral-400`   | color    |

### Dialog

CSS/fallbacks: [Dialog.css](../src/components/Dialog/Dialog.css). Styling parts: paper, backdrop, title, heading, closeButton, content, actions.

| Token                        | Category |
| ---------------------------- | -------- |
| `--fq-dialog-surface-raised` | color    |
| `--fq-dialog-border-subtle`  | color    |
| `--fq-dialog-text-high`      | color    |
| `--fq-dialog-text-medium`    | color    |
| `--fq-dialog-neutral-100`    | color    |
| `--fq-dialog-primary`        | color    |
| `--fq-dialog-gap-scale`      | density  |
| `--fq-dialog-padding-scale`  | density  |
| `--fq-dialog-font-family`    | font     |
| `--fq-dialog-radius-lg`      | length   |
| `--fq-dialog-radius-sm`      | length   |

### Field

No authored component CSS or density geometry is introduced. Use the existing named decoration slots and host inheritance.

### Form

No authored component CSS or density geometry is introduced. Use native form props and host inheritance.

### Icon

CSS/fallbacks: [IconBase.css](../src/components/Icon/IconBase.css). Styling parts: native root props and documented CSS classes.

| Token                     | Category |
| ------------------------- | -------- |
| `--fq-icon-primary`       | color    |
| `--fq-icon-text-medium`   | color    |
| `--fq-icon-danger`        | color    |
| `--fq-icon-success`       | color    |
| `--fq-icon-warning-solid` | color    |
| `--fq-icon-text-disabled` | color    |

### IconButton

CSS/fallbacks: [IconButton.css](../src/components/IconButton/IconButton.css). Styling parts: native root props and documented CSS classes.

| Token                             | Category |
| --------------------------------- | -------- |
| `--fq-icon-button-radius-md`      | length   |
| `--fq-icon-button-primary`        | color    |
| `--fq-icon-button-primary-subtle` | color    |
| `--fq-icon-button-text-medium`    | color    |
| `--fq-icon-button-danger`         | color    |
| `--fq-icon-button-success`        | color    |
| `--fq-icon-button-warning-solid`  | color    |
| `--fq-icon-button-text-disabled`  | color    |
| `--fq-icon-button-neutral-100`    | color    |
| `--fq-icon-button-neutral-200`    | color    |
| `--fq-icon-button-border`         | color    |

### Input

CSS/fallbacks: [Input.css](../src/components/Input/Input.css). Styling parts: root, container, inner, row, label, required, input, helperText, prefix, startIcon, endIcon, clearButton.

| Token                      | Category |
| -------------------------- | -------- |
| `--fq-input-radius`        | length   |
| `--fq-input-background`    | color    |
| `--fq-input-border`        | color    |
| `--fq-input-gap-scale`     | density  |
| `--fq-input-radius-md`     | length   |
| `--fq-input-text-activity` | color    |
| `--fq-input-danger`        | color    |
| `--fq-input-surface`       | color    |
| `--fq-input-font-family`   | font     |
| `--fq-input-text-low`      | color    |
| `--fq-input-text-alert`    | color    |
| `--fq-input-text-high`     | color    |
| `--fq-input-text-disabled` | color    |

### Label

CSS/fallbacks: [Label.css](../src/components/Label/Label.css). Styling parts: native root props and documented CSS classes.

| Token                            | Category |
| -------------------------------- | -------- |
| `--fq-label-padding-scale`       | density  |
| `--fq-label-radius-xs`           | length   |
| `--fq-label-font-family`         | font     |
| `--fq-label-primary-subtle`      | color    |
| `--fq-label-primary`             | color    |
| `--fq-label-success-subtle`      | color    |
| `--fq-label-success`             | color    |
| `--fq-label-danger-subtle`       | color    |
| `--fq-label-danger`              | color    |
| `--fq-label-warning`             | color    |
| `--fq-label-warning-text`        | color    |
| `--fq-label-surface`             | color    |
| `--fq-label-text-medium`         | color    |
| `--fq-label-border-strong`       | color    |
| `--fq-label-red-400`             | color    |
| `--fq-label-text-inverse`        | color    |
| `--fq-label-orange-500`          | color    |
| `--fq-label-green-500`           | color    |
| `--fq-label-blue-400`            | color    |
| `--fq-label-gradient-red-100`    | color    |
| `--fq-label-gradient-red-200`    | color    |
| `--fq-label-gradient-orange-100` | color    |
| `--fq-label-gradient-orange-200` | color    |
| `--fq-label-gradient-green-100`  | color    |
| `--fq-label-gradient-green-200`  | color    |
| `--fq-label-gradient-tosca-100`  | color    |
| `--fq-label-gradient-tosca-200`  | color    |
| `--fq-label-gradient-violet-100` | color    |
| `--fq-label-gradient-violet-200` | color    |
| `--fq-label-neutral-200`         | color    |
| `--fq-label-neutral-100`         | color    |
| `--fq-label-text-disabled`       | color    |

### NavigationBottom

CSS/fallbacks: [NavigationBottom.css](../src/components/NavigationBottom/NavigationBottom.css). Styling parts: native root props and documented CSS classes.

| Token                                  | Category |
| -------------------------------------- | -------- |
| `--fq-navigation-bottom-background`    | color    |
| `--fq-navigation-bottom-gap-scale`     | density  |
| `--fq-navigation-bottom-padding-scale` | density  |
| `--fq-navigation-bottom-text-low`      | color    |
| `--fq-navigation-bottom-font-family`   | font     |
| `--fq-navigation-bottom-text-activity` | color    |
| `--fq-navigation-bottom-text-disabled` | color    |

### Radio

CSS/fallbacks: [Radio.css](../src/components/Radio/Radio.css). Styling parts: root, label, input, control, helperText.

| Token                    | Category |
| ------------------------ | -------- |
| `--fq-radio-font-family` | font     |
| `--fq-radio-gap-scale`   | density  |
| `--fq-radio-border`      | color    |
| `--fq-radio-background`  | color    |
| `--fq-radio-primary`     | color    |
| `--fq-radio-text-high`   | color    |
| `--fq-radio-text-low`    | color    |
| `--fq-radio-danger`      | color    |

### Select

CSS/fallbacks: [Select.css](../src/components/Select/Select.css). Styling parts: root, label, required, select, helperText.

| Token                       | Category |
| --------------------------- | -------- |
| `--fq-select-gap-scale`     | density  |
| `--fq-select-text-high`     | color    |
| `--fq-select-danger`        | color    |
| `--fq-select-padding-scale` | density  |
| `--fq-select-border`        | color    |
| `--fq-select-radius-md`     | length   |
| `--fq-select-background`    | color    |
| `--fq-select-font-family`   | font     |
| `--fq-select-border-strong` | color    |
| `--fq-select-primary`       | color    |
| `--fq-select-focus-ring`    | color    |
| `--fq-select-surface`       | color    |
| `--fq-select-text-disabled` | color    |
| `--fq-select-text-low`      | color    |
| `--fq-select-error-ring`    | color    |

### Snackbar

CSS/fallbacks: [Snackbar.css](../src/components/Snackbar/Snackbar.css). Styling parts: root, content, message, action.

| Token                         | Category |
| ----------------------------- | -------- |
| `--fq-snackbar-neutral-900`   | color    |
| `--fq-snackbar-neutral-0`     | color    |
| `--fq-snackbar-primary-light` | color    |
| `--fq-snackbar-blue-700`      | color    |
| `--fq-snackbar-success-dark`  | color    |
| `--fq-snackbar-warning-dark`  | color    |
| `--fq-snackbar-danger-dark`   | color    |
| `--fq-snackbar-gap-scale`     | density  |
| `--fq-snackbar-padding-scale` | density  |
| `--fq-snackbar-toast-surface` | color    |
| `--fq-snackbar-radius-md`     | length   |
| `--fq-snackbar-font-family`   | font     |
| `--fq-snackbar-toast-action`  | color    |
| `--fq-snackbar-toast-info`    | color    |
| `--fq-snackbar-toast-success` | color    |
| `--fq-snackbar-toast-warning` | color    |
| `--fq-snackbar-toast-danger`  | color    |

### Switch

CSS/fallbacks: [Switch.css](../src/components/Switch/Switch.css). Styling parts: root, label, input, control, thumb, helperText.

| Token                       | Category |
| --------------------------- | -------- |
| `--fq-switch-gap`           | length   |
| `--fq-switch-font-family`   | font     |
| `--fq-switch-gap-scale`     | density  |
| `--fq-switch-radius-full`   | length   |
| `--fq-switch-border`        | color    |
| `--fq-switch-background`    | color    |
| `--fq-switch-border-strong` | color    |
| `--fq-switch-primary`       | color    |
| `--fq-switch-text-high`     | color    |
| `--fq-switch-text-low`      | color    |
| `--fq-switch-danger`        | color    |

### Tabs

CSS/fallbacks: [Tabs.css](../src/components/Tabs/Tabs.css). Styling parts: public compound parts with native root props.

| Token                        | Category |
| ---------------------------- | -------- |
| `--fq-tabs-border`           | color    |
| `--fq-tabs-gap-scale`        | density  |
| `--fq-tabs-padding-scale`    | density  |
| `--fq-tabs-text-low`         | color    |
| `--fq-tabs-font-family`      | font     |
| `--fq-tabs-text-activity`    | color    |
| `--fq-tabs-text-medium`      | color    |
| `--fq-tabs-inverse-border`   | color    |
| `--fq-tabs-neutral-800`      | color    |
| `--fq-tabs-inverse-inactive` | color    |
| `--fq-tabs-inverse-hover`    | color    |
| `--fq-tabs-text-inverse`     | color    |

### Textarea

CSS/fallbacks: [Textarea.css](../src/components/Textarea/Textarea.css). Styling parts: root, label, required, textarea, footer, helperText, count.

| Token                         | Category |
| ----------------------------- | -------- |
| `--fq-textarea-gap-scale`     | density  |
| `--fq-textarea-text-high`     | color    |
| `--fq-textarea-danger`        | color    |
| `--fq-textarea-padding-scale` | density  |
| `--fq-textarea-border`        | color    |
| `--fq-textarea-radius-md`     | length   |
| `--fq-textarea-background`    | color    |
| `--fq-textarea-font-family`   | font     |
| `--fq-textarea-text-disabled` | color    |
| `--fq-textarea-border-strong` | color    |
| `--fq-textarea-primary`       | color    |
| `--fq-textarea-focus-ring`    | color    |
| `--fq-textarea-surface`       | color    |
| `--fq-textarea-text-low`      | color    |
| `--fq-textarea-error-ring`    | color    |

### Tooltip

CSS/fallbacks: [Tooltip.css](../src/components/Tooltip/Tooltip.css). Styling parts: root, content, arrow.

| Token                        | Category |
| ---------------------------- | -------- |
| `--fq-tooltip-padding-scale` | density  |
| `--fq-tooltip-neutral-800`   | color    |
| `--fq-tooltip-neutral-0`     | color    |
| `--fq-tooltip-radius-md`     | length   |
| `--fq-tooltip-font-family`   | font     |

## Verification boundary

The browser gate checks all default T01 contracts, light/dark at mobile/desktop,
and representative branded states at all three densities. It checks spacing,
fonts, color/gradient roles, radii, hover, disabled/error semantics, keyboard focus,
expansion, clipping, offsets and portal inheritance. Existing interaction minima
and structural sizes remain as documented in source; native consumer-provided
actions retain their own sizing. Whole-library accessibility/state enforcement
and hosted release gates remain T10. Arbitrary combinations of custom font size,
length or host CSS require consumer verification.
