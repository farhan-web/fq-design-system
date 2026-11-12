# Contributing to fq-design-system

## Local setup

Use Node `^20.19.0 || ^22.13.0 || >=24.0.0`; CI covers 20.19.0, 22.13.0 and
24.8.0. Install the lockfile with `npm ci`.

```bash
git clone https://github.com/HAEID/fq-design-system.git
cd fq-design-system
npm ci
npm run dev        # Vite dev server
npm run storybook  # Component explorer
```

## Workflow

```bash
npm test           # Run all tests
npm run test:watch # Watch mode
npm run lint       # ESLint
npm run format     # Prettier
npm run build      # Library build
```

## Package verification

`npm pack` runs the `prepack` build, so publishing/packing cannot silently reuse
an old `dist/`. `npm run verify:package` performs dry-run and real packing,
installs the tarball in fresh temporary React 18/19 consumers, validates Bundler
and NodeNext types, builds the app, renders native ESM SSR, and checks hydration,
interaction, fonts and consumer CSS overrides in Chromium. It downloads fixture
dependencies and requires `npx playwright install chromium` first. Failure reports
retain fixture paths for diagnosis; successful temporary installs are removed.
No packages are published by verification.

## Adding a component

1. Create `src/components/ComponentName/` with:
   - `ComponentName.tsx` — component + exported types
   - `ComponentName.css` — scoped styles using design tokens
   - `ComponentName.stories.tsx` — Storybook stories
   - `ComponentName.test.tsx` — unit tests
2. Export from `src/index.ts`
3. All form controls must use `useFormField` and consume `useFieldContext`
4. All components must use `forwardRef` and set `displayName`
5. CSS must use `var(--token)` — no hardcoded values

## Coding conventions

- **Naming**: PascalCase for components, camelCase for hooks/utils
- **CSS classes**: BEM-like with `fq-` prefix (`fq-button`, `fq-button--primary`, `fq-button__spinner`)
- **Props**: extend native HTML attributes where possible, add `FormFieldProps` for form controls
- **Accessibility**: `aria-invalid`, `aria-describedby`, `aria-hidden` must be correct

## Overlay accessibility

Dialog uses its visible title as its accessible name. For a titleless dialog,
provide `aria-label` or `aria-labelledby`; optional `aria-describedby` refers to
consumer content IDs. These attributes and the forwarded ref target the paper.
BottomSheet accepts the same native ARIA attributes and keeps its ref on the
sheet. Empty sheets receive fallback focus. Escape dismisses the upper modal;
focus and the shared document scroll lock remain owned through the exit animation.

Tooltip preserves the child's existing `aria-describedby` IDs and adds its own
only while visible. Custom trigger components must forward ARIA and event props
to their focusable element. Keep tooltip content informational; use Dialog for
interactive content. Hover, focus and touch keep disclosure active independently.
Escape cancels pending disclosure or requests immediate close; it preserves
trigger focus and dismisses before a containing Dialog. After dismissal, leave
and blur the trigger before reopening it. Controlled `open` still belongs to the
parent, which must honor `onClose` to change visibility. Pending callbacks are
cancelled on unmount; callback updates do not restart an existing delay.

T04 corrects dark-mode colors: Dialog uses `--color-surface-raised` rather than
an always-white background. Tooltip retains its N800 background and uses
`--color-neutral-0` text for contrast in both modes. A custom tooltip text override
previously using `--color-text-inverse` should target `.fq-tooltip__content`
instead. Placement, spacing, typography and layout remain unchanged.

`npm run verify:browser` compares selected DOM/style/layout baselines and runs
keyboard/pointer behavior plus overlay accessibility checks. The
`--behavior-only` mode runs behavior and accessibility without OS-specific
baseline comparisons, and is wired into CI. It uses real timers, normal
transitions, two viewports and light/dark. No screenshots are used.

The axe audit scope is the active Dialog paper, BottomSheet, or Tooltip wrapper,
using WCAG A/AA rules through 2.2 plus `aria-dialog-name`. Background focus and
stacking have separate browser assertions. A negative probe removes Dialog's
name, proves the audit assertion fails, then restores the relationship. Results
and engine version are in `verification/reports/accessibility-results.json`
(or `verification/reports/behavior/` for behavior-only runs).

Tooltip's transparent hover bridge makes axe report an incomplete color-contrast
result. Only that exact tooltip target is allowed to use a fallback: opaque
computed foreground/background colors must give at least 4.5:1 using sRGB
luminance. Other incomplete results fail the gate. This is a scoped automated
check, not a full manual accessibility certification. The remaining Storybook
families still use `a11y.test: 'todo'`; expanding the gate belongs to T10.

