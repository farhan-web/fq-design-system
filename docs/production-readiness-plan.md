# Production Readiness & Theme Customization Plan

Dokumen ini adalah backlog implementasi, bukan laporan bahwa pekerjaan sudah
selesai. Status task diperbarui berdasarkan bukti implementasi di current context. Tujuan: library siap produksi, foundation
dapat dikustomisasi, dan tampilan serta behavior default tetap konsisten.

## Baseline dan aturan perubahan

Hasil review sebelumnya: build lulus; 467 tes pada 30 file lulus; coverage lines
90,70%, functions 87,06%, branches 85,26%; lint gagal dengan 8 error; format
gagal pada 85 file. Jalankan ulang untuk mendapatkan baseline saat implementasi.

- Bekukan baseline DOM, computed styles, layout, dan kontrak behavior **sebelum** refactor arsitektur.
- Default token, ukuran, warna, typography, spacing, dan public API harus tetap
  kompatibel. Nama token baru tidak boleh memutus token lama.
- Perbaikan bug boleh mengubah hasil yang salah. Catat perubahan yang disengaja
  beserta before/after; jangan menjadikan bug lama sebagai kontrak wajib.
- Jangan memperbarui seluruh baseline hanya agar CI hijau. Setiap perubahan
  baseline harus memiliki alasan dan hasil review.
- Pisahkan PR formatting, bug fix, migrasi token, dan fitur editor agar mudah
  ditinjau. Jangan mengubah file kerja consumer yang tidak terkait.

## Prioritas dan dependency

| Prioritas | Task                                  | Dependency                              |
| --------- | ------------------------------------- | --------------------------------------- |
| P0        | T01 Baseline DOM, style, dan behavior | Tidak ada                               |
| P0        | T02 Pulihkan quality gates            | T01                                     |
| P0        | S01 Steering dan lifecycle guard      | T02                                     |
| P0        | T03 Packaging dan compatibility       | T01                                     |
| P0        | T04 Aksesibilitas overlay             | T01, T02                                |
| P1        | T05 Kontrak token dan sumber tunggal  | T01, T03                                |
| P1        | T06 Cascade dan isolasi style         | T05                                     |
| P1        | T07 API override komponen             | T05, T06                                |
| P1        | T08 Theme scope dan portal            | T04–T07                                 |
| P1        | T09 Migrasi seluruh komponen          | T05–T08                                 |
| P1        | T10 Gerbang rilis otomatis            | T02–T09                                 |
| P2        | T11 Theme Playground                  | T09, T10                                |
| P3        | T12 Dashboard dan publikasi theme     | T11; kebutuhan multi-brand dikonfirmasi |

P0 memblokir rilis produksi. P1 harus selesai untuk menjanjikan kustomisasi
foundation yang konsisten. P2 membangun pengalaman editor; P3 bersifat opsional.

## P0 — Stabilitas sebelum perubahan arsitektur

### T01 — Bekukan baseline yang dapat direproduksi

- [x] Buat inventaris semua komponen, variant, size, state, token, dan API publik.
- [x] Tambahkan stories untuk kombinasi penting yang belum ada, termasuk default,
      hover, focus-visible, active, disabled, loading, error, dan konten panjang.
- [x] Siapkan browser regression tanpa screenshot dengan Playwright terhadap
      Storybook: semantic DOM/HTML, accessibility snapshot, computed styles,
      serta layout geometry dalam JSON.
- [x] Simpan matriks behavior: keyboard, controlled/uncontrolled, event callback,
      ref, form submission/reset, focus, dan ARIA.

**Verify:** jalankan pada viewport 390×844 dan 1440×900, light/dark,
font lokal selesai dimuat, waktu/data tetap, serta animasi selesai atau
dinonaktifkan untuk pengukuran style/layout. Gunakan browser/OS/DPR yang sama di
CI. Dua run tanpa perubahan harus menghasilkan baseline terstruktur yang sama.
Simpan baseline per commit dan diff HTML/JSON ketika gagal, tanpa screenshot.
Storybook menyediakan toolbar light/dark; runner memverifikasi theme pada HTML.
Skenario fokus/animasi tetap diuji terpisah dengan animasi normal.

