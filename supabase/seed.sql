-- Muda Conduta? — Dados demonstrativos (seed)
--
-- ATENÇÃO: conteúdo DEMONSTRATIVO, criado para ilustrar o layout e a estrutura
-- editorial. Os números e detalhes podem não refletir dados reais atualizados.
-- Sempre confira as fontes primárias antes de qualquer decisão clínica.
--
-- As datas usam 2026-07-02 (hoje), 2026-07-01 (ontem) e 2026-06-30.
-- Ajuste as datas se quiser que apareçam em /hoje e /ontem na data em que rodar.

-- Boletins ------------------------------------------------------------------
insert into daily_issues (id, issue_date, issue_number, title, intro, what_matters, status, published_at)
values
  ('11111111-1111-1111-1111-111111111101', '2026-07-02', 42,
   'Boletim de 2 de julho de 2026',
   'Conteúdo demonstrativo. Três destaques hoje: um anticorpo para doença ocular da tireoide, um antiviral para influenza e uma diretriz da OMS para filoviroses.',
   array[
     'Veligrotug (anti-IGF-1R) reduz proptose na doença ocular da tireoide — muda conduta apenas onde aprovado; no Brasil, ainda pendente.',
     'Baloxavir genérico amplia acesso ao tratamento de influenza com dose única.',
     'OMS publica diretriz para manejo de filoviroses (Ebola/Marburg), com impacto em surtos e protocolos.'
   ],
   'published', now()),
  ('11111111-1111-1111-1111-111111111102', '2026-07-01', 41,
   'Boletim de 1 de julho de 2026',
   'Conteúdo demonstrativo. Destaque em oncologia: ensaio de fase 3 com ganho de sobrevida livre de progressão, mas sobrevida global ainda imatura.',
   array[
     'Ensaio de fase 3 em oncologia mostra ganho de PFS, mas OS ainda imatura — merece acompanhar.'
   ],
   'published', now()),
  ('11111111-1111-1111-1111-111111111103', '2026-06-30', 40,
   'Boletim de 30 de junho de 2026',
   'Conteúdo demonstrativo. Alerta de segurança e farmacovigilância em destaque.',
   array[
     'Alerta de segurança demonstrativo: como o site trata retratações e comunicados regulatórios.'
   ],
   'published', now())
on conflict (issue_date) do nothing;

-- Atualizações --------------------------------------------------------------
insert into medical_updates
  (id, daily_issue_id, title, slug, short_summary, what_matters, clinical_context,
   area, evidence_type, evidence_strength, impact_level, publication_date,
   reading_time_minutes, status)
