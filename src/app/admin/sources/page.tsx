import Link from "next/link";
import { adminListSources } from "@/lib/admin-queries";
import { AdminTable } from "@/components/admin/AdminTable";
import { Pill } from "@/components/badges";

export const dynamic = "force-dynamic";

export default async function AdminSourcesPage() {
  const sources = await adminListSources();

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink">Fontes</h1>
      <p className="mt-1 text-ink-muted">
        Todas as fontes cadastradas nas atualizações. Edite as fontes dentro de
        cada atualização.
      </p>

      <div className="mt-6">
        <AdminTable
          headers={["Fonte", "Tipo", "Atualização", "Primária"]}
          empty={sources.length === 0}
        >
          {sources.map((s) => (
            <tr key={s.id} className="hover:bg-paper-soft/40">
              <td className="px-4 py-3 font-medium text-ink">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy-500 hover:underline"
                >
                  {s.source_name}
                </a>
              </td>
              <td className="px-4 py-3 text-ink-soft">{s.source_type}</td>
              <td className="px-4 py-3 text-ink-soft">
                {s.update ? (
                  <Link
                    href={`/updates/${s.update.slug}`}
                    className="hover:underline"
                  >
                    {s.update.title}
                  </Link>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3">
                {s.is_primary ? <Pill tone="muda">Primária</Pill> : "—"}
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}