Status T01: **completed untuk baseline awal** (2026-11-09). Inventaris 27
keluarga, 232 baseline skenario, dan matriks behavior tersedia. Stories Form/Field,
Button hover/focus/active, serta assertion form/keyboard/hit testing ditambahkan.
Comparison penuh lulus 236/236; behavior tambahan lulus 4/4. Perluasan state dan
assertion khusus wajib mendahului refactor keluarga terkait; lihat [behavior matrix](../verification/behavior-matrix.md). Baseline
awal bukan bukti bahwa semua kombinasi story sudah diuji.

### Kontrak validasi tanpa screenshot

HTML saja tidak membuktikan hasil CSS. Gunakan browser nyata untuk mengambil
hasil rendering yang bisa diperiksa AI dan assertion otomatis:

| Lapisan           | Data dan assertion                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| DOM/HTML semantik | Tag, role, label, native attributes, slot, dan hubungan ARIA                                     |
| Accessibility     | Accessible name/state, urutan fokus, dan audit otomatis                                          |
| Computed styles   | Color/background, padding, gap, radius, border, font, line-height, shadow, outline, visibility   |
| Layout            | Bounding rect, scroll/client dimensions, alignment, overlap, clipping, serta hit testing overlay |
| Behavior          | Keyboard/pointer, event callback, form, ref, focus restore, dan state transition                 |

- Simpan HTML diagnostik dan JSON terpilih per komponen/state/theme/viewport;
  hindari snapshot seluruh DOM atau seluruh CSS yang mudah berubah tanpa makna.
- Normalisasi ID generated dan class Emotion pada artefak diagnostik. Tetap uji
  bahwa ID unik dan referensi label/deskripsi menunjuk elemen yang benar.
- Bandingkan computed styles root **dan** slot penting, termasuk `::before`/
  `::after` bila dipakai. Perubahan DOM internal boleh terjadi jika public
  contract, accessibility, style, dan behavior tetap memenuhi assertion.
- Gunakan nilai expected eksplisit untuk token/warna/state; ukuran hasil token
  dibandingkan tepat setelah normalisasi. Untuk layout pecahan, tetapkan
  toleransi per assertion (awal maksimal 0,5 CSS px pada environment sama),
  bukan toleransi global yang menyembunyikan regresi.
- Uji relasi layout, bukan hanya angka snapshot: label tidak menimpa teks,
  konten penting tidak terpotong, serta elemen fokus dan klik tetap terjangkau.
- Artefak usulan: `verification/baselines/<component>/<scenario>.json` dan
  laporan `verification-report.html` berisi tabel expected/actual dan DOM diff.
  Runner awal tersedia melalui `npm run verify:browser`; baseline ada di
  `verification/baselines/` dan laporan generated di `verification/reports/`.
- Metode ini tidak membandingkan pixel, rasterisasi font, atau detail gambar.
  Sediakan halaman HTML preview untuk review manusia bila dibutuhkan; jangan
  mengklaim kesamaan pixel dari kelulusan assertion DOM/style/layout.

### T02 — Pulihkan lint dan format

- [x] Perbaiki akses ref saat render di Accordion, unused variable di Label,
      dan penggunaan hooks pada render stories.
- [x] Rapikan formatting sebagai batch terpisah; tetapkan cakupan generated/local files
      yang memang harus dikecualikan, bukan mengecualikan source yang gagal.

**Verify:** `npm run lint`, `npm run format:check`, `npm test`, dan
`npm run build` lulus; kontrak DOM/style/layout T01 tetap lulus. Refactor Accordion harus
tetap lulus tes toggle berulang dan controlled state.

Status T02: **completed** (2026-11-09). Lint tanpa warning, format, build,
469 unit tests dan coverage gates lulus. Accordion direkam sebelum refactor
(28 browser scenarios), kemudian full comparison lulus **260/260** tanpa update
baseline setelah perbaikan. Dua regression tests menjaga controlled updates dan
observer sekali per toggle di StrictMode. Changeset patch sudah ditambahkan.
Formatting source terpisah secara scope dari runtime fixes; output generated dan
catatan lokal AI dikecualikan, bukan source yang gagal. Belum dibuat commit/PR.

### S01 — Perkuat steering dan lifecycle (prioritas pengguna setelah T02)

- [x] Tambahkan provenance source/build pada hasil browser verification.
- [x] Validasi struktur, link, fingerprint source/policy/baseline/context, dan
      kewajiban context review pada perubahan kontrak terhadap base PR.
