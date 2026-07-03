// Tipos compartilhados pelas integrações de coleta automática de fontes.
// Cada integração transforma dados de uma fonte externa em RawUpdateInput,
// que futuramente será inserido na tabela `raw_updates` para revisão editorial.

export interface RawUpdateInput {
  title: string;
  source_name: string;
  source_url: string;
  source_type: string;
  published_at: string | null; // ISO
  raw_summary: string | null;
  raw_payload: Record<string, unknown>;
}

export interface FetchOptions {
  // Janela de busca — ex.: coletar itens desde esta data (ISO).
  since?: string;
  // Limite de itens.
  limit?: number;
  // Termos/áreas de interesse.
  query?: string;
}

export interface IntegrationResult {
  source: string;
  fetchedAt: string;
  items: RawUpdateInput[];
  // Placeholder: indica que a integração ainda não faz chamadas reais.
  placeholder: boolean;
}

export type IntegrationFetcher = (
  options?: FetchOptions,
) => Promise<IntegrationResult>;
