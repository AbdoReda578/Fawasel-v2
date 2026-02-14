import { SectionFrame } from "../components/SectionFrame";
import { HeroMedia } from "../components/HeroMedia";
import type { AssetPage, SiteContent } from "../types/content";

interface ContactSectionProps {
  content: SiteContent["sections"]["contact"];
  page?: AssetPage;
}

export function ContactSection({ content, page }: ContactSectionProps) {
  return (
    <SectionFrame id="contact" className="section-contact" innerClassName="contact-layout">
      <div className="contact-copy">
        <h2>{content.title}</h2>
        <p>{content.address}</p>
        <p>{content.note}</p>
        <ul>
          {content.phones.map((phone) => (
            <li key={phone}>
              <a href={`tel:${phone}`}>{phone}</a>
            </li>
          ))}
        </ul>
        <a href={`mailto:${content.email}`} className="contact-email">
          {content.email}
        </a>
      </div>
      <HeroMedia page={page} alt={content.title} className="contact-hero" />
    </SectionFrame>
  );
}
