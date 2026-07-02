import Link from "next/link";
import { WhatMattersToday } from "@/components/issue";
import { UpdateList } from "@/components/UpdateList";
import { UpdateCard } from "@/components/UpdateCard";
import { FilterBar } from "@/components/FilterBar";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { EmptyState } from "@/components/EmptyState";
import {
  AreaBadge,
  EvidenceBadge,
  ImpactBadge,
  impactColor,
} from "@/components/badges";
import {
  getIssueByDate,
  getRecentUpdates,
  getUpdatesByDate,
  getUpdatesByIssue,
  getUpdatesThatChangePractice,
  getUpdatesToWatch,
  listIssues,
} from "@/lib/queries";
import { formatFullDate, relativeDateLabel, todayISO } from "@/lib/date";
import type { MedicalUpdate } from "@/lib/types";

export const revalidate = 300; // revalida a cada 5 min — o site "se atualiza".

const LEAD_ACCENT: Record<string, string> = {
  muda: "bg-impact-muda",
  acompanhar: "bg-impact-acompanhar",
  alerta: "bg-impact-alerta",
  neutro: "bg-navy",
};

// Manchete principal — tratamento editorial grande.
function LeadStory({ update }: { update: MedicalUpdate }) {
  return (
    <article className="group">
      <span
        className={`mb-3 block h-1 w-16 ${LEAD_ACCENT[impactColor(update.impact_level)]}`}
      />
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <AreaBadge area={update.area} />
        <EvidenceBadge type={update.evidence_type} />
        <ImpactBadge level={update.impact_level} />
      </div>
      <h2 className="font-serif text-3xl font-bold leading-[1.1] text-ink sm:text-[2.6rem]">
        <Link href={`/updates/${update.slug}`} className="hover:text-signal">
          {update.title}
        </Link>
      </h2>
      {update.short_summary && (
        <p className="mt-3 max-w-prose text-lg leading-relaxed text-ink-soft">
          {update.short_summary}
        </p>
      )}
      <Link
        href={`/updates/${update.slug}`}
        className="mt-3 inline-block text-sm font-semibold text-signal hover:text-navy"
      >
        Ler análise completa →
      </Link>
    </article>
  );
}

