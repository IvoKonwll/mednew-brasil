import Link from "next/link";
import type { DailyIssue } from "@/lib/types";
import { formatFullDate, relativeDateLabel } from "@/lib/date";

// Hero da edição diária.
export function DailyIssueHero({
  issue,
  date,
}: {
  issue: DailyIssue | null;
  date: string;
}) {
  return (
    <div className="border-b border-ink-line pb-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-navy-500">
          Boletim médico de {relativeDateLabel(date).toLowerCase()}
        </p>
        {issue?.issue_number != null && (
          <p className="text-xs text-ink-muted">Edição nº {issue.issue_number}</p>
        )}
      </div>
      <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl">
        {issue?.title ?? `Boletim de ${formatFullDate(date)}`}
      </h1>
      <p className="mt-1 text-sm text-ink-muted">{formatFullDate(date)}</p>
      {issue?.intro && (
        <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-soft">
          {issue.intro}
        </p>
      )}
    </div>
  );
}

// Bloco "O que realmente importa hoje".
export function WhatMattersToday({
  items,
  title = "O que realmente importa hoje",
}: {
  items: string[] | null | undefined;
  title?: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <section className="rounded-lg border-l-4 border-navy bg-paper-card p-5 shadow-sm">
      <h2 className="mb-3 font-serif text-lg font-semibold text-ink">{title}</h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-ink-soft">
            <span className="mt-0.5 font-serif text-lg font-bold text-navy-500">
              {i + 1}
            </span>
            <span className="text-[0.98rem] leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Navegação entre boletins (anterior / próximo / arquivo).
export function DateNavigator({
  prevDate,
  nextDate,
}: {
  prevDate: string | null;
  nextDate: string | null;
}) {
  return (
    <nav className="flex items-center justify-between gap-2 text-sm">
      {prevDate ? (
        <Link
          href={`/boletim/${prevDate}`}
          className="rounded-md border border-ink-line bg-paper-card px-3 py-2 font-medium text-navy-500 transition hover:bg-paper-soft"
        >
          ← Boletim anterior
        </Link>
      ) : (
        <span className="rounded-md border border-ink-line/50 px-3 py-2 text-ink-muted/50">
          ← Boletim anterior
        </span>
      )}

      <Link
        href="/arquivo"
        className="rounded-md px-3 py-2 font-medium text-ink-muted hover:text-ink"
      >
        Arquivo completo
      </Link>

      {nextDate ? (
        <Link
          href={`/boletim/${nextDate}`}
          className="rounded-md border border-ink-line bg-paper-card px-3 py-2 font-medium text-navy-500 transition hover:bg-paper-soft"
        >
          Próximo boletim →
        </Link>
      ) : (
        <span className="rounded-md border border-ink-line/50 px-3 py-2 text-ink-muted/50">
          Próximo boletim →
        </span>
      )}
    </nav>
  );
}
