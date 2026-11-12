# Decision Log

Status keputusan: `accepted` berarti arah disepakati, bukan sudah diimplementasikan.
Gunakan `implemented` hanya ketika task dan verifikasinya selesai; `superseded`
harus menunjuk keputusan pengganti. Tambahkan tanggal review saat isinya ditinjau.

## D001 — Browser contracts tanpa screenshot

- Date: 2026-11-09. Status: accepted. Tasks: T01, T10.
- Decision: DOM/HTML semantik, accessibility, computed styles, geometry, dan
  interaction tests menjadi bukti regresi. JSON menyimpan baseline terpilih;
  HTML menyajikan laporan. Screenshot tidak digunakan.
- Reason: hasil terstruktur dapat dibandingkan dan diperiksa AI secara langsung.
- Consequence: browser nyata tetap diperlukan; HTML/jsdom saja tidak menguji
  cascade/layout. Kesamaan pixel dan rasterisasi font di luar klaim validasi.
- Implementation: runner awal, baseline JSON dan laporan HTML tersedia pada T01;
  236/236 checks lulus (2026-11-09). Baseline awal T01 selesai; status tetap
  accepted sampai perluasan kontrak dan integrasi CI T10 selesai. Lihat behavior matrix untuk gap.

## D002 — Foundation customization dengan consumer overrides

- Date: 2026-11-09. Status: accepted. Tasks: T05–T09.
- Decision: satu sumber theme membentuk foundation, semantic, component tokens,
  CSS variables, dan integrasi MUI. Pertahankan override global/scoped/instance
  melalui API style/slot yang konsisten dan kompatibilitas token existing.
- Reason: perubahan brand menyebar tanpa menghilangkan kebutuhan khusus consumer.
- Consequence: density, portal scope, cascade, dan default parity harus diuji;
  schema/nama token final ditentukan ketika T05 dikerjakan.
- Implementation: T05 adds the versioned shared source, generator and opt-in
  scope with browser evidence. Broader cascade, portal and component migration
  remain T06–T09; D002 stays accepted until those tasks are complete.

## D003 — Playground sebelum dashboard persistence

- Date: 2026-11-09. Status: accepted. Tasks: T11, T12.
- Decision: bangun Theme Playground di Storybook setelah kontrak library stabil.
  Dashboard multi-user/multi-brand hanya dibangun bila kebutuhannya dikonfirmasi.
- Reason: buktikan propagasi theme dan export/import sebelum menambah layanan.
- Consequence: editor bukan syarat kesiapan produksi library; draft tidak boleh
  otomatis mengubah theme aplikasi produksi jika layanan publikasi kelak dibuat.
- Implementation: belum dimulai.

## D004 — Source-bound handoff dan lifecycle guard

- Date: 2026-11-09. Status: implemented. Task: S01.
- Decision: context prose disertai manifest handoff generated. Source, policy,
  baseline, dan prose memiliki fingerprint terpisah; perubahan kontrak pada PR
  menuntut review kedua file context. Verification run mencatat build/source
  identity dan menolak perubahan input di tengah run.
- Reason: hasil lama dan context yang tertinggal harus terdeteksi secara otomatis.
- Consequence: generated output dikecualikan; context tidak meng-hash dirinya
  sendiri. Commit/dirty dicatat, equality berdasarkan byte fingerprint. Guard
  tidak menjamin kebenaran semantik, kelengkapan checks, atau branch protection.
- Implementation: local/base-aware guard, six test groups, build/run provenance,
  dan PR/CI wiring terverifikasi lokal. Hosted CI/branch protection belum
  diverifikasi atau diaktifkan; lihat current context untuk evidence terbaru.

## D005 — Required MUI v6 peers and a clean ESM package

- Date: 2026-11-09. Status: implemented. Task: T03.
- Decision: keep MUI v6 and make MUI/Emotion mandatory peers. Bound React to the
  tested 18.3.1/19.2.8 families and MUI to the 6.5 family; Lucide is not a runtime
  peer. Node requirements align with installed tooling and the test matrix.
- Reason: root imports are unconditional; optional peer and zero-dependency claims
  were incorrect. A MUI major migration is outside T03.
