// Integração com FDA — PLACEHOLDER.
//
// Fonte: https://www.fda.gov
// Objetivo futuro: openFDA (drug approvals, labels, adverse events) e comunicados de segurança.
//
// Nesta versão do MVP a função é apenas um stub bem tipado. Ela retorna
// uma lista vazia e `placeholder: true`, mantendo a assinatura estável para
// quando a coleta real for implementada.

import type { FetchOptions, IntegrationFetcher, IntegrationResult } from "./types";

export const fdaFetcher: IntegrationFetcher = async (
  _options?: FetchOptions,
): Promise<IntegrationResult> => {
  // TODO: implementar chamada real à API de FDA.
  return {
    source: "FDA",
    fetchedAt: new Date().toISOString(),
    items: [],
    placeholder: true,
  };
};
