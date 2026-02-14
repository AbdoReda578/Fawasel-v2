import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const OCR_AR_FILE = path.resolve("src/content/raw/ocr-ar.json");
const OCR_EN_FILE = path.resolve("src/content/raw/ocr-en.auto.json");
const OUT_AR_FILE = path.resolve("src/content/site.ar.json");
const OUT_EN_FILE = path.resolve("src/content/site.en.json");

const localizedSectionSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().min(1),
  bullets: z.array(z.string()).optional(),
});

const quickActionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  href: z.string().min(1),
  icon: z.string().min(1),
});

const siteContentSchema = z.object({
  locale: z.enum(["ar", "en"]),
  direction: z.enum(["rtl", "ltr"]),
  meta: z.object({
    brandName: z.string().min(1),
    companyName: z.string().min(1),
    year: z.number().int(),
    primaryColor: z.string().min(1),
    accentColor: z.string().min(1),
  }),
  navigation: z.object({
    sections: z.array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
      }),
    ),
  }),
  sections: z.object({
    cover: z.object({
      kicker: z.string().min(1),
      title: z.string().min(1),
      subtitle: z.string().min(1),
      description: z.string().min(1),
      ctaPrimary: z.string().min(1),
      ctaSecondary: z.string().min(1),
    }),
    about: localizedSectionSchema,
    visionMission: z.object({
      title: z.string().min(1),
      visionTitle: z.string().min(1),
      visionText: z.string().min(1),
      missionTitle: z.string().min(1),
      missionText: z.string().min(1),
    }),
    goalsValues: z.object({
      title: z.string().min(1),
      goalsTitle: z.string().min(1),
      goals: z.array(z.string()).min(3),
      valuesTitle: z.string().min(1),
      values: z.array(z.string()).min(3),
    }),
    services: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      categories: z.array(z.string()).min(3),
    }),
    projectsGallery: localizedSectionSchema,
    clients: localizedSectionSchema,
    certificates: localizedSectionSchema,
    contact: z.object({
      title: z.string().min(1),
      address: z.string().min(1),
      phones: z.array(z.string()).min(1),
      email: z.string().email(),
      whatsapp: z.string().min(1),
      note: z.string().min(1),
    }),
  }),
  quickActions: z.array(quickActionSchema).min(3),
  projectGalleryGroups: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      pageIds: z.array(z.string()).min(1),
    }),
  ),
  certificateItems: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      pageId: z.string().min(1),
    }),
  ),
});

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function cleanText(text) {
  return String(text ?? "")
    .replace(/\u200f|\u200e|\u061c/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitParagraphs(text) {
  return cleanText(text)
    .split(/\n\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function qualityScore(text, locale) {
  const normalized = cleanText(text);
  if (!normalized) {
    return 0;
  }

  const letters = normalized.match(/[A-Za-z\u0600-\u06FF]/g)?.length ?? 0;
  const arabicLetters = normalized.match(/[\u0600-\u06FF]/g)?.length ?? 0;
  const latinLetters = normalized.match(/[A-Za-z]/g)?.length ?? 0;
  const symbols = normalized.match(/[^A-Za-z0-9\u0600-\u06FF\s\.\,\:\-\(\)]/g)?.length ?? 0;
  const lines = normalized.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const shortLines = lines.filter((line) => line.length <= 2).length;

  let score = 1;
  const symbolRatio = symbols / Math.max(normalized.length, 1);
  if (symbolRatio > 0.08) score -= 0.4;
  if (shortLines > 8) score -= 0.25;

  if (locale === "ar") {
    const arabicRatio = arabicLetters / Math.max(letters, 1);
    if (arabicRatio < 0.6) score -= 0.45;
  } else {
    const latinRatio = latinLetters / Math.max(letters, 1);
    if (latinRatio < 0.6) score -= 0.45;
  }

  if (normalized.includes("Â") || normalized.includes("~â€”")) {
    score -= 0.5;
  }

  return score;
}

function pickSectionText(raw, key, fallback, locale) {
  const value = raw?.sections?.[key]?.text;
  const text = cleanText(value);
  if (!text) {
    return fallback;
  }

  return qualityScore(text, locale) >= 0.45 ? text : fallback;
}

function parseVisionMission(text, fallbackVision, fallbackMission) {
  const clean = cleanText(text);
  const byDoubleLine = splitParagraphs(clean);
  if (byDoubleLine.length >= 2) {
    return {
      vision: byDoubleLine[0],
      mission: byDoubleLine[1],
    };
  }

  const missionIndex = clean.search(/رسالتنا|mission/i);
  if (missionIndex > 0) {
    return {
      vision: clean.slice(0, missionIndex).trim(),
      mission: clean.slice(missionIndex).trim(),
    };
  }

  return {
    vision: fallbackVision,
    mission: fallbackMission,
  };
}

function cleanGoalLines(text) {
  return splitParagraphs(text)
    .flatMap((paragraph) => paragraph.split(/\n+/))
    .map((line) => line.replace(/^[-\d\.\)]\s*/, "").trim())
    .filter((line) => line.length > 12);
}

function buildArabicContent(rawAr) {
  const fallbackAbout =
    "منذ انطلاقتها، تلتزم مؤسسة فواصل المتطورة للمقاولات العامة بتقديم حلول متخصصة في المقاولات والتشطيب، مع الاعتماد على الجودة والتخطيط الدقيق والتنفيذ الاحترافي.";
  const fallbackVision =
    "نطمح إلى مواكبة رؤية المملكة 2030 عبر تقديم حلول مبتكرة تدعم التطور العمراني المستدام.";
  const fallbackMission =
    "ننفذ المشاريع بأعلى معايير الدقة والجودة مع بناء علاقات طويلة الأمد تلبي تطلعات العملاء.";
  const fallbackGoals =
    "تحقيق أعلى مستويات الجودة في كل مشروع.\nالتوسع في الخدمات المتخصصة داخل المملكة.\nبناء شراكات طويلة الأمد مع العملاء.\nتعزيز الابتكار في التصميم والتنفيذ.\nتطوير الكفاءات الفنية والإدارية باستمرار.";
  const fallbackServices =
    "نقدم تشطيبات المعارض والمكاتب، الأعمال الكهروميكانيكية، التصنيع والتوريد، الصيانة الدورية، وأنظمة التكييف والتهوية والأعمال الكهربائية.";
  const fallbackContactNote =
    "جاهزون لاستقبال استفساراتكم وتقديم حلول تنفيذ مناسبة لنطاق مشروعكم.";

  const aboutText = fallbackAbout;
  const visionMissionText = pickSectionText(rawAr, "visionMission", `${fallbackVision}\n\n${fallbackMission}`, "ar");
  const goalsValuesText = fallbackGoals;
  const servicesText = fallbackServices;
  const contactNote = fallbackContactNote;
  const parsedVisionMission = parseVisionMission(visionMissionText, fallbackVision, fallbackMission);

  const goals = cleanGoalLines(goalsValuesText).slice(0, 5);

  const values = ["الجودة", "النزاهة", "الابتكار", "الالتزام"];

  return {
    locale: "ar",
    direction: "rtl",
    meta: {
      brandName: "فواصل",
      companyName: "مؤسسة فواصل المتطورة للمقاولات العامة",
      year: 2024,
      primaryColor: "#0D5A6F",
      accentColor: "#F57921",
    },
    navigation: {
      sections: [
        { id: "cover", label: "الرئيسية" },
        { id: "about", label: "من نحن" },
        { id: "visionMission", label: "الرؤية والرسالة" },
        { id: "goalsValues", label: "الأهداف والقيم" },
        { id: "services", label: "الخدمات" },
        { id: "projectsGallery", label: "المشاريع" },
        { id: "clients", label: "العملاء" },
        { id: "certificates", label: "الشهادات" },
        { id: "contact", label: "التواصل" },
      ],
    },
    sections: {
      cover: {
        kicker: "Fawasel Advanced Contracting Est.",
        title: "مؤسسة فواصل المتطورة",
        subtitle: "حلول تنفيذ احترافية في المقاولات والتشطيب",
        description: "تجربة رقمية مستوحاة من ملف الشركة تعرض الأعمال والخدمات بصورة تفاعلية حديثة.",
        ctaPrimary: "استعرض المشاريع",
        ctaSecondary: "تواصل معنا",
      },
      about: {
        title: "من نحن",
        subtitle: "خبرة تشغيلية بمعايير حديثة",
        description: aboutText,
      },
      visionMission: {
        title: "رؤيتنا ورسالتنا",
        visionTitle: "رؤيتنا",
        visionText: parsedVisionMission.vision,
        missionTitle: "رسالتنا",
        missionText: parsedVisionMission.mission,
      },
      goalsValues: {
        title: "أهدافنا وقيمنا",
        goalsTitle: "أهدافنا",
        goals: goals.length >= 3 ? goals : [
          "تحقيق أعلى مستويات الجودة في كل مشروع.",
          "التوسع في الخدمات المتخصصة داخل المملكة.",
          "بناء شراكات طويلة الأمد مع العملاء.",
          "تعزيز الابتكار في التصميم والتنفيذ.",
          "تطوير الكفاءات الفنية والإدارية باستمرار.",
        ],
        valuesTitle: "قيمنا",
        values,
      },
      services: {
        title: "خدماتنا",
        description: servicesText,
        categories: [
          "تشطيبات المعارض والمكاتب التجارية والإدارية",
          "الأعمال الكهروميكانيكية (تكييف، تهوية، كهرباء، حريق)",
          "التصنيع والتوريد والصيانة الدورية",
          "الأعمال المدنية والديكور الداخلي",
        ],
      },
      projectsGallery: {
        title: "مشروعاتنا المنفذة",
        subtitle: "معارض ومراكز تجارية ومشاريع تشغيلية",
        description: "نماذج مختارة من أعمال المؤسسة في مشاريع متنوعة داخل المملكة.",
      },
      clients: {
        title: "عملاؤنا",
        subtitle: "شراكات قائمة على الثقة",
        description: "تشرفنا بتنفيذ أعمال لعلامات تجارية وجهات رائدة مثل سنومي، SNB، أديداس، وفلورينا.",
      },
      certificates: {
        title: "الشهادات والاعتمادات",
        subtitle: "توثيق رسمي للكيان",
        description: "السجل والوثائق الرسمية التي تدعم موثوقية المؤسسة ونطاق أعمالها.",
      },
      contact: {
        title: "تواصل معنا",
        address: "مكة المكرمة - حي الشرائع - ص.ب: 24432",
        phones: ["0592478182", "0565362538", "0561806831"],
        email: "fawasil.manager@gmail.com",
        whatsapp: "0565362538",
        note: contactNote,
      },
    },
    quickActions: [
      { id: "call", label: "اتصال", href: "tel:0592478182", icon: "phone" },
      { id: "whatsapp", label: "واتساب", href: "https://wa.me/966565362538", icon: "whatsapp" },
      { id: "email", label: "بريد", href: "mailto:fawasil.manager@gmail.com", icon: "mail" },
    ],
    projectGalleryGroups: [
      { id: "showcase-1", title: "معارض وتجهيزات", pageIds: ["page_12", "page_10", "page_09"] },
      { id: "showcase-2", title: "تنفيذات ميدانية", pageIds: ["page_11", "page_08", "page_06", "page_07", "page_05", "page_03"] },
    ],
    certificateItems: [
      { id: "cert-main", title: "شهادات التسجيل والاعتماد", pageId: "page_02" },
    ],
  };
}

function buildEnglishContent(rawEn) {
  const fallbackAbout =
    "Fawasel Advanced Contracting Est. delivers practical contracting and fit-out solutions with quality-driven execution.";
  const fallbackVision =
    "We align with Saudi Vision 2030 by delivering innovative and sustainable contracting solutions.";
  const fallbackMission =
    "We execute projects with precision and quality while building long-term client partnerships.";
  const fallbackGoals =
    "Achieve consistent project excellence.\nExpand specialized contracting services.\nBuild long-term trusted client relationships.\nPromote innovation in design and execution.\nContinuously develop technical and managerial teams.";
  const fallbackServices =
    "We provide commercial fit-outs, electro-mechanical works, fabrication and supply, preventive maintenance, and HVAC/electrical systems.";
  const fallbackContactNote =
    "Reach out for project consultations, fit-out scope, and contracting support.";

  const aboutText = fallbackAbout;
  const visionMissionText = pickSectionText(rawEn, "visionMission", `${fallbackVision}\n\n${fallbackMission}`, "en");
  const goalsValuesText = fallbackGoals;
  const servicesText = fallbackServices;
  const contactNote = fallbackContactNote;
  const parsedVisionMission = parseVisionMission(visionMissionText, fallbackVision, fallbackMission);

  const goals = cleanGoalLines(goalsValuesText).slice(0, 5);

  return {
    locale: "en",
    direction: "ltr",
    meta: {
      brandName: "Fawasel",
      companyName: "Fawasel Advanced Contracting Est.",
      year: 2024,
      primaryColor: "#0D5A6F",
      accentColor: "#F57921",
    },
    navigation: {
      sections: [
        { id: "cover", label: "Home" },
        { id: "about", label: "About" },
        { id: "visionMission", label: "Vision & Mission" },
        { id: "goalsValues", label: "Goals & Values" },
        { id: "services", label: "Services" },
        { id: "projectsGallery", label: "Projects" },
        { id: "clients", label: "Clients" },
        { id: "certificates", label: "Certificates" },
        { id: "contact", label: "Contact" },
      ],
    },
    sections: {
      cover: {
        kicker: "Fawasel Advanced Contracting Est.",
        title: "Fawasel Advanced Contracting",
        subtitle: "Premium execution in contracting and fit-out",
        description: "A cinematic, bilingual company profile transformed from brochure to web storytelling.",
        ctaPrimary: "View Projects",
        ctaSecondary: "Contact Us",
      },
      about: {
        title: "Who We Are",
        subtitle: "Execution depth with modern standards",
        description: aboutText,
      },
      visionMission: {
        title: "Vision & Mission",
        visionTitle: "Vision",
        visionText: parsedVisionMission.vision,
        missionTitle: "Mission",
        missionText: parsedVisionMission.mission,
      },
      goalsValues: {
        title: "Goals & Values",
        goalsTitle: "Goals",
        goals: goals.length >= 3 ? goals : [
          "Achieve consistent project excellence.",
          "Expand specialized contracting services.",
          "Build long-term trusted client relationships.",
          "Promote innovation in design and execution.",
          "Continuously develop technical and managerial teams.",
        ],
        valuesTitle: "Values",
        values: ["Quality", "Integrity", "Innovation", "Commitment"],
      },
      services: {
        title: "Our Services",
        description: servicesText,
        categories: [
          "Commercial and administrative fit-out works",
          "Electro-mechanical systems (HVAC, ventilation, electrical, fire safety)",
          "Fabrication, supply, and preventive maintenance",
          "Civil works and interior finishes",
        ],
      },
      projectsGallery: {
        title: "Executed Projects",
        subtitle: "Retail, commercial, and technical execution",
        description: "Selected references highlighting delivered quality across diverse project types.",
      },
      clients: {
        title: "Our Clients",
        subtitle: "Partnerships built on trust",
        description: "We have served leading brands and entities including Cenomi, SNB, Adidas, and Florina.",
      },
      certificates: {
        title: "Certificates & Registrations",
        subtitle: "Official business documentation",
        description: "Registration and compliance documents supporting the company profile and scope.",
      },
      contact: {
        title: "Contact Us",
        address: "Makkah - Al Sharaea District - P.O. Box 24432",
        phones: ["0592478182", "0565362538", "0561806831"],
        email: "fawasil.manager@gmail.com",
        whatsapp: "0565362538",
        note: contactNote,
      },
    },
    quickActions: [
      { id: "call", label: "Call", href: "tel:0592478182", icon: "phone" },
      { id: "whatsapp", label: "WhatsApp", href: "https://wa.me/966565362538", icon: "whatsapp" },
      { id: "email", label: "Email", href: "mailto:fawasil.manager@gmail.com", icon: "mail" },
    ],
    projectGalleryGroups: [
      { id: "showcase-1", title: "Retail Fit-outs", pageIds: ["page_12", "page_10", "page_09"] },
      { id: "showcase-2", title: "Field Execution", pageIds: ["page_11", "page_08", "page_06", "page_07", "page_05", "page_03"] },
    ],
    certificateItems: [
      { id: "cert-main", title: "Business Registration & Certificates", pageId: "page_02" },
    ],
  };
}

function main() {
  const rawAr = readJson(OCR_AR_FILE);
  const rawEn = readJson(OCR_EN_FILE);

  const ar = buildArabicContent(rawAr);
  const en = buildEnglishContent(rawEn);

  siteContentSchema.parse(ar);
  siteContentSchema.parse(en);

  fs.mkdirSync(path.dirname(OUT_AR_FILE), { recursive: true });
  fs.writeFileSync(OUT_AR_FILE, JSON.stringify(ar, null, 2), "utf8");
  fs.writeFileSync(OUT_EN_FILE, JSON.stringify(en, null, 2), "utf8");

  console.log(`Wrote ${OUT_AR_FILE}`);
  console.log(`Wrote ${OUT_EN_FILE}`);
}

main();
