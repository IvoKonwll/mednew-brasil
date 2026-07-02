# Muda Conduta?

**Avanços médicos explicados por evidência, mecanismo e impacto prático.**

Jornal médico digital brasileiro com boletins diários sobre os principais
avanços da medicina no mundo. Para cada novidade, o site responde às mesmas
perguntas: **o que saiu, como funciona no corpo, como foi estudado, qual
evidência sustenta e — principalmente — se muda conduta no Brasil.**

> ⚠️ O site é **orientado a dados e se atualiza continuamente**. Cada dia recebe
> um novo boletim publicado pelo painel editorial; as páginas “Hoje”, “Ontem” e
> “Arquivo” são calculadas dinamicamente a partir da data atual e do que está
> publicado no banco. Nada é fixo no código.

---

## Sumário

1. [Visão do produto](#visão-do-produto)
2. [Stack](#stack)
3. [Estrutura de pastas](#estrutura-de-pastas)
4. [Instalação](#instalação)
5. [Variáveis de ambiente](#variáveis-de-ambiente)
6. [Banco de dados (Supabase)](#banco-de-dados-supabase)
7. [Rodar localmente](#rodar-localmente)
8. [Criar o primeiro usuário admin](#criar-o-primeiro-usuário-admin)
9. [Publicar o primeiro boletim](#publicar-o-primeiro-boletim)
10. [Deploy na Vercel](#deploy-na-vercel)
11. [Segurança e RLS](#segurança-e-rls)
12. [Próximos passos: automação de coleta](#próximos-passos-automação-de-coleta)

---

## Visão do produto

Não é um blog de notícias. É um **boletim médico diário** para estudantes de
medicina, residentes e médicos, com estética editorial sóbria e científica,
sempre diferenciando evidência forte de preliminar e sinalizando quando algo
depende de Anvisa, CONITEC, SUS, convênios, diretrizes nacionais ou
disponibilidade local.

Cada atualização médica segue uma estrutura fixa: o que importa → contexto
clínico → **como funciona no corpo** (mecanismo) → **como a pesquisa foi feita**
(desenho do estudo) → resultados que importam → limitações e leitura crítica →
impacto prático → contexto no Brasil → **fontes confiáveis com links**.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (design editorial premium)
- **Supabase / PostgreSQL** (dados) + **Supabase Auth** (painel admin)
- **Vercel** (deploy)
- Estrutura pronta para integração futura com PubMed, FDA, EMA, OMS, Anvisa,
  CDC, NICE e ClinicalTrials.gov.

## Estrutura de pastas

```
src/
  app/
    (site)/                 # site público (layout com masthead + footer)
      page.tsx              # / — home (boletim de hoje + destaques + recentes)
      hoje/                 # /hoje
      ontem/                # /ontem
      boletim/[date]/       # /boletim/2026-07-01 — edição diária
      arquivo/              # /arquivo — boletins por data
      updates/[slug]/       # página individual da atualização (a mais importante)
      areas/                # /areas e /areas/[area]
      evidencias/[type]/    # /evidencias/fase-3, /evidencias/diretrizes, ...
      muda-conduta/         # /muda-conduta
      acompanhar/           # /acompanhar
      alertas/              # /alertas
      metodologia/  sobre/  newsletter/
    admin/                  # painel protegido por Supabase Auth
      layout.tsx            # checa sessão, renderiza sidebar
      login/                # /admin/login
      page.tsx              # dashboard
      boletins/ (new, edit/[id])
      updates/  (new, edit/[id])
      raw/                  # coleta bruta (futura automação)
      sources/              # fontes cadastradas
      actions.ts            # Server Actions de CRUD
    api/
      cron/fetch-updates/   # coleta automática (protegida por CRON_SECRET)
      newsletter/           # inscrição na newsletter
    sitemap.ts  robots.ts  not-found.tsx  layout.tsx  globals.css
  components/               # Header, Footer, UpdateCard, badges, boxes, admin/*
  lib/
    constants.ts            # áreas, tipos de evidência, impactos, slugs
    types.ts                # tipos que espelham o schema
    date.ts                 # datas em pt-BR / America/Sao_Paulo
    queries.ts              # leitura pública (só publicado)
    admin-queries.ts        # leitura admin (todos os status)
    supabase/               # clients: server, client (browser), admin (service role)
    integrations/           # pubmed, fda, clinicaltrials (reais); ema, who, anvisa (placeholders)
    collect.ts              # coleta + dedupe + gravação em raw_updates
  middleware.ts             # renova sessão + protege /admin
supabase/
  migrations/0001_schema.sql
  migrations/0002_rls.sql
  seed.sql                  # 5 atualizações demonstrativas
```

### Principais componentes

- **EditorialMasthead / Header / Footer** — cabeçalho de jornal com data e menu.
- **DailyIssueHero, WhatMattersToday, DateNavigator** — a edição diária.
- **UpdateCard / UpdateList** — grid de atualizações com estados vazios.
- **EvidenceBadge, ImpactBadge, AreaBadge, StatusBadge, Pill** — vocabulário visual.
- **MechanismBox, StudyDesignBox, CriticalAppraisalBox, BrazilContextBox, SourceList** — as seções da página individual.
- **ArchiveCalendar, FilterBar, NewsletterSignup, EmptyState**.
- **Admin**: `AdminSidebar, AdminTable, IssueForm, UpdateForm, SourceFormRepeater, RowActions`.

## Instalação

Requer **Node 18+** (testado no Node 22).

```bash
npm install
cp .env.local.example .env.local   # e preencha as chaves do Supabase
```

## Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # NUNCA expor no frontend; só server-side/cron
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CRON_SECRET=troque-este-valor
```

Sem o Supabase configurado, o site **ainda roda** (com estados vazios) e o
`/admin` exibe uma tela pedindo a configuração — útil para desenvolver o layout.

## Banco de dados (Supabase)

1. Crie um projeto em [app.supabase.com](https://app.supabase.com).
2. Em **Project Settings → API**, copie a URL, a `anon key` e a `service_role key`
   para o `.env.local`.
3. Rode as migrations. **Opção A — SQL Editor** (mais simples): abra o SQL Editor
   e cole/execute na ordem:
   - `supabase/migrations/0001_schema.sql`
   - `supabase/migrations/0002_rls.sql`
   - `supabase/seed.sql` (opcional — dados demonstrativos)
4. **Opção B — Supabase CLI**:
   ```bash
   supabase link --project-ref SEU_REF
   supabase db push          # aplica as migrations
   # seed:
   psql "$SUPABASE_DB_URL" -f supabase/seed.sql
   ```

### Tabelas

`daily_issues`, `medical_updates`, `study_details`, `mechanism_details`,
`critical_appraisal`, `sources`, `tags`, `update_tags`, `raw_updates`,
`newsletter_subscribers`. Relações 1:1 (estudo/mecanismo/leitura crítica) usam
`update_id` único; fontes e tags são 1:N / N:N. `updated_at` é mantido por
trigger.

## Rodar localmente

```bash
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run typecheck  # checagem de tipos
npm run lint
```

## Criar o primeiro usuário admin

O painel usa **Supabase Auth (e-mail + senha)**. Não há cadastro público.

1. No painel do Supabase: **Authentication → Users → Add user**.
2. Informe e-mail e senha e marque **Auto Confirm User**.
3. Acesse `http://localhost:3000/admin/login` e entre com essas credenciais.

Qualquer usuário autenticado tem acesso editorial (as políticas RLS concedem
escrita a `authenticated`). Para múltiplos papéis, dá para evoluir com uma
tabela de perfis e checagem por `role` — ver [Próximos passos](#próximos-passos-automação-de-coleta).

## Publicar o primeiro boletim

1. Entre em `/admin`.
2. **Boletins → Novo boletim**: escolha a data (ex.: hoje), preencha título,
   introdução e os destaques de “O que realmente importa hoje” (um por linha).
   Deixe o status como **Publicado** e salve.
3. **Atualizações → Nova atualização**: preencha as seções (identificação,
   resumo, evidência, mecanismo, leitura crítica, impacto/Brasil e fontes),
   **associe ao boletim** criado, marque **Publicado** e salve. O slug é gerado
   automaticamente a partir do título se você deixar em branco.
4. Abra `/hoje` (ou `/boletim/DATA`): a edição aparece com os destaques e os
   cards. A página individual fica em `/updates/SLUG`.

Publicar/despublicar/mudar para “em revisão”/excluir também pode ser feito
direto nas listas do admin, pelos botões de cada linha.

## Deploy na Vercel

1. Suba o repositório no GitHub e importe em [vercel.com](https://vercel.com).
2. Em **Settings → Environment Variables**, adicione as mesmas variáveis do
   `.env.local` (incluindo `SUPABASE_SERVICE_ROLE_KEY` como secret e
   `NEXT_PUBLIC_SITE_URL` com a URL final).
3. Deploy. Framework detectado automaticamente (Next.js).
4. **Cron (futuro)**: para agendar a coleta, adicione em `vercel.json`:
   ```json
   { "crons": [{ "path": "/api/cron/fetch-updates", "schedule": "0 9 * * *" }] }
   ```

## Segurança e RLS

- `/admin` é protegido pelo **middleware** (redireciona para login sem sessão) e
  reforçado no layout do admin.
- **RLS ligado em todas as tabelas** (`0002_rls.sql`):
  - Leitura **pública apenas de conteúdo publicado** (`status = 'published'`),
    inclusive nas relações (estudo, mecanismo, fontes só aparecem se o update-pai
    está publicado).
  - Escrita **apenas para usuários autenticados**.
  - `raw_updates` não tem leitura pública; `newsletter_subscribers` aceita
    inscrição pública, mas leitura/gerência só autenticada.
- A **service role key** só é usada server-side (cliente `lib/supabase/admin.ts`,
  destinado ao cron). Nunca é importada no browser.

## Automação de coleta

A coleta automática está **implementada** para as fontes com API pública:

- **PubMed** (`pubmed.ts`) — E-utilities (esearch + esummary), artigos/ensaios/
  metanálises recentes.
- **FDA** (`fda.ts`) — openFDA (recalls de medicamentos), útil para alertas.
- **ClinicalTrials.gov** (`clinicaltrials.ts`) — API v2, estudos recentes.

EMA, WHO e Anvisa (`ema.ts`, `who.ts`, `anvisa.ts`) seguem como _placeholders_
tipados (sem API JSON pública estável sem scraping). O registro central fica em
`src/lib/integrations/index.ts`.

### Fluxo

1. `collectRawUpdates()` (`src/lib/collect.ts`) roda cada integração, deduplica
   por `source_url` e insere itens novos em `raw_updates` (`status = 'pending'`)
   usando o cliente **service role** (server-side).
2. A equipe revisa em **/admin/raw**, clica em **Coletar agora** para buscar sob
   demanda e **Promover → rascunho** para transformar um item em atualização
   (cria um `medical_update` em rascunho já com a fonte preenchida).
3. A publicação **sempre** passa por curadoria e revisão humana.

### Rodar a coleta

- **Manual (painel):** botão “Coletar agora” em `/admin/raw`.
- **HTTP/cron:** `GET /api/cron/fetch-updates?run=1` — protegido por `CRON_SECRET`
  (via `?secret=...` ou header `Authorization: Bearer <segredo>`). Sem `run=1`,
  a rota apenas descreve as integrações.
- **Agendado (Vercel):** `vercel.json` já traz um cron diário. Adicione
  `CRON_SECRET` nas variáveis de ambiente e configure o header de autorização
  do Vercel Cron.

> A coleta faz chamadas de rede em runtime (na Vercel). Requer
> `SUPABASE_SERVICE_ROLE_KEY` para gravar em `raw_updates`.

### Ideias de evolução

Tabela de `profiles`/`roles` para permissões granulares, editor rich-text,
agendamento de publicação, envio real da newsletter, deduplicação semântica e
mapeamento automático de área/tipo de evidência.

---

_Este conteúdo é educacional e não substitui julgamento clínico, diretrizes
locais, bula oficial, avaliação individual do paciente ou decisão
compartilhada._
