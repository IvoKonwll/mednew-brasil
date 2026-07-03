// Montagem automática da edição diária — SEMPRE em rascunho.
// Nunca publica: apenas cria/atualiza o boletim de hoje (status draft) e
// converte itens brutos coletados em atualizações-rascunho associadas.
// A publicação é um passo separado (portão de confirmação), ver publish.ts.

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { todayISO, formatLongDate } from "@/lib/date";
import { toSlug } from "@/lib/constants";

export interface AssembleSummary {
  ran: boolean;
  issueId: string | null;
  issueDate: string;
  createdUpdates: number;
  errors: string[];
}

export async function assembleDailyDraft(
  maxItems = 6,
): Promise<AssembleSummary> {
  const date = todayISO();
  const summary: AssembleSummary = {
    ran: false,
    issueId: null,
    issueDate: date,
    createdUpdates: 0,
    errors: [],
  };

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    summary.errors.push("SUPABASE_SERVICE_ROLE_KEY ausente");
    return summary;
  }
  const supabase = createSupabaseAdminClient();
  summary.ran = true;

  // 1) Garante o boletim de hoje (rascunho).
  const { data: existing } = await supabase
    .from("daily_issues")
    .select("*")
    .eq("issue_date", date)
    .maybeSingle();

  let issue = existing;
  if (!issue) {
    const { data: last } = await supabase
      .from("daily_issues")
      .select("issue_number")
      .order("issue_number", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();
    const nextNumber = ((last?.issue_number as number | null) ?? 0) + 1;
    const { data: created, error } = await supabase
      .from("daily_issues")
      .insert({
        issue_date: date,
        issue_number: nextNumber,
        title: `Boletim de ${formatLongDate(date)}`,
        status: "draft",
      })
      .select("*")
      .single();
    if (error) {
      summary.errors.push(`criar edição: ${error.message}`);
      return summary;
    }
    issue = created;
  }
  summary.issueId = issue.id;

  // 2) Pega itens brutos pendentes (mais recentes primeiro).
  const { data: raws } = await supabase
    .from("raw_updates")
    .select("*")
    .eq("status", "pending")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(maxItems);

  // Ordem inicial: continua após os updates já existentes na edição.
  const { count: existingCount } = await supabase
    .from("medical_updates")
    .select("id", { count: "exact", head: true })
    .eq("daily_issue_id", issue.id);
  let order = existingCount ?? 0;

  const highlights: string[] = [];

  for (const raw of raws ?? []) {
    const title = String(raw.title ?? "Sem título");
    const baseSlug = toSlug(title) || `item-${Date.now()}`;

    let newId: string | null = null;
    for (let attempt = 0; attempt < 3 && !newId; attempt++) {
      const slug =
        attempt === 0
          ? baseSlug
          : `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
      const { data, error } = await supabase
        .from("medical_updates")
        .insert({
          daily_issue_id: issue.id,
          title,
          slug,
          short_summary: raw.raw_summary ?? null,
          publication_date: raw.published_at
            ? String(raw.published_at).slice(0, 10)
            : date,
          status: "draft",
          display_order: order,
        })
        .select("id")
        .single();
      if (!error && data) newId = data.id;
      else if (error && error.code !== "23505") {
        summary.errors.push(`update: ${error.message}`);
        break;
      }
    }
    if (!newId) continue;

    if (raw.source_url) {
      await supabase.from("sources").insert({
        update_id: newId,
        source_name: String(raw.source_name ?? raw.source_type ?? "Fonte"),
        source_type: String(raw.source_type ?? "Artigo original"),
        url: String(raw.source_url),
        is_primary: true,
        accessed_at: date,
      });
    }
    await supabase.from("raw_updates").update({ status: "reviewed" }).eq("id", raw.id);

    highlights.push(title);
    order++;
    summary.createdUpdates++;
  }

  // 3) Preenche "O que realmente importa" se ainda estiver vazio.
  if (highlights.length > 0 && (!issue.what_matters || issue.what_matters.length === 0)) {
    await supabase
      .from("daily_issues")
      .update({ what_matters: highlights.slice(0, 5) })
      .eq("id", issue.id);
  }

  return summary;
}
