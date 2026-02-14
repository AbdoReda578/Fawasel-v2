export type PageRole = "cover" | "core_semantic" | "gallery" | "certificates" | "contact";

export interface PageAssetEntry {
  pageId: string;
  sourceIndex: number;
  fileName: string;
  role: PageRole;
  section: string;
  semantic: boolean;
  logicalOrder: number;
}

export const pageManifest: PageAssetEntry[] = [
  {
    pageId: 'page_18',
    sourceIndex: 18,
    role: 'cover',
    section: 'cover',
    semantic: false,
    logicalOrder: 1,
    fileName: 'page_18.jpg'
  },
  {
    pageId: 'page_17',
    sourceIndex: 17,
    role: 'core_semantic',
    section: 'about',
    semantic: true,
    logicalOrder: 2,
    fileName: 'page_17.jpg'
  },
  {
    pageId: 'page_16',
    sourceIndex: 16,
    role: 'core_semantic',
    section: 'visionMission',
    semantic: true,
    logicalOrder: 3,
    fileName: 'page_16.jpg'
  },
  {
    pageId: 'page_15',
    sourceIndex: 15,
    role: 'core_semantic',
    section: 'goalsValues',
    semantic: true,
    logicalOrder: 4,
    fileName: 'page_15.jpg'
  },
  {
    pageId: 'page_14',
    sourceIndex: 14,
    role: 'core_semantic',
    section: 'services',
    semantic: true,
    logicalOrder: 5,
    fileName: 'page_14.jpg'
  },
  {
    pageId: 'page_13',
    sourceIndex: 13,
    role: 'core_semantic',
    section: 'services',
    semantic: true,
    logicalOrder: 6,
    fileName: 'page_13.jpg'
  },
  {
    pageId: 'page_11',
    sourceIndex: 11,
    role: 'gallery',
    section: 'projectsGallery',
    semantic: false,
    logicalOrder: 7,
    fileName: 'page_11.jpg'
  },
  {
    pageId: 'page_12',
    sourceIndex: 12,
    role: 'gallery',
    section: 'projectsGallery',
    semantic: false,
    logicalOrder: 8,
    fileName: 'page_12.jpg'
  },
  {
    pageId: 'page_10',
    sourceIndex: 10,
    role: 'gallery',
    section: 'projectsGallery',
    semantic: false,
    logicalOrder: 9,
    fileName: 'page_10.jpg'
  },
  {
    pageId: 'page_09',
    sourceIndex: 9,
    role: 'gallery',
    section: 'projectsGallery',
    semantic: false,
    logicalOrder: 10,
    fileName: 'page_09.jpg'
  },
  {
    pageId: 'page_08',
    sourceIndex: 8,
    role: 'gallery',
    section: 'projectsGallery',
    semantic: false,
    logicalOrder: 11,
    fileName: 'page_08.jpg'
  },
  {
    pageId: 'page_06',
    sourceIndex: 6,
    role: 'gallery',
    section: 'projectsGallery',
    semantic: false,
    logicalOrder: 12,
    fileName: 'page_06.jpg'
  },
  {
    pageId: 'page_07',
    sourceIndex: 7,
    role: 'gallery',
    section: 'projectsGallery',
    semantic: false,
    logicalOrder: 13,
    fileName: 'page_07.jpg'
  },
  {
    pageId: 'page_05',
    sourceIndex: 5,
    role: 'gallery',
    section: 'projectsGallery',
    semantic: false,
    logicalOrder: 14,
    fileName: 'page_05.jpg'
  },
  {
    pageId: 'page_03',
    sourceIndex: 3,
    role: 'gallery',
    section: 'projectsGallery',
    semantic: false,
    logicalOrder: 15,
    fileName: 'page_03.jpg'
  },
  {
    pageId: 'page_04',
    sourceIndex: 4,
    role: 'gallery',
    section: 'clients',
    semantic: false,
    logicalOrder: 16,
    fileName: 'page_04.jpg'
  },
  {
    pageId: 'page_02',
    sourceIndex: 2,
    role: 'certificates',
    section: 'certificates',
    semantic: false,
    logicalOrder: 17,
    fileName: 'page_02.jpg'
  },
  {
    pageId: 'page_01',
    sourceIndex: 1,
    role: 'contact',
    section: 'contact',
    semantic: true,
    logicalOrder: 18,
    fileName: 'page_01.jpg'
  }
];

export const pageManifestById = Object.fromEntries(pageManifest.map((entry) => [entry.pageId, entry])) as Record<string, PageAssetEntry>;
