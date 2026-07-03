// Integração com a Anvisa (Brasil) via RSS de notícias (portal gov.br/Plone).
// A automação NUNCA publica: itens vão para raw_updates como "pending".
//
// O caminho de RSS do gov.br pode variar; configure ANVISA_RSS_URL se preciso.
// Se o feed não estiver disponível, a integração degrada para lista vazia.

import { fetchRssAsRawUpdates } from "./rss";
import type { FetchOptions, IntegrationFetcher, IntegrationResult } from "./types";

const ANVISA_RSS =
  process.env.ANVISA_RSS_URL ??
  "https://www.gov.br/anvisa/pt-br/assuntos/noticias/RSS";

export const anvisaFetcher: IntegrationFetcher = async (
  options?: FetchOptions,
): Promise<IntegrationResult> => {
  const items = await fetchRssAsRawUpdates({
    url: ANVISA_RSS,
    sourceName: "Anvisa",
    sourceType: "Anvisa",
    limit: Math.min(options?.limit ?? 15, 40),
    sinceDays: options?.since ? undefined : 7,
  });
  return { source: "Anvisa", fetchedAt: new Date().toISOString(), items, placeholder: false };
};
