// Integração com PubMed — PLACEHOLDER.
//
// Fonte: https://pubmed.ncbi.nlm.nih.gov
// Objetivo futuro: E-utilities (esearch/efetch) para artigos e metanálises indexados no MEDLINE.
//
// Nesta versão do MVP a função é apenas um stub bem tipado. Ela retorna
// uma lista vazia e `placeholder: true`, mantendo a assinatura estável para
// quando a coleta real for implementada.

import type { FetchOptions, IntegrationFetcher, IntegrationResult } from "./types";

export const pubmedFetcher: IntegrationFetcher = async (
  _options?: FetchOptions,
): Promise<IntegrationResult> => {
  // TODO: implementar chamada real à API de PubMed.
  return {
    source: "PubMed",
    fetchedAt: new Date().toISOString(),
    items: [],
    placeholder: true,
  };
};
