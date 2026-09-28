/**
 * scripts/scrape-screenshots.mjs
 *
 * Scrapes tiket.design/system for visual reference only.
 * Saves screenshots + structured data (colors, spacing, typography, component inventory).
 * Does NOT save HTML/CSS source files.
 *
 * Usage:
 *   npx playwright install chromium   (one-time)
 *   node scripts/scrape-screenshots.mjs
 *
 * Output: design-reference/
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'design-reference');
const SCREENSHOTS_DIR = path.join(OUT, 'screenshots');

const BASE = 'https://tiket.design/system';

// ─── Page inventory (discovered by browsing the site) ───────────────────────

const COMPONENTS = [
  { name: 'accordion',        slug: 'accordion',                   description: 'Allows content to expand and collapse' },
  { name: 'badge',            slug: 'badges',                      description: 'Visual cue for alerts and notifications' },
  { name: 'button',           slug: 'button',                      description: 'Triggers for actions' },
  { name: 'bottom-sheet',     slug: 'bottomsheet',                 description: 'Supplementary content anchored to bottom' },
  { name: 'banner-gradient',  slug: 'bannergradient-smallsingle',  description: 'Banners with gradient colors' },
  { name: 'banner-notif',     slug: 'bannerinfo&notif-info',       description: 'Info/notification banners' },
  { name: 'checkbox',         slug: 'checkbox',                    description: 'Select zero, one, or more options' },
  { name: 'coachmark',        slug: 'coachmark',                   description: 'Temporary educational messages' },
  { name: 'countdown',        slug: 'countdown',                   description: 'Visual duration indicator' },
  { name: 'chips',            slug: 'chips',                       description: 'Selection, filter, or action triggers' },
  { name: 'label',            slug: 'label',                       description: 'Status indicator' },
  { name: 'navigation-bottom',slug: 'navigationbar-bottom',        description: 'Primary navigation destinations' },
  { name: 'tabs',             slug: 'tabs',                        description: 'Navigate between related content' },
  { name: 'textfield',        slug: 'textfield',                   description: 'User text input' },
  { name: 'tooltip',          slug: 'tooltip',                     description: 'Small contextual messages' },
];

const FOUNDATIONS = [
  { name: 'colors',      slug: 'color-solid',           description: 'Color palette' },
  { name: 'typography',  slug: 'typography-mobile',     description: 'Typography scale' },
  { name: 'spacing',     slug: 'spacing',               description: 'Spacing scale' },
  { name: 'elevation',   slug: 'elevation',             description: 'Shadow and elevation levels' },
];

// ─── Color extraction (run on the colors page) ───────────────────────────────

async function extractColors(page) {
  return page.evaluate(() => {
    const colors = {};
    document.querySelectorAll('*').forEach(el => {
      if (el.children.length > 4) return; // skip large containers
      const text = el.textContent?.trim() ?? '';
      const match = text.match(/^([A-Z]\d{1,3})\s*HEX\s*(#[0-9A-Fa-f]{6})\s*RGB/);
      if (match) colors[match[1]] = match[2];
    });
    // N0 is white, often not matched by the pattern above
    if (!colors['N0']) colors['N0'] = '#FFFFFF';
    return colors;
  });
}

// ─── Typography extraction ───────────────────────────────────────────────────

async function extractTypography(page) {
  return page.evaluate(() => {
    const lines = document.body.innerText.split('\n').map(l => l.trim()).filter(Boolean);
    const tokens = [];
    for (let i = 0; i < lines.length; i++) {
      // Look for patterns like "Heading 1\n32px\nBold / 700"
      if (/^(Heading|Body|Caption|Label)\s*\d*/i.test(lines[i])) {
        tokens.push({
          name: lines[i],
          size: lines[i + 1] ?? '',
          weight: lines[i + 2] ?? '',
        });
      }
    }
    return tokens;
  });
}

// ─── Spacing extraction ──────────────────────────────────────────────────────

