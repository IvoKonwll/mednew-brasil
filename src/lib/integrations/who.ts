// Integração com OMS — PLACEHOLDER.
//
// Fonte: https://www.who.int
// Objetivo futuro: Diretrizes, alertas e emergências em saúde da Organização Mundial da Saúde.
//
// Nesta versão do MVP a função é apenas um stub bem tipado. Ela retorna
// uma lista vazia e `placeholder: true`, mantendo a assinatura estável para
// quando a coleta real for implementada.

import type { FetchOptions, IntegrationFetcher, IntegrationResult } from "./types";

export const whoFetcher: IntegrationFetcher = async (
  _options?: FetchOptions,
): Promise<IntegrationResult> => {
  // TODO: implementar chamada real à API de OMS.
  return {
    source: "OMS",
    fetchedAt: new Date().toISOString(),
    items: [],
    placeholder: true,
  };
};
