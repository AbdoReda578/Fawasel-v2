import { SectionFrame } from "../components/SectionFrame";
import { HeroMedia } from "../components/HeroMedia";
import { TextCard } from "../components/TextCard";
import type { AssetPage, SiteContent } from "../types/content";

interface VisionMissionSectionProps {
  content: SiteContent["sections"]["visionMission"];
  page?: AssetPage;
}

export function VisionMissionSection({ content, page }: VisionMissionSectionProps) {
  return (
    <SectionFrame id="visionMission" className="section-soft" innerClassName="vision-layout">
      <header className="section-heading">
        <h2>{content.title}</h2>
      </header>
      <div className="vision-cards">
        <TextCard title={content.visionTitle} body={content.visionText} />
        <TextCard title={content.missionTitle} body={content.missionText} />
      </div>
      <HeroMedia page={page} alt={content.title} className="wide" />
    </SectionFrame>
  );
}