async function extractSpacing(page) {
  return page.evaluate(() => {
    const lines = document.body.innerText.split('\n').map(l => l.trim()).filter(Boolean);
    const scale = [];
    // Layout scale table: Token | Name | px | Example
    for (let i = 0; i < lines.length; i++) {
      if (/^\d+$/.test(lines[i]) && i > 0 && /(Small|Medium|Large|X-Large)/i.test(lines[i - 1])) {
        scale.push({ name: lines[i - 1], px: parseInt(lines[i], 10) });
      }
    }
    return scale;
  });
}

// ─── Screenshot helper ───────────────────────────────────────────────────────

async function screenshot(page, url, filename) {
  console.log(`  → ${filename}`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  // Give SPA components extra time to render
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, filename),
    fullPage: true,
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Ensure output directories exist
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  // Suppress console noise from the target site
  page.on('console', () => {});
  page.on('pageerror', () => {});

  const inventory = {
    scrapedAt: new Date().toISOString(),
    source: BASE,
    components: [],
    foundations: [],
  };

  // ── Components ─────────────────────────────────────────────────────────────
  console.log('\n[1/4] Scraping component pages...');
  for (const comp of COMPONENTS) {
    const url = `${BASE}/component/${comp.slug}`;
    const filename = `component-${comp.name}.png`;
    try {
      await screenshot(page, url, filename);
      inventory.components.push({ ...comp, url, screenshot: filename });
    } catch (err) {
      console.warn(`  ✗ Failed: ${comp.name} — ${err.message}`);
      inventory.components.push({ ...comp, url, screenshot: null, error: err.message });
    }
  }

  // ── Foundations ────────────────────────────────────────────────────────────
  console.log('\n[2/4] Scraping foundation pages...');
  const extractedData = {};

  for (const found of FOUNDATIONS) {
    const url = `${BASE}/foundation/${found.slug}`;
    const filename = `foundation-${found.name}.png`;
    try {
      await screenshot(page, url, filename);

      // Extract structured data from each foundation page
      if (found.name === 'colors') {
        extractedData.colors = await extractColors(page);
        console.log(`  ✓ Extracted ${Object.keys(extractedData.colors).length} color tokens`);
      } else if (found.name === 'typography') {
        extractedData.typography = await extractTypography(page);
        console.log(`  ✓ Extracted ${extractedData.typography.length} typography tokens`);
      } else if (found.name === 'spacing') {
        extractedData.spacing = await extractSpacing(page);
        console.log(`  ✓ Extracted ${extractedData.spacing.length} spacing tokens`);
      }

      inventory.foundations.push({ ...found, url, screenshot: filename });
    } catch (err) {
      console.warn(`  ✗ Failed: ${found.name} — ${err.message}`);
      inventory.foundations.push({ ...found, url, screenshot: null, error: err.message });
    }
  }

  await browser.close();

  // ── Save data files ────────────────────────────────────────────────────────
  console.log('\n[3/4] Saving data files...');

  fs.writeFileSync(
    path.join(OUT, 'inventory.json'),
    JSON.stringify(inventory, null, 2),
  );
  console.log('  → inventory.json');

  if (extractedData.colors) {
    fs.writeFileSync(
      path.join(OUT, 'colors.json'),
      JSON.stringify(extractedData.colors, null, 2),
    );
    console.log('  → colors.json');
  }

  if (extractedData.typography?.length) {
    fs.writeFileSync(
      path.join(OUT, 'typography.json'),
      JSON.stringify(extractedData.typography, null, 2),
    );
    console.log('  → typography.json');
  }

  if (extractedData.spacing?.length) {
    fs.writeFileSync(
      path.join(OUT, 'spacing.json'),
      JSON.stringify(extractedData.spacing, null, 2),
    );
    console.log('  → spacing.json');
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n[4/4] Done!');
  console.log(`  Components : ${inventory.components.filter(c => c.screenshot).length}/${COMPONENTS.length} screenshots saved`);
  console.log(`  Foundations: ${inventory.foundations.filter(f => f.screenshot).length}/${FOUNDATIONS.length} screenshots saved`);
  console.log(`  Output dir : ${OUT}`);
  console.log('\nNext step: review design-reference/ then run the token update script.');
}

main().catch(err => {
  console.error('\nScraper failed:', err);
  process.exit(1);
});
