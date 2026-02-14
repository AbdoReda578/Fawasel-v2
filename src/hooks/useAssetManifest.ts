import { useEffect, useMemo, useState } from "react";
import type { AssetManifest, AssetPage } from "../types/content";

export function useAssetManifest() {
  const [manifest, setManifest] = useState<AssetManifest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/assets/manifest.json", { cache: "no-cache" });
        if (!response.ok) {
          throw new Error(`Unable to load asset manifest: ${response.status}`);
        }

        const data = (await response.json()) as AssetManifest;
        if (!cancelled) {
          setManifest(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const pagesById = useMemo(() => {
    if (!manifest) {
      return {} as Record<string, AssetPage>;
    }

    return Object.fromEntries(manifest.pages.map((page) => [page.pageId, page]));
  }, [manifest]);

  return {
    manifest,
    pagesById,
    loading: manifest === null && error === null,
    error,
  };
}
