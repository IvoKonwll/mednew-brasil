// Publicação da edição diária — o "lançamento".
// Executado apenas por um passo explícito de confirmação (nunca pelo cron
// de coleta). Publica o boletim da data e todas as suas atualizações-rascunho.

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export interface PublishSummary {
  ran: boolean;
  issueDate: string;
  publishedIssue: boolean;
  publishedUpdates: number;
  errors: string[];
}

// Retorna o rascunho montado de uma data, para revisão antes de lançar.
export async function getDailyDraft(date: string) {
  const supabase = createSupabaseAdminClient();
  const { data: issue } = await supabase
    .from("daily_issues")
    .select("*")
    .eq("issue_date", date)
    .maybeSingle();
  if (!issue) return { issue: null, updates: [] as Array<Record<string, unknown>> };

  const { data: updates } = await supabase
    .from("medical_updates")
    .select("id, title, slug, area, impact_level, status, display_order")
    .eq("daily_issue_id", issue.id)
    .order("display_order", { ascending: true });

  return { issue, updates: (updates as Array<Record<string, unknown>>) ?? [] };
}

export async function publishDailyIssue(date: string): Promise<PublishSummary> {
  const summary: PublishSummary = {
    ran: false,
    issueDate: date,
    publishedIssue: false,
    publishedUpdates: 0,
    errors: [],
  };
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    summary.errors.push("SUPABASE_SERVICE_ROLE_KEY ausente");
    return summary;
  }
  const supabase = createSupabaseAdminClient();
  summary.ran = true;

  const { data: issue } = await supabase
    .from("daily_issues")
    .select("id")
    .eq("issue_date", date)
    .maybeSingle();
  if (!issue) {
    summary.errors.push("Sem edição para esta data.");
    return summary;
  }

  // Publica as atualizações-rascunho da edição.
  const { data: updated, error: uErr } = await supabase
    .from("medical_updates")
    .update({ status: "published", updated_at: new Date().toISOString() })
    .eq("daily_issue_id", issue.id)
    .neq("status", "published")
    .select("id");
  if (uErr) summary.errors.push(`updates: ${uErr.message}`);
  else summary.publishedUpdates = (updated as { id: string }[])?.length ?? 0;

  // Publica a edição.
  const { error: iErr } = await supabase
    .from("daily_issues")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", issue.id);
  if (iErr) summary.errors.push(`edição: ${iErr.message}`);
  else summary.publishedIssue = true;

  return summary;
}