- [x] Tambahkan PR handoff checklist serta CI guard dan negative regression tests.
- [x] Perbarui current context dan rekam handoff terstruktur tanpa klaim bahwa
      guard menjamin kebenaran semantik atau branch protection sudah aktif.

**Verify:** positive/negative guard tests, steering check lokal dan terhadap base,
lint/format, serta browser run dengan build/run metadata yang konsisten. S01
menguatkan proses sebelum T03; tidak mengubah implementasi library.

Status S01: **completed secara lokal** (2026-11-09). Enam guard test groups,
469 unit tests, lint/format, dan 260 browser checks lulus. Provenance build/run
memiliki source fingerprint yang sama; expected baseline tidak diperbarui.
Local/base-aware steering check lulus. CI dan PR template sudah dikonfigurasi;
GitHub hosted run dan required branch checks belum diverifikasi/diaktifkan.

### T03 — Benahi kontrak instalasi dan paket distribusi

- [x] Putuskan MUI/Emotion wajib atau integrasi terpisah. Entry utama tidak boleh
      mengimpor dependency yang dijanjikan opsional tetapi tidak terpasang.
- [x] Selaraskan README, peer dependencies, versi Node, CI, dan versi yang diuji.
- [x] Periksa export JS, deklarasi TypeScript, CSS, fonts, dan isi tarball.
- [x] Pastikan proses rilis membangun artefak dari source terbaru.

**Verify:** jalankan `npm pack --dry-run`, lalu pasang tarball nyata ke consumer
fixture bersih di direktori sementara. Build dan render fixture, cek resolusi
types/assets tanpa source repository. Jika MUI opsional, fixture tanpa MUI
harus bisa memakai entry core. Jika wajib, instalasi terdokumentasi harus
menyertakannya. Uji SSR import/render untuk komponen yang didukung dan hydration
tanpa warning; uji batas versi dependency yang benar-benar dijanjikan.

Status T03: **completed secara lokal** (2026-11-09). Required MUI/Emotion peers,
React/Node bounds dan docs diselaraskan; Lucide bukan runtime peer. Single public
declaration, native ESM imports, exact six-file tarball dan prepack build teruji.
Clean React 18/19 consumers lulus pada Node 20.19.0, 22.13.0, 22.14.0, 24.0.0 dan
24.8.0 (10 combinations): Bundler/NodeNext types, native SSR/hydration, fonts,
interaction, scoped tokens dan instance padding. SSR memakai opt-in
`enableCssLayer`; default false menjaga compatibility. Default browser comparison
lulus 260/260 tanpa update expected; 469 tests/coverage, lint/format dan guard tests
lulus. CI matrix dikonfigurasi, belum dijalankan hosted. Minor changeset tersedia.

### T04 — Perbaiki aksesibilitas dan lifecycle overlay

- [x] Dialog: hubungkan heading dengan `aria-labelledby`; izinkan accessible
      name ketika tidak ada judul dan deskripsi bila diperlukan.
- [x] BottomSheet: fokus setelah konten mounted, fallback fokus tanpa judul,
      trap fokus, dan kembalikan fokus ke pemicu saat ditutup.
- [x] Tangani cleanup animation frame, buka/tutup cepat, overlay bertumpuk,
      Escape hanya pada overlay teratas, serta scroll lock bersama.
- [x] Audit Tooltip: gabungkan `aria-describedby` existing, cleanup timer,
      keyboard dismissal, dan perpindahan pointer ke konten tooltip.

**Verify:** browser keyboard tests untuk Tab/Shift+Tab, Escape, backdrop,
focus restore, tanpa judul, tanpa elemen focusable, serta dua overlay bersamaan.
Background tidak boleh menerima fokus ketika modal terbuka. Tutup satu overlay
tidak membuka scroll ketika overlay lain masih aktif. Tambahkan pemeriksaan
aksesibilitas otomatis dan tes accessible name; perubahan baseline harus
sesuai perbaikan yang dicatat. Jangan hanya memeriksa keberadaan role.

Status T04: **completed secara lokal** (2026-11-10). Dialog naming, BottomSheet
focus/cleanup/stacking dan shared scroll lock teruji. Tooltip mempertahankan
ARIA existing, membersihkan timer, menangani Escape serta hover ke bubble pada
12 placement. Axe audit overlay aktif dan negative dialog-name probe tersedia;
incomplete kontras Tooltip memakai fallback computed-color >=4.5:1 yang spesifik.
Dark Dialog/Tooltip contrast diperbaiki. Delapan baseline color/pseudo diffs
sengaja direview; geometry/typography tetap. CI behavior/a11y dikonfigurasi,
hosted run belum diverifikasi. Scope dan evidence final ada di current context;
T05 berikutnya, sedangkan a11y seluruh library tetap T10.

