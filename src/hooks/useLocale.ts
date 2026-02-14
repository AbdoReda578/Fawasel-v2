import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Locale, SiteContent } from "../types/content";
import { STORAGE_KEY } from "../i18n";

export function useLocale() {
  const { i18n } = useTranslation();
  const locale: Locale = i18n.language.startsWith("en") ? "en" : "ar";
  const site = i18n.t("site", { returnObjects: true }) as SiteContent;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = site.direction;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale, site.direction]);

  const toggleLocale = () => {
    const next = locale === "ar" ? "en" : "ar";
    void i18n.changeLanguage(next);
  };

  return {
    locale,
    site,
    direction: site.direction,
    isArabic: locale === "ar",
    toggleLocale,
  };
}
