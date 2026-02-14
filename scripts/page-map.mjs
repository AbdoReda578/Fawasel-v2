export const PAGE_MAP = [
  { pageId: "page_18", sourceIndex: 18, role: "cover", section: "cover", semantic: false, logicalOrder: 1 },
  { pageId: "page_17", sourceIndex: 17, role: "core_semantic", section: "about", semantic: true, logicalOrder: 2 },
  { pageId: "page_16", sourceIndex: 16, role: "core_semantic", section: "visionMission", semantic: true, logicalOrder: 3 },
  { pageId: "page_15", sourceIndex: 15, role: "core_semantic", section: "goalsValues", semantic: true, logicalOrder: 4 },
  { pageId: "page_14", sourceIndex: 14, role: "core_semantic", section: "services", semantic: true, logicalOrder: 5 },
  { pageId: "page_13", sourceIndex: 13, role: "core_semantic", section: "services", semantic: true, logicalOrder: 6 },
  { pageId: "page_11", sourceIndex: 11, role: "gallery", section: "projectsGallery", semantic: false, logicalOrder: 7 },
  { pageId: "page_12", sourceIndex: 12, role: "gallery", section: "projectsGallery", semantic: false, logicalOrder: 8 },
  { pageId: "page_10", sourceIndex: 10, role: "gallery", section: "projectsGallery", semantic: false, logicalOrder: 9 },
  { pageId: "page_09", sourceIndex: 9, role: "gallery", section: "projectsGallery", semantic: false, logicalOrder: 10 },
  { pageId: "page_08", sourceIndex: 8, role: "gallery", section: "projectsGallery", semantic: false, logicalOrder: 11 },
  { pageId: "page_06", sourceIndex: 6, role: "gallery", section: "projectsGallery", semantic: false, logicalOrder: 12 },
  { pageId: "page_07", sourceIndex: 7, role: "gallery", section: "projectsGallery", semantic: false, logicalOrder: 13 },
  { pageId: "page_05", sourceIndex: 5, role: "gallery", section: "projectsGallery", semantic: false, logicalOrder: 14 },
  { pageId: "page_03", sourceIndex: 3, role: "gallery", section: "projectsGallery", semantic: false, logicalOrder: 15 },
  { pageId: "page_04", sourceIndex: 4, role: "gallery", section: "clients", semantic: false, logicalOrder: 16 },
  { pageId: "page_02", sourceIndex: 2, role: "certificates", section: "certificates", semantic: false, logicalOrder: 17 },
  { pageId: "page_01", sourceIndex: 1, role: "contact", section: "contact", semantic: true, logicalOrder: 18 },
];

export const SEMANTIC_OCR_TARGETS = [
  { key: "about", pages: ["page_17"] },
  { key: "visionMission", pages: ["page_16"] },
  { key: "goalsValues", pages: ["page_15"] },
  { key: "services", pages: ["page_14", "page_13"] },
  { key: "contact", pages: ["page_01"] },
];