- Consequence: preserve ESM/CSS entry names and legacy default styles. Use root
  MUI runtime exports and true type-only imports; bundle declarations through
  CJS API Extractor and rebuild on prepack. React 18 consumers override react-is.
- SSR: expose `enableCssLayer` as opt-in. MUI/Emotion hydration ordering can
  override external CSS; the layer stabilizes precedence. Making it the default
  changes existing component dimensions, so default stays false. T06 still owns
  the broader cascade/reset migration; it must preserve this compatibility mode.
- Implementation: 10 clean React/Node combinations and 260 legacy browser checks
  pass against the same source. Single type bundle and prepack are verified;
  minor changeset and installation/SSR migration docs added. Hosted CI remains
  unverified; see current context for receipts and limitations.

## D006 — Dialog accessible naming on the modal paper

- Date: 2026-11-10. Status: implemented. Task: T04 (Dialog naming batch).
- Decision: attach the heading ID and consumer ARIA naming/description props to
  MUI Dialog's paper, preserving the existing ref and visual classes. Explicit
  `aria-labelledby` takes priority, then `aria-label`, then the rendered heading.
- Reason: MUI v6 forwards `aria-label` on its outer presentation root and creates
  an automatic label reference that does not target our custom heading. Paper
  props must override that reference, including with undefined for titleless use.
- Consequence: a titleless Dialog needs a consumer-provided accessible name;
  optional description IDs refer to consumer content. No CSS change is required.
- Implementation: unit name/description/reference tests and real browser name
  lookups cover titled and titleless stories. Remaining T04 lifecycle work is
  tracked separately and is not certified by this decision.

## D007 — Shared modal focus ownership and document scroll lock

- Date: 2026-11-10. Status: implemented. Task: T04 (BottomSheet lifecycle batch).
- Decision: BottomSheet uses MUI Modal's shared manager for focus trapping,
  restoration, background isolation and topmost Escape alongside Dialog. Keep
  the existing sheet/backdrop CSS, paper ref, portal default and 280ms exit.
  Initial focus waits for both the actual portal node and the visible state;
  choose the first available control, or the sheet with tabindex -1.
- Scroll: Dialog and BottomSheet share a document-scoped reference count via
  `useModalScrollLock`; disable MUI's per-container scroll locking. Inline sheets
  use their local parent as the MUI container so the modal is not aria-hidden
  through its ancestor. Scroll remains locked through exit, restores previous
  declarations and compensates scrollbar width for body and `.mui-fixed`.
- Compatibility: explicit sheet aria-labelledby takes priority over aria-label,
  then the rendered title. Preserve disablePortal DOM placement and native/ref
  target. The modal root introduces a stacking boundary at MUI's modal level;
  default portal mixed overlays follow opening order. Clipped/transformed inline
  hosts and theme scope remain T08 work.
- Verification: browser keyboard, pointer, bounds, empty/titleless focus, inline
  accessibility and both portal stacking orders; unit rapid reopen, frame
  cancellation, lower-overlay exit and scroll restoration. Behavior pages run
  real timers; interval freezing is confined to deterministic baseline pages.
- Remaining: Tooltip and automatic accessibility audits are still open in T04.

## D008 — Tooltip disclosure lifetime and scoped overlay accessibility gate

- Date: 2026-11-10. Status: implemented. Task: T04.
- Decision: preserve child description IDs and handlers. Coordinate hover/focus/
  touch on the wrapper, clear both timers, read latest callbacks without resetting
  delays, and dismiss with Escape before a containing modal. Controlled open
  remains parent-owned; dismissal blocks reopening until all triggers leave.
- Hover: enable pointer events only for visible content and bridge the existing
  12px gap with a transparent positioned pseudo-element. Keep dimensions, fonts,
  padding and placement unchanged; test pointer travel across all 12 placements.
- Contrast: correct Dialog dark background from white to semantic raised surface,
  and Tooltip text from dark N800 to N0 on its fixed N800 background. Light colors
  are preserved. Tooltip customization migration is documented in CONTRIBUTING.
- Gate: axe-core 4.13.0 audits active overlay scopes with WCAG A/AA through 2.2
  and the explicit best-practice dialog-name rule. Unexpected violations or
  incomplete findings fail; tooltip contrast incompletes require a matching
  tooltip target and opaque computed sRGB ratio >=4.5. Background focus/stacking
  remain independent browser checks, not inferred from scoped axe results.