## Token theme contract

`src/theme/default-theme.json` is the reviewed value source. `tokenConfig.ts`
validates configurations and defines the fixed density/component registry;
`fqTheme.ts` maps these values into MUI while retaining its component resets.
There is no second FQ palette table. Distinct MUI shadow/layer tokens retain
MUI's legacy scale rather than silently replacing it with FQ's different scale.

Run `npm run tokens:generate` after editing defaults or the registry. Review the
six foundation stylesheets, JSON Schema and TypeScript token-name declarations.
`npm run tokens:check` rejects drift and runs before library/Storybook builds.
The old scraper token writer now stops with migration guidance; scraped data
must be reviewed into the canonical JSON before generation.

The version 1 configuration has required `schemaVersion: 1`, optional partial
`foundation` groups (palette, spacing, radius, typography, shadow, layer),
`semantic.light`/`semantic.dark`, `aliases`, `components`, and `density`.
Keys use the existing CSS custom-property names. Unknown keys/versions, wrong
value categories, unresolved references and cycles are rejected with a path.
`parseFqThemeJson` parses JSON; `parseFqTheme` validates an object. Both return a
complete frozen definition without mutating defaults or applying DOM changes.
Validate an imported draft before storing it as the active theme; retain the
previous value and display the error when validation fails. Do not feed invalid
props into a React tree without handling the error.

Supported values are intentionally bounded: named token references, hexadecimal
colors, supported RGB syntax, and color-mix with a six-digit hex source (or a
reference resolving to one) mixed with transparent. Lengths use px/rem/em/% or
zero; raw font sizes and foundation radii use px to match MUI's numeric APIs.
Font families, weights, layers and non-inset shadows have category checks.
Arbitrary CSS expressions, URLs and injected declarations are not theme JSON.
The packaged `fq-design-system/theme-schema.json` provides structure/defaults;
the runtime parser additionally validates CSS categories and reference graphs.

`createFqTheme(config, mode, density?)` returns the validated definition,
`cssVariables` and `muiTheme`. `themeCssVariables` provides the variables alone.
`defaultFqThemeDefinition` exposes defaults. The default MUI palette strings,
font family, spacing, radius, shadows and layer values preserve the previous
provider contract. Selecting dark mode explicitly maps its semantic colors into
MUI as well as CSS. Omitted dark entries inherit the merged light map; existing
dark defaults still win over light overrides for those specific keys. Override
both semantic modes or the referenced palette entries when changing both brands.

`FqThemeProvider tokens={config} mode="light|dark" density="..."` supplies MUI
context and a `display: contents` boundary with the complete variable map. Each
configuration starts from defaults rather than inheriting another provider's
JSON patch. No body variables are mutated. `tokens`/`mode`/`density` cannot be
combined with the independent legacy MUI `theme` prop. Without these new props,
the provider retains its original DOM. Static CSS retains the original explicit
`data-theme` and system-preference rules; the token provider uses explicit mode
(default light), without a new implicit browser preference listener.

Precedence is foundation → selected semantic mode → explicit legacy alias value
for components using that alias → explicit component token. Spacing aliases such
as `--space-4` now refer to `--spacing-16`. If JSON sets both, an explicit
`aliases['--space-4']` wins for properties using `--space-4`; the canonical token
retains its own value. Native CSS declarations still follow ordinary cascade and
inheritance. CSS resolves an alias where it is declared: for scoped changes to a
referenced foundation token, use the complete provider map (or redeclare the
alias in that scope). CSS-only edits and a legacy MUI theme do not synchronize
automatically. A resolved component override beats lower-level token changes;
set the component token on the instance to override that value.

The original Button radius/gap, sm/md/lg padding, primary/primary-hover and Input
radius/background/border keys retain their behavior. Component overrides remain
unset by default so CSS use-site fallbacks stay live. The [component token
reference](docs/component-tokens.md) documents 349 keys across 25 styled groups,
plus the unstyled Field/Form containers, with slots, states and examples.

Density presets compact 0.75, comfortable 1 and spacious 1.25 map safe padding/gap
factors and MUI spacing. Comfortable preserves defaults. New scale overrides are
bounded to 0.75–1.25 in the parser and CSS. Input retains fixed floating-label
geometry; fixed glyph and interaction dimensions remain. Helper/dismiss/badge
alignment follows the same spacing values as its control. Within token-provider
scopes, family typography reaches labels, helpers and inherited content, including
portal roots; the legacy path keeps its existing host inheritance. Build prechecks
validate generated tokens and the consumed-token/color inventory before emitting CSS.

