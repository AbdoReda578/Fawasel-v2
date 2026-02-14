import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { PAGE_MAP } from "./page-map.mjs";

const RAW_DIR = path.resolve("public/assets/raw");
const OUT_DIR = path.resolve("public/assets/optimized");
const OUT_MANIFEST = path.resolve("public/assets/manifest.json");
const TARGET_WIDTHS = [960, 1440, 1920];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function clearOptimized(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }

  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith(".jpg") || file.endsWith(".webp")) {
      fs.unlinkSync(path.join(dir, file));
    }
  }
}

async function optimizePage(entry) {
  const inputFile = path.join(RAW_DIR, `${entry.pageId}.jpg`);
  if (!fs.existsSync(inputFile)) {
    throw new Error(`Missing raw page: ${inputFile}`);
  }

  const image = sharp(inputFile);
  const metadata = await image.metadata();
  const originalWidth = metadata.width ?? 2480;
  const originalHeight = metadata.height ?? 3508;

  const effectiveWidths = TARGET_WIDTHS.filter((width) => width <= originalWidth);
  const variants = [];

  for (const width of effectiveWidths) {
    const jpgName = `${entry.pageId}-${width}.jpg`;
    const webpName = `${entry.pageId}-${width}.webp`;
    const jpgPath = path.join(OUT_DIR, jpgName);
    const webpPath = path.join(OUT_DIR, webpName);

    await sharp(inputFile).resize({ width, withoutEnlargement: true }).jpeg({ quality: 86, mozjpeg: true }).toFile(jpgPath);
    await sharp(inputFile).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(webpPath);

    variants.push(
      {
        width,
        format: "jpg",
        url: `/assets/optimized/${jpgName}`,
      },
      {
        width,
        format: "webp",
        url: `/assets/optimized/${webpName}`,
      },
    );
  }

  return {
    pageId: entry.pageId,
    sourceIndex: entry.sourceIndex,
    logicalOrder: entry.logicalOrder,
    role: entry.role,
    section: entry.section,
    semantic: entry.semantic,
    original: {
      width: originalWidth,
      height: originalHeight,
      url: `/assets/raw/${entry.pageId}.jpg`,
    },
    variants,
  };
}

async function main() {
  ensureDir(OUT_DIR);
  clearOptimized(OUT_DIR);

  const pages = [];
  for (const entry of PAGE_MAP) {
    const optimized = await optimizePage(entry);
    pages.push(optimized);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    widths: TARGET_WIDTHS,
    pages,
  };

  fs.writeFileSync(OUT_MANIFEST, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Wrote optimized assets and manifest to ${OUT_DIR}`);
}

main();
