import { SectionFrame } from "../components/SectionFrame";
import { HeroMedia } from "../components/HeroMedia";
import { TextCard } from "../components/TextCard";
import type { AssetPage, SiteContent } from "../types/content";

interface AboutSectionProps {
  content: SiteContent["sections"]["about"];
  page?: AssetPage;
}

export function AboutSection({ content, page }: AboutSectionProps) {
  return (
    <SectionFrame id="about" className="section-soft" innerClassName="split-layout">
      <TextCard title={content.title} subtitle={content.subtitle} body={content.description} />
      <HeroMedia page={page} alt={content.title} />
    </SectionFrame>
  );
}
