// Publicação da edição diária — o "lançamento".
// Executado apenas por um passo explícito de confirmação (nunca pelo cron
// de coleta). Publica o boletim da data e todas as suas atualizações-rascunho.

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Relatório de lançamento — o que é comunicado a cada item publicado.
export interface LaunchReportItem {
  title: string;
  slug: string;
  studyType: string; // tipo de estudo + força da evidência
  approval: string; // situação regulatória (FDA/EMA/Anvisa)
  changesPractice: string; // como muda a conduta
  mechanism: string; // como age no organismo (se medicamento)
}

export interface PublishSummary {
  ran: boolean;
  issueDate: string;
  publishedIssue: boolean;
  publishedUpdates: number;
  report: LaunchReportItem[];
  errors: string[];
}

// Monta o relatório de lançamento de uma data (itens publicados + relações).
export async function buildLaunchReport(
  date: string,
): Promise<LaunchReportItem[]> {
  const supabase = createSupabaseAdminClient();
  const { data: issue } = await supabase
    .from("daily_issues")
    .select("id")
    .eq("issue_date", date)
    .maybeSingle();
  if (!issue) return [];

  const { data } = await supabase
    .from("medical_updates")
    .select(
      `title, slug, evidence_type, evidence_strength, impact_level,
       mechanism_details(drug_class, mechanism, why_it_works),
       critical_appraisal(anvisa_status, brazil_available, changes_practice_now, practical_impact),
       sources(source_type)`,
    )
    .eq("daily_issue_id", issue.id)
    .order("display_order", { ascending: true });

  const one = <T,>(v: unknown): T | null =>
    Array.isArray(v) ? ((v[0] as T) ?? null) : ((v as T) ?? null);

  return ((data as Array<Record<string, unknown>>) ?? []).map((u) => {
    const mech = one<{ drug_class?: string; mechanism?: string; why_it_works?: string }>(
      u.mechanism_details,
    );
    const ca = one<{
      anvisa_status?: string;
      brazil_available?: boolean | null;
      changes_practice_now?: boolean | null;
      practical_impact?: string;
    }>(u.critical_appraisal);
    const sourceTypes = Array.isArray(u.sources)
      ? (u.sources as { source_type?: string }[]).map((s) => s.source_type)
      : [];

    // Aprovação: agências presentes nas fontes + situação Anvisa/Brasil.
    const agencies = ["FDA", "EMA", "Anvisa"].filter((a) => sourceTypes.includes(a));
    const approvalParts: string[] = [];
    if (u.evidence_type === "Aprovação regulatória")
      approvalParts.push("Aprovação regulatória");
    if (agencies.length) approvalParts.push(`Agências: ${agencies.join(", ")}`);
    if (ca?.anvisa_status) approvalParts.push(`Anvisa: ${ca.anvisa_status}`);
    if (ca?.brazil_available === true) approvalParts.push("Disponível no Brasil");
    if (ca?.brazil_available === false) approvalParts.push("Ainda não no Brasil");

    // Como muda a conduta.
    const changes =
      (u.impact_level ? String(u.impact_level) : "Impacto não classificado") +
      (ca?.practical_impact ? ` — ${ca.practical_impact}` : "") +
      (ca?.changes_practice_now === true ? " (muda conduta agora)" : "");

    // Mecanismo (só se houver — indica que é medicamento/intervenção).
    const mechParts: string[] = [];
    if (mech?.drug_class) mechParts.push(`Classe: ${mech.drug_class}`);
    if (mech?.mechanism) mechParts.push(mech.mechanism);
    if (mech?.why_it_works) mechParts.push(mech.why_it_works);

    return {
      title: String(u.title ?? ""),
      slug: String(u.slug ?? ""),
      studyType:
        (u.evidence_type ? String(u.evidence_type) : "Tipo de estudo não informado") +
        (u.evidence_strength ? ` · evidência ${u.evidence_strength}` : ""),
      approval: approvalParts.length ? approvalParts.join(" · ") : "Sem dado de aprovação",
      changesPractice: changes,
      mechanism: mechParts.length
        ? mechParts.join(" — ")
        : "Não se aplica / não é medicamento",
    };
  });
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
    report: [],
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

  // Relatório de lançamento (tipo de estudo, aprovação, conduta, mecanismo).
  summary.report = await buildLaunchReport(date);

  return summary;
}
