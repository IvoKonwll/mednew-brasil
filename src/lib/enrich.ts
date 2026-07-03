// Enriquecimento de atualizações — SOMENTE server-side, via cliente service role.
// Usado pelo endpoint protegido por CRON_SECRET para preencher a análise clínica
// (tipo de estudo, mecanismo, leitura crítica, impacto) antes da publicação.
//
// Whitelists garantem que só colunas conhecidas sejam gravadas.

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const UPDATE_FIELDS = [
  "area",
  "evidence_type",
  "evidence_strength",
  "impact_level",
  "reading_time_minutes",
  "short_summary",
  "what_matters",
  "clinical_context",
] as const;

const MECHANISM_FIELDS = [
  "drug_class",
  "mechanism_target",
  "mechanism",
  "disease_pathophysiology",
  "why_it_works",
  "mechanism_based_adverse_effects",
] as const;

const STUDY_FIELDS = [
  "study_phase",
  "study_design",
  "randomization",
  "blinding",
  "multicenter",
  "sample_size",
  "population",
  "inclusion_criteria",
  "follow_up",
  "intervention",
  "control_group",
  "primary_outcome",
  "secondary_outcomes",
  "main_results",
  "effect_size",
  "absolute_risk_reduction",
  "nnt",
  "hazard_ratio",
  "relative_risk",
  "odds_ratio",
  "p_value",
  "confidence_interval",
] as const;

const APPRAISAL_FIELDS = [
  "limitations",
  "conflicts_of_interest",
  "funding",
  "critical_interpretation",
  "practical_impact",
  "brazil_context",
  "anvisa_status",
  "conitec_status",
  "sus_status",
  "brazil_available",
  "changes_practice_now",
] as const;

export interface EnrichPatch {
  id?: string;
  slug?: string;
  area?: string;
  evidence_type?: string;
  evidence_strength?: string;
  impact_level?: string;
  reading_time_minutes?: number;
  short_summary?: string;
  what_matters?: string;
  clinical_context?: string;
  mechanism?: Record<string, unknown>;
  study?: Record<string, unknown>;
  appraisal?: Record<string, unknown>;
}

export interface EnrichResult {
  identifier: string;
  ok: boolean;
  error?: string;
}

function pick(
  src: Record<string, unknown> | undefined,
  allowed: readonly string[],
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (!src) return out;
  for (const key of allowed) {
    if (src[key] !== undefined) out[key] = src[key];
  }
  return out;
}

export async function applyEnrichment(
  patches: EnrichPatch[],
): Promise<EnrichResult[]> {
  const supabase = createSupabaseAdminClient();
  const results: EnrichResult[] = [];

  for (const p of patches) {
    const ident = p.id ?? p.slug ?? "(sem id/slug)";

    // Resolve o update por id ou slug.
    let updateId = p.id ?? null;
    if (!updateId && p.slug) {
      const { data } = await supabase
        .from("medical_updates")
        .select("id")
        .eq("slug", p.slug)
        .maybeSingle();
      updateId = (data?.id as string | undefined) ?? null;
    }
    if (!updateId) {
      results.push({ identifier: ident, ok: false, error: "não encontrado" });
      continue;
    }

    // Campos escalares do próprio update.
    const scalar = pick(p as Record<string, unknown>, UPDATE_FIELDS);
    if (Object.keys(scalar).length > 0) {
      const { error } = await supabase
        .from("medical_updates")
        .update({ ...scalar, updated_at: new Date().toISOString() })
        .eq("id", updateId);
      if (error) {
        results.push({ identifier: ident, ok: false, error: error.message });
        continue;
      }
    }

    // Relações 1:1 (upsert por update_id).
    const mech = pick(p.mechanism, MECHANISM_FIELDS);
    if (Object.keys(mech).length > 0) {
      await supabase
        .from("mechanism_details")
        .upsert({ update_id: updateId, ...mech }, { onConflict: "update_id" });
    }
    const study = pick(p.study, STUDY_FIELDS);
    if (Object.keys(study).length > 0) {
      await supabase
        .from("study_details")
        .upsert({ update_id: updateId, ...study }, { onConflict: "update_id" });
    }
    const appraisal = pick(p.appraisal, APPRAISAL_FIELDS);
    if (Object.keys(appraisal).length > 0) {
      await supabase
        .from("critical_appraisal")
        .upsert(
          { update_id: updateId, ...appraisal },
          { onConflict: "update_id" },
        );
    }

    results.push({ identifier: ident, ok: true });
  }

  return results;
}
