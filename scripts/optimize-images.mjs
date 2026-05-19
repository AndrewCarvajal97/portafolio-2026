/**
 * Optimize all raster images under public/ to sibling .webp and .avif files.
 *
 * - Preserves original aspect ratio and dimensions (no resize).
 * - Skips favicons, vector SVGs, and already-optimized images.
 * - Skips files when the optimized sibling is newer than the source.
 * - Reports size deltas at the end.
 *
 * Usage:
 *   node scripts/optimize-images.mjs           # convert only stale files
 *   node scripts/optimize-images.mjs --force   # re-convert everything
 */

import { readdir, stat, mkdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { join, relative, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

const FORCE = process.argv.includes('--force');

const RASTER_EXT = new Set(['.png', '.jpg', '.jpeg']);
const SKIP_NAMES = new Set(['favicon.ico', 'favicon.svg']);

/** Walk a directory recursively yielding file paths. */
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

const isNewer = (target, source) => {
  if (!existsSync(target)) return false;
  return statSync(target).mtimeMs >= statSync(source).mtimeMs;
};

const fmtBytes = (n) => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
};

const summary = {
  processed: 0,
  skipped: 0,
  sourceBytes: 0,
  webpBytes: 0,
  avifBytes: 0,
  rows: []
};

async function processOne(file) {
  const { dir, name, ext } = parse(file);
  const lowerExt = ext.toLowerCase();
  const base = `${dir}/${name}`;

  if (!RASTER_EXT.has(lowerExt)) return;
  if (SKIP_NAMES.has(`${name}${lowerExt}`)) return;

  const webpPath = `${base}.webp`;
  const avifPath = `${base}.avif`;

  const needsWebp = FORCE || !isNewer(webpPath, file);
  const needsAvif = FORCE || !isNewer(avifPath, file);

  if (!needsWebp && !needsAvif) {
    summary.skipped += 1;
    return;
  }

  const srcSize = (await stat(file)).size;
  summary.sourceBytes += srcSize;

  // Reuse a single sharp pipeline; we encode the same buffer twice.
  const pipeline = sharp(file, { failOn: 'none' }).rotate(); // strip orientation EXIF if any

  if (needsWebp) {
    await pipeline
      .clone()
      .webp({
        quality: 82,
        effort: 5,
        smartSubsample: true
      })
      .toFile(webpPath);
  }

  if (needsAvif) {
    await pipeline
      .clone()
      .avif({
        quality: 60,
        effort: 5,
        chromaSubsampling: '4:2:0'
      })
      .toFile(avifPath);
  }

  const webpSize = existsSync(webpPath) ? statSync(webpPath).size : 0;
  const avifSize = existsSync(avifPath) ? statSync(avifPath).size : 0;
  summary.webpBytes += webpSize;
  summary.avifBytes += avifSize;
  summary.processed += 1;

  summary.rows.push({
    file: relative(PUBLIC_DIR, file),
    src: srcSize,
    webp: webpSize,
    avif: avifSize
  });
}

(async () => {
  console.log(`Optimizing images under ${PUBLIC_DIR}`);
  if (FORCE) console.log('(--force) re-converting everything');

  for await (const file of walk(PUBLIC_DIR)) {
    try {
      await processOne(file);
    } catch (err) {
      console.warn(`! Failed on ${file}: ${err.message}`);
    }
  }

  console.log('\nResults');
  console.log('────────────────────────────────────────────────────────────────────');
  for (const row of summary.rows) {
    const webpPct = row.src ? Math.round((row.webp / row.src) * 100) : 0;
    const avifPct = row.src ? Math.round((row.avif / row.src) * 100) : 0;
    console.log(
      `${row.file.padEnd(48)} ` +
      `src ${fmtBytes(row.src).padStart(9)} → ` +
      `webp ${fmtBytes(row.webp).padStart(9)} (${webpPct}%)  ` +
      `avif ${fmtBytes(row.avif).padStart(9)} (${avifPct}%)`
    );
  }
  console.log('────────────────────────────────────────────────────────────────────');
  console.log(
    `Processed: ${summary.processed}, skipped: ${summary.skipped}\n` +
    `Total source : ${fmtBytes(summary.sourceBytes)}\n` +
    `Total .webp  : ${fmtBytes(summary.webpBytes)}  (saved ${fmtBytes(summary.sourceBytes - summary.webpBytes)})\n` +
    `Total .avif  : ${fmtBytes(summary.avifBytes)}  (saved ${fmtBytes(summary.sourceBytes - summary.avifBytes)})`
  );
})();
