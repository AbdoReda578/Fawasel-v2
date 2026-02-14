import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { LanguageToggle } from "./components/LanguageToggle";
import { QuickActions } from "./components/QuickActions";
import { ScrollProgress } from "./components/ScrollProgress";
import { useAssetManifest } from "./hooks/useAssetManifest";
import { useLocale } from "./hooks/useLocale";
import { pageManifest } from "./content/pageManifest";
import { CoverSection } from "./sections/CoverSection";
import { AboutSection } from "./sections/AboutSection";
import { VisionMissionSection } from "./sections/VisionMissionSection";
import { GoalsValuesSection } from "./sections/GoalsValuesSection";
import { ServicesSection } from "./sections/ServicesSection";
import { ProjectsGallerySection } from "./sections/ProjectsGallerySection";
import { ClientsSection } from "./sections/ClientsSection";
import { CertificatesSection } from "./sections/CertificatesSection";
import { ContactSection } from "./sections/ContactSection";

function SitePage() {
  const { locale, site, direction, toggleLocale } = useLocale();
  const { pagesById, loading, error } = useAssetManifest();
  const [activeSection, setActiveSection] = useState("cover");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".section-frame[id]"));
    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          .slice(0, 1)
          .forEach((entry) => {
            setActiveSection(entry.target.id);
          });
      },
      {
        threshold: [0.35, 0.6, 0.85],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const coverPage = pagesById.page_18;
  const aboutPage = pagesById.page_17;
  const visionMissionPage = pagesById.page_16;
  const goalsPage = pagesById.page_15;
  const servicesPrimary = pagesById.page_14;
  const servicesSecondary = pagesById.page_13;
  const clientsPage = pagesById.page_04;
  const contactPage = pagesById.page_01;

  return (
    <div className={`app-shell locale-${locale}`} dir={direction}>
      <div className="ambient-bg" aria-hidden="true" />

      <header className="top-bar">
        <a href="#cover" className="brand-block">
          <span className="brand-name">{site.meta.brandName}</span>
          <small>{site.meta.companyName}</small>
        </a>

        <nav className="top-nav" aria-label="Primary">
          {site.navigation.sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className={section.id === activeSection ? "active" : ""}>
              {section.label}
            </a>
          ))}
        </nav>

        <LanguageToggle locale={locale} onToggle={toggleLocale} />
      </header>

      <ScrollProgress items={site.navigation.sections} activeId={activeSection} />
      <QuickActions actions={site.quickActions} />

      <main>
        <CoverSection content={site.sections.cover} page={coverPage} />
        <AboutSection content={site.sections.about} page={aboutPage} />
        <VisionMissionSection content={site.sections.visionMission} page={visionMissionPage} />
        <GoalsValuesSection content={site.sections.goalsValues} page={goalsPage} />
        <ServicesSection content={site.sections.services} primaryPage={servicesPrimary} secondaryPage={servicesSecondary} />
        <ProjectsGallerySection content={site.sections.projectsGallery} groups={site.projectGalleryGroups} pagesById={pagesById} />
        <ClientsSection content={site.sections.clients} page={clientsPage} />
        <CertificatesSection content={site.sections.certificates} items={site.certificateItems} pagesById={pagesById} />
        <ContactSection content={site.sections.contact} page={contactPage} />
      </main>

      <footer className="site-footer">
        <p>
          {site.meta.companyName} • {site.meta.year}
        </p>
        <small>
          {loading ? "Preparing visual assets..." : `${pageManifest.length} page mappings active`}
          {error ? ` • ${error}` : ""}
        </small>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<SitePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
