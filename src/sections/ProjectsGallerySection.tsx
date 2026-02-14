import { SectionFrame } from "../components/SectionFrame";
import { ImageGallery } from "../components/ImageGallery";
import type { AssetPage, SiteContent } from "../types/content";

interface ProjectsGallerySectionProps {
  content: SiteContent["sections"]["projectsGallery"];
  groups: SiteContent["projectGalleryGroups"];
  pagesById: Record<string, AssetPage>;
}

export function ProjectsGallerySection({ content, groups, pagesById }: ProjectsGallerySectionProps) {
  return (
    <SectionFrame id="projectsGallery" className="section-soft" innerClassName="projects-layout">
      <header className="section-heading">
        <h2>{content.title}</h2>
        {content.subtitle ? <p>{content.subtitle}</p> : null}
        <p>{content.description}</p>
      </header>

      {groups.map((group) => {
        const pages = group.pageIds.map((pageId) => pagesById[pageId]).filter(Boolean);
        return <ImageGallery key={group.id} title={group.title} pages={pages} />;
      })}
    </SectionFrame>
  );
}