values
  -- 1. Veligrotug
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101',
   'Veligrotug reduz proptose na doença ocular da tireoide',
   'veligrotug-doenca-ocular-tireoide',
   'Anticorpo monoclonal anti-IGF-1R reduziu proptose e diplopia na doença ocular da tireoide em ensaios de fase 3. [Conteúdo demonstrativo]',
   'Um anticorpo que bloqueia o receptor IGF-1R reduziu a proptose (olhos "para fora") e melhorou a diplopia em pacientes com doença ocular da tireoide ativa. Muda conduta onde já aprovado; no Brasil, ainda depende de registro na Anvisa.',
   'A doença ocular da tireoide (orbitopatia de Graves) cursa com inflamação e aumento de volume dos tecidos retro-orbitários, causando proptose, diplopia e, em casos graves, risco visual. As opções tradicionais (corticoide, radioterapia orbitária, cirurgia) têm eficácia limitada na fase ativa.',
   'Oftalmologia', 'Ensaio clínico randomizado fase 3', 'Moderada',
   'Muda apenas onde aprovado', '2026-07-02', 7, 'published'),

  -- 2. Baloxavir genérico
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111101',
   'Baloxavir genérico amplia acesso ao tratamento de influenza',
   'baloxavir-generico-influenza',
   'Versão genérica do baloxavir marboxil, antiviral de dose única para influenza, tende a ampliar acesso. [Conteúdo demonstrativo]',
   'O baloxavir é um antiviral oral de dose única que inibe a replicação do vírus influenza por um mecanismo diferente dos inibidores de neuraminidase. A entrada de genéricos tende a reduzir custo e ampliar acesso onde aprovado.',
   'A influenza sazonal causa morbidade significativa e hospitalizações em grupos de risco. Os antivirais mais usados (oseltamivir) exigem múltiplas doses; a adesão e o custo são barreiras.',
   'Infectologia', 'Aprovação regulatória', 'Moderada',
   'Muda apenas onde aprovado', '2026-07-02', 5, 'published'),

  -- 3. Diretriz OMS filoviroses
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111101',
   'OMS publica diretriz para manejo de filoviroses (Ebola e Marburg)',
   'oms-diretriz-filoviroses-ebola-marburg',
   'Nova diretriz da OMS orienta cuidados de suporte e uso de terapias específicas em doenças por filovírus. [Conteúdo demonstrativo]',
   'A OMS consolidou recomendações para o manejo de doenças por filovírus (Ebola, Marburg), reforçando cuidados de suporte otimizados e o uso de anticorpos monoclonais específicos quando disponíveis. Impacta protocolos de surtos e preparação de serviços.',
   'Surtos de Ebola e Marburg têm alta letalidade e exigem resposta rápida, isolamento e suporte intensivo. Diretrizes padronizadas melhoram desfechos e a segurança das equipes.',
   'Infectologia', 'Diretriz', 'Alta',
   'Muda conduta agora', '2026-07-02', 6, 'published'),

  -- 4. Oncologia fase 3
  ('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111102',
   'Ensaio de fase 3 em oncologia: ganho de PFS com OS ainda imatura',
   'ensaio-fase-3-oncologia-pfs-os-imatura',
   'Novo esquema aumentou a sobrevida livre de progressão, mas a sobrevida global ainda não está madura. [Conteúdo demonstrativo]',
   'Um ensaio de fase 3 mostrou ganho significativo de sobrevida livre de progressão (PFS) com o novo esquema. A sobrevida global (OS) ainda é imatura — não sabemos se o ganho de PFS se traduz em viver mais. Merece acompanhar antes de mudar conduta.',
   'Em vários tumores sólidos, o desfecho que mais importa para o paciente é viver mais e melhor. Ganhos de PFS nem sempre se traduzem em ganho de OS, sobretudo com seguimento curto.',
   'Oncologia', 'Ensaio clínico randomizado fase 3', 'Moderada',
   'Merece acompanhar', '2026-07-01', 8, 'published'),

  -- 5. Alerta de segurança
  ('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111103',
   'Alerta de segurança: sinal de hepatotoxicidade e mudança de bula (exemplo)',
   'alerta-seguranca-hepatotoxicidade-exemplo',
   'Exemplo de como o site trata alertas regulatórios, retratações e farmacovigilância. [Conteúdo demonstrativo]',
   'Um sinal de hepatotoxicidade em farmacovigilância levou a atualização de bula e recomendação de monitorização de enzimas hepáticas. Exemplo demonstrativo de como tratamos alertas de segurança e retratações.',
   'Após a aprovação, a farmacovigilância pode identificar eventos adversos raros não detectados nos ensaios. Alertas regulatórios e mudanças de bula exigem ajuste imediato de conduta e monitorização.',
   'Saúde Pública', 'Alerta de segurança', 'Moderada',
   'Alerta de segurança', '2026-06-30', 4, 'published')
on conflict (slug) do nothing;

-- Detalhes do estudo --------------------------------------------------------
insert into study_details
  (update_id, study_phase, study_design, randomization, blinding, multicenter,
   sample_size, population, inclusion_criteria, follow_up, intervention,
   control_group, primary_outcome, secondary_outcomes, main_results,
   hazard_ratio, relative_risk, absolute_risk_reduction, nnt, p_value, confidence_interval)
values
  ('22222222-2222-2222-2222-222222222201',
   'Fase 3', 'Ensaio clínico randomizado controlado por placebo', 'Randomizado 1:1',
   'Duplo-cego', true, 84,
   'Adultos com doença ocular da tireoide ativa de moderada a grave',
   'CAS ≥ 3, proptose acima do valor de referência, doença ativa recente',
   '24 semanas (mais extensão)', 'Veligrotug intravenoso a cada 3 semanas',
   'Placebo', 'Proporção de respondedores de proptose (redução ≥ 2 mm) na semana 24',
   'Melhora de diplopia; escore de atividade clínica (CAS); qualidade de vida (GO-QoL)',
   'Maioria dos pacientes tratados atingiu resposta de proptose vs. minoria no placebo; melhora consistente da diplopia. [Números demonstrativos]',
   null, null, 'Diferença absoluta relevante na resposta de proptose',
   null, 'p < 0,001', 'IC 95% não sobrepõe o placebo'),

  ('22222222-2222-2222-2222-222222222204',
   'Fase 3', 'Ensaio clínico randomizado aberto', 'Randomizado 1:1',
   'Aberto', true, 620,
   'Pacientes com tumor sólido avançado sem tratamento prévio para doença metastática',
   'Doença mensurável, ECOG 0-1, função orgânica adequada',
   'Mediana de 18 meses', 'Novo esquema combinado',
   'Esquema padrão de referência',
   'Sobrevida livre de progressão (PFS) avaliada por comitê independente',
   'Sobrevida global (OS); taxa de resposta objetiva; segurança',
   'Ganho significativo de PFS a favor do novo esquema; OS ainda imatura (dados iniciais, sem significância). [Números demonstrativos]',
   'HR para PFS ~0,65', null, null, null, 'p < 0,001', 'IC 95% 0,52–0,81 (PFS)')
