// Integração com Anvisa — PLACEHOLDER.
//
// Fonte: https://www.gov.br/anvisa
// Objetivo futuro: Registros, bulas e alertas regulatórios da Anvisa (Brasil).
//
// Nesta versão do MVP a função é apenas um stub bem tipado. Ela retorna
// uma lista vazia e `placeholder: true`, mantendo a assinatura estável para
// quando a coleta real for implementada.

import type { FetchOptions, IntegrationFetcher, IntegrationResult } from "./types";

export const anvisaFetcher: IntegrationFetcher = async (
  _options?: FetchOptions,
): Promise<IntegrationResult> => {
  // TODO: implementar chamada real à API de Anvisa.
  return {
    source: "Anvisa",
    fetchedAt: new Date().toISOString(),
    items: [],
    placeholder: true,
  };
};
