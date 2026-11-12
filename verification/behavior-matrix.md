# Behavior and compatibility matrix

T01 establishes a pre-refactor contract, not a production-readiness certificate.
`inventory.json` contains all 27 component families, exported prop/type declarations,
story names, test files/cases, and foundation token names. Regenerate it after
public API, token, story, or test changes; review the diff.

## Layers of evidence

| Contract                                                                   | Existing evidence                                       | Browser evidence / remaining work                                                                                                              |
| -------------------------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Button variants, size, loading, disabled, icons, native attrs, ref         | `Button.test.tsx`                                       | All non-interaction Button stories; primary hover, keyboard focus, active; native disabled smoke                                               |
| Input value, focus, error, required, slots                                 | `Input.test.tsx`, `useFormField.test.ts`                | All non-interaction Input stories; fill, value, keyboard blur smoke                                                                            |
| Field labels, description/error, ARIA references, ref                      | `Field.test.tsx`                                        | Default/long-content layout; composed Form checks ID uniqueness and label/description references                                               |
| Form composition, submission, validation context                           | `Form.test.tsx`, `Form.integration.test.tsx`            | Default composition layout; required validation, native submission/reset, and submit hit testing                                               |
| Checkbox/CheckboxGroup, Radio, Switch, Select, Textarea                    | Respective colocated tests listed in inventory          | Initial story for each; full keyboard/change/controlled matrix to expand                                                                       |
| Tabs selection, controlled state, callback, disabled, auto/manual keyboard | `Tabs.test.tsx`                                         | Initial layout plus ArrowRight selection, focus, panel relationship smoke                                                                      |
| Accordion state and toggle                                                 | `Accordion.test.tsx`                                    | All seven Accordion stories; repeated single-mode and controlled browser toggle checks added before T02 refactor                               |
| Dialog/BottomSheet focus, Escape, backdrop, scroll, portals                | `Dialog.test.tsx`, `BottomSheet.test.tsx`               | T04 Dialog names/descriptions; sheet Tab/Shift+Tab, empty/inline focus, backdrop, restore, bounds, mixed portal stacks and shared scroll lock  |
| Tooltip/Coachmark disclosure and placement                                 | Respective colocated tests                              | T04 Tooltip ARIA merge, timers, Escape/controlled state, focus persistence and 12-placement hover bridge; Coachmark lifecycle remains separate |
| Badge/Banner/BannerGradient/BannerInfo/Chips/Label                         | Respective colocated tests                              | Initial story each; additional state combinations before modifying these contracts                                                             |
| NavigationBottom, Countdown, Snackbar                                      | Respective colocated tests                              | Initial story each; countdown wall time/intervals frozen for capture, real timer behavior remains a separate test                              |
| IconBase/IconButton                                                        | Respective colocated tests                              | Initial story each; icon sizes/colors/accessible labels remain inventoried for targeted expansion                                              |
| Consumer overrides, two brands and portal theme inheritance                | Partial className/style coverage in existing unit tests | Dedicated cross-scope/consumer fixtures required in T05–T09                                                                                    |

## Baseline scope

The baseline samples every component family, not every story or Cartesian
combination. Button/Input/Accordion receive additional variant/state coverage, Field has
long content, and Button has explicit hover/focus/active scenarios. All captured
scenarios run with light/dark and mobile/desktop viewports. Tests run without
measurement CSS for the independent behavior checks; transition timing, touch,
browser compatibility beyond recorded Chromium is not
certified by these checks.

Before changing an uncovered component/state, extend its browser assertions and
capture its baseline first. Preserve default API/ref behavior with the existing
unit suite. A known accessibility bug observed in baseline is not an expected
behavior contract: fix it and review only the intentional baseline changes.

## Layout and semantics follow-up

Captured rectangles and scroll dimensions detect changes, but equality alone
does not establish a good initial layout. Add independent overlap, clipping,
hit-testing, unique-ID and ARIA-reference assertions per affected component.
T04 adds scoped axe audits for active Dialog, BottomSheet and Tooltip, with a
negative missing-name probe. Tooltip contrast incompletes require an explicit
computed sRGB check >=4.5:1; all other incompletes fail. Whole-library audits and
contrast coverage remain T10 work.
Behavior pages use real timers; only baseline capture pages freeze intervals.
Maintain these gaps explicitly until corresponding checks are implemented.
