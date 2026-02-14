import { motion, useReducedMotion } from "framer-motion";
import { SectionFrame } from "../components/SectionFrame";
import { HeroMedia } from "../components/HeroMedia";
import type { AssetPage, SiteContent } from "../types/content";

interface GoalsValuesSectionProps {
  content: SiteContent["sections"]["goalsValues"];
  page?: AssetPage;
}

export function GoalsValuesSection({ content, page }: GoalsValuesSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionFrame id="goalsValues" className="section-soft" innerClassName="goals-layout">
      <header className="section-heading">
        <h2>{content.title}</h2>
      </header>
      <div className="list-columns">
        <div>
          <h3>{content.goalsTitle}</h3>
          <ul>
            {content.goals.map((goal, index) => (
              <motion.li
                key={goal}
                initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.65, delay: index * 0.05 }}
              >
                {goal}
              </motion.li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{content.valuesTitle}</h3>
          <ul>
            {content.values.map((value, index) => (
              <motion.li
                key={value}
                initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.65, delay: index * 0.05 + 0.1 }}
              >
                {value}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
      <HeroMedia page={page} alt={content.title} />
    </SectionFrame>
  );
}