- Evidence: pre-refactor visible baseline captured, eight intentional color/
  pseudo-element diffs reviewed without geometry or typography changes. Negative
  probe proves missing dialog name fails. CI runs behavior-only mode; global
  Storybook a11y and hosted CI enforcement remain T10/unverified, respectively.

## D009 — Versioned token configuration with compatibility-first generation

- Date: 2026-11-11. Status: implemented. Task: T05.
- Scope: follow the original React library readiness plan. Per latest user
  steering, no JSP/Thymeleaf-specific entry or alternate component implementation.
- Source: reviewed default-theme.json holds foundation, light/dark semantic,
  legacy alias and optional component maps. Pure TS parsing validates categories,
  known keys, references/cycles and version before applying anything. Generate
  six CSS sheets, structural JSON Schema/defaults and public token-name types;
  fail stale generated inputs before build. Scraped values require manual review.
- MUI: consume the same definition for palette, font/weights, base font size,
  spacing/density, numeric radius, shadows and z-index. Keep distinct existing
  FQ and MUI shadow/layer scales as separate tokens; preserve default MUI strings
  and values instead of silently changing their meanings. Do not mirror palette
  constants in TypeScript. Existing component resets remain intact.
- Precedence: preserve CSS names; default legacy spacing values become references
  to canonical spacing. An explicit legacy alias override wins for consumers of
  that alias; component overrides win over lower levels. Full scoped variable
  maps redeclare aliases because CSS substitutes references at the declaration
  boundary. Native CSS-only overrides do not automatically rewrite MUI.
- Provider: opt-in tokens/mode/density create a display-contents boundary plus
  generated MUI context. The legacy default/MUI-only path keeps its original DOM;
  mixing separate MUI and token configs is rejected. Mode is explicit (default
  light) in the token API; existing static CSS preference behavior is retained.
- Density: fixed compact/comfortable/spacious factors, comfortable parity. Button
  consumes horizontal padding/gap factors while size minima remain unchanged;
  Input has initial component overrides. Whole-family migration remains T09.
- Verification: unit invalid/atomic configs and default MUI compatibility;
  generator drift negative tests; browser scoped property changes, component
  isolation, aliases, all densities and invalid import retention; full baseline
  comparison and clean React 18/19 tarball/types/SSR verification.
- Limits: reset/layer isolation is T06, full slot/token APIs T07/T09 and portal
  variable propagation T08. A token boundary is not a portal fix or an editor.

## D010 — Add layered isolation while preserving legacy CSS mode

- Date: 2026-11-11. Status: implemented. Task: T06.
- Compatibility: retain `style.css` unlayered/global-reset behavior and add an
  explicit `compat.css` alias. The provider's default enableCssLayer stays false.
  Move source reset into its own file and keep source demos/Storybook on compat.
- Isolated mode: derive `isolated.css` with actual fq-tokens/fq blocks and no
  application reset. Pair with enableCssLayer so MUI resets stay in mui. Export
  optional reset.css in reset layer. Unlayered consumer styles win in either
  import order. No application body variables/styles are written by JS.
- Internal contract: zero-specificity FQ sizing plus an isolated-only outer FQ
  typography boundary. Preserve measured content-box on MUI ButtonBase/Paper FQ
  roots; do not apply that exception to custom backdrops. This keeps default
  geometry when migrating from unlayered legacy mode. Preserve nested slot
  inheritance so consumer font overrides reach content without important.
- Build: PostCSS is dev-only. Derive two assets from the built graph, reject
  unexpected reset blocks, global selectors and important rules. Tokens/font
  registration remain intentional global resources. Nine-file tarball; aliases
  reuse the legacy asset. No public React ref/native prop target changes.
- Evidence: default browser comparison without rebaselining; clean React 18/19
  legacy and isolated SSR/hydration; native host preservation; actual CSSOM blocks;
  both consumer/reset import orders; default box geometry; explicit/system dark;
  override inheritance and interactions; negative stylesheet extraction tests.
- SSR: use a consistent layer policy per application/process. Mixed layered and
  unlayered server renders share Emotion serialization output and remain outside
  certification; tests isolate modes rather than claiming that cache is fixed.
