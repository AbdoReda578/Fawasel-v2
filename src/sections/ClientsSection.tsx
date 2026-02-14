import { SectionFrame } from "../components/SectionFrame";
import { HeroMedia } from "../components/HeroMedia";
import { TextCard } from "../components/TextCard";
import type { AssetPage, SiteContent } from "../types/content";

interface ClientsSectionProps {
  content: SiteContent["sections"]["clients"];
  page?: AssetPage;
}

export function ClientsSection({ content, page }: ClientsSectionProps) {
  return (
    <SectionFrame id="clients" className="section-soft" innerClassName="split-layout">
      <TextCard title={content.title} subtitle={content.subtitle} body={content.description} />
      <HeroMedia page={page} alt={content.title} />
    </SectionFrame>
  );
}
