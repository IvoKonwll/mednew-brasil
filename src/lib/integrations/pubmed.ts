// Integração com PubMed (NCBI E-utilities). API pública, sem chave obrigatória.
//
// Fluxo: esearch (ids mais recentes por termo) -> esummary (metadados).
// Objetivo: trazer artigos/metanálises recentes para curadoria editorial.

import { fetchJson } from "./http";
import type {
  FetchOptions,
  IntegrationFetcher,
  IntegrationResult,
  RawUpdateInput,
} from "./types";

const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

// Termo padrão: ensaios/diretrizes/metanálises recentes (alto nível de evidência).
const DEFAULT_QUERY =
  "(randomized controlled trial[pt] OR guideline[pt] OR meta-analysis[pt])";

interface ESearchResponse {
  esearchresult?: { idlist?: string[] };
}
interface ESummaryResponse {
  result?: Record<string, unknown> & { uids?: string[] };
}

export const pubmedFetcher: IntegrationFetcher = async (
  options?: FetchOptions,
): Promise<IntegrationResult> => {
  const now = new Date().toISOString();
  const limit = Math.min(options?.limit ?? 10, 50);
  const term = options?.query ?? DEFAULT_QUERY;

  const searchUrl = `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&sort=most+recent&retmax=${limit}&term=${encodeURIComponent(
    term,
  )}`;
  const search = await fetchJson<ESearchResponse>(searchUrl);
  const ids = search?.esearchresult?.idlist ?? [];

  if (ids.length === 0) {
    return { source: "PubMed", fetchedAt: now, items: [], placeholder: false };
  }

  const summaryUrl = `${EUTILS}/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(",")}`;
  const summary = await fetchJson<ESummaryResponse>(summaryUrl);
  const result = summary?.result ?? {};

  const items: RawUpdateInput[] = ids
    .map((id): RawUpdateInput | null => {
      const rec = result[id] as
        | { title?: string; pubdate?: string; fulljournalname?: string; source?: string }
        | undefined;
      if (!rec?.title) return null;
      const journal = rec.fulljournalname ?? rec.source ?? "PubMed";
      return {
        title: rec.title,
        source_name: journal,
        source_url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        source_type: "Artigo original",
        published_at: rec.pubdate ? safeDate(rec.pubdate) : null,
        raw_summary: `${journal}${rec.pubdate ? ` · ${rec.pubdate}` : ""}`,
        raw_payload: { pmid: id, ...rec },
      };
    })
    .filter((x): x is RawUpdateInput => x !== null);

  return { source: "PubMed", fetchedAt: now, items, placeholder: false };
};

function safeDate(value: string): string | null {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
