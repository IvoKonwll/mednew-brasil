// Registro central das integrações de coleta automática.
// Futuramente, /api/cron/fetch-updates itera sobre este registro,
// coleta itens e insere em `raw_updates` para revisão editorial humana.

import { pubmedFetcher } from "./pubmed";
import { fdaFetcher } from "./fda";
import { emaFetcher } from "./ema";
import { whoFetcher } from "./who";
import { anvisaFetcher } from "./anvisa";
import { clinicaltrialsFetcher } from "./clinicaltrials";
import type { IntegrationFetcher } from "./types";

export const integrations: Record<string, IntegrationFetcher> = {
  pubmed: pubmedFetcher,
  fda: fdaFetcher,
  ema: emaFetcher,
  who: whoFetcher,
  anvisa: anvisaFetcher,
  clinicaltrials: clinicaltrialsFetcher,
};

export * from "./types";
