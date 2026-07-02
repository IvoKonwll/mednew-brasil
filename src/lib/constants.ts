// Constantes de domínio do "Muda Conduta?".
// Centralizam vocabulário editorial usado no site e no painel admin.

export const SITE = {
  name: "Muda Conduta?",
  subtitle:
    "Avanços médicos explicados por evidência, mecanismo e impacto prático.",
  description:
    "Jornal médico digital brasileiro. Boletins diários sobre os principais avanços da medicina no mundo: o que saiu, como funciona, como foi estudado, qual evidência sustenta e se muda conduta no Brasil.",
  disclaimer:
    "Este conteúdo é educacional e não substitui julgamento clínico, diretrizes locais, bula oficial, avaliação individual do paciente ou decisão compartilhada.",
} as const;

// -----------------------------------------------------------------------------
// Áreas médicas
// -----------------------------------------------------------------------------

export const MEDICAL_AREAS = [
  "Cardiologia",
  "Oncologia",
  "Infectologia",
  "Gastroenterologia",
  "Cirurgia",
  "Endocrinologia",
  "Neurologia",
  "Pediatria",
  "Ginecologia e Obstetrícia",
  "Reumatologia",
  "Nefrologia",
  "Pneumologia",
  "Dermatologia",
  "Psiquiatria",
  "Hematologia",
  "Medicina Intensiva",
  "Emergência",
  "Saúde Pública",
  "Oftalmologia",
  "Otorrinolaringologia",
  "Urologia",
  "Ortopedia",
  "Radiologia",
  "Outros",
] as const;

export type MedicalArea = (typeof MEDICAL_AREAS)[number];

// -----------------------------------------------------------------------------
// Tipos de evidência
// -----------------------------------------------------------------------------

export const EVIDENCE_TYPES = [
  "Diretriz",
  "Aprovação regulatória",
  "Ensaio clínico randomizado fase 3",
  "Ensaio clínico randomizado fase 2",
  "Ensaio clínico fase 1",
  "Estudo observacional",
  "Coorte",
  "Caso-controle",
  "Série de casos",
  "Revisão sistemática/metanálise",
  "Estudo animal/in vitro",
  "Alerta de segurança",
  "Retratação",
  "Opinião/consenso",
] as const;

export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

// Força de evidência (hierarquia editorial simplificada)
export const EVIDENCE_STRENGTHS = [
  "Alta",
  "Moderada",
  "Baixa",
  "Preliminar",
] as const;

export type EvidenceStrength = (typeof EVIDENCE_STRENGTHS)[number];

// -----------------------------------------------------------------------------
// Impacto prático
// -----------------------------------------------------------------------------

export const IMPACT_LEVELS = [
  "Muda conduta agora",
  "Muda apenas onde aprovado",
  "Merece acompanhar",
  "Não muda conduta ainda",
  "Alerta de segurança",
] as const;

export type ImpactLevel = (typeof IMPACT_LEVELS)[number];

// Mapeia impacto -> cor semântica (Tailwind token) e descrição curta.
export const IMPACT_META: Record<
  ImpactLevel,
  { color: "muda" | "acompanhar" | "alerta" | "neutro"; short: string }
> = {
  "Muda conduta agora": {
    color: "muda",
    short: "Evidência suficiente para mudar a prática já.",
  },
  "Muda apenas onde aprovado": {
    color: "muda",
    short: "Muda a prática onde há aprovação e disponibilidade.",
  },
  "Merece acompanhar": {
    color: "acompanhar",
    short: "Promissor, mas ainda não muda a conduta.",
  },
  "Não muda conduta ainda": {
    color: "neutro",
    short: "Sem impacto prático imediato.",
  },
  "Alerta de segurança": {
    color: "alerta",
    short: "Sinal de segurança que exige atenção.",
  },
};

// -----------------------------------------------------------------------------
// Status editorial
// -----------------------------------------------------------------------------

export const CONTENT_STATUSES = [
  "draft",
  "review",
  "published",
  "archived",
] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "Rascunho",
  review: "Em revisão",
  published: "Publicado",
  archived: "Arquivado",
};

// -----------------------------------------------------------------------------
// Tipos de fonte
// -----------------------------------------------------------------------------

export const SOURCE_TYPES = [
  "Artigo original",
  "Diretriz",
  "FDA",
  "EMA",
  "Anvisa",
  "OMS",
  "CDC",
  "NICE",
  "ClinicalTrials.gov",
  "Bula",
  "Jornalístico complementar",
] as const;

export type SourceType = (typeof SOURCE_TYPES)[number];

// Fontes consideradas primárias por padrão.
export const PRIMARY_SOURCE_TYPES: SourceType[] = [
  "Artigo original",
  "Diretriz",
  "FDA",
  "EMA",
  "Anvisa",
  "OMS",
  "CDC",
  "NICE",
  "ClinicalTrials.gov",
  "Bula",
];

// -----------------------------------------------------------------------------
// Navegação por tipo de evidência (slugs amigáveis nas URLs /evidencias/[type])
// -----------------------------------------------------------------------------

export const EVIDENCE_SLUG_MAP: Record<string, EvidenceType[]> = {
  diretrizes: ["Diretriz"],
  "aprovacao-regulatoria": ["Aprovação regulatória"],
  "fase-3": ["Ensaio clínico randomizado fase 3"],
  "fase-2": ["Ensaio clínico randomizado fase 2"],
  observacional: ["Estudo observacional", "Coorte", "Caso-controle"],
  metanalise: ["Revisão sistemática/metanálise"],
  "alerta-seguranca": ["Alerta de segurança", "Retratação"],
};

export const EVIDENCE_SLUG_LABELS: Record<string, string> = {
  diretrizes: "Diretrizes",
  "aprovacao-regulatoria": "Aprovação regulatória",
  "fase-3": "Ensaios de fase 3",
  "fase-2": "Ensaios de fase 2",
  observacional: "Estudos observacionais",
  metanalise: "Revisões sistemáticas e metanálises",
  "alerta-seguranca": "Alertas de segurança",
};

// Impactos considerados "muda conduta" (página /muda-conduta)
export const CHANGES_PRACTICE_IMPACTS: ImpactLevel[] = [
  "Muda conduta agora",
  "Muda apenas onde aprovado",
];

// Impactos considerados "acompanhar" (página /acompanhar)
export const WATCH_IMPACTS: ImpactLevel[] = [
  "Merece acompanhar",
  "Não muda conduta ainda",
];

// Helper: converte área/label em slug de URL.
export function toSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Mapa area-slug -> area (para /areas/[area])
export const AREA_SLUG_MAP: Record<string, MedicalArea> = Object.fromEntries(
  MEDICAL_AREAS.map((area) => [toSlug(area), area]),
) as Record<string, MedicalArea>;
