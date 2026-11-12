# Engineering Steering

Status: active. Owner: repository maintainers. Updated: 2026-11-09.

## Purpose and authority

Steering ini menjadi acuan setiap perbaikan library: default tetap kompatibel,
consumer dapat mengustomisasi theme, dan hasil dibuktikan dengan verifikasi.
Instruksi pengguna terbaru mengarahkan scope pekerjaan. Jika bertentangan dengan
steering, ikuti instruksi tersebut dan catat penyesuaian aturan yang relevan.
Dokumen tidak boleh mengalahkan bukti implementasi: ketidaksesuaian adalah temuan
yang harus diperbaiki, bukan alasan mengklaim fitur sudah tersedia.

## Read order and sources of truth

1. `AGENTS.md`: pintu masuk dan konvensi repository.
2. Dokumen ini: invariants dan lifecycle pekerjaan.
3. [Current context](current-context.md): status, bukti, dan handoff terkini.
4. [Readiness plan](../production-readiness-plan.md): task ID, dependency,
   acceptance criteria, dan verification matrix.
5. [Decision log](decisions.md): keputusan arsitektur yang berlaku.
6. Source, konfigurasi, dan hasil command aktual: bukti kondisi implementasi.

Hindari menyalin backlog ke context atau mengulang aturan ke banyak dokumen.
Baca file implementasi yang terkait task, bukan seluruh sejarah setiap sesi.
Instruksi repo tidak menjamin setiap tool AI otomatis membacanya; integrasi AI
lain harus menunjuk ke `AGENTS.md` ini tanpa membuat salinan steering terpisah.

## Non-negotiable implementation contracts

- Pertahankan public API, target ref/native props, default tokens, typography,
  padding, spacing, radius, layout, dan behavior selama refactor. Bug fix yang
  sengaja mengubah hasil wajib dijelaskan dan mendapat regression test.
- Gunakan foundation → semantic → component tokens. Consumer tetap dapat
  override global, scope, component, dan instance. Jangan memasukkan nilai brand
  hardcoded baru atau `!important` yang menghalangi override.
- CSS variables dan MUI theme harus menuju satu sumber konfigurasi. Ini target
  arsitektur; jangan menganggap sinkronisasi tersebut sudah diimplementasikan.
- Theme scope harus mencakup portal dan mendukung dua brand dalam satu halaman.
  Jangan memperbaiki satu brand dengan mengubah body tokens secara global.
- Pertahankan semantics, keyboard interaction, focus, ARIA, controlled state,
  dan callback ketika menambah slot/customization API.
- Hindari perubahan global pada aplikasi consumer. Reset global harus memiliki
  kontrak opt-in/compatibility yang jelas ketika dimigrasikan.
- Pilih task sesuai priority/dependency; permintaan eksplisit pengguna dapat
  mengubah urutan. Catat alasan bila melewati prerequisite dan tangani gap-nya.

## Verification contract — no screenshots

Gunakan browser nyata untuk DOM/HTML semantik, accessible names/states,
`getComputedStyle()`, geometry, overflow, hit testing, dan interaction tests.
HTML saja tidak cukup; jsdom tidak membuktikan layout browser. Gunakan JSON
untuk baseline terpilih dan HTML untuk laporan expected/actual yang mudah dibaca.
Jangan membuat screenshot sebagai baseline, gate, atau bukti validasi.

Ikuti detail T01 pada readiness plan: determinisme font/waktu/viewport,
normalisasi ID tanpa mengabaikan relasi ARIA, slot/pseudo-elements penting,
toleransi layout per assertion, dan pemeriksaan light/dark serta scoped themes.
Jangan membekukan seluruh internal DOM yang boleh berubah tanpa mengubah kontrak.
Kelulusan ini tidak membuktikan kesamaan pixel atau rasterisasi font.

Bekukan kontrak terkait sebelum refactor. Jika runner belum tersedia, bangun
prerequisite yang diperlukan atau laporkan gap verifikasi secara eksplisit;
jangan menyebut planned check sebagai passed. Baseline tidak boleh diregenerasi
massal untuk menyembunyikan kegagalan. Perubahan expected harus disertai alasan,
nilai sebelum/sesudah, dan tes terhadap perilaku yang memang diinginkan.

## Context lifecycle

### Start / resume

- Baca urutan acuan di atas; periksa `git status` dan source/config terkait.
- Cocokkan active task, dependency, dan hasil lama dengan perubahan repository.
  Temuan review lama adalah historical sampai diverifikasi lagi.
- Jika context stale, perbaiki dahulu bagian yang relevan. Jangan mengulang semua
  test tanpa alasan; jalankan checks yang memberi bukti untuk perubahan saat ini.

### During implementation

- Batasi satu perubahan logis per batch; pisahkan formatting dari refactor.
- Tambahkan regression test untuk bug dan kontrak customization yang diubah.
- Jika keputusan memengaruhi public API, tokens, cascade, portal, packaging,
  atau strategi verifikasi, catat di decision log bersama task implementasinya.
- Update context ketika scope, blocker, keputusan, atau hasil penting berubah.
  Jangan mencatat setiap langkah tool atau memasukkan secrets/log besar.

### Verify / handoff