on conflict (update_id) do nothing;

-- Mecanismo -----------------------------------------------------------------
insert into mechanism_details
  (update_id, drug_class, mechanism_target, mechanism, disease_pathophysiology,
   why_it_works, mechanism_based_adverse_effects)
values
  ('22222222-2222-2222-2222-222222222201',
   'Anticorpo monoclonal', 'Receptor de IGF-1 (IGF-1R)',
   'Bloqueia o receptor IGF-1R nos fibroblastos orbitários.',
   'Na doença ocular da tireoide, os fibroblastos orbitários ficam hiperativados (via IGF-1R e receptor de TSH), aumentando inflamação, produção de glicosaminoglicanos e volume dos tecidos atrás do olho.',
   'Ao bloquear a via do IGF-1R, o medicamento reduz a inflamação orbital, melhora a proptose e pode reduzir a diplopia.',
   'Hiperglicemia, alteração auditiva (zumbido/hipoacusia), cãibras musculares e náusea — coerentes com o papel fisiológico do IGF-1R.'),

  ('22222222-2222-2222-2222-222222222202',
   'Antiviral (inibidor de endonuclease)', 'Endonuclease cap-dependente da polimerase viral (PA)',
   'Inibe a endonuclease cap-dependente do vírus influenza, bloqueando o "cap-snatching" necessário para a transcrição do RNA viral.',
   'O vírus influenza depende de sequestrar caps de RNA do hospedeiro para iniciar a transcrição de seus genes.',
   'Ao bloquear essa etapa inicial, o antiviral interrompe a replicação viral precocemente, com dose única.',
   'Sintomas gastrointestinais leves; preocupação teórica com seleção de variantes de resistência (mutações na PA).')
on conflict (update_id) do nothing;

-- Leitura crítica e Brasil --------------------------------------------------
insert into critical_appraisal
  (update_id, limitations, conflicts_of_interest, funding, critical_interpretation,
   practical_impact, brazil_context, anvisa_status, conitec_status, sus_status,
   brazil_available, changes_practice_now)
values
  ('22222222-2222-2222-2222-222222222201',
   'Amostra relativamente pequena; seguimento de médio prazo; população selecionada (doença ativa moderada a grave).',
   'Estudo patrocinado pela fabricante; parte dos autores com vínculos.',
   'Financiado pela indústria farmacêutica.',
   'Efeito clínico consistente na fase ativa, mas faltam dados de longo prazo e comparação direta com outras terapias-alvo.',
   'Onde aprovado, é uma opção para doença ocular da tireoide ativa moderada a grave. No Brasil, ainda não muda conduta enquanto não houver registro e disponibilidade.',
   'Ainda não disponível no Brasil na data desta análise. Depende de registro na Anvisa e, para acesso ampliado, de avaliação de custo/incorporação.',
   'Pendente (verificar situação atual na Anvisa)', 'Não avaliado', 'Não incorporado',
   false, false),

  ('22222222-2222-2222-2222-222222222202',
   'Benefício clínico modesto em desfechos duros na população geral; risco de resistência viral.',
   'Não aplicável (aprovação de genérico).', 'Não aplicável.',
   'Dose única melhora adesão; a decisão deve considerar grupo de risco, tempo de sintomas e cenário epidemiológico.',
   'Amplia acesso onde aprovado. A conduta muda sobretudo em termos de custo e disponibilidade.',
   'Verificar disponibilidade e aprovação de genéricos no Brasil junto à Anvisa.',
   'Verificar registro do genérico na Anvisa', 'Não avaliado', 'Depende de política local',
   false, false),

  ('22222222-2222-2222-2222-222222222203',
   'Recomendações dependem de contexto de surto e disponibilidade de terapias específicas.',
   'Documento de agência de saúde global.', 'OMS.',
   'Diretriz consolida a melhor prática atual; aplicação depende de recursos locais e treinamento de equipes.',
   'Muda conduta em protocolos de surto e preparação de serviços de referência.',
   'No Brasil, incorporar às rotinas de vigilância e resposta a emergências em saúde; articular com Ministério da Saúde e OPAS.',
   'Não aplicável (diretriz)', 'Não aplicável', 'Incorporável em protocolos de vigilância',
   true, true),

  ('22222222-2222-2222-2222-222222222204',
   'Desenho aberto (risco de viés); OS imatura; seguimento ainda curto para desfecho de mortalidade; PFS é desfecho substituto.',
   'Estudo patrocinado pela fabricante.', 'Financiado pela indústria.',
   'Ganho de PFS é promissor, mas sem OS madura não há certeza de benefício de sobrevida. Avaliar toxicidade e qualidade de vida.',
   'Ainda não muda conduta de forma definitiva. Merece acompanhar a maturação da OS e os dados de segurança.',
   'Verificar aprovação e incorporação no Brasil; decisão sobre uso deve aguardar dados mais maduros e avaliação da CONITEC.',
   'Verificar situação na Anvisa', 'Aguardando avaliação', 'Não incorporado',
   false, false),

  ('22222222-2222-2222-2222-222222222205',
   'Sinais de farmacovigilância exigem confirmação; causalidade nem sempre é definitiva.',
   'Comunicado regulatório.', 'Órgão regulador.',
   'Alertas de segurança e mudanças de bula devem ser aplicados imediatamente, mesmo com incerteza, priorizando a segurança do paciente.',
   'Muda conduta: monitorizar enzimas hepáticas e revisar indicação em pacientes de risco.',
   'Acompanhar comunicados da Anvisa e ajustar bula/monitorização conforme orientação nacional.',
   'Acompanhar comunicados da Anvisa', 'Não aplicável', 'Conforme protocolo',
   true, true)
