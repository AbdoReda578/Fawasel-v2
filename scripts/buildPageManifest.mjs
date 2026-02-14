import fs from "node:fs";
import path from "node:path";
import { PAGE_MAP } from "./page-map.mjs";

const MANIFEST_TS_PATH = path.resolve("src/content/pageManifest.ts");
const RAW_DIR = path.resolve("public/assets/raw");

const HEADER = `export type PageRole = "cover" | "core_semantic" | "gallery" | "certificates" | "contact";

export interface PageAssetEntry {
  pageId: string;
  sourceIndex: number;
  fileName: string;
  role: PageRole;
  section: string;
  semantic: boolean;
  logicalOrder: number;
}

`;

function validateRawPages() {
  if (!fs.existsSync(RAW_DIR)) {
    throw new Error(`Raw assets not found. Run assets:extract first. Missing: ${RAW_DIR}`);
  }

  const files = fs.readdirSync(RAW_DIR).filter((file) => /^page_\d{2}\.jpg$/.test(file));
  if (files.length !== 18) {
    throw new Error(`Expected 18 raw page images in ${RAW_DIR}, found ${files.length}`);
  }
}

function buildEntries() {
  return PAGE_MAP.map((entry) => ({
    ...entry,
    fileName: `${entry.pageId}.jpg`,
  }));
}

function toTs(entries) {
  const body = JSON.stringify(entries, null, 2)
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/"([^"]+)"/g, "'$1'");

  return `${HEADER}export const pageManifest: PageAssetEntry[] = ${body};\n\nexport const pageManifestById = Object.fromEntries(pageManifest.map((entry) => [entry.pageId, entry])) as Record<string, PageAssetEntry>;\n`;
}

function main() {
  validateRawPages();
  fs.mkdirSync(path.dirname(MANIFEST_TS_PATH), { recursive: true });
  const entries = buildEntries();
  const output = toTs(entries);
  fs.writeFileSync(MANIFEST_TS_PATH, output, "utf8");
  console.log(`Wrote ${MANIFEST_TS_PATH}`);
}

main();