- Remaining: component slots T07, brand portal inheritance T08 and complete
  component/density migration T09. Hosted CI and full-family certification T10.

## D011 — Decoration slots preserve native targets

- Date: 2026-11-12. Status: implemented. Related task: T07.
- Add shared public FqSlotCustomization/FqSlotProps/FqSlotStyle contracts with
  classNames and slotProps. Named parts accept className, style/custom properties
  and primitive data attributes only. Runtime filtering also excludes events,
  ref, id, role, ARIA and semantic state for JavaScript callers.
- Existing component/native callbacks remain the behavioral API and retain their
  existing composition. Decoration slots do not supply a second event path.
  Internal classes remain; slot style merges before existing top-level style.
  BottomSheet drag transform/transition and explicit Tooltip maxWidth still win.
- Implement named parts on Button, Input, Select, Textarea, Checkbox, Radio,
  Switch, CheckboxGroup, Field, Dialog, BottomSheet, Tooltip and Snackbar.
  Other families retain native root or public compound-part APIs. The complete
  target/slot table in CONTRIBUTING is the supported contract; private descendants
  are not implicitly public slots.
- Preserve native/ref targets, especially native form inputs, Dialog paper and
  Snackbar's split outer ref/inner class target. Add Field outer ref/class/style
  without moving its contextual id; add Dialog paper and Snackbar content style.
  Default DOM/classes/styles remain equivalent without customization.
- Verify installed consumer positive/negative types, class/style merges and safe
  runtime filtering, native attributes/refs, callbacks/state/ARIA and real browser
  global/scope/component/instance cascade with sibling isolation. Browser overlay
  checks include customized sheet backdrop forwarding and focus/close behavior.
- Guide distinguishes direct inline CSS from inherited custom properties and
  compatibility versus isolated layer precedence. Portal token scope remains T08.

## D012 — Carry resolved token scope on portal roots

- Date: 2026-11-12. Status: implemented. Related task: T08.
- Provider context carries the generated CSS variable map, mode and density.
  React context crosses portals; Dialog/BottomSheet modal roots and Snackbar's
  outer root receive that scope inline. No added DOM wrappers/hosts, no global
  body theme writes and no new CSS/layout rules. Legacy providers add no DOM.
- Preserve Dialog/BottomSheet body portal defaults and Snackbar's inline default.
  Add typed container and disablePortal options. Container callbacks are evaluated
  by MUI after mount; server rendering does not access DOM through those callbacks.
  Snackbar's opt-in Portal requires disablePortal=false; container alone does not
  change placement. Tooltip and Coachmark retain inline DOM inheritance.
- Explicit nested token providers resolve their own config from defaults, as
  before; they do not partially merge brands. Nested legacy providers retain the
  inherited CSS portal scope. Legacy MUI theme-only overrides remain independent.
  Arbitrary ancestor variables/classes are not copied; use token config or slots.
- Inline Dialog's new disablePortal path uses its actual parent as MUI's manager
  container (same ownership rule as BottomSheet). A regression test reproduced
  the inaccessible inline dialog when body management aria-hid its ancestor;
  the corrected path keeps the dialog in the accessible tree. Forwarded refs stay
  on paper/sheet/Snackbar outer root. Default paths remain unchanged.
- Default/custom body portals escape the tested transformed overflow host. Inline
  and deliberately clipped custom hosts retain normal CSS clipping/stacking.
  Do not silently change the existing MUI reset's root layout or z-index policy.
  Shared MUI focus/modal stacking and scroll-lock lifecycle continue to own cleanup.
- Verification covers live two-brand/mode updates, default/custom/inline placement,
  nested modal scope, computed color/spacing/radius/font, fixed sheet geometry and
  click hit testing, SSR callbacks, refs, unmount and installed React 18/19 portals
  opened after SSR hydration. Full default baseline remains a separate gate.
- Requires consistent CSS-layer policy per SSR process. Cross-document/Shadow DOM
  hosting and automatic copying of ad-hoc DOM-scoped variables remain uncertified.

## D013 — Per-family aliases and bounded density migration

- Date: 2026-11-12. Status: implemented. Related task: T09.
- Centralize the closed override registry in componentTokens.ts: 349 consumed
  keys across 25 styled groups. Field/Form keep native/context inheritance.
  Parser, generated schema and public mapped types use the same registry. Exact
  defaults remain at CSS use sites, with legacy aliases/fallbacks retained.