For SSR, keep `enableCssLayer` consistent across renders within the same process.
The consumer probe observed that an earlier unlayered render can seed shared
Emotion server serialization output used by a later layered render. Verification
isolates the token SSR probe and the legacy hydration fixture in separate Node
processes; arbitrary mixed-layer SSR requests are not certified. Keep one
layer policy per application/server process.

Token providers transfer their resolved variables/mode/density to FQ portal
roots (see Portal scope below). Stylesheet entry selection remains independent.
No JSP/Thymeleaf-specific packaging or alternative widget implementation is added.

## Stylesheet modes

| Entry          | Application reset                                      | Rules                          | Provider                                    |
| -------------- | ------------------------------------------------------ | ------------------------------ | ------------------------------------------- |
| `isolated.css` | None                                                   | Actual `fq-tokens`/`fq` layers | `enableCssLayer` required                   |
| `reset.css`    | Explicit opt-in, for body/html/#root and global sizing | `reset` layer                  | Use alongside isolated mode                 |
| `style.css`    | Legacy global reset retained                           | Unlayered compatibility rules  | Legacy default or existing SSR layer opt-in |
| `compat.css`   | Same as style.css                                      | Alias to the same legacy asset | Same as style.css                           |

For an isolated integration:

```tsx
import 'fq-design-system/isolated.css';
// Optional: import 'fq-design-system/reset.css';

<FqThemeProvider enableCssLayer>
  <App />
</FqThemeProvider>;
```

Choose isolated or compatibility CSS, not both on the same page. Do not silently
swap `style.css` for `isolated.css` without adding `enableCssLayer`: unlayered MUI
reset rules outrank layered library rules. The provider default is unchanged.
Existing compatibility imports keep their body reset, native override behavior
and default layout; `compat.css` makes that choice explicit during migration.

Isolated CSS reserves `reset, mui, fq-tokens, fq` and places real rules inside the
latter layers, not just an order declaration. MUI's opt-in rules use `mui`.
Ordinary unlayered app styles outrank library layers, regardless of which file is
imported first; no `!important` is needed. Avoid predeclaring a conflicting layer
order. Inline styles/custom properties still follow normal CSS precedence and
inheritance. Font-face registration and the public root/data-theme custom
properties remain global resources; this is light-DOM styling, not Shadow DOM.

The isolated entry has no body, heading, link, html-margin or #root reset. Only
FQ roots/descendants get internal sizing, with zero-specificity namespace rules.
Measured MUI ButtonBase/Paper FQ roots retain content-box, preserving the frozen
legacy default geometry (including md Button 118×38); custom backdrop divs remain
border-box. Layered compatibility mode already has a different box model from
T03 and remains unchanged. Outermost FQ boundaries get typography formerly
inherited from the legacy body; nested slots inherit component/app overrides.
Explicit component rules and unlayered consumer styles can override these defaults.

`reset.css` is optional and works before or after isolated.css. It intentionally
applies the original application reset in a low-priority layer; unlayered host
styles still win. Omit it when integrating with an app that owns its reset.

Build derives both additional CSS assets from the built legacy graph, with a
scoped isolated base. It rejects unexpected reset structure, unscoped component
selectors and important declarations. Tests include negative extraction cases.
Clean package consumers verify actual CSSOM layer blocks, host body/heading/link/
native-control preservation, consumer color/padding/radius/font overrides in
both import orders, slot font inheritance, frozen default Button dimensions,
Input sizing, explicit/system dark modes, reset ordering and SSR/hydration.
The isolated fixture samples Button/Input/Badge at 900×800. T09 adds full-family
representative brand/density browser checks; broader state/a11y enforcement remains T10. Default compatibility snapshots still
run the complete light/dark and mobile/desktop matrix without screenshot checks.

The tarball now has nine files: the previous seven plus isolated and reset CSS.
The compatibility alias does not duplicate an asset. Layer-mode consistency in
SSR remains required because of the shared Emotion serialization behavior noted
above. Portal scope is provided by T08, independently of stylesheet mode.

## Versioning