// Faixa de seção com título editorial e link.
function SectionHead({
  title,
  href,
  linkLabel,
  accent = "ink",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  accent?: "ink" | "muda" | "acompanhar";
}) {
  const borderColor =
    accent === "muda"
      ? "border-impact-muda"
      : accent === "acompanhar"
        ? "border-impact-acompanhar"
        : "border-ink";
  return (
    <div className={`mb-4 flex items-end justify-between border-b-2 pb-2 ${borderColor}`}>
      <h2 className="font-serif text-xl font-bold text-ink">{title}</h2>
      {href && linkLabel && (
        <Link href={href} className="text-sm font-semibold text-signal hover:text-navy">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const today = todayISO();
  const issue = await getIssueByDate(today);

  const [todayUpdates, recent, latestIssues, mudaConduta, acompanhar] =
    await Promise.all([
      issue ? getUpdatesByIssue(issue.id) : getUpdatesByDate(today),
      getRecentUpdates(9),
      listIssues(8),
      getUpdatesThatChangePractice(),
      getUpdatesToWatch(),
    ]);

  // Fonte para a manchete: hoje > recentes.
  const primary = todayUpdates.length > 0 ? todayUpdates : recent;
  const lead = primary[0] ?? null;
  const rest = primary.slice(1, 7);

  const highlights =
    issue?.what_matters && issue.what_matters.length > 0
      ? issue.what_matters
      : primary.slice(0, 5).map((u) => u.short_summary ?? u.title);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Faixa da edição */}
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-line pb-3">
        <p className="kicker">Boletim médico de hoje</p>
        <p className="text-xs text-ink-muted">{formatFullDate(today)}</p>
      </div>

      {lead ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Coluna principal */}
          <div className="min-w-0 space-y-10">
            {/* Manchete + destaques */}
            <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
              <LeadStory update={lead} />
              <div className="md:border-l md:border-ink-line md:pl-6">
                {highlights.length > 0 ? (
                  <WhatMattersToday items={highlights} embedded />
                ) : null}
              </div>
            </div>

            {/* Grid de cards do dia */}
            {rest.length > 0 && (
              <section>
                <SectionHead
                  title="Atualizações de hoje"
                  href="/hoje"
                  linkLabel="Ver boletim"
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  {rest.map((u) => (
                    <UpdateCard key={u.id} update={u} />
                  ))}
                </div>
              </section>
            )}

            {/* Muda conduta agora */}
            {mudaConduta.length > 0 && (
              <section>
                <SectionHead
                  title="Muda conduta agora"
                  href="/muda-conduta"
                  linkLabel="Ver tudo"
                  accent="muda"
                />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {mudaConduta.slice(0, 3).map((u) => (
                    <UpdateCard key={u.id} update={u} />
                  ))}
                </div>
              </section>
            )}

            {/* Merece acompanhar */}
            {acompanhar.length > 0 && (
              <section>
                <SectionHead
                  title="Merece acompanhar"
                  href="/acompanhar"
                  linkLabel="Ver tudo"
                  accent="acompanhar"
                />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {acompanhar.slice(0, 3).map((u) => (
                    <UpdateCard key={u.id} update={u} />
                  ))}
                </div>
              </section>
            )}

            <div className="rounded-lg border border-ink-line bg-paper-card p-5 shadow-card">
              <FilterBar />
            </div>
          </div>

          {/* Lateral */}
          <aside className="space-y-6">
            <div className="rounded-lg border border-ink-line bg-paper-card p-5 shadow-card">
              <SectionHead title="Últimos boletins" />
              {latestIssues.length > 0 ? (
                <ul className="divide-y divide-ink-line">
                  {latestIssues.map((it) => (
                    <li key={it.id}>
                      <Link
                        href={`/boletim/${it.issue_date}`}
                        className="flex items-center justify-between gap-2 py-2.5 text-sm text-ink-soft transition hover:text-signal"
                      >
                        <span className="truncate">
                          {it.title ?? formatFullDate(it.issue_date)}
                        </span>
                        <span className="shrink-0 text-xs text-ink-muted tabular-nums">
                          {relativeDateLabel(it.issue_date)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-muted">
                  Nenhum boletim publicado ainda.
                </p>
              )}
              <Link
                href="/arquivo"
                className="mt-3 inline-block text-sm font-semibold text-signal hover:text-navy"
              >
                Arquivo completo →
              </Link>
            </div>

            <div className="rounded-lg border border-ink-line bg-paper-card p-5 shadow-card">
              <SectionHead title="Por impacto" />
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/muda-conduta" className="flex items-center gap-2 hover:opacity-80">
                    <ImpactBadge level="Muda conduta agora" />
                  </Link>
                </li>
                <li>
                  <Link href="/acompanhar" className="flex items-center gap-2 hover:opacity-80">
                    <ImpactBadge level="Merece acompanhar" />
                  </Link>
                </li>
                <li>
                  <Link href="/alertas" className="flex items-center gap-2 hover:opacity-80">
                    <ImpactBadge level="Alerta de segurança" />
                  </Link>
                </li>
              </ul>
            </div>

            <NewsletterSignup />
          </aside>
        </div>
      ) : (
        <EmptyState
          title="O boletim de hoje ainda está em preparação"
          description="Enquanto isso, explore o arquivo ou o boletim de ontem."
          action={
            <div className="flex justify-center gap-3">
              <Link
                href="/ontem"
                className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Boletim de ontem
              </Link>
              <Link
                href="/arquivo"
                className="rounded-md border border-ink-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-paper-soft"
              >
                Arquivo
              </Link>
            </div>
          }
        />
      )}
    </div>
  );
}
