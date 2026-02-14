import { motion, useReducedMotion } from "framer-motion";
import { SectionFrame } from "../components/SectionFrame";
import { HeroMedia } from "../components/HeroMedia";
import type { AssetPage, SiteContent } from "../types/content";

interface ServicesSectionProps {
  content: SiteContent["sections"]["services"];
  primaryPage?: AssetPage;
  secondaryPage?: AssetPage;
}

export function ServicesSection({ content, primaryPage, secondaryPage }: ServicesSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionFrame id="services" className="section-soft" innerClassName="services-layout">
      <div className="services-copy">
        <header className="section-heading">
          <h2>{content.title}</h2>
        </header>
        <p>{content.description}</p>
        <ul className="service-list">
          {content.categories.map((item, index) => (
            <motion.li
              key={item}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: index * 0.04 }}
            >
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="services-media-stack">
        <HeroMedia page={primaryPage} alt={content.title} />
        <HeroMedia page={secondaryPage} alt={content.title} />
      </div>
    </SectionFrame>
  );
}
