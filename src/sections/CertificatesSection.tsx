import { SectionFrame } from "../components/SectionFrame";
import { HeroMedia } from "../components/HeroMedia";
import { TextCard } from "../components/TextCard";
import type { AssetPage, SiteContent } from "../types/content";

interface CertificatesSectionProps {
  content: SiteContent["sections"]["certificates"];
  items: SiteContent["certificateItems"];
  pagesById: Record<string, AssetPage>;
}

export function CertificatesSection({ content, items, pagesById }: CertificatesSectionProps) {
  const firstPage = items.length ? pagesById[items[0].pageId] : undefined;

  return (
    <SectionFrame id="certificates" className="section-soft" innerClassName="split-layout">
      <TextCard title={content.title} subtitle={content.subtitle} body={content.description} />
      <HeroMedia page={firstPage} alt={content.title} />
    </SectionFrame>
  );
}