## P1 — Kontrak kustomisasi yang konsisten

### T05 — Definisikan token dan satu sumber konfigurasi

- [x] Definisikan schema theme JSON berversi dengan defaults dan validasi.
- [x] Bedakan foundation (palette, spacing, radius, typography, shadow), semantic
      (primary, surface, text, border), dan component tokens.
- [x] Hasilkan CSS variables dan MUI theme dari sumber yang sama, dengan strategi
      light/dark yang eksplisit. Hindari dua tabel warna hardcoded.
- [x] Pertahankan token existing melalui alias dan tetapkan precedence ketika
      consumer mengatur nama lama serta nama baru secara bersamaan.
- [x] Rancang density compact/comfortable/spacious sebagai pemetaan padding dan
      gap; ukuran sm/md/lg tetap pilihan komponen. Density default harus identik
      dengan tampilan saat ini.

**Verify:** default output menghasilkan computed styles yang sama dengan T01.
Ubah warna, spacing, radius, font, shadow satu per satu; seluruh komponen yang
bergantung pada token itu mengikuti. Component override hanya memengaruhi
jenis komponen terkait. Token lama tetap bekerja, termasuk state hover/focus.
JSON invalid ditolak dengan pesan jelas tanpa merusak theme aktif.

Status T05: **completed secara lokal** (2026-11-11). Version 1 JSON defaults,
strict runtime/reference validation, generated CSS/schema/types, shared MUI
factory and opt-in provider scope tersedia. Legacy names/alias precedence dan
comfortable defaults dipertahankan; generator drift ditolak. Browser property
matrix meliputi palette, spacing, radius, font, shadow, component overrides,
density, sibling isolation dan invalid import retention. Initial component tokens
Button/Input; density consumption Button. Migrasi seluruh keluarga tetap T09;
portal scope tetap T08 dan tidak diklaim selesai oleh T05. Lihat current context
untuk final gate evidence. User mengarahkan scope tetap plan awal tanpa adaptasi
khusus JSP/Thymeleaf.

### T06 — Tetapkan cascade dan isolasi stylesheet

T03 menyediakan MUI `enableCssLayer` opt-in untuk SSR. T06 tetap menangani
layer/scope/reset yang lebih luas; jangan mengubah default compatibility mode
atau meregenerasi baseline untuk menutupi perubahan geometry.

- [x] Terapkan cascade layer yang nyata pada rules; deklarasi urutan saja tidak
      cukup. Dokumentasikan interaksi dengan Emotion dan consumer CSS.
- [x] Pisahkan global reset/body styles menjadi stylesheet opt-in.
- [x] Pertahankan kebutuhan internal seperti box-sizing melalui style scoped.
- [x] Hindari `!important` pada style bawaan yang menghalangi consumer override.

**Verify:** consumer fixture dengan CSS miliknya sendiri tidak berubah pada
body, heading, link, atau komponen di luar library. Uji urutan import yang
didukung, style injection MUI, dan consumer stylesheet tanpa `!important`.
Jika pemisahan reset mengubah kontrak lama, sediakan compatibility entry dan
catatan migrasi. Assertion style/layout default tetap lulus.

Status T06: **completed secara lokal** (2026-11-11). Isolated CSS memakai layer
fq-tokens/fq yang nyata dan tanpa reset app; reset.css opt-in tersedia. style.css
legacy dan alias compat.css mempertahankan compatibility. Scoped sizing dan
outer-boundary typography menjaga internal layout tanpa mengubah host. Consumer
React 18/19 menguji kedua urutan app/reset CSS, actual CSSOM layers, default
Button geometry, native host styles, font inheritance, dark explicit/system dan
SSR/hydration. Guard menolak global leaks/important; baseline default tidak
berubah. Mode SSR wajib konsisten; mixed-layer serialization tidak diklaim fixed.
Lihat current context untuk final receipts dan batas fixture. Berikutnya T07.

### T07 — Standarkan API override

- [x] Tentukan elemen root tiap komponen dan kontrak `className`, `style`, serta
      ref. Jangan memindahkan target ref/native props existing secara diam-diam.
