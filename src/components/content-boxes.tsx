import type {
  CriticalAppraisal,
  MechanismDetails,
  StudyDetails,
} from "@/lib/types";
import { Pill } from "./badges";

// Bloco de seção destacado, estilo jornal: barra de acento + olho + título.
export function SectionBox({
  title,
  eyebrow,
  children,
  accent = "navy",
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  accent?: "navy" | "signal" | "muda" | "alerta" | "acompanhar" | "neutro";
}) {
  const accentBar: Record<string, string> = {
    navy: "bg-navy",
    signal: "bg-signal",
    muda: "bg-impact-muda",
    alerta: "bg-impact-alerta",
    acompanhar: "bg-impact-acompanhar",
    neutro: "bg-impact-neutro",
  };
  const eyebrowColor: Record<string, string> = {
    navy: "text-navy",
    signal: "text-signal",
    muda: "text-impact-muda",
    alerta: "text-impact-alerta",
    acompanhar: "text-impact-acompanhar",
    neutro: "text-ink-muted",
  };
  return (
    <section className="overflow-hidden rounded-lg border border-ink-line bg-paper-card shadow-card">
      <div className="flex items-stretch">
        <span className={`w-1 shrink-0 ${accentBar[accent]}`} />
        <div className="min-w-0 flex-1 p-5 sm:p-6">
          {eyebrow && (
            <p
              className={`mb-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] ${eyebrowColor[accent]}`}
            >
              {eyebrow}
            </p>
          )}
          <h2 className="mb-3 font-serif text-[1.4rem] font-bold text-ink">
            {title}
          </h2>
          <div className="editorial-prose text-[1rem]">{children}</div>
        </div>
      </div>
    </section>
  );
}

// Linha rótulo/valor reutilizável.
function Field({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | null | undefined;
}) {
  if (value === null || value === undefined || value === "") return null;
  const display =
    typeof value === "boolean" ? (value ? "Sim" : "Não") : String(value);
  return (
    <div className="flex flex-col gap-0.5 border-b border-ink-line/60 py-2 last:border-0 sm:flex-row sm:gap-3">
      <dt className="w-52 shrink-0 text-sm font-medium text-ink-muted">
        {label}
      </dt>
      <dd className="text-sm text-ink-soft whitespace-editorial">{display}</dd>
    </div>
  );
}

function Paragraph({ text }: { text: string | null | undefined }) {
  if (!text) return null;
  return <p className="whitespace-editorial">{text}</p>;
}

// D. Como funciona no corpo
export function MechanismBox({ data }: { data: MechanismDetails | null }) {
  if (!data) return null;
  const hasContent =
    data.drug_class ||
    data.mechanism_target ||
    data.mechanism ||
    data.disease_pathophysiology ||
    data.why_it_works ||
    data.mechanism_based_adverse_effects;
  if (!hasContent) return null;

  return (
    <SectionBox eyebrow="Mecanismo" title="Como funciona no corpo" accent="signal">
      <dl className="not-prose mb-3">
        <Field label="Classe" value={data.drug_class} />
        <Field label="Alvo molecular / fisiológico" value={data.mechanism_target} />
      </dl>
      <Paragraph text={data.mechanism} />
      {data.disease_pathophysiology && (
        <>
          <h3>Fisiopatologia da doença</h3>
          <Paragraph text={data.disease_pathophysiology} />
        </>
      )}
      {data.why_it_works && (
        <>
          <h3>Por que isso melhora a doença</h3>
          <Paragraph text={data.why_it_works} />
        </>
      )}
      {data.mechanism_based_adverse_effects && (
        <>
          <h3>Efeitos adversos esperados pelo mecanismo</h3>
          <Paragraph text={data.mechanism_based_adverse_effects} />
        </>
      )}
    </SectionBox>
  );
}

// E. Como a pesquisa foi feita
export function StudyDesignBox({ data }: { data: StudyDetails | null }) {
  if (!data) return null;

  const designFields: Array<[string, string | number | boolean | null]> = [
    ["Fase do estudo", data.study_phase],
    ["Desenho", data.study_design],
    ["Randomização", data.randomization],
    ["Cegamento", data.blinding],
    ["Multicêntrico", data.multicenter],
    ["Tamanho da amostra", data.sample_size],
    ["População", data.population],
    ["Critérios de inclusão", data.inclusion_criteria],
    ["Seguimento", data.follow_up],
    ["Intervenção", data.intervention],
    ["Grupo controle", data.control_group],
    ["Desfecho primário", data.primary_outcome],
    ["Desfechos secundários", data.secondary_outcomes],
  ];

  const hasDesign = designFields.some(
    ([, v]) => v !== null && v !== "" && v !== undefined,
  );
  if (!hasDesign && !data.main_results) return null;

  return (
    <SectionBox eyebrow="Método" title="Como a pesquisa foi feita" accent="navy">
      {hasDesign && (
        <dl className="not-prose mb-4">
          {designFields.map(([label, value]) => (
            <Field key={label} label={label} value={value} />
          ))}
        </dl>
      )}

      {data.main_results && (
        <>
          <h3>Como interpretar o resultado</h3>
          <Paragraph text={data.main_results} />
        </>
      )}
    </SectionBox>
  );
}

