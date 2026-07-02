-- Muda Conduta? — Row Level Security
--
-- Regras:
--   * Leitura pública SOMENTE de conteúdo publicado.
--   * Escrita apenas para usuários autenticados (equipe editorial).
--   * Tabelas internas (raw_updates, newsletter_subscribers) sem leitura pública.
--
-- Observação: o cliente com service role ignora RLS (usado apenas server-side,
-- ex.: cron). Nunca exponha a service role key no frontend.

alter table daily_issues enable row level security;
alter table medical_updates enable row level security;
alter table study_details enable row level security;
alter table mechanism_details enable row level security;
alter table critical_appraisal enable row level security;
alter table sources enable row level security;
alter table tags enable row level security;
alter table update_tags enable row level security;
alter table raw_updates enable row level security;
alter table newsletter_subscribers enable row level security;

-- ---------------------------------------------------------------------------
-- daily_issues
-- ---------------------------------------------------------------------------
drop policy if exists "public read published issues" on daily_issues;
create policy "public read published issues" on daily_issues
  for select using (status = 'published');

drop policy if exists "auth full issues" on daily_issues;
create policy "auth full issues" on daily_issues
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- medical_updates
-- ---------------------------------------------------------------------------
drop policy if exists "public read published updates" on medical_updates;
create policy "public read published updates" on medical_updates
  for select using (status = 'published');

drop policy if exists "auth full updates" on medical_updates;
create policy "auth full updates" on medical_updates
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Helper: leitura pública das relações somente se o update-pai está publicado.
-- ---------------------------------------------------------------------------
-- study_details
drop policy if exists "public read study of published" on study_details;
create policy "public read study of published" on study_details
  for select using (
    exists (select 1 from medical_updates u
            where u.id = study_details.update_id and u.status = 'published')
  );
drop policy if exists "auth full study" on study_details;
create policy "auth full study" on study_details
  for all to authenticated using (true) with check (true);

-- mechanism_details
drop policy if exists "public read mechanism of published" on mechanism_details;
create policy "public read mechanism of published" on mechanism_details
  for select using (
    exists (select 1 from medical_updates u
            where u.id = mechanism_details.update_id and u.status = 'published')
  );
drop policy if exists "auth full mechanism" on mechanism_details;
create policy "auth full mechanism" on mechanism_details
  for all to authenticated using (true) with check (true);

-- critical_appraisal
drop policy if exists "public read appraisal of published" on critical_appraisal;
create policy "public read appraisal of published" on critical_appraisal
  for select using (
    exists (select 1 from medical_updates u
            where u.id = critical_appraisal.update_id and u.status = 'published')
  );
drop policy if exists "auth full appraisal" on critical_appraisal;
create policy "auth full appraisal" on critical_appraisal
  for all to authenticated using (true) with check (true);

-- sources
drop policy if exists "public read sources of published" on sources;
create policy "public read sources of published" on sources
  for select using (
    exists (select 1 from medical_updates u
            where u.id = sources.update_id and u.status = 'published')
  );
drop policy if exists "auth full sources" on sources;
create policy "auth full sources" on sources
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- tags / update_tags — leitura pública livre, escrita autenticada.
-- ---------------------------------------------------------------------------
drop policy if exists "public read tags" on tags;
create policy "public read tags" on tags for select using (true);
drop policy if exists "auth full tags" on tags;
create policy "auth full tags" on tags
  for all to authenticated using (true) with check (true);

drop policy if exists "public read update_tags" on update_tags;
create policy "public read update_tags" on update_tags for select using (true);
drop policy if exists "auth full update_tags" on update_tags;
create policy "auth full update_tags" on update_tags
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- raw_updates — sem leitura pública; só autenticado.
-- ---------------------------------------------------------------------------
drop policy if exists "auth full raw" on raw_updates;
create policy "auth full raw" on raw_updates
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- newsletter_subscribers — qualquer um pode se inscrever (insert);
-- leitura/gerência apenas autenticado.
-- ---------------------------------------------------------------------------
drop policy if exists "public subscribe" on newsletter_subscribers;
create policy "public subscribe" on newsletter_subscribers
  for insert with check (true);
drop policy if exists "auth read subscribers" on newsletter_subscribers;
create policy "auth read subscribers" on newsletter_subscribers
  for select to authenticated using (true);
drop policy if exists "auth manage subscribers" on newsletter_subscribers;
create policy "auth manage subscribers" on newsletter_subscribers
  for update to authenticated using (true) with check (true);
