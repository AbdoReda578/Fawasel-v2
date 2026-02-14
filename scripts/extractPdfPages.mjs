import fs from "node:fs";
import path from "node:path";

const PDF_FILE = path.resolve("1 (1) (1).pdf");
const OUTPUT_DIR = path.resolve("public/assets/raw");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanOutput(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }

  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith(".jpg")) {
      fs.unlinkSync(path.join(dir, file));
    }
  }
}

function extractJpegs(buffer) {
  const extracted = [];
  let offset = 0;

  while (true) {
    const start = buffer.indexOf(Buffer.from([0xff, 0xd8, 0xff]), offset);
    if (start === -1) {
      break;
    }

    const end = buffer.indexOf(Buffer.from([0xff, 0xd9]), start + 3);
    if (end === -1) {
      break;
    }

    extracted.push(buffer.subarray(start, end + 2));
    offset = end + 2;
  }

  return extracted;
}

function main() {
  if (!fs.existsSync(PDF_FILE)) {
    throw new Error(`PDF not found: ${PDF_FILE}`);
  }

  ensureDir(OUTPUT_DIR);
  cleanOutput(OUTPUT_DIR);

  const buffer = fs.readFileSync(PDF_FILE);
  const jpegs = extractJpegs(buffer);

  if (jpegs.length !== 18) {
    throw new Error(`Expected 18 JPEG pages, found ${jpegs.length}`);
  }

  jpegs.forEach((jpg, index) => {
    const page = String(index + 1).padStart(2, "0");
    const filePath = path.join(OUTPUT_DIR, `page_${page}.jpg`);
    fs.writeFileSync(filePath, jpg);
  });

  console.log(`Extracted ${jpegs.length} pages to ${OUTPUT_DIR}`);
}

main();
