import Link from "next/link";
import { adminListIssues } from "@/lib/admin-queries";
import { AdminTable } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/badges";
import { RowActions } from "@/components/admin/RowActions";
import { formatShortDate } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function AdminBoletinsPage() {
  const issues = await adminListIssues();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-ink">Boletins</h1>
        <Link
          href="/admin/boletins/new"
          className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          + Novo boletim
        </Link>
      </div>

      <AdminTable
        headers={["Data", "Título", "Nº", "Status", "Ações"]}
        empty={issues.length === 0}
      >
        {issues.map((issue) => (
          <tr key={issue.id} className="hover:bg-paper-soft/40">
            <td className="px-4 py-3 font-medium text-ink">
              {formatShortDate(issue.issue_date)}
            </td>
            <td className="px-4 py-3 text-ink-soft">{issue.title ?? "—"}</td>
            <td className="px-4 py-3 text-ink-muted">
              {issue.issue_number ?? "—"}
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={issue.status} />
            </td>
            <td className="px-4 py-3">
              <RowActions
                id={issue.id}
                status={issue.status}
                type="issue"
                editHref={`/admin/boletins/edit/${issue.id}`}
              />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
