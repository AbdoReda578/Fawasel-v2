import { describe, expect, it } from "vitest";
import { pageManifest } from "./pageManifest";

describe("page manifest", () => {
  it("maps exactly 18 pages", () => {
    expect(pageManifest).toHaveLength(18);
  });

  it("contains unique page ids", () => {
    const ids = pageManifest.map((entry) => entry.pageId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps cover first and contact last", () => {
    expect(pageManifest[0].section).toBe("cover");
    expect(pageManifest[pageManifest.length - 1].section).toBe("contact");
  });
});
