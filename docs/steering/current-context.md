# Current Context

Last reviewed: 2026-11-12. Scope: T10 release gates, reviewed baselines and negative probes.
Owner: maintainer / AI yang mengerjakan task aktif.
Source reference: base073585e plus uncommitted T01–T10 work. Unrelated user edits,
including .gitignore/tracked coverage, remain intact; root Git is unchanged.

## Current state

- T01/T02/S01/T03/T04/T05/T06/T07/T08/T09 completed locally. T10 local gate
  verification is finishing; hosted CI and required protection remain pending.
  Handoff stays T10→T10. T11/T12 and production readiness are not accepted.
- CI separates quality/coverage/build, macOS arm64 frozen browser contracts,
  full accessibility + regression canaries, installed consumer Node matrix, and
  aggregate Release gates. Every prerequisite must succeed; skipped/failing jobs
  make the aggregate fail. No screenshots are used.
- Accessibility scans all 284 component/icon stories in light/dark desktop using
  private axe instances and shared WCAG A/AA + aria-dialog-name policy. Storybook
  uses test:error. Stale builds, changing inputs, violations and unresolved
  incomplete diagnostics fail. Discovery is not CI acceptance.
- Selected-Tab pseudo diagnostics require measured opaque contrast >=4.5, underline
  below text and unobscured hit tests; reports retain measurements. All other
  incomplete diagnostics fail. This is not an unrestricted rule exclusion.
- Exactly 130 of 260 expected files receive reviewed intentional paint changes;
  130 remain byte-for-byte intact. Complete JSON comparison proves DOM, classes,
  ARIA, geometry, scroll and non-paint styles unchanged. Baseline metadata records
  old fingerprint, affected IDs and approved value pairs. Full before/after JSON,
  original files and readable HTML remain in the complete-diff-review artifact.
- D014/minor wise-toes-warn changeset and the
  [migration guide](../t10-accessibility-migration.md) document contrast defaults,
  dark feedback, gradient text backgrounds, status/page semantics and native
  sibling Chips actions. Main Chip refs/native props/classes/styles retain their
  target; custom properties reach the sibling; both actions disable together.
- The new keyboard fixture proves primary Enter selection, Tab order, dismiss
  Enter/Space activation once each, and callback isolation. Browser density checks
  prove dismiss >=24x24 and no overlap at three scales; its default is24x32.
- verify:gates snapshots explicit project inputs (including LICENSE) onto an
  isolated temporary Git branch. Positive controls must pass, mutations compile,
  and failures must match layout padding, callback counts, Dialog naming or
  package export. Root source/baselines are checked unchanged. It never switches,
  stages or commits the user's Git tree. Patches/logs/results remain reviewable.
- T09 contracts remain: 27 families, 25 groups/349 consumed token aliases, optional
  version-1 additions, bounded density, primary Button background-only alias and
  original native/ref targets. T06 isolated CSS still pairs with enableCssLayer
  and one stylesheet/SSR mode. No JSP/Thymeleaf adaptation was added.

## Verification evidence

Latest full UI/browser receipt source (before the final export-probe diagnostic
refinement; hosted CI will certify the current snapshot):
`845d1ec67a51424ee405fd2cc24bc6125946f77a760636a5c743e42ef22e2c44`.

- Final browser matrix **264/264 pass**: 260 exact expected JSON comparisons at
  390/1440 light/dark and four behavior groups including themes/density, slots,
  portals, overlay/Tooltip interactions, axe and native Chips keyboard callbacks.
- Strict accessibility **568/568 pass**, all 284 stories × light/dark at1440x900.
  Source and baseline integrity checks pass. Final runs use the fingerprint above.
- Unit coverage:558 tests/35 files pass, lines94.08%, functions93.45%, branches88.87%.
  Thresholds remain80/80/70. Versus original plan baseline90.70/87.06/85.26,
  delta is+3.38/+6.39/+3.61 points. Unit tests are jsdom, separate from Chromium.
- Lint, format, stamped Storybook, library build and ten guard groups pass.
  Token inventory remains27/25/349 without active literal colors/dangling aliases.
  API Extractor's existing bundled-TypeScript version warning remains.
- Installed React18.3.1/19.2.8 consumers pass Node22.14.0 with exports/types, ESM,
  original version-1 fixture, fonts/schema, stylesheet isolation/import order,
  SSR/hydration and portals. The matching Node22 receipt passed; final instrumentation is checked again by CI.
  CI additionally configures Node20.19/22.13/24.8; hosted runs are not yet verified.
- Negative probes currently prove layout, callback and Dialog naming gates reject
  their intended regressions after controls pass. Package control passed on the
  corrected complete snapshot; its export mutation is being verified.
- Rejected iteration receipts: first orchestration read the wrong report folder;
  another snapshot omitted LICENSE so its package control failed. Neither counted
  as a successful probe. Earlier130 failing expected comparisons were retained
  until complete paint-only diff review, then the final full matrix passed.
- Reports: verification/reports/{results,run-metadata}.json and browser HTML;
  a11y/results.json; package/results.json; gate-canaries/results.json with patches,
  positive/negative logs and copied gate reports; t10-complete-diff-review/ with
  differences.json, review.html and before/; final steering-check.json.
  Logs: /tmp/fq-t10-{browser-final,a11y-final-receipt,canaries-certified,
  package-final-receipt,coverage-complete,guards-complete,lint-final-source,
  format-final-source,static-final}.log. Policy-only reviews follow runtime checks.

Historical T09 was556 tests/264 browser checks. Historical failed T10 runs and
older fingerprints do not certify the final source. Keep failures distinguishable
from accepted receipts; no blanket baseline regeneration hid regressions.

## Gaps and next action

1. Finish the fourth negative probe and final same-source package receipt; accept
   only the intended export assertion failure after its original control passes.
2. Refresh/check local handoff, copy the verified snapshot onto the isolated
   readiness/t10-release-gates clone and push that branch to execute hosted CI.
   main remains at073585e and unprotected per read-only admin audit; Actions is
   enabled. The clone is outside the user's tree; no remote push has occurred yet.
3. Verify hosted jobs and aggregate result, fix actual failures, then activate/read
   back required Release gates on main, bound to the observed GitHub Actions app.
   Record actual run/protection evidence. No merge, publication or PR is needed.
4. Close T10 and refresh T10→T11 only when every requirement actually passes.
   Update prose/plan/decisions with final facts; do not advance the playground now.

Desktop automated audits do not certify all interactive states, mobile a11y,
manual screen-reader behavior, arbitrary custom themes/fonts/host CSS, RSC,
Shadow DOM/cross-document portals, mixed-layer SSR or custom critical-CSS.
Browser evidence is DOM/computed styles/layout/interactions, never pixel equality.

## Lifecycle reminder

Refresh T10/summary/next T10 while hosted enforcement is pending, then check against
base073585e. Final acceptance requires fresh prose and actual evidence, not manually
edited fingerprints or planned-tooling claims. Root user work stays untouched.
