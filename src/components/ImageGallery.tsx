import { motion, useReducedMotion } from "framer-motion";
import type { AssetPage } from "../types/content";
import { buildImageSet } from "../utils/image";

interface ImageGalleryProps {
  pages: AssetPage[];
  title?: string;
}

export function ImageGallery({ pages, title }: ImageGalleryProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="image-gallery-wrapper">
      {title ? <h3 className="gallery-title">{title}</h3> : null}
      <div className="image-gallery-grid">
        {pages.map((page, index) => {
          const imageSet = buildImageSet(page);
          return (
            <motion.figure
              key={page.pageId}
              className="gallery-item"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: prefersReducedMotion ? 0 : index * 0.05 }}
            >
              <picture>
                {imageSet.srcSetWebp ? <source type="image/webp" srcSet={imageSet.srcSetWebp} sizes="(max-width: 700px) 100vw, 45vw" /> : null}
                {imageSet.srcSetJpg ? <source type="image/jpeg" srcSet={imageSet.srcSetJpg} sizes="(max-width: 700px) 100vw, 45vw" /> : null}
                <img src={imageSet.src} alt={`${title ?? "Gallery"} ${index + 1}`} loading="lazy" />
              </picture>
            </motion.figure>
          );
        })}
      </div>
    </div>
  );
}