- Keep original Button/Input keys and their precedence. Button primary remains
  background-only; new accent covers focus/primary-colored text. New definition
  groups and semantic roles are optional so version-1 definitions remain valid;
  requiredSemanticTokens.ts records the original required role contract. The
  installed consumer compiles a fixed original definition fixture.
- New density scales are bounded to 0.75–1.25 in parser and CSS clamp. Preserve
  glyph/control dimensions, Input floating-label geometry, safe areas, arrows,
  transitions and explicit minima. Helper indentation follows its spacing alias;
  Switch gap, Chip dismiss and Tab badge offsets follow their matching spacing.
- Scoped family typography covers labels/helpers/inherited content. Portal roots
  carry data-fq-theme plus their full variables, without extra wrappers/body writes.
  Legacy provider paths keep host inheritance. Native prop/ref targets do not move.
- Active literal colors move to semantic roles or component overrides; compatible
  var() color fallbacks stay. Build/Storybook prechecks now run tokens:inventory,
  rejecting active hex/RGB colors, unknown FQ aliases and orphan registry tokens.
  Retained geometry/state/font metrics are listed in its report. Negative guard
  tests reproduce all three rejection paths.
- Controls, navigation and feedback each passed a full gate before proceeding.
  Later typography/spacing compatibility refinements were reviewed in the final
  whole-library comparison. All 260 expected JSON remain unchanged; four behavior
  groups check representative brands/states at every density and viewport/mode.
- Final evidence: 556 tests, 264 browser checks, 10 guard groups, React 18/19
  published types/native ESM/SSR/hydration/isolated consumers and matching source
  receipts. Per-family keys, slots, states, density and examples are documented in
  docs/component-tokens.md. Broader state/a11y/hosted release enforcement remains T10.

## Template keputusan baru

- ID / title / date / status / related tasks.
- Decision dan alasan; alternatif hanya bila menjelaskan tradeoff yang relevan.
- Dampak kompatibilitas, verifikasi wajib, serta implementation evidence.
- Supersedes/superseded by jika menggantikan keputusan sebelumnya.

## D014 — Fail-closed accessibility gate and intentional contrast repairs

- Date: 2026-11-12 (UTC; 2026-11-13 Jakarta). Status: implementing. Task: T10.
- Audit all component/icon stories in both themes with a private axe instance in
  real Chromium. Stamp source identity before building; reject stale output and
  source/baseline changes during an audit. Discovery is diagnostic, never a CI
  acceptance receipt. jsdom remains a separate unit gate.
- Share WCAG 2.0/2.1/2.2 A/AA rule selection and aria-dialog-name with Storybook;
  promote its test policy from todo to error after a strict 566/566 desktop run.
  Unresolved incomplete results fail. Selected-Tab pseudo diagnostics require
  measured opaque paint contrast >=4.5, underline/text separation and unobscured
  hit tests. Persist those measurements; no general exception disables a rule.
- Intentionally repair accessible default colors, dark feedback, gradient text
  paint, expired timer text, native sibling Chip actions, decorative navigation
  names and page/status semantics. Preserve public primary refs/native props,
  override keys and optional version-1 semantic extensions. Exact consumer impact
  is described in docs/t10-accessibility-migration.md and wise-toes-warn changeset.
- Static quality, frozen browser contracts, accessibility and installed consumers
  feed an aggregate Release gates CI check. Mac browser execution matches the
  frozen platform; consumer Node versions remain separate jobs.
- Not yet accepted as a completed release gate: intentional baseline differences,
  negative regression probes, hosted CI and required branch protection must all
  be verified. No remote branch or repository protection change has been made.

T10 implementation review: complete actual JSON and readable before/after HTML
validated exactly130 paint-only baseline changes, preserving DOM/classes/ARIA,
geometry, scroll and other styles. Native Chips Tab/Enter/Space callback proof is
part of the four existing behavior groups. Regression canaries now use positive
controls and compiling mutations on a copied Git branch; export diagnostics also
inspect the installed manifest and missing target rather than matching unrelated
build errors. CI execution/protection remain pending until actual hosted receipts.
