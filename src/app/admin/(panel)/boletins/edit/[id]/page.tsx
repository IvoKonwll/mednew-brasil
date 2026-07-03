import Link from "next/link";
import { notFound } from "next/navigation";
import {
  adminGetIssue,
  adminGetIssueUpdates,
  adminListUpdates,
} from "@/lib/admin-queries";
import { IssueForm } from "@/components/admin/IssueForm";
import { IssueUpdatesManager } from "@/components/admin/IssueUpdatesManager";
import { StatusBadge } from "@/components/badges";

export const dynamic = "force-dynamic";

export default async function EditIssuePage({
  params,
}: {
  params: { id: string };
}) {
  const [issue, associated, allUpdates] = await Promise.all([
    adminGetIssue(params.id),
    adminGetIssueUpdates(params.id),
    adminListUpdates(),
  ]);
  if (!issue) notFound();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-2xl font-bold text-ink">
            Editar boletim
          </h1>
          <StatusBadge status={issue.status} />
        </div>
        <Link
          href={`/boletim/${issue.issue_date}`}
          target="_blank"
          className="rounded-md border border-ink-line px-3 py-2 text-sm font-semibold text-signal hover:bg-paper-soft"
        >
          Ver no site ↗
        </Link>
      </div>

      {/* Dados da edição */}
      <section>
        <h2 className="mb-3 font-serif text-lg font-bold text-ink">
          1. Dados da edição
        </h2>
        <IssueForm issue={issue} />
      </section>

      {/* Composição da edição */}
      <section className="rounded-lg border border-ink-line bg-paper-card p-5 shadow-card">
        <h2 className="mb-1 font-serif text-lg font-bold text-ink">
          2. Montar a edição
        </h2>
        <p className="mb-4 text-sm text-ink-muted">
          Associe as atualizações desta edição e ordene por relevância.
        </p>
        <IssueUpdatesManager
          issueId={issue.id}
          allUpdates={allUpdates}
          associatedIds={associated.map((u) => u.id)}
        />
      </section>
    </div>
  );
}
