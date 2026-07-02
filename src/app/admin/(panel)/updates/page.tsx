import Link from "next/link";
import { adminListUpdates } from "@/lib/admin-queries";
import { AdminUpdatesTable } from "@/components/admin/AdminUpdatesTable";

export const dynamic = "force-dynamic";

export default async function AdminUpdatesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const updates = await adminListUpdates();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-ink">Atualizações</h1>
        <Link
          href="/admin/updates/new"
          className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white shadow-card hover:opacity-90"
        >
          + Nova atualização
        </Link>
      </div>

      <AdminUpdatesTable
        updates={updates}
        initialStatus={searchParams.status ?? ""}
      />
    </div>
  );
}
