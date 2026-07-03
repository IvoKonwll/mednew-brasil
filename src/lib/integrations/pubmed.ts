// Integração com PubMed (NCBI E-utilities). API pública, sem chave obrigatória.
//
// Fluxo: para cada termo, esearch (ids recentes, últimos N dias) -> esummary.
// A automação NUNCA publica: os itens vão para raw_updates como "pending".

import { fetchJson } from "./http";
import type {
  FetchOptions,
  IntegrationFetcher,
  IntegrationResult,
  RawUpdateInput,
} from "./types";

const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

// Buscas iniciais (podem ser sobrescritas por options.query, separadas por "|").
export const PUBMED_QUERIES = [
  "phase 3 randomized trial medicine",
  "clinical guideline medicine",
  "drug approval",
  "NEJM randomized trial",
  "Lancet randomized trial",
  "JAMA clinical trial",
  "systematic review guideline",
];

interface ESearchResponse {
  esearchresult?: { idlist?: string[] };
}
interface ESummaryResponse {
  result?: Record<string, unknown> & { uids?: string[] };
}

function safeDate(value: string): string | null {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

async function searchIds(
  term: string,
  perTerm: number,
  sinceDays: number,
): Promise<string[]> {
  // reldate + datetype=pdat limita aos últimos N dias por data de publicação.
  const url =
    `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&sort=most+recent` +
    `&retmax=${perTerm}&datetype=pdat&reldate=${sinceDays}` +
    `&term=${encodeURIComponent(term)}`;
  const res = await fetchJson<ESearchResponse>(url);
  return res?.esearchresult?.idlist ?? [];
}

export const pubmedFetcher: IntegrationFetcher = async (
  options?: FetchOptions,
): Promise<IntegrationResult> => {
  const now = new Date().toISOString();
  const sinceDays = options?.since
    ? Math.max(1, daysSince(options.since))
    : 7; // preferencialmente últimos 7 dias
  const perTerm = Math.min(options?.limit ?? 8, 20);
  const terms = options?.query ? options.query.split("|") : PUBMED_QUERIES;

  // Coleta ids de todos os termos e deduplica.
  const idSet = new Set<string>();
  for (const term of terms) {
    const ids = await searchIds(term.trim(), perTerm, sinceDays);
    ids.forEach((id) => idSet.add(id));
  }
  const ids = Array.from(idSet).slice(0, 100);

  if (ids.length === 0) {
    return { source: "PubMed", fetchedAt: now, items: [], placeholder: false };
  }

  // esummary em lotes de 50.
  const items: RawUpdateInput[] = [];
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50);
    const url = `${EUTILS}/esummary.fcgi?db=pubmed&retmode=json&id=${batch.join(",")}`;
    const summary = await fetchJson<ESummaryResponse>(url);
    const result = summary?.result ?? {};
    for (const id of batch) {
      const rec = result[id] as
        | { title?: string; pubdate?: string; fulljournalname?: string; source?: string }
        | undefined;
      if (!rec?.title) continue;
      const journal = rec.fulljournalname ?? rec.source ?? "PubMed";
      items.push({
        title: rec.title,
        source_name: journal,
        source_url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        source_type: "Artigo original",
        published_at: rec.pubdate ? safeDate(rec.pubdate) : null,
        raw_summary: `${journal}${rec.pubdate ? ` · ${rec.pubdate}` : ""}`,
        raw_payload: { pmid: id, ...rec },
      });
    }
  }

  return { source: "PubMed", fetchedAt: now, items, placeholder: false };
};

function daysSince(iso: string): number {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 7;
  return Math.ceil((Date.now() - then) / (24 * 60 * 60 * 1000));
}
