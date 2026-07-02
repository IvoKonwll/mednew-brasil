import Link from "next/link";
import { WhatMattersToday } from "@/components/issue";
import { UpdateList } from "@/components/UpdateList";
import { FilterBar } from "@/components/FilterBar";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { EmptyState } from "@/components/EmptyState";
import { ImpactBadge } from "@/components/badges";
import {
  getIssueByDate,
  getRecentUpdates,
  getUpdatesByDate,
  getUpdatesByIssue,
  listIssues,
} from "@/lib/queries";
import { formatFullDate, relativeDateLabel, todayISO } from "@/lib/date";

export const revalidate = 300; // revalida a cada 5 min — o site "se atualiza".

export default async function HomePage() {
  const today = todayISO();
  const issue = await getIssueByDate(today);

  const [todayUpdates, recent, latestIssues] = await Promise.all([
    issue ? getUpdatesByIssue(issue.id) : getUpdatesByDate(today),
    getRecentUpdates(9),
    listIssues(8),
  ]);

  // Destaques do dia: preferência para o "what_matters" do boletim;
  // senão, usa os títulos das atualizações de hoje.
  const highlights =
    issue?.what_matters && issue.what_matters.length > 0
      ? issue.what_matters
      : todayUpdates.slice(0, 5).map((u) => u.short_summary ?? u.title);

  const hasToday = todayUpdates.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      <section className="border-b border-ink-line pb-6">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-navy-500">
          Boletim médico de hoje
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {issue?.title ?? "O que saiu hoje na medicina"}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">{formatFullDate(today)}</p>
        {issue?.intro && (
          <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-soft">
            {issue.intro}
          </p>
        )}
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Coluna principal */}
        <div className="space-y-8">
          {highlights.length > 0 && <WhatMattersToday items={highlights} />}

          <div>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-serif text-2xl font-semibold text-ink">
                Atualizações de hoje
              </h2>
              <Link
                href="/hoje"
                className="text-sm font-medium text-navy-500 hover:text-navy"
              >
                Ver boletim →
              </Link>
            </div>
            {hasToday ? (
              <UpdateList updates={todayUpdates} />
            ) : (
              <EmptyState
                title="O boletim de hoje ainda está em preparação"
                description="Enquanto isso, veja as análises mais recentes abaixo ou explore o arquivo."
                action={
                  <Link
                    href="/ontem"
                    className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                  >
                    Ver boletim de ontem
                  </Link>
                }
              />
            )}
          </div>

          {recent.length > 0 && (
            <div>
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="font-serif text-2xl font-semibold text-ink">
                  Análises recentes
                </h2>
                <Link
                  href="/arquivo"
                  className="text-sm font-medium text-navy-500 hover:text-navy"
                >
                  Últimos 7 dias →
                </Link>
              </div>
              <UpdateList updates={recent} />
            </div>
          )}

          <div className="rounded-lg border border-ink-line bg-paper-card p-5">
            <FilterBar />
          </div>
        </div>

        {/* Lateral */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-ink-line bg-paper-card p-5">
            <h2 className="mb-3 font-serif text-lg font-semibold text-ink">
              Últimos boletins
            </h2>
            {latestIssues.length > 0 ? (
              <ul className="space-y-2">
                {latestIssues.map((it) => (
                  <li key={it.id}>
                    <Link
                      href={`/boletim/${it.issue_date}`}
                      className="flex items-center justify-between gap-2 text-sm text-ink-soft hover:text-navy"
                    >
                      <span className="truncate">
                        {it.title ?? formatFullDate(it.issue_date)}
                      </span>
                      <span className="shrink-0 text-xs text-ink-muted">
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
              className="mt-3 inline-block text-sm font-medium text-navy-500 hover:text-navy"
            >
              Arquivo completo →
            </Link>
          </div>

          <div className="rounded-lg border border-ink-line bg-paper-card p-5">
            <h2 className="mb-3 font-serif text-lg font-semibold text-ink">
              Navegue por impacto
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/muda-conduta" className="flex items-center gap-2 hover:opacity-80">
                  <ImpactBadge level="Muda conduta agora" /> Muda conduta
                </Link>
              </li>
              <li>
                <Link href="/acompanhar" className="flex items-center gap-2 hover:opacity-80">
                  <ImpactBadge level="Merece acompanhar" /> Acompanhar
                </Link>
              </li>
              <li>
                <Link href="/alertas" className="flex items-center gap-2 hover:opacity-80">
                  <ImpactBadge level="Alerta de segurança" /> Alertas
                </Link>
              </li>
            </ul>
          </div>

          <NewsletterSignup />
        </aside>
      </div>
    </div>
  );
}
