import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import siteAr from "./content/site.ar.json";
import siteEn from "./content/site.en.json";

const STORAGE_KEY = "fawasel-locale";

const initialLocale =
  typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY) === "en"
    ? "en"
    : "ar";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      ar: { translation: { site: siteAr } },
      en: { translation: { site: siteEn } },
    },
    lng: initialLocale,
    fallbackLng: "ar",
    interpolation: {
      escapeValue: false,
    },
  });
}

export { STORAGE_KEY };
export default i18n;
