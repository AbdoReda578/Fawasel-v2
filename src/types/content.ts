export type Locale = "ar" | "en";
export type Direction = "rtl" | "ltr";

export interface LocalizedSection {
  title: string;
  subtitle?: string;
  description: string;
  bullets?: string[];
}

export interface QuickAction {
  id: string;
  label: string;
  href: string;
  icon: "phone" | "whatsapp" | "mail" | string;
}

export interface ContactInfo {
  title: string;
  address: string;
  phones: string[];
  email: string;
  whatsapp: string;
  note: string;
}

export interface VisionMission {
  title: string;
  visionTitle: string;
  visionText: string;
  missionTitle: string;
  missionText: string;
}

export interface GoalsValues {
  title: string;
  goalsTitle: string;
  goals: string[];
  valuesTitle: string;
  values: string[];
}

export interface Services {
  title: string;
  description: string;
  categories: string[];
}

export interface ProjectGalleryGroup {
  id: string;
  title: string;
  pageIds: string[];
}

export interface CertificateItem {
  id: string;
  title: string;
  pageId: string;
}

export interface SiteContent {
  locale: Locale;
  direction: Direction;
  meta: {
    brandName: string;
    companyName: string;
    year: number;
    primaryColor: string;
    accentColor: string;
  };
  navigation: {
    sections: Array<{ id: string; label: string }>;
  };
  sections: {
    cover: {
      kicker: string;
      title: string;
      subtitle: string;
      description: string;
      ctaPrimary: string;
      ctaSecondary: string;
    };
    about: LocalizedSection;
    visionMission: VisionMission;
    goalsValues: GoalsValues;
    services: Services;
    projectsGallery: LocalizedSection;
    clients: LocalizedSection;
    certificates: LocalizedSection;
    contact: ContactInfo;
  };
  quickActions: QuickAction[];
  projectGalleryGroups: ProjectGalleryGroup[];
  certificateItems: CertificateItem[];
}

export interface AssetVariant {
  width: number;
  format: "jpg" | "webp";
  url: string;
}

export interface AssetPage {
  pageId: string;
  sourceIndex: number;
  logicalOrder: number;
  role: "cover" | "core_semantic" | "gallery" | "certificates" | "contact";
  section: string;
  semantic: boolean;
  original: {
    width: number;
    height: number;
    url: string;
  };
  variants: AssetVariant[];
}

export interface AssetManifest {
  generatedAt: string;
  widths: number[];
  pages: AssetPage[];
}
