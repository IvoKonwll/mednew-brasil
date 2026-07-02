import Link from "next/link";
import { adminListUpdates } from "@/lib/admin-queries";
import { AdminTable } from "@/components/admin/AdminTable";
import { StatusBadge, ImpactBadge } from "@/components/badges";
import { RowActions } from "@/components/admin/RowActions";

export const dynamic = "force-dynamic";

export default async function AdminUpdatesPage() {
  const updates = await adminListUpdates();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-ink">Atualizações</h1>
        <Link
          href="/admin/updates/new"
          className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          + Nova atualização
        </Link>
      </div>

      <AdminTable
        headers={["Título", "Área", "Impacto", "Status", "Ações"]}
        empty={updates.length === 0}
      >
        {updates.map((u) => (
          <tr key={u.id} className="hover:bg-paper-soft/40">
            <td className="px-4 py-3 font-medium text-ink">{u.title}</td>
            <td className="px-4 py-3 text-ink-soft">{u.area ?? "—"}</td>
            <td className="px-4 py-3">
              <ImpactBadge level={u.impact_level} />
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={u.status} />
            </td>
            <td className="px-4 py-3">
              <RowActions
                id={u.id}
                status={u.status}
                type="update"
                editHref={`/admin/updates/edit/${u.id}`}
              />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
