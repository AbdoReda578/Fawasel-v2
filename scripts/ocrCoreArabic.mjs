import fs from "node:fs";
import path from "node:path";
import { createWorker } from "tesseract.js";
import { SEMANTIC_OCR_TARGETS } from "./page-map.mjs";

const RAW_DIR = path.resolve("public/assets/raw");
const OUT_FILE = path.resolve("src/content/raw/ocr-ar.json");

const FALLBACK_AR = {
  about: "من نحن\nمنذ انطلاقتها، حرصت مؤسسة فواصل المتطورة للمقاولات العامة على تقديم حلول احترافية في المقاولات والتشطيب، مع الالتزام بالجودة والدقة واعتماد التقنيات الحديثة.",
  visionMission: "رؤيتنا\nنطمح إلى مواكبة رؤية المملكة 2030 في تطوير قطاع المقاولات عبر حلول مبتكرة ومستدامة.\n\nرسالتنا\nتنفيذ الأعمال بأعلى معايير الجودة والالتزام، وبناء شراكات طويلة الأمد مع عملائنا.",
  goalsValues: "أهدافنا\nتحقيق التميز، التوسع في الخدمات المتخصصة، بناء الثقة مع العملاء، وتعزيز الابتكار.\n\nقيمنا\nالجودة، النزاهة، الابتكار، الالتزام.",
  services: "خدماتنا\nتشطيبات المعارض والمكاتب الإدارية، الأعمال الكهروميكانيكية، التصنيع والتوريد، الصيانة الدورية، وأنظمة التكييف والتهوية والأعمال الكهربائية.",
  contact: "تواصل معنا\nمكة المكرمة - حي الشرائع - ص.ب: 24432\n0592478182 - 0565362538 - 0561806831\nfawasil.manager@gmail.com",
};

function normalize(text) {
  return text
    .replace(/\u200f|\u200e|\u061c/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function ensureRawAssets() {
  if (!fs.existsSync(RAW_DIR)) {
    throw new Error(`Missing raw assets in ${RAW_DIR}. Run npm run assets:build first.`);
  }
}

async function main() {
  ensureRawAssets();

  const results = {};
  const worker = await createWorker("ara+eng", 1, {
    cachePath: path.resolve(".cache/tesseract"),
  });

  try {
    for (const target of SEMANTIC_OCR_TARGETS) {
      const pageResults = [];
      let mode = "ocr";

      for (const pageId of target.pages) {
        const imagePath = path.join(RAW_DIR, `${pageId}.jpg`);
        try {
          const ocr = await worker.recognize(imagePath);
          const text = normalize(ocr.data.text ?? "");
          if (text.length < 40) {
            throw new Error("OCR text too short");
          }

          pageResults.push({ pageId, text });
        } catch (error) {
          mode = "fallback";
          pageResults.push({
            pageId,
            text: FALLBACK_AR[target.key] ?? "",
            warning: `fallback_used:${error instanceof Error ? error.message : String(error)}`,
          });
        }
      }

      const combined = normalize(pageResults.map((page) => page.text).join("\n\n"));
      results[target.key] = {
        key: target.key,
        pages: target.pages,
        mode,
        text: combined,
        pageResults,
      };
    }
  } finally {
    await worker.terminate();
  }

  const output = {
    generatedAt: new Date().toISOString(),
    source: "tesseract.js",
    language: "ar",
    sections: results,
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2), "utf8");
  console.log(`Wrote OCR output to ${OUT_FILE}`);
}

main();
