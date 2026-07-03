// Tipos que espelham o schema do Supabase/PostgreSQL.
// Mantidos manualmente para o MVP; podem ser substituídos por tipos gerados
// (`supabase gen types typescript`) no futuro.

import type {
  ContentStatus,
  EvidenceStrength,
  EvidenceType,
  ImpactLevel,
  MedicalArea,
  SourceType,
} from "./constants";

export interface DailyIssue {
  id: string;
  issue_date: string; // YYYY-MM-DD
  issue_number: number | null;
  title: string | null;
  intro: string | null;
  what_matters: string[] | null;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MedicalUpdate {
  id: string;
  daily_issue_id: string | null;
  title: string;
  slug: string;
  short_summary: string | null;
  what_matters: string | null;
  clinical_context: string | null;
  area: MedicalArea | null;
  evidence_type: EvidenceType | null;
  evidence_strength: EvidenceStrength | null;
  impact_level: ImpactLevel | null;
  publication_date: string | null;
  reading_time_minutes: number | null;
  status: ContentStatus;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface StudyDetails {
  id: string;
  update_id: string;
  study_phase: string | null;
  study_design: string | null;
  randomization: string | null;
  blinding: string | null;
  multicenter: boolean | null;
  sample_size: number | null;
  population: string | null;
  inclusion_criteria: string | null;
  follow_up: string | null;
  intervention: string | null;
  control_group: string | null;
  primary_outcome: string | null;
  secondary_outcomes: string | null;
  main_results: string | null;
  effect_size: string | null;
  absolute_risk_reduction: string | null;
  nnt: string | null;
  hazard_ratio: string | null;
  relative_risk: string | null;
  odds_ratio: string | null;
  p_value: string | null;
  confidence_interval: string | null;
}

export interface MechanismDetails {
  id: string;
  update_id: string;
  drug_class: string | null;
  mechanism_target: string | null;
  mechanism: string | null;
  disease_pathophysiology: string | null;
  why_it_works: string | null;
  mechanism_based_adverse_effects: string | null;
}

export interface CriticalAppraisal {
  id: string;
  update_id: string;
  limitations: string | null;
  conflicts_of_interest: string | null;
  funding: string | null;
  critical_interpretation: string | null;
  practical_impact: string | null;
  brazil_context: string | null;
  anvisa_status: string | null;
  conitec_status: string | null;
  sus_status: string | null;
  brazil_available: boolean | null;
  changes_practice_now: boolean | null;
}

export interface Source {
  id: string;
  update_id: string;
  source_name: string;
  source_type: SourceType | string;
  url: string;
  is_primary: boolean;
  accessed_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface RawUpdate {
  id: string;
  title: string | null;
  source_name: string | null;
  source_url: string | null;
  source_type: string | null;
  published_at: string | null;
  raw_summary: string | null;
  raw_payload: Record<string, unknown> | null;
  status: "pending" | "reviewed" | "discarded";
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: "active" | "unsubscribed";
  created_at: string;
}

// Update com todas as relações carregadas (usado na página individual).
export interface FullMedicalUpdate extends MedicalUpdate {
  study_details: StudyDetails | null;
  mechanism_details: MechanismDetails | null;
  critical_appraisal: CriticalAppraisal | null;
  sources: Source[];
  tags: Tag[];
  daily_issue?: DailyIssue | null;
}
