// Integração com ClinicalTrials.gov — PLACEHOLDER.
//
// Fonte: https://clinicaltrials.gov
// Objetivo futuro: Registro e resultados de ensaios clínicos via API v2.
//
// Nesta versão do MVP a função é apenas um stub bem tipado. Ela retorna
// uma lista vazia e `placeholder: true`, mantendo a assinatura estável para
// quando a coleta real for implementada.

import type { FetchOptions, IntegrationFetcher, IntegrationResult } from "./types";

export const clinicaltrialsFetcher: IntegrationFetcher = async (
  _options?: FetchOptions,
): Promise<IntegrationResult> => {
  // TODO: implementar chamada real à API de ClinicalTrials.gov.
  return {
    source: "ClinicalTrials.gov",
    fetchedAt: new Date().toISOString(),
    items: [],
    placeholder: true,
  };
};
