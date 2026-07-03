import type { MetadataRoute } from "next";
import {
  getAllPublishedIssueDates,
  getAllPublishedSlugs,
} from "@/lib/queries";
import { EVIDENCE_SLUG_MAP, MEDICAL_AREAS, toSlug } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticPaths = [
    "",
    "/hoje",
    "/ontem",
    "/arquivo",
    "/areas",
    "/muda-conduta",
    "/acompanhar",
    "/alertas",
    "/metodologia",
    "/sobre",
    "/newsletter",
  ];

  const [slugs, issueDates] = await Promise.all([
    getAllPublishedSlugs(),
    getAllPublishedIssueDates(),
  ]);

  const entries: MetadataRoute.Sitemap = [
    ...staticPaths.map((p) => ({
      url: `${base}${p}`,
      lastModified: new Date(),
    })),
    ...MEDICAL_AREAS.map((a) => ({
      url: `${base}/areas/${toSlug(a)}`,
    })),
    ...Object.keys(EVIDENCE_SLUG_MAP).map((t) => ({
      url: `${base}/evidencias/${t}`,
    })),
    ...issueDates.map((d) => ({
      url: `${base}/boletim/${d}`,
    })),
    ...slugs.map((s) => ({
      url: `${base}/updates/${s.slug}`,
      lastModified: new Date(s.updated_at),
    })),
  ];

  return entries;
}
