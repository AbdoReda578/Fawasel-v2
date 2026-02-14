import { describe, expect, it } from "vitest";
import siteAr from "./site.ar.json";
import siteEn from "./site.en.json";

describe("site content", () => {
  it("includes required bilingual sections", () => {
    expect(siteAr.locale).toBe("ar");
    expect(siteAr.direction).toBe("rtl");
    expect(siteEn.locale).toBe("en");
    expect(siteEn.direction).toBe("ltr");

    expect(siteAr.sections.contact.email).toMatch(/@/);
    expect(siteEn.sections.contact.phones.length).toBeGreaterThanOrEqual(3);
  });

  it("exposes navigation with all core sections", () => {
    const ids = siteAr.navigation.sections.map((item) => item.id);
    expect(ids).toEqual([
      "cover",
      "about",
      "visionMission",
      "goalsValues",
      "services",
      "projectsGallery",
      "clients",
      "certificates",
      "contact",
    ]);
  });
});
