// Integração com a OMS/WHO via RSS de notícias/publicações.
// A automação NUNCA publica: itens vão para raw_updates como "pending".

import { fetchRssAsRawUpdates } from "./rss";
import type { FetchOptions, IntegrationFetcher, IntegrationResult } from "./types";

// Feed de notícias da WHO. Pode ser sobrescrito por WHO_RSS_URL.
const WHO_RSS =
  process.env.WHO_RSS_URL ?? "https://www.who.int/rss-feeds/news-english.xml";

export const whoFetcher: IntegrationFetcher = async (
  options?: FetchOptions,
): Promise<IntegrationResult> => {
  const items = await fetchRssAsRawUpdates({
    url: WHO_RSS,
    sourceName: "OMS (WHO)",
    sourceType: "OMS",
    limit: Math.min(options?.limit ?? 15, 40),
    sinceDays: options?.since ? undefined : 7,
  });
  return { source: "OMS", fetchedAt: new Date().toISOString(), items, placeholder: false };
};
