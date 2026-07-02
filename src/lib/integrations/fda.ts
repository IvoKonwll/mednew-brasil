// Integração com FDA via openFDA. API pública, sem chave obrigatória.
//
// Usa o endpoint de recalls (enforcement) de medicamentos — ótimo para
// alertas de segurança recentes. Objetivo: sinalizar retiradas/recalls.

import { fetchJson } from "./http";
import type {
  FetchOptions,
  IntegrationFetcher,
  IntegrationResult,
  RawUpdateInput,
} from "./types";

const OPENFDA = "https://api.fda.gov/drug/enforcement.json";

interface OpenFdaResponse {
  results?: Array<{
    recall_number?: string;
    product_description?: string;
    reason_for_recall?: string;
    recalling_firm?: string;
    recall_initiation_date?: string; // YYYYMMDD
    classification?: string;
  }>;
}

// Converte "YYYYMMDD" -> ISO.
function fdaDate(raw?: string): string | null {
  if (!raw || raw.length !== 8) return null;
  const iso = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export const fdaFetcher: IntegrationFetcher = async (
  options?: FetchOptions,
): Promise<IntegrationResult> => {
  const now = new Date().toISOString();
  const limit = Math.min(options?.limit ?? 10, 50);

  const url = `${OPENFDA}?sort=recall_initiation_date:desc&limit=${limit}`;
  const data = await fetchJson<OpenFdaResponse>(url);
  const results = data?.results ?? [];

  const items: RawUpdateInput[] = results
    .filter((r) => r.product_description)
    .map((r) => {
      const firm = r.recalling_firm ?? "FDA";
      const title = `Recall: ${truncate(r.product_description!, 120)}`;
      return {
        title,
        source_name: `FDA · ${firm}`,
        source_url: r.recall_number
          ? `https://www.accessdata.fda.gov/scripts/ires/index.cfm?action=search.search_terms&term=${encodeURIComponent(
              r.recall_number,
            )}`
          : "https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts",
        source_type: "FDA",
        published_at: fdaDate(r.recall_initiation_date),
        raw_summary: r.reason_for_recall ?? r.classification ?? null,
        raw_payload: { ...r },
      } satisfies RawUpdateInput;
    });

  return { source: "FDA", fetchedAt: now, items, placeholder: false };
};

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}
