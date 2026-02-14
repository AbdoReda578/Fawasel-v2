import fs from "node:fs";
import path from "node:path";
import { translate } from "@vitalets/google-translate-api";

const IN_FILE = path.resolve("src/content/raw/ocr-ar.json");
const OUT_FILE = path.resolve("src/content/raw/ocr-en.auto.json");

const FALLBACK_EN = {
  about: "Who We Are\nSince our launch, Fawasel Advanced Contracting Est. has focused on delivering professional contracting and fit-out solutions with strong quality and modern execution standards.",
  visionMission: "Vision\nWe align with Saudi Vision 2030 by delivering innovative and sustainable contracting solutions.\n\nMission\nDeliver projects with quality, precision, and long-term client value.",
  goalsValues: "Goals\nExcellence in delivery, expansion of specialized services, strong client trust, and practical innovation.\n\nValues\nQuality, integrity, innovation, commitment.",
  services: "Services\nCommercial fit-outs, electro-mechanical works, fabrication and supply, preventive maintenance, HVAC and electrical systems.",
  contact: "Contact Us\nMakkah - Al Sharaea District - P.O. Box 24432\n0592478182 - 0565362538 - 0561806831\nfawasil.manager@gmail.com",
};

async function translateSafe(text, key) {
  try {
    const result = await translate(text, { from: "ar", to: "en" });
    const translated = (result.text ?? "").trim();
    if (!translated) {
      throw new Error("empty translation");
    }

    return {
      mode: "translated",
      text: translated,
    };
  } catch (error) {
    return {
      mode: "fallback",
      text: FALLBACK_EN[key] ?? "",
      warning: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  if (!fs.existsSync(IN_FILE)) {
    throw new Error(`Missing OCR input: ${IN_FILE}. Run npm run content:ocr first.`);
  }

  const raw = JSON.parse(fs.readFileSync(IN_FILE, "utf8"));
  const sections = {};

  for (const [key, value] of Object.entries(raw.sections ?? {})) {
    const text = typeof value?.text === "string" ? value.text : "";
    const translated = await translateSafe(text, key);
    sections[key] = {
      key,
      sourceMode: value?.mode ?? "unknown",
      ...translated,
    };
  }

  const output = {
    generatedAt: new Date().toISOString(),
    source: "@vitalets/google-translate-api",
    language: "en",
    sections,
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2), "utf8");
  console.log(`Wrote translation output to ${OUT_FILE}`);
}

main();