- [x] Tambahkan `classNames`/`slotProps` untuk bagian seperti input wrapper,
      label, helper text, dialog paper, backdrop, dan content.
- [x] Bedakan slot styling dengan event/ARIA internal; callback consumer harus
      dikomposisikan tanpa menghilangkan behavior wajib.
- [x] Dokumentasikan override global → scope → component → instance. Jelaskan
      bahwa direct inline style lebih kuat daripada rule biasa, sedangkan inline
      custom property tetap tunduk pada aturan inheritance dan token resolution.

**Verify:** TypeScript consumer fixture menerima props yang didukung dan
menolak yang salah. Uji override padding, gap, radius, warna dan typography
pada tiap tingkat; sibling di luar scope tetap sama. Uji class/style merging,
ref, native attributes, callbacks, disabled, dan ARIA setelah slot override.

Status T07: **completed secara lokal** (2026-11-12). Root/native/ref targets
untuk 27 families didokumentasikan di CONTRIBUTING. Named decoration slots
tersedia pada 13 families; lainnya memakai native root/public compound APIs.
Slot API hanya class/style/data dan memfilter event/ARIA/state juga saat runtime.
543 tests, coverage/lint/format, sembilan guard groups, 264 browser checks tanpa
rebaseline, dan clean React 18/19 package consumers lulus. Browser checks mencakup
lima properti pada empat tingkat override serta sibling isolation dan customized
overlay focus/close. Final receipts dan batas sertifikasi ada di current context.
Berikutnya T08 untuk scope token di portal.

### T08 — Bawa theme scope ke portal

- [x] Sediakan container portal atau theme boundary yang mempertahankan token
      dan mode theme untuk Dialog, BottomSheet, Snackbar, serta overlay lain.
- [x] Hindari solusi global body tokens yang merusak dua brand dalam satu halaman.
- [x] Tetapkan dukungan nesting, disablePortal, SSR, dan cleanup saat unmount.

**Verify:** render brand A dan B berdampingan; buka overlay masing-masing dan
periksa computed color, spacing, radius, font, serta dark mode. Perubahan brand A
tidak memengaruhi B. Uji container default/custom dan ancestor overflow, sehingga
penanganan scope tidak menimbulkan clipping atau regresi z-index.

Status T08: **completed secara lokal** (2026-11-12). Resolved provider variables,
mode dan density diteruskan ke root overlay tanpa body theme writes atau wrapper
portal baru. Dialog/BottomSheet mempertahankan default body portal; Snackbar
mempertahankan inline default dengan portal opt-in. Container callback/node,
nesting, inline manager ownership, SSR dan cleanup didokumentasikan. 548 tests,
264 browser checks tanpa rebaseline, sembilan guard groups dan clean React 18/19
SSR/hydration consumers lulus. Source browser/paket cocok; current context memuat
receipts, kegagalan yang diselesaikan dan batas sertifikasi. Berikutnya T09.

### T09 — Migrasi komponen secara bertahap

- [x] Inventarisasi nilai hardcoded; pindahkan nilai yang memang dapat dikustom
      ke token. Pertahankan konstanta struktural yang tidak perlu menjadi API.
- [x] Migrasikan per keluarga: foundations → controls → navigation → feedback
      → overlays; setiap batch harus melewati gate sebelum batch berikutnya.
- [x] Dokumentasikan token, slot, state, density, dan contoh override per komponen.

**Verify:** seluruh matriks T01 tetap lulus untuk default theme. Jalankan juga
brand berbeda dan setiap density; tidak ada clipping, label bertumpuk, focus
ring hilang, atau target interaksi mengecil tanpa batas yang disepakati.
Periksa disabled/error/hover agar tidak kembali ke warna brand hardcoded.

Status T09: **completed secara lokal** (2026-11-12). Inventory mencakup 27
families: 25 styled groups dengan 349 token terpakai; Field/Form tetap unstyled
native/context containers. Default fallback, glyph/minimum dimensions, floating
label dan behavior tetap; safe padding/gap density serta offset terkait mengikuti
scale. Font scope lengkap sampai label/helper dan portal. Build guard memeriksa
consumption/typo token, active hex/RGB colors dan generated-token drift. Controls,
navigation dan feedback masing-masing melewati gate sebelum batch berikutnya;
final seluruh keluarga lulus 264 browser checks tanpa rebaseline, 556 unit tests,
10 guard groups dan clean React 18/19 SSR/hydration consumers. Definition versi 1
lama juga tetap diterima. Referensi per komponen ada di docs/component-tokens.md;
receipts dan batas verifikasi ada di current context. Berikutnya T10.

