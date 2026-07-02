// Queries do painel admin — leem TODOS os status (RLS permite ao autenticado).
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  DailyIssue,
  FullMedicalUpdate,
  MedicalUpdate,
  RawUpdate,
  Source,
} from "@/lib/types";
import type { ContentStatus } from "@/lib/constants";

export async function adminListIssues(): Promise<DailyIssue[]> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("daily_issues")
    .select("*")
    .order("issue_date", { ascending: false });
  return (data as DailyIssue[]) ?? [];
}

export async function adminGetIssue(id: string): Promise<DailyIssue | null> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("daily_issues")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as DailyIssue) ?? null;
}

export async function adminListUpdates(): Promise<MedicalUpdate[]> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("medical_updates")
    .select("*")
    .order("updated_at", { ascending: false });
  return (data as MedicalUpdate[]) ?? [];
}

export async function adminGetUpdate(
  id: string,
): Promise<FullMedicalUpdate | null> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("medical_updates")
    .select(
      `*, study_details(*), mechanism_details(*), critical_appraisal(*), sources(*)`,
    )
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  const raw = data as Record<string, unknown>;
  const one = <T,>(v: unknown): T | null =>
    Array.isArray(v) ? ((v[0] as T) ?? null) : ((v as T) ?? null);
  return {
    ...(raw as unknown as FullMedicalUpdate),
    study_details: one(raw.study_details),
    mechanism_details: one(raw.mechanism_details),
    critical_appraisal: one(raw.critical_appraisal),
    sources: (raw.sources as Source[]) ?? [],
    tags: [],
  };
}

export async function adminListRaw(): Promise<RawUpdate[]> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("raw_updates")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  return (data as RawUpdate[]) ?? [];
}

export async function adminListSources(): Promise<
  (Source & { update?: { title: string; slug: string } | null })[]
> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("sources")
    .select("*, update:medical_updates(title, slug)")
    .order("created_at", { ascending: false })
    .limit(200);
  return (data as (Source & { update?: { title: string; slug: string } })[]) ?? [];
}

export async function adminCounts() {
  const supabase = createSupabaseServerClient();
  const [issues, updates, published, raw] = await Promise.all([
    supabase.from("daily_issues").select("id", { count: "exact", head: true }),
    supabase.from("medical_updates").select("id", { count: "exact", head: true }),
    supabase
      .from("medical_updates")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("raw_updates")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);
  return {
    issues: issues.count ?? 0,
    updates: updates.count ?? 0,
    published: published.count ?? 0,
    rawPending: raw.count ?? 0,
  };
}

// Contagens por status editorial + boletim de hoje (para o dashboard).
export async function adminEditorialSnapshot(today: string) {
  const supabase = createSupabaseServerClient();
  const countByStatus = (status: ContentStatus) =>
    supabase
      .from("medical_updates")
      .select("id", { count: "exact", head: true })
      .eq("status", status);

  const [draft, review, published, archived, todayIssue] = await Promise.all([
    countByStatus("draft"),
    countByStatus("review"),
    countByStatus("published"),
    countByStatus("archived"),
    supabase
      .from("daily_issues")
      .select("*")
      .eq("issue_date", today)
      .maybeSingle(),
  ]);

  return {
    draft: draft.count ?? 0,
    review: review.count ?? 0,
    published: published.count ?? 0,
    archived: archived.count ?? 0,
    todayIssue: (todayIssue.data as DailyIssue | null) ?? null,
  };
}

// Atualizações associadas a um boletim (para o editor de edição).
export async function adminGetIssueUpdates(
  issueId: string,
): Promise<MedicalUpdate[]> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("medical_updates")
    .select("*")
    .eq("daily_issue_id", issueId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  return (data as MedicalUpdate[]) ?? [];
}
