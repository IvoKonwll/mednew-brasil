import Link from "next/link";
import type { DailyIssue } from "@/lib/types";
import { formatLongDate, relativeDateLabel } from "@/lib/date";
import { EmptyState } from "./EmptyState";

// Lista de boletins agrupados por mês (arquivo).
export function ArchiveCalendar({ issues }: { issues: DailyIssue[] }) {
  if (issues.length === 0) {
    return (
      <EmptyState
        title="Nenhum boletim publicado ainda"
        description="Quando o primeiro boletim for publicado, ele aparece aqui organizado por data."
      />
    );
  }

  // Agrupa por "YYYY-MM".
  const groups = new Map<string, DailyIssue[]>();
  for (const issue of issues) {
    const key = issue.issue_date.slice(0, 7);
    const list = groups.get(key) ?? [];
    list.push(issue);
    groups.set(key, list);
  }

  const monthLabel = (key: string) => {
    const [y, m] = key.split("-").map(Number);
    const label = new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(y, m - 1, 1, 12)));
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  return (
    <div className="space-y-8">
      {Array.from(groups.entries()).map(([month, monthIssues]) => (
        <section key={month}>
          <h2 className="mb-3 font-serif text-lg font-semibold text-ink">
            {monthLabel(month)}
          </h2>
          <ul className="divide-y divide-ink-line rounded-lg border border-ink-line bg-paper-card">
            {monthIssues.map((issue) => (
              <li key={issue.id}>
                <Link
                  href={`/boletim/${issue.issue_date}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-paper-soft"
                >
                  <div>
                    <p className="font-medium text-ink">
                      {issue.title ?? formatLongDate(issue.issue_date)}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {formatLongDate(issue.issue_date)}
                      {issue.issue_number != null
                        ? ` · Edição nº ${issue.issue_number}`
                        : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-navy-500">
                    {relativeDateLabel(issue.issue_date)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
