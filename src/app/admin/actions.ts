"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toSlug, type ContentStatus } from "@/lib/constants";
import { collectRawUpdates, type CollectionSummary } from "@/lib/collect";
import { assembleDailyDraft, type AssembleSummary } from "@/lib/assemble";
import { publishDailyIssue, type PublishSummary } from "@/lib/publish";
import { todayISO } from "@/lib/date";

// Garante que há um usuário autenticado antes de qualquer mutação.
async function requireAuth() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function str(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  if (v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function num(fd: FormData, key: string): number | null {
  const s = str(fd, key);
  if (s === null) return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

function bool(fd: FormData, key: string): boolean | null {
  const v = fd.get(key);
  if (v === null || v === "") return null;
  return v === "true" || v === "on" || v === "1";
}

// -----------------------------------------------------------------------------
// Boletins diários
// -----------------------------------------------------------------------------

export async function saveIssue(id: string | null, fd: FormData) {
  const supabase = await requireAuth();

  const whatMattersRaw = str(fd, "what_matters") ?? "";
  const what_matters = whatMattersRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const payload = {
    issue_date: str(fd, "issue_date"),
    issue_number: num(fd, "issue_number"),
    title: str(fd, "title"),
    intro: str(fd, "intro"),
    what_matters,
    status: (str(fd, "status") ?? "draft") as ContentStatus,
  };

  if (!payload.issue_date) {
    throw new Error("A data do boletim é obrigatória.");
  }

  const withPublish = {
    ...payload,
    published_at:
      payload.status === "published" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase
      .from("daily_issues")
      .update(withPublish)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("daily_issues").insert(withPublish);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/boletins");
  revalidatePath("/");
  redirect("/admin/boletins");
}

export async function setIssueStatus(id: string, status: ContentStatus) {
  const supabase = await requireAuth();
  const { error } = await supabase
    .from("daily_issues")
    .update({
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/boletins");
  revalidatePath("/");
}

export async function deleteIssue(id: string) {
  const supabase = await requireAuth();
  const { error } = await supabase.from("daily_issues").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/boletins");
}

// -----------------------------------------------------------------------------
// Atualizações médicas (com relações)
// -----------------------------------------------------------------------------

// Núcleo de persistência (compartilhado por saveUpdate e autosaveUpdate).
async function persistUpdate(
  id: string | null,
  fd: FormData,
): Promise<{ id: string; slug: string }> {
  const supabase = await requireAuth();

  const title = str(fd, "title");
  if (!title) throw new Error("O título é obrigatório.");

  let slug = str(fd, "slug");
  if (!slug) slug = toSlug(title);

  const updateRow = {
    daily_issue_id: str(fd, "daily_issue_id"),
    title,
    slug,
    short_summary: str(fd, "short_summary"),
    what_matters: str(fd, "what_matters"),
    clinical_context: str(fd, "clinical_context"),
    area: str(fd, "area"),
    evidence_type: str(fd, "evidence_type"),
    evidence_strength: str(fd, "evidence_strength"),
    impact_level: str(fd, "impact_level"),
    publication_date: str(fd, "publication_date"),
    reading_time_minutes: num(fd, "reading_time_minutes"),
    status: (str(fd, "status") ?? "draft") as ContentStatus,
    updated_at: new Date().toISOString(),
  };

  let updateId = id;

  if (id) {
    const { error } = await supabase
      .from("medical_updates")
      .update(updateRow)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("medical_updates")
      .insert(updateRow)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    updateId = data.id;
  }

  if (!updateId) throw new Error("Falha ao obter o id da atualização.");

  // Detalhes do estudo (upsert por update_id).
  const study = {
    update_id: updateId,
    study_phase: str(fd, "study_phase"),
    study_design: str(fd, "study_design"),
    randomization: str(fd, "randomization"),
    blinding: str(fd, "blinding"),
    multicenter: bool(fd, "multicenter"),
    sample_size: num(fd, "sample_size"),
    population: str(fd, "population"),
    inclusion_criteria: str(fd, "inclusion_criteria"),
    follow_up: str(fd, "follow_up"),
    intervention: str(fd, "intervention"),
    control_group: str(fd, "control_group"),
    primary_outcome: str(fd, "primary_outcome"),
    secondary_outcomes: str(fd, "secondary_outcomes"),
    main_results: str(fd, "main_results"),
    effect_size: str(fd, "effect_size"),
    absolute_risk_reduction: str(fd, "absolute_risk_reduction"),
    nnt: str(fd, "nnt"),
    hazard_ratio: str(fd, "hazard_ratio"),
    relative_risk: str(fd, "relative_risk"),
    odds_ratio: str(fd, "odds_ratio"),
    p_value: str(fd, "p_value"),
    confidence_interval: str(fd, "confidence_interval"),
  };
  await supabase
    .from("study_details")
    .upsert(study, { onConflict: "update_id" });

  const mechanism = {
    update_id: updateId,
    drug_class: str(fd, "drug_class"),
    mechanism_target: str(fd, "mechanism_target"),
    mechanism: str(fd, "mechanism"),
    disease_pathophysiology: str(fd, "disease_pathophysiology"),
    why_it_works: str(fd, "why_it_works"),
    mechanism_based_adverse_effects: str(fd, "mechanism_based_adverse_effects"),
  };
  await supabase
    .from("mechanism_details")
    .upsert(mechanism, { onConflict: "update_id" });

  const appraisal = {
    update_id: updateId,
    limitations: str(fd, "limitations"),
    conflicts_of_interest: str(fd, "conflicts_of_interest"),
    funding: str(fd, "funding"),
    critical_interpretation: str(fd, "critical_interpretation"),
    practical_impact: str(fd, "practical_impact"),
    brazil_context: str(fd, "brazil_context"),
    anvisa_status: str(fd, "anvisa_status"),
    conitec_status: str(fd, "conitec_status"),
    sus_status: str(fd, "sus_status"),
    brazil_available: bool(fd, "brazil_available"),
    changes_practice_now: bool(fd, "changes_practice_now"),
  };
  await supabase
    .from("critical_appraisal")
    .upsert(appraisal, { onConflict: "update_id" });

  // Fontes: recebidas como JSON no campo "sources_json".
  const sourcesJson = str(fd, "sources_json");
  if (sourcesJson) {
    try {
      const parsed = JSON.parse(sourcesJson) as Array<Record<string, unknown>>;
      // Reescreve todas as fontes deste update.
      await supabase.from("sources").delete().eq("update_id", updateId);
      const rows = parsed
        .filter((s) => s.source_name && s.url)
        .map((s) => ({
          update_id: updateId,
          source_name: String(s.source_name),
          source_type: String(s.source_type ?? "Artigo original"),
          url: String(s.url),
          is_primary: Boolean(s.is_primary),
          accessed_at: s.accessed_at ? String(s.accessed_at) : null,
          notes: s.notes ? String(s.notes) : null,
        }));
      if (rows.length > 0) {
        await supabase.from("sources").insert(rows);
      }
    } catch {
      // JSON malformado — ignora as fontes para não travar o salvamento.
    }
  }

  return { id: updateId, slug };
}

// Salva e volta para a listagem.
export async function saveUpdate(id: string | null, fd: FormData) {
  const { slug } = await persistUpdate(id, fd);
  revalidatePath("/admin/updates");
  revalidatePath(`/updates/${slug}`);
  revalidatePath("/");
  redirect("/admin/updates");
}

// Autosave: salva sem redirecionar; devolve o id/slug para o cliente.
export async function autosaveUpdate(
  id: string | null,
  fd: FormData,
): Promise<{ id: string; slug: string }> {
  const result = await persistUpdate(id, fd);
  revalidatePath(`/updates/${result.slug}`);
  revalidatePath(`/admin/preview/${result.id}`);
  return result;
}

export async function setUpdateStatus(id: string, status: ContentStatus) {
  const supabase = await requireAuth();
  const { error } = await supabase
    .from("medical_updates")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/updates");
  revalidatePath("/");
}

export async function deleteUpdate(id: string) {
  const supabase = await requireAuth();
  const { error } = await supabase
    .from("medical_updates")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/updates");
}

// Associa e ordena atualizações dentro de um boletim.
// `orderedIds` define quais updates pertencem à edição e em que ordem.
export async function setIssueUpdates(issueId: string, orderedIds: string[]) {
  const supabase = await requireAuth();

  // Remove desta edição os updates que não estão mais na lista.
  const { data: current } = await supabase
    .from("medical_updates")
    .select("id")
    .eq("daily_issue_id", issueId);
  const currentIds = ((current as { id: string }[]) ?? []).map((r) => r.id);
  const toDetach = currentIds.filter((id) => !orderedIds.includes(id));

  if (toDetach.length > 0) {
    await supabase
      .from("medical_updates")
      .update({ daily_issue_id: null })
      .in("id", toDetach);
  }

  // Associa e ordena os selecionados.
  for (let i = 0; i < orderedIds.length; i++) {
    await supabase
      .from("medical_updates")
      .update({ daily_issue_id: issueId, display_order: i })
      .eq("id", orderedIds[i]);
  }

  revalidatePath("/admin/boletins");
  revalidatePath(`/admin/boletins/edit/${issueId}`);
  revalidatePath("/");
}

// -----------------------------------------------------------------------------
// Coleta bruta
// -----------------------------------------------------------------------------

export async function setRawStatus(
  id: string,
  status: "pending" | "reviewed" | "discarded",
) {
  const supabase = await requireAuth();
  const { error } = await supabase
    .from("raw_updates")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/raw");
}

// Dispara a coleta automática manualmente a partir do painel.
export async function runCollectionAction(): Promise<CollectionSummary> {
  await requireAuth();
  const summary = await collectRawUpdates({ limit: 10 });
  revalidatePath("/admin/raw");
  return summary;
}

// Monta a edição de hoje em rascunho a partir dos itens coletados.
export async function assembleTodayAction(): Promise<AssembleSummary> {
  await requireAuth();
  const summary = await assembleDailyDraft(6);
  revalidatePath("/admin/boletins");
  revalidatePath("/admin");
  return summary;
}

// Confirma e PUBLICA a edição de hoje (o "lançamento").
export async function publishTodayAction(): Promise<PublishSummary> {
  await requireAuth();
  const summary = await publishDailyIssue(todayISO());
  revalidatePath("/admin");
  revalidatePath("/admin/boletins");
  revalidatePath("/");
  revalidatePath("/hoje");
  return summary;
}

// Promove um item bruto a uma atualização em rascunho (com a fonte pré-preenchida).
export async function promoteRawToUpdate(rawId: string) {
  const supabase = await requireAuth();

  const { data: raw } = await supabase
    .from("raw_updates")
    .select("*")
    .eq("id", rawId)
    .maybeSingle();
  if (!raw) throw new Error("Item bruto não encontrado.");

  const title = String(raw.title ?? "Sem título");
  const baseSlug = toSlug(title) || `item-${Date.now()}`;

  // Tenta inserir com slug base; em colisão, adiciona sufixo curto.
  let newId: string | null = null;
  for (let attempt = 0; attempt < 3 && !newId; attempt++) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
    const { data, error } = await supabase
      .from("medical_updates")
      .insert({
        title,
        slug,
        short_summary: raw.raw_summary ?? null,
        publication_date: raw.published_at
          ? String(raw.published_at).slice(0, 10)
          : todayISO(),
        status: "draft" as ContentStatus,
      })
      .select("id")
      .single();
    if (!error && data) {
      newId = data.id;
    } else if (error && error.code !== "23505") {
      throw new Error(error.message);
    }
  }

  if (!newId) throw new Error("Não foi possível gerar um slug único.");

  // Cria a fonte a partir do item bruto.
  if (raw.source_url) {
    await supabase.from("sources").insert({
      update_id: newId,
      source_name: String(raw.source_name ?? raw.source_type ?? "Fonte"),
      source_type: String(raw.source_type ?? "Artigo original"),
      url: String(raw.source_url),
      is_primary: true,
      accessed_at: todayISO(),
    });
  }

  // Marca o item bruto como revisado.
  await supabase.from("raw_updates").update({ status: "reviewed" }).eq("id", rawId);

  revalidatePath("/admin/raw");
  revalidatePath("/admin/updates");
  redirect(`/admin/updates/edit/${newId}`);
}
