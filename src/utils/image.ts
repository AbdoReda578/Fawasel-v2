import type { AssetPage } from "../types/content";

export function buildImageSet(page?: AssetPage) {
  if (!page) {
    return {
      src: "",
      srcSetWebp: "",
      srcSetJpg: "",
    };
  }

  const webp = page.variants.filter((variant) => variant.format === "webp");
  const jpg = page.variants.filter((variant) => variant.format === "jpg");
  const fallback = jpg[jpg.length - 1]?.url ?? page.original.url;

  return {
    src: fallback,
    srcSetWebp: webp.map((variant) => `${variant.url} ${variant.width}w`).join(", "),
    srcSetJpg: jpg.map((variant) => `${variant.url} ${variant.width}w`).join(", "),
  };
}
