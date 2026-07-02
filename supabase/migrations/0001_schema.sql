-- Muda Conduta? — Schema inicial
-- Executar no SQL Editor do Supabase (ou via CLI: supabase db push).

create extension if not exists "pgcrypto";

-- Trigger util para manter updated_at.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- Boletins diários
-- ---------------------------------------------------------------------------
create table if not exists daily_issues (
  id uuid primary key default gen_random_uuid(),
  issue_date date unique not null,
  issue_number integer,
  title text,
  intro text,
  what_matters text[],
  status text not null default 'draft'
    check (status in ('draft','review','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_daily_issues_status_date
  on daily_issues (status, issue_date desc);

drop trigger if exists trg_daily_issues_updated on daily_issues;
create trigger trg_daily_issues_updated before update on daily_issues
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Atualizações médicas
-- ---------------------------------------------------------------------------
create table if not exists medical_updates (
  id uuid primary key default gen_random_uuid(),
  daily_issue_id uuid references daily_issues(id) on delete set null,
  title text not null,
  slug text unique not null,
  short_summary text,
  what_matters text,
  clinical_context text,
  area text,
  evidence_type text,
  evidence_strength text,
  impact_level text,
  publication_date date,
  reading_time_minutes integer,
  status text not null default 'draft'
    check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_updates_status on medical_updates (status);
create index if not exists idx_updates_area on medical_updates (area);
create index if not exists idx_updates_impact on medical_updates (impact_level);
create index if not exists idx_updates_evidence on medical_updates (evidence_type);
create index if not exists idx_updates_pubdate on medical_updates (publication_date desc);
create index if not exists idx_updates_issue on medical_updates (daily_issue_id);

drop trigger if exists trg_updates_updated on medical_updates;
create trigger trg_updates_updated before update on medical_updates
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Detalhes do estudo (1:1)
-- ---------------------------------------------------------------------------
create table if not exists study_details (
  id uuid primary key default gen_random_uuid(),
  update_id uuid unique references medical_updates(id) on delete cascade,
  study_phase text,
  study_design text,
  randomization text,
  blinding text,
  multicenter boolean,
  sample_size integer,
  population text,
  inclusion_criteria text,
  follow_up text,
  intervention text,
  control_group text,
  primary_outcome text,
  secondary_outcomes text,
  main_results text,
  effect_size text,
  absolute_risk_reduction text,
  nnt text,
  hazard_ratio text,
  relative_risk text,
  odds_ratio text,
  p_value text,
  confidence_interval text
);

-- ---------------------------------------------------------------------------
-- Mecanismo e fisiopatologia (1:1)
-- ---------------------------------------------------------------------------
create table if not exists mechanism_details (
  id uuid primary key default gen_random_uuid(),
  update_id uuid unique references medical_updates(id) on delete cascade,
  drug_class text,
  mechanism_target text,
  mechanism text,
  disease_pathophysiology text,
  why_it_works text,
  mechanism_based_adverse_effects text
);

-- ---------------------------------------------------------------------------
-- Leitura crítica e contexto Brasil (1:1)
-- ---------------------------------------------------------------------------
create table if not exists critical_appraisal (
  id uuid primary key default gen_random_uuid(),
  update_id uuid unique references medical_updates(id) on delete cascade,
  limitations text,
  conflicts_of_interest text,
  funding text,
  critical_interpretation text,
  practical_impact text,
  brazil_context text,
  anvisa_status text,
  conitec_status text,
  sus_status text,
  brazil_available boolean,
  changes_practice_now boolean
);

-- ---------------------------------------------------------------------------
-- Fontes (1:N)
-- ---------------------------------------------------------------------------
create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  update_id uuid references medical_updates(id) on delete cascade,
  source_name text not null,
  source_type text not null,
  url text not null,
  is_primary boolean not null default true,
  accessed_at date,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists idx_sources_update on sources (update_id);

-- ---------------------------------------------------------------------------
-- Tags (N:N)
-- ---------------------------------------------------------------------------
create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null
);

create table if not exists update_tags (
  update_id uuid references medical_updates(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (update_id, tag_id)
);

-- ---------------------------------------------------------------------------
-- Coleta bruta (futura automação)
-- ---------------------------------------------------------------------------
create table if not exists raw_updates (
  id uuid primary key default gen_random_uuid(),
  title text,
  source_name text,
  source_url text,
  source_type text,
  published_at timestamptz,
  raw_summary text,
  raw_payload jsonb,
  status text not null default 'pending'
    check (status in ('pending','reviewed','discarded')),
  created_at timestamptz not null default now()
);
create index if not exists idx_raw_status on raw_updates (status, created_at desc);

-- ---------------------------------------------------------------------------
-- Newsletter
-- ---------------------------------------------------------------------------
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text not null default 'active'
    check (status in ('active','unsubscribed')),
  created_at timestamptz not null default now()
);
