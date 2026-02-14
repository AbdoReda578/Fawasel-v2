interface LanguageToggleProps {
  locale: "ar" | "en";
  onToggle: () => void;
}

export function LanguageToggle({ locale, onToggle }: LanguageToggleProps) {
  return (
    <button
      type="button"
      className="language-toggle"
      onClick={onToggle}
      aria-label={locale === "ar" ? "Switch to English" : "التحويل إلى العربية"}
    >
      <span className={locale === "ar" ? "active" : ""}>AR</span>
      <span>/</span>
      <span className={locale === "en" ? "active" : ""}>EN</span>
    </button>
  );
}