- Jalankan checks sesuai perubahan. Untuk perubahan dokumentasi saja, cukup
  cek format, link lokal, dan konsistensi instruksi.
- Catat command, hasil, tanggal, dan scope/commit yang diverifikasi. Sertakan
  kegagalan serta checks yang belum dijalankan; jangan mengubahnya menjadi pass.
- Update current context, checkbox task yang acceptance criteria-nya benar-benar
  selesai, dan decision status jika telah diimplementasikan/superseded.
- Catat next action konkret dan gap yang tersisa. Checklist parsial tidak berarti
  task atau production readiness selesai.

### Refresh / retire

Refresh pada setiap akhir task/PR, sebelum release, setelah perubahan dependency
atau arsitektur, dan saat melanjutkan sesi dengan source yang telah berubah.
Tanggal saja tidak membuktikan freshness; cocokkan source/config dan evidence.
Jangan mengubah tanggal review bila tidak melakukan review.

Current context adalah ringkasan yang diganti, bukan jurnal append-only. Hapus
blocker yang selesai, pertahankan historical evidence berlabel bila berguna,
dan pindahkan keputusan jangka panjang ke decision log. Tandai keputusan lama
`superseded` dengan penggantinya; jangan menghapus alasannya. Backlog selesai
tetap ditandai selesai, lalu revisi readiness plan untuk fase berikutnya bila
diperlukan. Lifecycle ini dijalankan saat pekerjaan dilakukan, bukan background
automation yang berjalan sendiri.

## Automated lifecycle guard

`current-context.md` tetap ringkasan manusia. `current-context.json` adalah handoff
machine-readable, dihasilkan dari source aktual dan hash context setelah review.
Jangan mengedit fingerprint secara manual atau menjalankan refresh untuk menutupi
context yang belum ditinjau.

Urutan akhir pekerjaan:

1. Update context prose (tanggal UTC, state, evidence, gaps/next action), task plan,
   dan decisions yang relevan. Catat failed/skipped checks secara eksplisit.
2. Jalankan checks yang relevan terhadap perubahan.
3. Rekam handoff setelah perubahan stabil:

   ```sh
   npm run steering:refresh -- --task=S01 --summary="Reviewed steering lifecycle changes and evidence" --next=T03
   npm run steering:check
   ```

4. Untuk memeriksa kewajiban pembaruan context terhadap base PR, gunakan SHA:

   ```sh
   npm run steering:check -- --base=<BASE_COMMIT_SHA> --report=verification/reports/steering-check.json
   ```

`steering:check` memvalidasi schema, task IDs, required headings, tanggal review,
relative Markdown file links, dan fingerprint source/policy/baseline/context.
Mode `--base` juga menuntut perubahan kedua file context jika source, konfigurasi,
policy, atau baseline berubah. Tanpa `--base`, kewajiban diff PR tidak diperiksa;
CLI menyebutkan batas ini. Guard tidak menguji anchors Markdown atau link eksternal.

Fingerprint source meliputi `src`, `public`, `scripts`, `.storybook`, `.github`,
manifest/lock/config build-test-format dan `.gitignore`. Policy meliputi panduan
canonical dan readiness/steering docs yang terdaftar pada provenance module.
Baseline hash terpisah mencakup expected JSON, metadata, dan inventory. Generated
reports, output build/coverage, serta kedua file current context tidak menjadi
input source hash; context prose memiliki hash sendiri agar tidak terjadi siklus.
Hash dihitung dari path relatif dan isi file, termasuk file source baru/deleted.

Commit dan dirty status dicatat sebagai provenance, bukan syarat equality:
commit yang menambahkan handoff dapat memiliki SHA baru walau byte source tetap
sama. Fingerprint yang dibandingkan. Ini identitas input repository, bukan
attestation seluruh OS, environment variables, atau dependency installation.

CI menjalankan guard tests dan base-aware check, lalu mengunggah ringkasan JSON
sebagai artifact. Workflow sudah dikonfigurasi; required status/branch protection
harus diaktifkan pada hosting repository agar merge benar-benar diblokir. Belum
ada klaim workflow hosted sudah dijalankan atau branch protection sudah aktif.

## Verification provenance

Browser npm commands menggunakan build wrapper: source di-hash sebelum/sesudah
Storybook build. Runner menolak output tanpa build stamp atau stamp yang stale.
`run-metadata.json` dan laporan HTML mencatat source/commit/dirty, environment,
mode, filter, waktu, jumlah checks, status, serta build identity. Source atau
baseline yang berubah di tengah run membuat hasil gagal dan mencegah baseline
update. Update yang disengaja mencatat reason dan source pada metadata baru.
Baseline historis sebelum fitur ini tidak diberi provenance retroaktif.

Setelah source/config berubah, jalankan ulang checks terkait sebelum handoff.
Perubahan policy saja memerlukan review policy/context baru, bukan otomatis
menjalankan semua browser tests. Guard tidak membuktikan ringkasan benar, reviewer
membaca source, atau semua checks yang diperlukan sudah dijalankan. Checklist PR
melengkapi guard, bukan menggantikan evidence. `npm run test:steering` menguji
kasus gagal agar enforcement tidak sekadar menghasilkan output hijau.
