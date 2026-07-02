import {
  getAdjacentIssue,
  getIssueByDate,
  getUpdatesByDate,
  getUpdatesByIssue,
} from "@/lib/queries";
import { DailyIssueHero, DateNavigator, WhatMattersToday } from "./issue";
import { UpdateList } from "./UpdateList";
import { EmptyState } from "./EmptyState";
import Link from "next/link";

// Renderiza a edição diária completa de uma data.
// Reutilizado por /hoje, /ontem e /boletim/[date].
export async function IssueView({ date }: { date: string }) {
  const issue = await getIssueByDate(date);

  // Atualizações: preferimos as associadas ao boletim; se não houver boletim,
  // caímos para as publicadas naquela data (o site "se atualiza" por data).
  const updates = issue
    ? await getUpdatesByIssue(issue.id)
    : await getUpdatesByDate(date);

  const [prev, next] = await Promise.all([
    getAdjacentIssue(date, "prev"),
    getAdjacentIssue(date, "next"),
  ]);

  const isEmpty = !issue && updates.length === 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <DailyIssueHero issue={issue} date={date} />

      {isEmpty ? (
        <div className="mt-8">
          <EmptyState
            title="Ainda não há boletim publicado para esta data"
            description="Talvez a edição esteja em preparação. Veja o boletim mais recente ou explore o arquivo."
            action={
              <div className="flex justify-center gap-3">
                <Link
                  href="/arquivo"
                  className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Ver arquivo
                </Link>
              </div>
            }
          />
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {issue?.what_matters && issue.what_matters.length > 0 && (
            <WhatMattersToday items={issue.what_matters} />
          )}

          <div>
            <h2 className="mb-4 font-serif text-2xl font-semibold text-ink">
              Atualizações da edição
            </h2>
            <UpdateList
              updates={updates}
              emptyTitle="Sem atualizações nesta edição"
              emptyDescription="O boletim foi publicado, mas ainda não há análises associadas."
            />
          </div>
        </div>
      )}

      <div className="mt-10">
        <DateNavigator
          prevDate={prev?.issue_date ?? null}
          nextDate={next?.issue_date ?? null}
        />
      </div>
    </div>
  );
}