// F. Resultados que importam — grade de "stat tiles" para leitura rápida.
export function ResultsBox({ data }: { data: StudyDetails | null }) {
  if (!data) return null;

  const stats: Array<[string, string | null]> = [
    ["Hazard ratio (HR)", data.hazard_ratio],
    ["Risco relativo (RR)", data.relative_risk],
    ["Odds ratio (OR)", data.odds_ratio],
    ["Redução absoluta", data.absolute_risk_reduction],
    ["NNT", data.nnt],
    ["Tamanho de efeito", data.effect_size],
    ["Valor de p", data.p_value],
    ["IC 95%", data.confidence_interval],
  ];

  const present = stats.filter(([, v]) => v);
  if (present.length === 0) return null;

  return (
    <SectionBox
      eyebrow="Desfechos"
      title="Resultados que importam"
      accent="signal"
    >
      <div className="not-prose grid grid-cols-2 gap-3 sm:grid-cols-3">
        {present.map(([label, value]) => (
          <div
            key={label}
            className="rounded-md border border-ink-line bg-paper-soft/40 p-3"
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-muted">
              {label}
            </p>
            <p className="mt-1 font-serif text-lg font-bold leading-tight text-ink">
              {value}
            </p>
          </div>
        ))}
      </div>
    </SectionBox>
  );
}

// G. Limitações e leitura crítica
export function CriticalAppraisalBox({
  data,
}: {
  data: CriticalAppraisal | null;
}) {
  if (!data) return null;
  const hasContent =
    data.limitations ||
    data.conflicts_of_interest ||
    data.funding ||
    data.critical_interpretation;
  if (!hasContent) return null;

  return (
    <SectionBox
      eyebrow="Leitura crítica"
      title="Limitações e leitura crítica"
      accent="acompanhar"
    >
      {data.limitations && (
        <>
          <h3>Limitações</h3>
          <Paragraph text={data.limitations} />
        </>
      )}
      {data.critical_interpretation && (
        <>
          <h3>Interpretação crítica</h3>
          <Paragraph text={data.critical_interpretation} />
        </>
      )}
      <dl className="not-prose mt-3">
        <Field label="Conflitos de interesse" value={data.conflicts_of_interest} />
        <Field label="Financiamento" value={data.funding} />
      </dl>
    </SectionBox>
  );
}

// I. Contexto no Brasil
export function BrazilContextBox({
  data,
}: {
  data: CriticalAppraisal | null;
}) {
  if (!data) return null;
  const hasContent =
    data.brazil_context ||
    data.anvisa_status ||
    data.conitec_status ||
    data.sus_status ||
    data.brazil_available !== null ||
    data.practical_impact;
  if (!hasContent) return null;

  return (
    <SectionBox eyebrow="Brasil" title="Contexto no Brasil" accent="muda">
      {data.practical_impact && (
        <>
          <h3>O que significa na prática</h3>
          <Paragraph text={data.practical_impact} />
        </>
      )}
      <Paragraph text={data.brazil_context} />
      <div className="not-prose mt-3 flex flex-wrap gap-2">
        {data.brazil_available !== null && (
          <Pill tone={data.brazil_available ? "muda" : "alerta"}>
            {data.brazil_available
              ? "Disponível no Brasil"
              : "Ainda não disponível no Brasil"}
          </Pill>
        )}
        {data.changes_practice_now !== null && (
          <Pill tone={data.changes_practice_now ? "muda" : "neutral"}>
            {data.changes_practice_now
              ? "Muda conduta agora"
              : "Não muda conduta agora"}
          </Pill>
        )}
      </div>
      <dl className="not-prose mt-3">
        <Field label="Situação na Anvisa" value={data.anvisa_status} />
        <Field label="CONITEC" value={data.conitec_status} />
        <Field label="SUS" value={data.sus_status} />
      </dl>
    </SectionBox>
  );
}
