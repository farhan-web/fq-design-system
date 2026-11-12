# Browser contract verification

T01 tooling; no screenshots. Install the locked dependencies and Chromium:

```sh
npm ci
npx playwright install chromium
npm run build-storybook
node scripts/inventory-contracts.mjs
npm run verify:browser
```

Initial baseline creation or an intentional change requires a reason:

```sh
npm run verify:browser:update -- --reason="T01 initial browser contracts"
```

Review JSON changes before accepting them. Updates do not establish correctness:
known bugs must be fixed with independent assertions in the appropriate task.
Never refresh baselines just to pass a failed comparison.

Both npm verification commands rebuild Storybook first to avoid stale output.
The runner serves the static build locally, captures selected fq elements and
pseudo-elements, semantic accessibility snapshots, computed styles and geometry.
It checks every initial component story including IconBase, plus Button/Input/Accordion variants and states
at mobile/desktop widths and light/dark. Basic input keyboard and disabled button
and Tabs arrow-key behavior are asserted independently. Accordion checks cover
repeated single-mode toggles and two-way controlled state. Form checks assert
label/ARIA references, ID uniqueness, required validation, submit/reset, and
button hit testing. Other state combinations and detailed
behavior contracts remain to be expanded; see [the behavior matrix](behavior-matrix.md),
the generated inventory and T01.

Comparison is exact, including browser/platform metadata and fractional geometry.
Use the recorded Playwright/browser version, OS, architecture and DPR; establish
separate baselines before using a different environment. There is no global
layout tolerance. Fonts load before capture; application intervals and wall time
are frozen. Animation styles are disabled only for baseline measurement.

`reports/verification-report.html` lists expected/actual differences; failure
artifacts contain escaped DOM HTML. These generated files are ignored. Baselines,
metadata, and `inventory.json` are tracked. ARIA snapshots complement assertions;
they are not an automated accessibility audit. Internal DOM/class structure in
the initial capture is diagnostic and may require a reasoned baseline migration
when public behavior/style is preserved. Pixel equivalence is not claimed.

For targeted comparison, use `npm run verify:browser -- --filter=icons-iconbase`.
Filtered reports are saved under `reports/filtered/`.
The filter matches scenario keys; unmatched filters fail. Targeted runs skip the
shared behavior smoke tests, so they do not replace the full run. Updates can use
the same filter and still require a reason. Failed update runs do not write
collected baselines. Metadata records which scenarios were last captured.

Use `npm run verify:browser -- --behavior-only` for the independent behavior
smoke groups without style capture. Its report is saved under `reports/behavior/`.
It cannot be combined with `--update` or `--filter`. This is a fast diagnostic
run, not a replacement for the full browser contract run.

## Provenance and handoff

The npm commands now use a build wrapper that records source fingerprints before
and after the static build. Direct runner invocation requires a matching build
stamp; an older Storybook build is rejected. Each run writes `run-metadata.json`
and embeds it in the HTML report: commit/dirty state, source/policy/baseline
fingerprints, build identity, runtime, mode/filter, timestamps, and status.
Source or baseline mutation during a run fails verification. Comparison metadata
is separate from expected snapshots, so adding provenance does not refresh them.
Existing historical baseline metadata is not retroactively attributed to source.

After reviewing source and updating context, use the steering handoff procedure
in [the steering guide](../docs/steering/README.md). CI checks structure/freshness
and PR context updates; full browser regression CI remains T10 work because the
current baselines are specific to macOS arm64 Chromium.

## Clean tarball consumers

```sh
npx playwright install chromium
npm run verify:package
```

The command runs real `prepack` builds during dry-run and actual packing. It checks
that the tarball contains exactly public JS, bundled declarations, CSS, README,
LICENSE, and package metadata; no internal source/tests/demo assets. Native ESM
imports no longer depend on MUI directory imports. `bundle-types.mjs` uses API
Extractor's CJS export and fails the build if bundling fails. Its bundled TS 5.8
engine currently warns about project TS 6; strict consumer TS 6 checks validate
the emitted declarations in both Bundler and NodeNext modes.

Fresh temporary consumers install the tarball and exact peer versions with React
18.3.1 / 19.2.8. React 18 uses the documented react-is override. No repository
node_modules symlinks are used. The harness checks every public runtime/type
export, unsupported prop rejection, four embedded WOFF2 fonts, production app/SSR
builds, native ESM server render, warning-free hydration, click/input interactions,
scoped color/radius overrides, and inline padding. SSR fixture opts into
`enableCssLayer`; default legacy styling remains covered by the separate 260-check
browser comparison. The opt-in can change geometry and is not silently enabled.

Results include source fingerprints, Node version, tarball integrity, peers and
computed style evidence in `reports/package/results.json`. Per-runtime receipts
are retained as `reports/package/node-<version>.json`. Verification publishes
nothing. Successful fixtures are deleted; failed fixture paths remain in reports
for diagnosis. Downloads use a temporary shared npm cache; override its location
with `FQ_PACKAGE_NPM_CACHE` if needed.

CI is configured for Node 20.19.0, 22.13.0, and 24.8.0 and uploads package evidence
alongside the steering report. Local matrix evidence is recorded in current
context; configuration alone is not proof a hosted CI run passed.

## T10 release gates

`npm run verify:a11y` builds stamped static Storybook and audits every component/
icon story in light and dark with Chromium at 1440x900. The shared Storybook policy
uses `test: error`. WCAG A/AA violations and unresolved axe incomplete results
fail the command. Filtered/representative runs are diagnostic subsets, not full
acceptance. See the [accessibility migration guide](../docs/t10-accessibility-migration.md)
for intentional consumer changes and the measured selected-Tab fallback.

`npm run verify:gates` creates an isolated Git branch in a temporary workspace.
It proves each original gate passes, introduces one compiling regression, and
requires the corresponding assertion to fail: Button padding/layout, Button
callback behavior, Dialog accessible name, and installed package export. Snapshot
source and baseline fingerprints must match; root source/baselines must remain
unchanged. Reports retain positive/negative logs, patches, gate results and the
workspace path. A failed control/build or unrelated failure never counts as proof.
This command needs the same installed browser and package registry access as the
underlying gates; it never switches/stages/commits the user's working repository.

CI runs static quality/coverage, the full frozen browser matrix and accessibility,
the regression canaries, and installed React consumers across the Node matrix.
The aggregate `Release gates` job fails when any prerequisite fails or is skipped.
Hosted execution and required branch protection are separate facts recorded in
current context; workflow YAML alone is not evidence that merging is blocked.

Browser reports include complete `*.actual.json` alongside the HTML summary.
T10's baseline metadata records exactly 130 reviewed paint changes and 130 retained
files, approved before/after pairs and unchanged DOM/ARIA/geometry/scroll contracts.
The full review JSON/HTML and original expected files are retained in
`reports/t10-complete-diff-review/`. No screenshot validation is performed.
