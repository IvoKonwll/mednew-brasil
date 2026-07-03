// Integração com a FDA via RSS oficial (comunicados de imprensa / MedWatch).
// A automação NUNCA publica: itens vão para raw_updates como "pending".

import { fetchRssAsRawUpdates } from "./rss";
import type { FetchOptions, IntegrationFetcher, IntegrationResult } from "./types";

// Feed de comunicados da FDA. Pode ser sobrescrito por FDA_RSS_URL.
const FDA_RSS =
  process.env.FDA_RSS_URL ??
  "https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml";

export const fdaFetcher: IntegrationFetcher = async (
  options?: FetchOptions,
): Promise<IntegrationResult> => {
  const items = await fetchRssAsRawUpdates({
    url: FDA_RSS,
    sourceName: "FDA",
    sourceType: "FDA",
    limit: Math.min(options?.limit ?? 15, 40),
    sinceDays: options?.since ? undefined : 7,
  });
  return { source: "FDA", fetchedAt: new Date().toISOString(), items, placeholder: false };
};
