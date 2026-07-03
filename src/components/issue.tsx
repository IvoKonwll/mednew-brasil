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
    <div className="border-b-2 border-ink pb-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="kicker">
          Boletim médico de {relativeDateLabel(date).toLowerCase()}
        </p>
        {issue?.issue_number != null && (
          <p className="text-xs uppercase tracking-wider text-ink-muted">
            Edição nº {issue.issue_number}
          </p>
        )}
      </div>
      <h1 className="mt-2 font-serif text-3xl font-bold leading-[1.1] text-ink sm:text-[2.75rem]">
        {issue?.title ?? `Boletim de ${formatFullDate(date)}`}
      </h1>
      <p className="mt-1.5 text-sm text-ink-muted">{formatFullDate(date)}</p>
      {issue?.intro && (
        <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-soft">
          {issue.intro}
        </p>
      )}
    </div>
  );
}

// Bloco "O que realmente importa hoje".
// variant embedded: sem caixa (para colunas laterais/manchete).
export function WhatMattersToday({
  items,
  title = "O que realmente importa hoje",
  embedded = false,
}: {
  items: string[] | null | undefined;
  title?: string;
  embedded?: boolean;
}) {
  if (!items || items.length === 0) return null;

  const list = (
    <>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="font-serif text-base font-bold uppercase tracking-wide text-ink">
          {title}
        </h2>
      </div>
      <ol className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 border-b border-ink-line pb-3 last:border-0 last:pb-0">
            <span className="font-serif text-lg font-bold leading-none text-signal tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[0.92rem] leading-relaxed text-ink-soft">
              {item}
            </span>
          </li>
        ))}
      </ol>
    </>
  );

  if (embedded) return <div>{list}</div>;

  return (
    <section className="rounded-lg border border-ink-line border-l-4 border-l-signal bg-paper-card p-5 shadow-card">
      {list}
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
  const btn =
    "rounded-md border border-ink-line bg-paper-card px-4 py-2.5 text-sm font-semibold text-signal shadow-card transition hover:bg-paper-soft";
  const disabled =
    "rounded-md border border-ink-line/50 px-4 py-2.5 text-sm text-ink-muted/50";

  return (
    <nav className="flex items-center justify-between gap-2 border-t-2 border-ink pt-4">
      {prevDate ? (
        <Link href={`/boletim/${prevDate}`} className={btn}>
          ← Boletim anterior
        </Link>
      ) : (
        <span className={disabled}>← Boletim anterior</span>
      )}

      <Link
        href="/arquivo"
        className="px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink"
      >
        Arquivo
      </Link>

      {nextDate ? (
        <Link href={`/boletim/${nextDate}`} className={btn}>
          Próximo boletim →
        </Link>
      ) : (
        <span className={disabled}>Próximo boletim →</span>
      )}
    </nav>
  );
}
