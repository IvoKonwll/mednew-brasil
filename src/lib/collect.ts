// Coleta compartilhada: roda as integrações e grava itens novos em raw_updates.
// Usada tanto pelo cron (/api/cron/fetch-updates) quanto pelo botão do painel.
//
// Usa o cliente admin (service role) — SOMENTE server-side. Deduplica por
// source_url para não inserir o mesmo item duas vezes.

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { integrations, type FetchOptions } from "@/lib/integrations";

export interface CollectionSummary {
  ran: boolean;
  perSource: { source: string; fetched: number; inserted: number; placeholder: boolean }[];
  totalInserted: number;
  totalFetched: number;
  errors: string[];
}

export async function collectRawUpdates(
  options?: FetchOptions,
): Promise<CollectionSummary> {
  const summary: CollectionSummary = {
    ran: true,
    perSource: [],
    totalInserted: 0,
    totalFetched: 0,
    errors: [],
  };

  // Sem service role não dá para gravar de forma confiável (cron sem sessão).
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { ...summary, ran: false, errors: ["SUPABASE_SERVICE_ROLE_KEY ausente"] };
  }

  const supabase = createSupabaseAdminClient();

  // URLs já existentes para deduplicar.
  const { data: existing } = await supabase
    .from("raw_updates")
    .select("source_url")
    .limit(2000);
  const seen = new Set(
    ((existing as { source_url: string | null }[]) ?? [])
      .map((r) => r.source_url)
      .filter(Boolean) as string[],
  );

  for (const [name, fetcher] of Object.entries(integrations)) {
    try {
      const result = await fetcher(options);
      summary.totalFetched += result.items.length;

      // Filtra itens novos (não vistos no banco nem no batch atual).
      const fresh = result.items.filter((item) => {
        if (!item.source_url || seen.has(item.source_url)) return false;
        seen.add(item.source_url);
        return true;
      });

      let inserted = 0;
      if (fresh.length > 0) {
        const rows = fresh.map((item) => ({
          title: item.title,
          source_name: item.source_name,
          source_url: item.source_url,
          source_type: item.source_type,
          published_at: item.published_at,
          raw_summary: item.raw_summary,
          raw_payload: item.raw_payload,
          status: "pending" as const,
        }));
        const { error, count } = await supabase
          .from("raw_updates")
          .insert(rows, { count: "exact" });
        if (error) {
          summary.errors.push(`${name}: ${error.message}`);
        } else {
          inserted = count ?? rows.length;
        }
      }

      summary.totalInserted += inserted;
      summary.perSource.push({
        source: result.source,
        fetched: result.items.length,
        inserted,
        placeholder: result.placeholder,
      });
    } catch (e) {
      summary.errors.push(
        `${name}: ${e instanceof Error ? e.message : "erro desconhecido"}`,
      );
    }
  }

  return summary;
}
