// Integração com a EMA (European Medicines Agency) via RSS de notícias.
// A automação NUNCA publica: itens vão para raw_updates como "pending".

import { fetchRssAsRawUpdates } from "./rss";
import type { FetchOptions, IntegrationFetcher, IntegrationResult } from "./types";

// Feed de notícias da EMA. Pode ser sobrescrito por EMA_RSS_URL.
const EMA_RSS =
  process.env.EMA_RSS_URL ?? "https://www.ema.europa.eu/en/rss/news.xml";

export const emaFetcher: IntegrationFetcher = async (
  options?: FetchOptions,
): Promise<IntegrationResult> => {
  const items = await fetchRssAsRawUpdates({
    url: EMA_RSS,
    sourceName: "EMA",
    sourceType: "EMA",
    limit: Math.min(options?.limit ?? 15, 40),
    sinceDays: options?.since ? undefined : 7,
  });
  return { source: "EMA", fetchedAt: new Date().toISOString(), items, placeholder: false };
};