### T10 — Jadikan verifikasi sebagai gerbang rilis

Status: **in progress**. Full browser264/264 and desktop axe568/568 pass after
complete intentional paint-only baseline review. Negative probes are finishing;
hosted required enforcement remains pending. See D014 and current context.

- [ ] Tambahkan CI untuk static Storybook build, browser interactions,
      accessibility, DOM/style/layout regression, dan consumer tarball smoke test.
- [x] Pastikan browser tests benar-benar dieksekusi: `npm test` saat ini memakai
      konfigurasi jsdom tersendiri; keberadaan browser config bukan bukti run.
- [ ] Terapkan lint, formatting, types/build, unit coverage, dan regression checks
      sebagai syarat merge. Ubah a11y Storybook dari `todo` menjadi gate setelah
      temuan ditangani; exception harus spesifik dan memiliki alasan.
- [x] Tambahkan changeset dan migration guide untuk perubahan consumer-facing.

**Verify:** simulasi satu regresi computed style/layout, behavior, accessibility, dan package
export pada branch sementara; masing-masing harus membuat gate terkait gagal.
Coverage minimal tetap lines/functions 80%, branches 70%; laporkan juga delta
terhadap T01. Pertahankan seluruh skenario existing kecuali perubahan disengaja
yang didokumentasikan. Persentase coverage bukan pengganti tes browser.

## P2 — Theme Playground

### T11 — Bangun editor foundation dengan live preview

- [ ] Mulai di Storybook; kontrol palette/semantic colors, font, spacing, radius,
      shadow, density, light/dark, dan component overrides tingkat lanjut.
- [ ] Tampilkan preview seluruh keluarga komponen, termasuk interaction states
      serta overlay. Gunakan runtime theme yang sama dengan library consumer.
- [ ] Tambahkan reset, undo/redo, import/export JSON dan CSS, validasi nilai,
      serta indikator kontras. Batasi input ke schema yang didukung.

**Verify:** setiap kontrol mengubah computed style target tanpa memengaruhi
properti yang tidak terkait. Export → import mempertahankan nilai dan tampilan;
reset kembali persis ke T01. File invalid tidak menimpa draft valid. Preview
tidak boleh memakai styling khusus editor yang menutupi masalah library.

## P3 — Dashboard pengelolaan theme (opsional)

### T12 — Persistensi, akses, dan publikasi

- [ ] Konfirmasi kebutuhan multi-brand/multi-user sebelum membangun layanan.
- [ ] Jika diperlukan, tambahkan autentikasi, otorisasi per brand, draft,
      immutable version, audit log, publish, dan rollback.
- [ ] Consumer memilih versi theme yang dipublikasikan. Perubahan draft tidak
      otomatis mengubah aplikasi produksi; definisikan fallback ketika layanan
      theme gagal dan validasi kompatibilitas schema/library.

**Verify:** uji isolasi tenant, akses tanpa izin, concurrent edits, publish dan
rollback. Consumer tetap berjalan saat layanan gagal dan draft tidak bocor ke
versi published. Theme version yang sama menghasilkan tampilan yang sama.

## Checklist penerimaan setiap PR

- [ ] Task ID, scope, dan perubahan kontrak dijelaskan.
- [ ] Unit/integration tests dan checks terkait perubahan lulus.
- [ ] DOM, computed styles, dan layout dibandingkan dengan baseline; diff disengaja
      dijelaskan tanpa screenshot.
- [ ] Custom theme/override tidak merusak behavior atau aksesibilitas.
- [ ] Dokumentasi dan changeset diperbarui bila consumer terdampak.
- [ ] Tidak ada pembaruan baseline massal atau generated output tanpa alasan.

## Definition of Done rilis produksi

T01–T10 selesai dan CI hijau; clean consumer install serta public types valid;
default theme konsisten dengan baseline; custom tokens, overrides, dan portal
scope teruji; accessibility bugs prioritas tinggi selesai; serta perubahan
breaking memiliki versi dan migration guide. T11–T12 tidak memblokir kesiapan
library. Browser/OS yang diuji dan batas dukungan dicantumkan dalam dokumentasi.
