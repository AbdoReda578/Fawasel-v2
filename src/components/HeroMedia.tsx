import { motion, useReducedMotion } from "framer-motion";
import type { AssetPage } from "../types/content";
import { buildImageSet } from "../utils/image";

interface HeroMediaProps {
  page?: AssetPage;
  alt: string;
  className?: string;
}

export function HeroMedia({ page, alt, className }: HeroMediaProps) {
  const prefersReducedMotion = useReducedMotion();
  const imageSet = buildImageSet(page);

  if (!page) {
    return <div className="hero-media placeholder" />;
  }

  return (
    <motion.div
      className={`hero-media ${className ?? ""}`.trim()}
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <picture>
        {imageSet.srcSetWebp ? <source type="image/webp" srcSet={imageSet.srcSetWebp} sizes="(max-width: 900px) 100vw, 55vw" /> : null}
        {imageSet.srcSetJpg ? <source type="image/jpeg" srcSet={imageSet.srcSetJpg} sizes="(max-width: 900px) 100vw, 55vw" /> : null}
        <img src={imageSet.src} alt={alt} loading="lazy" />
      </picture>
    </motion.div>
  );
}
