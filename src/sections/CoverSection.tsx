import { motion, useReducedMotion } from "framer-motion";
import { SectionFrame } from "../components/SectionFrame";
import { HeroMedia } from "../components/HeroMedia";
import type { AssetPage, SiteContent } from "../types/content";

interface CoverSectionProps {
  content: SiteContent["sections"]["cover"];
  page?: AssetPage;
}

export function CoverSection({ content, page }: CoverSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionFrame id="cover" className="section-cover" innerClassName="cover-grid">
      <div className="cover-copy">
        <p className="kicker">{content.kicker}</p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          {content.title}
        </motion.h1>
        <h2>{content.subtitle}</h2>
        <p className="cover-description">{content.description}</p>
        <div className="cover-cta-row">
          <a href="#projectsGallery" className="btn-primary">
            {content.ctaPrimary}
          </a>
          <a href="#contact" className="btn-secondary">
            {content.ctaSecondary}
          </a>
        </div>
      </div>
      <HeroMedia page={page} alt={content.title} />
    </SectionFrame>
  );
}
