-- Muda Conduta? — ordenação editorial de atualizações dentro do boletim.
-- Permite ordenar as análises de uma edição por relevância no painel.

alter table medical_updates
  add column if not exists display_order integer not null default 0;

create index if not exists idx_updates_issue_order
  on medical_updates (daily_issue_id, display_order);
