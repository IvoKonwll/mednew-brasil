import Link from "next/link";
import type { FullMedicalUpdate } from "@/lib/types";
import {
  AreaBadge,
  EvidenceBadge,
  ImpactBadge,
  Pill,
  impactColor,
} from "./badges";
import {
  BrazilContextBox,
  CriticalAppraisalBox,
  MechanismBox,
  ResultsBox,
  SectionBox,
  StudyDesignBox,
} from "./content-boxes";
import { SourceList } from "./SourceList";
import { formatLongDate } from "@/lib/date";
import { IMPACT_META } from "@/lib/constants";

const IMPACT_STRIP: Record<string, string> = {
  muda: "bg-impact-muda",
  acompanhar: "bg-impact-acompanhar",
  alerta: "bg-impact-alerta",
  neutro: "bg-navy",
};

// Renderiza a análise completa. Reutilizado na página pública e no preview admin.
export function UpdateArticle({ update }: { update: FullMedicalUpdate }) {
  const appraisal = update.critical_appraisal;
  const primarySource =
    update.sources.find((s) => s.is_primary) ?? update.sources[0] ?? null;
  const strip = IMPACT_STRIP[impactColor(update.impact_level)];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Trilha de navegação */}
      <nav className="mb-5 text-xs text-ink-muted">
        <Link href="/" className="hover:text-signal">
          Início
        </Link>
        {update.area && (
          <>
            <span className="mx-1.5">/</span>
            <AreaBadge area={update.area} />
          </>
        )}
      </nav>

      {/* A. Cabeçalho */}
      <header className="border-b-2 border-ink pb-6">
        <span className={`mb-4 block h-1 w-16 ${strip}`} />
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <EvidenceBadge type={update.evidence_type} />
          <ImpactBadge level={update.impact_level} />
          {appraisal?.brazil_available === false && (
            <Pill tone="alerta">Brasil pendente</Pill>
          )}
        </div>
        <h1 className="font-serif text-[2.1rem] font-bold leading-[1.1] text-ink sm:text-[2.9rem]">
          {update.title}
        </h1>
        {update.short_summary && (
          <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-soft">
            {update.short_summary}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
          {update.publication_date && (
            <span>{formatLongDate(update.publication_date)}</span>
          )}
          {update.reading_time_minutes ? (
            <span>· {update.reading_time_minutes} min de leitura</span>
          ) : null}
          {update.evidence_strength && (
            <span>· Evidência: {update.evidence_strength}</span>
          )}
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_310px]">
        {/* Coluna principal */}
        <article className="min-w-0 space-y-6">
          {update.what_matters && (
            <div className="rounded-lg border-l-4 border-signal bg-paper-soft/40 p-5">
              <p className="kicker mb-1.5">A mensagem central</p>
              <p className="whitespace-editorial font-serif text-xl leading-relaxed text-ink">
                {update.what_matters}
              </p>
            </div>
          )}

          {update.clinical_context && (
            <SectionBox eyebrow="Contexto" title="Contexto clínico" accent="neutro">
              <p className="whitespace-editorial">{update.clinical_context}</p>
            </SectionBox>
          )}

          <MechanismBox data={update.mechanism_details} />
          <StudyDesignBox data={update.study_details} />
          <ResultsBox data={update.study_details} />
          <CriticalAppraisalBox data={appraisal} />
          <BrazilContextBox data={appraisal} />
          <SourceList sources={update.sources} />

          <p className="rounded-md border border-ink-line bg-paper-soft/60 p-4 text-xs leading-relaxed text-ink-muted">
            Este conteúdo é educacional e não substitui julgamento clínico,
            diretrizes locais, bula oficial, avaliação individual do paciente ou
            decisão compartilhada.
          </p>
        </article>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {update.impact_level && (
            <div className="overflow-hidden rounded-lg border border-ink-line bg-paper-card shadow-card">
              <div className={`h-1.5 w-full ${strip}`} />
              <div className="p-5">
                <p className="kicker mb-2">Impacto prático</p>
                <ImpactBadge level={update.impact_level} />
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {IMPACT_META[update.impact_level]?.short}
                </p>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-ink-line bg-paper-card p-5 shadow-card">
            <p className="kicker mb-3">Ficha da análise</p>

            {update.evidence_type && (
              <div className="mb-4 border-b border-ink-line pb-4">
                <p className="text-xs text-ink-muted">Tipo de evidência</p>
                <div className="mt-1.5">
                  <EvidenceBadge type={update.evidence_type} />
                </div>
              </div>
            )}

            {primarySource && (
              <div className="mb-4 border-b border-ink-line pb-4">
                <p className="text-xs text-ink-muted">Fonte primária</p>
                <a
                  href={primarySource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 block text-sm font-semibold text-signal hover:text-navy"
                >
                  {primarySource.source_name} →
                </a>
              </div>
            )}

            {appraisal && (
              <div className="mb-4 border-b border-ink-line pb-4">
                <p className="text-xs text-ink-muted">Contexto Brasil</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {appraisal.brazil_available !== null && (
                    <Pill tone={appraisal.brazil_available ? "muda" : "alerta"}>
                      {appraisal.brazil_available
                        ? "Disponível"
                        : "Ainda não disponível"}
                    </Pill>
                  )}
                  {appraisal.anvisa_status && (
                    <Pill tone="signal">Anvisa: {appraisal.anvisa_status}</Pill>
                  )}
                </div>
              </div>
            )}

            {update.tags.length > 0 && (
              <div>
                <p className="text-xs text-ink-muted">Tags</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {update.tags.map((tag) => (
                    <Pill key={tag.id}>{tag.name}</Pill>
                  ))}
                </div>
              </div>
            )}
          </div>

          {update.daily_issue?.issue_date && (
            <Link
              href={`/boletim/${update.daily_issue.issue_date}`}
              className="block rounded-lg border border-ink-line bg-paper-card p-4 text-sm font-semibold text-signal shadow-card transition hover:bg-paper-soft"
            >
              ← Ver o boletim desta edição
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}
