import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUpdateBySlug } from "@/lib/queries";
import {
  AreaBadge,
  EvidenceBadge,
  ImpactBadge,
  Pill,
} from "@/components/badges";
import {
  BrazilContextBox,
  CriticalAppraisalBox,
  MechanismBox,
  SectionBox,
  StudyDesignBox,
} from "@/components/content-boxes";
import { SourceList } from "@/components/SourceList";
import { formatLongDate } from "@/lib/date";
import { IMPACT_META } from "@/lib/constants";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const update = await getUpdateBySlug(params.slug);
  if (!update) return { title: "Atualização não encontrada" };
  return {
    title: update.title,
    description: update.short_summary ?? update.what_matters ?? undefined,
    openGraph: {
      title: update.title,
      description: update.short_summary ?? undefined,
      type: "article",
    },
  };
}

export default async function UpdatePage({
  params,
}: {
  params: { slug: string };
}) {
  const update = await getUpdateBySlug(params.slug);
  if (!update) notFound();

  const appraisal = update.critical_appraisal;
  const primarySource =
    update.sources.find((s) => s.is_primary) ?? update.sources[0] ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* A. Cabeçalho */}
      <header className="border-b border-ink-line pb-6">
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <AreaBadge area={update.area} />
          <EvidenceBadge type={update.evidence_type} />
          <ImpactBadge level={update.impact_level} />
          {appraisal?.brazil_available === false && (
            <Pill tone="alerta">Brasil pendente</Pill>
          )}
        </div>
        <h1 className="font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {update.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
          {update.publication_date && (
            <span>{formatLongDate(update.publication_date)}</span>
          )}
          {update.reading_time_minutes && (
            <span>· {update.reading_time_minutes} min de leitura</span>
          )}
          {update.evidence_strength && (
            <span>· Evidência: {update.evidence_strength}</span>
          )}
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Coluna principal */}
        <article className="min-w-0 space-y-6">
          {/* B. O que realmente importa */}
          {update.what_matters && (
            <SectionBox
              eyebrow="A mensagem central"
              title="O que realmente importa"
              accent="navy"
            >
              <p className="whitespace-editorial text-lg">{update.what_matters}</p>
            </SectionBox>
          )}

          {/* C. Contexto clínico */}
          {update.clinical_context && (
            <SectionBox eyebrow="Contexto" title="Contexto clínico" accent="neutro">
              <p className="whitespace-editorial">{update.clinical_context}</p>
            </SectionBox>
          )}

          {/* D. Como funciona no corpo */}
          <MechanismBox data={update.mechanism_details} />

          {/* E + F. Como a pesquisa foi feita / Resultados */}
          <StudyDesignBox data={update.study_details} />

          {/* G. Limitações e leitura crítica */}
          <CriticalAppraisalBox data={appraisal} />

          {/* H + I. Impacto prático e Brasil */}
          <BrazilContextBox data={appraisal} />

          {/* J. Fontes */}
          <SourceList sources={update.sources} />

          <p className="rounded-md bg-paper-soft/60 p-4 text-xs leading-relaxed text-ink-muted">
            Este conteúdo é educacional e não substitui julgamento clínico,
            diretrizes locais, bula oficial, avaliação individual do paciente ou
            decisão compartilhada.
          </p>
        </article>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-lg border border-ink-line bg-paper-card p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Resumo
            </h2>

            {update.impact_level && (
              <div className="mb-4">
                <p className="text-xs text-ink-muted">Impacto prático</p>
                <div className="mt-1">
                  <ImpactBadge level={update.impact_level} />
                </div>
                <p className="mt-1 text-xs text-ink-soft">
                  {IMPACT_META[update.impact_level]?.short}
                </p>
              </div>
            )}

            {update.evidence_type && (
              <div className="mb-4">
                <p className="text-xs text-ink-muted">Tipo de evidência</p>
                <div className="mt-1">
                  <EvidenceBadge type={update.evidence_type} />
                </div>
              </div>
            )}

            {primarySource && (
              <div className="mb-4">
                <p className="text-xs text-ink-muted">Fonte primária</p>
                <a
                  href={primarySource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-sm font-medium text-navy-500 hover:text-navy"
                >
                  {primarySource.source_name} →
                </a>
              </div>
            )}

            {appraisal && (
              <div className="mb-4">
                <p className="text-xs text-ink-muted">Brasil</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {appraisal.brazil_available !== null && (
                    <Pill tone={appraisal.brazil_available ? "muda" : "alerta"}>
                      {appraisal.brazil_available
                        ? "Disponível"
                        : "Ainda não disponível"}
                    </Pill>
                  )}
                  {appraisal.anvisa_status && (
                    <Pill tone="navy">Anvisa: {appraisal.anvisa_status}</Pill>
                  )}
                </div>
              </div>
            )}

            {update.tags.length > 0 && (
              <div>
                <p className="text-xs text-ink-muted">Tags</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
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
              className="block rounded-lg border border-ink-line bg-paper-card p-4 text-sm text-navy-500 transition hover:bg-paper-soft"
            >
              ← Ver o boletim desta edição
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}