This project uses [Changesets](https://github.com/changesets/changesets).

Before opening a PR for a user-facing change:

```bash
npm run changeset
```

Follow the prompts to document the change type (patch/minor/major) and description.

## Pull request checklist

- [ ] Tests pass (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] Format passes (`npm run format:check`)
- [ ] Build passes (`npm run build`)
- [ ] Changeset added for user-facing changes
- [ ] Storybook story updated or added

## Component roots and style slots

`classNames` and `slotProps` decorate named parts without adding DOM wrappers.
`classNames.part` and `slotProps.part.className` append to internal and legacy
classes. Slot styles merge first; an existing top-level `style` wins duplicate
properties on its established target. Internal state classes remain present.
Class attribute order does not decide CSS precedence; selector specificity,
layers and stylesheet order still apply.

Slots accept only `className`, `style` (including CSS custom properties), and
primitive `data-*` attributes. TypeScript rejects unknown slots, events, refs,
IDs, roles, ARIA and control state. Runtime filtering also drops those fields
for untyped JavaScript callers. Keep callbacks, native attributes and semantic
props on the component; existing composed handlers continue to update internal
state and invoke the consumer callback. Slots are a styling API, not arbitrary
HTML prop forwarding. Styling can still hide or disable interaction visually;
consumer CSS must preserve usability.

| Component                            | Visual root                         | Existing className/style/ref and native-prop target                                                        | Named style slots                                                                                        |
| ------------------------------------ | ----------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Button                               | button                              | button                                                                                                     | root, content, spinner                                                                                   |
| Input                                | outer div                           | native input                                                                                               | root, container, inner, row, label, required, input, helperText, prefix, startIcon, endIcon, clearButton |
| Select                               | outer div                           | native select                                                                                              | root, label, required, select, helperText                                                                |
| Textarea                             | outer div                           | native textarea                                                                                            | root, label, required, textarea, footer, helperText, count                                               |
| Checkbox                             | outer div                           | native input                                                                                               | root, label (text), input, helperText                                                                    |
| Radio                                | outer div                           | native input                                                                                               | root, label (text), input, control, helperText                                                           |
| Switch                               | outer div                           | native input                                                                                               | root, label (text), input, control, thumb, helperText                                                    |
| CheckboxGroup                        | fieldset                            | fieldset                                                                                                   | root, legend, required, items, helperText                                                                |
| Field                                | outer div                           | new className/style/ref on outer div; id remains the child control ID; no arbitrary native prop forwarding | root, label, required, description, error                                                                |
| Form                                 | form                                | form                                                                                                       | native root props                                                                                        |
| Dialog                               | paper div inside MUI modal          | className/ref and new style on paper; only documented semantic props forwarded                             | paper, backdrop, title, heading, closeButton, content, actions                                           |
| BottomSheet                          | sheet div inside MUI modal          | sheet div                                                                                                  | root, backdrop, handle, handleBar, image, header, title, closeButton, actions, action, iconAction, body  |
| Tooltip                              | wrapper div                         | wrapper div                                                                                                | root, content, arrow                                                                                     |
| Snackbar                             | MUI outer div, inner status surface | ref on MUI outer div; className and new style on status surface; no arbitrary native prop forwarding       | root (MUI outer), content, message, action                                                               |
| Badge, Label, IconBase               | span                                | span                                                                                                       | native root props                                                                                        |
| Chips, IconButton                    | button                              | button                                                                                                     | native root props                                                                                        |
| Banner, BannerGradient, BannerInfo   | div                                 | div                                                                                                        | native root props                                                                                        |
| Countdown                            | span                                | span                                                                                                       | native root props                                                                                        |
| NavigationBottom                     | nav                                 | nav                                                                                                        | native root props                                                                                        |
| Coachmark                            | anchor div with conditional dialog  | conditional dialog div, not anchor                                                                         | native dialog props                                                                                      |
| Tabs / TabList / Tab / TabPanel      | div / div / button / div            | each public component's own root                                                                           | native root props on each compound part                                                                  |
| Accordion / Item / Trigger / Content | div / div / button / div            | each public component's own root                                                                           | native root props on each compound part                                                                  |

Other internal descendants are not named slots in this version. Use the public
compound components where supplied. The table describes existing prop targets;
it does not add arbitrary native forwarding to restricted components. Overlay
refs become null when unmounted. BottomSheet's active drag transform/transition
remain component-owned. Tooltip's explicit `maxWidth` prop wins the content slot
max-width when provided.

```tsx
<Input
  className="email-control"
  classNames={{ root: 'email-field', label: 'email-label' }}
  slotProps={{
    container: { style: { borderRadius: 12, '--local-accent': '#663399' } },
    helperText: { className: 'email-help', 'data-purpose': 'hint' },
  }}
  onChange={handleEmailChange}
/>
```

Override from broadest to narrowest: global tokens at `:root`, a scope selector
or `FqThemeProvider tokens`, component tokens/classes, then instance slot styles.
With `isolated.css` and `enableCssLayer`, ordinary unlayered consumer CSS wins
library layers in either import order. With compatibility CSS, account for
specificity and stylesheet order. A scope's variables inherit only into its DOM
subtree; FqThemeProvider also carries its resolved configuration into FQ portal
roots. Slots do not copy arbitrary ancestor CSS variables across a portal.

Direct inline properties such as `style={{ padding: 12 }}` beat ordinary
stylesheet declarations on the same element. An inline custom property only
provides a variable: it still follows inheritance and the consuming declaration's
cascade and fallback. For example, `--fq-button-radius` affects Button only while
its border-radius declaration consumes that token; an explicit border-radius
rule can supersede it. A descendant can redefine an inherited variable. Keep
scope classes on an actual ancestor, and verify an outside sibling stays intact.
`Foundations/Overrides/Contracts` demonstrates slot decoration and independent
native callbacks; the browser gate checks padding, gap, radius, color and font
at global, scope, component and instance levels without screenshots.

## Portal scope

`FqThemeProvider tokens/mode/density` carries the same resolved CSS variables,
mode and density to Dialog and BottomSheet modal roots and the Snackbar outer
root. React context crosses portals; variables live inline on each overlay root.
No theme tokens or mode attributes are written to `body`, no portal-host wrapper
is added, and existing refs/native/style targets remain as documented above.
Updates affect open overlays immediately, including nested overlays. Independent
providers keep their brands separate even when all portals target the same body.

A nested token provider starts from the default configuration with its own
explicit overrides, as before; it does not merge partial configuration with the
outer brand. A nested legacy provider without token props preserves inherited
CSS scope for its portals. Its optional legacy MUI theme remains independent of
the token source; use tokens for synchronized CSS/MUI customization. Arbitrary
ancestor classes, inline properties and custom CSS variables outside provider
configuration are not mirrored into a portal. Supply shared design values via
the token configuration or decorate overlay slots explicitly.

Dialog and BottomSheet default to body portals (`disablePortal=false`). Both
accept `container`: an HTMLElement, null, or a callback returning an element/null.
Callbacks run after mount, so `container={() => document.getElementById('host')}`
is safe to declare during SSR. Keep the target stable and mounted for the overlay
lifetime; choose a host outside clipping/transformed ancestors when escape is
required. Null uses MUI's default body resolution. Cross-document/Shadow DOM
hosting is not certified.

Snackbar preserves its existing inline default (`disablePortal=true`). Set
`disablePortal={false}` to escape an overflow/transform ancestor; `container` then
selects its portal destination. A custom container alone does not enable it.
Tooltip and Coachmark remain inline, inherit provider tokens through normal DOM
ancestry and keep their existing positioning APIs; this task adds no portal to
them. All inline overlays can be clipped or participate in an ancestor stacking
context. `disablePortal` is an explicit tradeoff, not a clipping workaround.

```tsx
<FqThemeProvider tokens={brandA} mode="dark">
  <Dialog open={open} title="Confirm" onClose={close}>
    <Button>Brand A</Button>
  </Dialog>
  <Snackbar
    open={saved}
    message="Saved"
    disablePortal={false}
    container={() => document.getElementById('notifications')}
  />
</FqThemeProvider>
```

Server rendering does not evaluate container callbacks. Portaled modal content
mounts after hydration; BottomSheet's existing client lifecycle remains intact.
Inline Snackbar renders during SSR; the root receives the same token values on
server and client. Unmount removes portal nodes; no new body theme attributes or
standalone portal hosts require cleanup. Existing MUI focus/stack handling and
shared scroll-lock ownership remain active. Keep one `enableCssLayer` policy per
SSR process as described above.

`Foundations/Portals/Contracts` exercises default/custom/inline containers, two
brands/modes, live updates and nested portals. Browser checks use computed styles
for color/spacing/radius/font, hit testing outside a transformed overflow host,
fixed sheet geometry and scoped changes; unit tests cover refs, SSR callbacks and
unmount cleanup. Default DOM/style/layout baselines remain unchanged. The existing
compatibility MUI reset affects modal-root positioning; scope propagation does not
replace those defaults with a new layout or promise all inline content is visible.

### Release gate checks

Run `npm run verify:a11y` for the full desktop light/dark axe audit and
`npm run verify:gates` to prove layout, behavior, a11y and package gates reject
intentional regressions in an isolated temporary branch. Both complement the
full browser matrix and unit coverage; neither a filtered audit nor jsdom alone
is a full release receipt. See [verification](verification/README.md) and the
[T10 migration guide](docs/t10-accessibility-migration.md) for reviewed changes.
