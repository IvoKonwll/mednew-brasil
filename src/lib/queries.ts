// Camada de acesso a dados para o site público.
// Todas as funções são server-side e leem apenas conteúdo PUBLICADO
// (RLS reforça isso no banco; aqui filtramos por clareza e defesa em profundidade).

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  DailyIssue,
  FullMedicalUpdate,
  MedicalUpdate,
} from "@/lib/types";
import {
  CHANGES_PRACTICE_IMPACTS,
  WATCH_IMPACTS,
  type ImpactLevel,
  type MedicalArea,
} from "@/lib/constants";

// Retorna true se as variáveis de ambiente do Supabase estão presentes.
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

const UPDATE_LIST_COLUMNS =
  "id, daily_issue_id, title, slug, short_summary, what_matters, clinical_context, area, evidence_type, evidence_strength, impact_level, publication_date, reading_time_minutes, status, created_at, updated_at";

// -----------------------------------------------------------------------------
// Boletins diários
// -----------------------------------------------------------------------------

export async function getIssueByDate(
  date: string,
): Promise<DailyIssue | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("daily_issues")
    .select("*")
    .eq("issue_date", date)
    .eq("status", "published")
    .maybeSingle();
  return (data as DailyIssue) ?? null;
}

// Boletim publicado mais recente (usado como fallback em /hoje).
export async function getLatestIssue(): Promise<DailyIssue | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("daily_issues")
    .select("*")
    .eq("status", "published")
    .order("issue_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as DailyIssue) ?? null;
}

// Boletim publicado imediatamente anterior/posterior a uma data.
export async function getAdjacentIssue(
  date: string,
  direction: "prev" | "next",
): Promise<DailyIssue | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseServerClient();
  const query = supabase
    .from("daily_issues")
    .select("issue_date, issue_number, title")
    .eq("status", "published")
    .limit(1);

  if (direction === "prev") {
    query.lt("issue_date", date).order("issue_date", { ascending: false });
  } else {
    query.gt("issue_date", date).order("issue_date", { ascending: true });
  }

  const { data } = await query.maybeSingle();
  return (data as DailyIssue) ?? null;
}

// Lista de boletins publicados (para o arquivo).
export async function listIssues(limit = 60): Promise<DailyIssue[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("daily_issues")
    .select("*")
    .eq("status", "published")
    .order("issue_date", { ascending: false })
    .limit(limit);
  return (data as DailyIssue[]) ?? [];
}

// -----------------------------------------------------------------------------
// Atualizações médicas (listagens)
// -----------------------------------------------------------------------------

export async function getUpdatesByIssue(
  issueId: string,
): Promise<MedicalUpdate[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("medical_updates")
    .select(UPDATE_LIST_COLUMNS)
    .eq("daily_issue_id", issueId)
    .eq("status", "published")
    .order("created_at", { ascending: true });
  return (data as MedicalUpdate[]) ?? [];
}

export async function getUpdatesByDate(
  date: string,
): Promise<MedicalUpdate[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("medical_updates")
    .select(UPDATE_LIST_COLUMNS)
    .eq("publication_date", date)
    .eq("status", "published")
    .order("created_at", { ascending: true });
  return (data as MedicalUpdate[]) ?? [];
}

export async function getRecentUpdates(limit = 12): Promise<MedicalUpdate[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("medical_updates")
    .select(UPDATE_LIST_COLUMNS)
    .eq("status", "published")
    .order("publication_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as MedicalUpdate[]) ?? [];
}

export async function getUpdatesByArea(
  area: MedicalArea,
  limit = 40,
): Promise<MedicalUpdate[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("medical_updates")
    .select(UPDATE_LIST_COLUMNS)
    .eq("area", area)
    .eq("status", "published")
    .order("publication_date", { ascending: false, nullsFirst: false })
    .limit(limit);
  return (data as MedicalUpdate[]) ?? [];
}

export async function getUpdatesByEvidenceTypes(
  types: string[],
  limit = 40,
): Promise<MedicalUpdate[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("medical_updates")
    .select(UPDATE_LIST_COLUMNS)
    .in("evidence_type", types)
    .eq("status", "published")
    .order("publication_date", { ascending: false, nullsFirst: false })
    .limit(limit);
  return (data as MedicalUpdate[]) ?? [];
}

export async function getUpdatesByImpacts(
  impacts: ImpactLevel[],
  limit = 40,
): Promise<MedicalUpdate[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("medical_updates")
    .select(UPDATE_LIST_COLUMNS)
    .in("impact_level", impacts)
    .eq("status", "published")
    .order("publication_date", { ascending: false, nullsFirst: false })
    .limit(limit);
  return (data as MedicalUpdate[]) ?? [];
}

export const getUpdatesThatChangePractice = () =>
  getUpdatesByImpacts(CHANGES_PRACTICE_IMPACTS);

export const getUpdatesToWatch = () => getUpdatesByImpacts(WATCH_IMPACTS);

export const getSafetyAlerts = () =>
  getUpdatesByImpacts(["Alerta de segurança"]);

// -----------------------------------------------------------------------------
// Atualização individual (com todas as relações)
// -----------------------------------------------------------------------------

export async function getUpdateBySlug(
  slug: string,
): Promise<FullMedicalUpdate | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("medical_updates")
    .select(
      `*,
       study_details(*),
       mechanism_details(*),
       critical_appraisal(*),
       sources(*),
       daily_issue:daily_issues(*),
       update_tags(tag:tags(*))`,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) return null;

  // Normaliza relações "one-to-one" que o Supabase retorna como array/objeto.
  const raw = data as Record<string, unknown>;
  const one = <T,>(v: unknown): T | null =>
    Array.isArray(v) ? ((v[0] as T) ?? null) : ((v as T) ?? null);

  const tags = Array.isArray(raw.update_tags)
    ? (raw.update_tags as Array<{ tag: unknown }>)
        .map((ut) => ut.tag)
        .filter(Boolean)
    : [];

  return {
    ...(raw as unknown as FullMedicalUpdate),
    study_details: one(raw.study_details),
    mechanism_details: one(raw.mechanism_details),
    critical_appraisal: one(raw.critical_appraisal),
    sources: (raw.sources as FullMedicalUpdate["sources"]) ?? [],
    daily_issue: one(raw.daily_issue),
    tags: tags as FullMedicalUpdate["tags"],
  };
}

// Slugs de todas as atualizações publicadas (para generateStaticParams / sitemap).
export async function getAllPublishedSlugs(): Promise<
  { slug: string; updated_at: string }[]
> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("medical_updates")
    .select("slug, updated_at")
    .eq("status", "published");
  return (data as { slug: string; updated_at: string }[]) ?? [];
}

export async function getAllPublishedIssueDates(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("daily_issues")
    .select("issue_date")
    .eq("status", "published");
  return ((data as { issue_date: string }[]) ?? []).map((r) => r.issue_date);
}