on conflict (update_id) do nothing;

-- Fontes --------------------------------------------------------------------
insert into sources (update_id, source_name, source_type, url, is_primary, accessed_at, notes)
values
  ('22222222-2222-2222-2222-222222222201',
   'Artigo original (ensaio de fase 3)', 'Artigo original', 'https://pubmed.ncbi.nlm.nih.gov/', true, '2026-07-02',
   'Referência demonstrativa — substituir pelo DOI/PMID real.'),
  ('22222222-2222-2222-2222-222222222201',
   'Comunicado de aprovação (FDA)', 'FDA', 'https://www.fda.gov/', true, '2026-07-02', null),
  ('22222222-2222-2222-2222-222222222202',
   'Bula e registro do genérico', 'Bula', 'https://www.gov.br/anvisa/', true, '2026-07-02',
   'Referência demonstrativa.'),
  ('22222222-2222-2222-2222-222222222202',
   'Ensaio pivotal do baloxavir', 'Artigo original', 'https://pubmed.ncbi.nlm.nih.gov/', true, '2026-07-02', null),
  ('22222222-2222-2222-2222-222222222203',
   'Diretriz OMS — filoviroses', 'OMS', 'https://www.who.int/', true, '2026-07-02',
   'Referência demonstrativa.'),
  ('22222222-2222-2222-2222-222222222204',
   'Ensaio de fase 3 (resultados)', 'Artigo original', 'https://pubmed.ncbi.nlm.nih.gov/', true, '2026-07-01', null),
  ('22222222-2222-2222-2222-222222222204',
   'Registro do ensaio', 'ClinicalTrials.gov', 'https://clinicaltrials.gov/', true, '2026-07-01', null),
  ('22222222-2222-2222-2222-222222222205',
   'Comunicado de segurança (regulador)', 'FDA', 'https://www.fda.gov/', true, '2026-06-30',
   'Referência demonstrativa — substituir pelo comunicado real.'),
  ('22222222-2222-2222-2222-222222222205',
   'Alerta Anvisa (farmacovigilância)', 'Anvisa', 'https://www.gov.br/anvisa/', true, '2026-06-30', null);

-- Tags ----------------------------------------------------------------------
insert into tags (id, name, slug) values
  ('33333333-3333-3333-3333-333333333301', 'Anticorpo monoclonal', 'anticorpo-monoclonal'),
  ('33333333-3333-3333-3333-333333333302', 'Antiviral', 'antiviral'),
  ('33333333-3333-3333-3333-333333333303', 'Diretriz', 'diretriz'),
  ('33333333-3333-3333-3333-333333333304', 'Oncologia', 'oncologia'),
  ('33333333-3333-3333-3333-333333333305', 'Farmacovigilância', 'farmacovigilancia')
on conflict (slug) do nothing;

insert into update_tags (update_id, tag_id) values
  ('22222222-2222-2222-2222-222222222201', '33333333-3333-3333-3333-333333333301'),
  ('22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333302'),
  ('22222222-2222-2222-2222-222222222203', '33333333-3333-3333-3333-333333333303'),
  ('22222222-2222-2222-2222-222222222204', '33333333-3333-3333-3333-333333333304'),
  ('22222222-2222-2222-2222-222222222205', '33333333-3333-3333-3333-333333333305')
on conflict do nothing;

-- Coleta bruta (exemplo) ----------------------------------------------------
insert into raw_updates (title, source_name, source_url, source_type, published_at, raw_summary, raw_payload, status)
values
  ('Exemplo de item coletado automaticamente (PubMed)', 'PubMed',
   'https://pubmed.ncbi.nlm.nih.gov/', 'Artigo original', now(),
   'Item demonstrativo aguardando curadoria editorial.',
   '{"demo": true}'::jsonb, 'pending')
on conflict do nothing;
