import { adminListRaw } from "@/lib/admin-queries";
import { AdminTable } from "@/components/admin/AdminTable";
import { RawActions } from "@/components/admin/RawActions";
import { Pill } from "@/components/badges";

export const dynamic = "force-dynamic";

export default async function AdminRawPage() {
  const items = await adminListRaw();

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink">Coleta bruta</h1>
      <p className="mt-1 max-w-prose text-ink-muted">
        Itens coletados automaticamente pelas futuras integrações (PubMed, FDA,
        EMA, OMS, Anvisa, CDC, NICE, ClinicalTrials.gov) chegam aqui como
        rascunhos brutos, para curadoria antes de virarem atualizações.
      </p>

      <div className="mt-6">
        <AdminTable
          headers={["Título", "Fonte", "Publicado", "Status", "Ações"]}
          empty={items.length === 0}
        >
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-paper-soft/40">
              <td className="px-4 py-3 font-medium text-ink">
                {item.source_url ? (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy-500 hover:underline"
                  >
                    {item.title ?? "(sem título)"}
                  </a>
                ) : (
                  (item.title ?? "(sem título)")
                )}
              </td>
              <td className="px-4 py-3 text-ink-soft">
                {item.source_name ?? "—"}
              </td>
              <td className="px-4 py-3 text-ink-muted">
                {item.published_at?.slice(0, 10) ?? "—"}
              </td>
              <td className="px-4 py-3">
                <Pill
                  tone={
                    item.status === "reviewed"
                      ? "muda"
                      : item.status === "discarded"
                        ? "alerta"
                        : "neutral"
                  }
                >
                  {item.status}
                </Pill>
              </td>
              <td className="px-4 py-3">
                <RawActions id={item.id} />
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}
