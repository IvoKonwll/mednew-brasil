// Integração com EMA — PLACEHOLDER.
//
// Fonte: https://www.ema.europa.eu
// Objetivo futuro: EPAR, aprovações e comunicados da European Medicines Agency.
//
// Nesta versão do MVP a função é apenas um stub bem tipado. Ela retorna
// uma lista vazia e `placeholder: true`, mantendo a assinatura estável para
// quando a coleta real for implementada.

import type { FetchOptions, IntegrationFetcher, IntegrationResult } from "./types";

export const emaFetcher: IntegrationFetcher = async (
  _options?: FetchOptions,
): Promise<IntegrationResult> => {
  // TODO: implementar chamada real à API de EMA.
  return {
    source: "EMA",
    fetchedAt: new Date().toISOString(),
    items: [],
    placeholder: true,
  };
};
