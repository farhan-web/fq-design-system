# Setup Scraping + Auto-Generate untuk Claude Code 🕷️

Sebelum lanjut, ada 1 temuan penting dari hasil cek gue barusan:

> ⚠️ **tiket.design adalah SPA (Single Page Application)** yang render pakai JavaScript client-side. Tool fetch biasa (termasuk yang gue pakai) **ga bisa baca konten aslinya secara akurat** — cuma dapet skeleton HTML kosong. Makanya data yang gue tampilkan sebelumnya itu **hasil pengetahuan umum gue, bukan hasil scraping real** dari situsnya. Ini penting karena Claude Code lo nanti **wajib pakai browser automation (Playwright/Puppeteer)**, bukan `fetch`/`curl` biasa, supaya dapet data yang bener-bener akurat.

Jadi strategi yang gue kasih di bawah ini didesain supaya Claude Code bisa scraping dengan benar.

---

## 1. Setup Environment Scraping

Kasih tau Claude Code buat install dependency ini duluan:

```bash
npm install -D playwright
npx playwright install chromium
```

Kenapa Playwright, bukan `fetch`/`cheerio` biasa? Karena situsnya JS-rendered, jadi butuh **headless browser** yang bener-bener nge-render halaman dulu sebelum ambil DOM-nya.

---

## 2. Script Scraper Template (kasih ke Claude Code sebagai starting point)

```js
// scripts/scrape-tiket-design.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://tiket.design/system';
const OUTPUT_DIR = path.join(__dirname, '../scraped-data');

async function scrapePage(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });

  // Ambil semua teks, heading, struktur nav
  const data = await page.evaluate(() => {
    const getText = (sel) => Array.from(document.querySelectorAll(sel)).map(el => el.textContent.trim());

    return {
      title: document.title,
      headings: getText('h1, h2, h3'),
      navLinks: Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.textContent.trim(),
        href: a.href
      })),
      // ambil computed style dari elemen tertentu (misal untuk cek warna/token)
      bodyHTML: document.body.innerHTML,
    };
  });

  return data;
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  const pagesToScrape = [
    { name: 'home', url: `${BASE_URL}` },
    { name: 'components', url: `${BASE_URL}/components` },
    { name: 'foundations', url: `${BASE_URL}/foundations` },
    // Claude Code: tambahin detail page per komponen setelah nav links ke-discover
  ];

  for (const p of pagesToScrape) {
    console.log(`Scraping ${p.name}...`);
    const result = await scrapePage(page, p.url);
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${p.name}.json`),
      JSON.stringify(result, null, 2)
    );
  }

  await browser.close();
}

main();
```

**Cara kerja alur ini:**
1. Scrape halaman utama & `/components` & `/foundations` dulu → ambil semua `navLinks`
2. Dari `navLinks`, filter URL yang polanya `/system/components/*` → itu daftar komponen individual
3. Loop lagi scrape tiap URL komponen → ambil detail (nama, varian, deskripsi, screenshot)
4. Simpan semua ke `scraped-data/*.json` sebagai **sumber data mentah**

---

## 3. Tambahin Screenshot Capture (biar Claude Code "lihat" visualnya juga)

```js
// tambahan di dalam loop scraping per komponen
await page.screenshot({
  path: path.join(OUTPUT_DIR, 'screenshots', `${p.name}.png`),
  fullPage: true
});
```

Ini penting banget — karena Claude Code punya vision capability, dia bisa **lihat screenshot** dan bandingin hasil replikasi Storybook lo apakah udah mirip secara visual atau belum.

---

## 4. File Instruksi untuk Claude Code (`CLAUDE.md`)

Ini yang paling krusial — file ini jadi "otak" yang nentuin gimana Claude Code kerja dari data mentah jadi Storybook jadi:

```markdown
# Instruksi Project: Design System Replication (Local Only)

## Konteks
Project ini untuk keperluan LOCAL DEVELOPMENT & LEARNING saja.
Tujuan: replikasi struktur & fungsi Passport Design System (tiket.design)
ke dalam Storybook, sebagai basis sebelum nanti di-rebrand total
dengan aset milik company sendiri. TIDAK akan dipublish dalam kondisi 1:1.

## Alur Kerja
1. Jalankan `scripts/scrape-tiket-design.js` untuk ambil data mentah
   ke folder `scraped-data/*.json` dan `scraped-data/screenshots/*.png`
2. Baca `docs/design-system-ERD.md` sebagai acuan struktur entitas
3. Generate folder & file Storybook mengikuti hierarki:
   FOUNDATION_CATEGORY > DESIGN_TOKEN
   COMPONENT_CATEGORY > COMPONENT > COMPONENT_VARIANT > COMPONENT_STATE
   COMPONENT > DOCUMENTATION_PAGE
4. Untuk tiap komponen di scraped-data, buatkan:
   - `Component.tsx` (implementasi React)
   - `Component.stories.tsx` (semua variant & state)
   - `Component.mdx` (dokumentasi: Overview, Usage, Do's & Don'ts, A11y)
5. Bandingkan hasil render Storybook dengan screenshot di
   `scraped-data/screenshots/` untuk validasi kemiripan visual
6. SEMUA warna/token pakai variable placeholder dulu
   (jangan hardcode warna asli tiket.com), contoh:
   `--color-primary: var(--placeholder-primary, #CCCCCC);`

## Batasan
- JANGAN copy asset gambar/logo/icon asli dari tiket.design
- JANGAN copy teks marketing/copywriting asli, tulis ulang dengan bahasa sendiri
- Fokus ke STRUKTUR & FUNGSI komponen, bukan duplikasi identitas visual
```

---

## 5. Urutan Eksekusi yang Gue Saranin ke Lo

| Step | Aksi | Tools |
|---|---|---|
| 1 | Suruh Claude Code jalanin scraper Playwright | Node.js + Playwright |
| 2 | Review hasil `scraped-data/*.json` manual (cek datanya masuk akal) | Manual review |
| 3 | Suruh Claude Code generate skeleton Storybook dari ERD + scraped data | Claude Code |
| 4 | Compare visual: Storybook local vs screenshot hasil scrape | Manual/visual diff |
| 5 | Iterasi sampai struktur & fungsi "1:1" secara teknis | Claude Code loop |
| 6 | Baru masuk fase swap identitas ke brand company lo | Manual + Claude Code |

---

### Catatan Penting (gue ulang biar jelas)

Karena ini **cuma jalan di local, ga di-publish**, risiko legalnya jauh lebih kecil — ini normal banget dalam proses belajar/riset UI (banyak engineer belajar dengan cara "bedah" struktur situs orang). Yang penting:
- ✅ Jangan taro di repo publik/GitHub public dalam kondisi masih 1:1
- ✅ Jangan deploy ke domain publik sebelum full rebrand
- ✅ Aset asli (gambar, icon, logo) sebaiknya jangan ikut ke-download/tersimpan permanen di repo

Kalau lo mau, gue bisa lanjutin bikinin **isi lengkap `design-system-ERD.md`** yang udah gabung sama instruksi `CLAUDE.md` di atas jadi satu file siap pakai, tinggal taro di project lo. Mau?