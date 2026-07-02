import Link from "next/link";
import { adminCounts } from "@/lib/admin-queries";
import { todayISO } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const counts = await adminCounts();

  const stats = [
    { label: "Boletins", value: counts.issues, href: "/admin/boletins" },
    { label: "Atualizações", value: counts.updates, href: "/admin/updates" },
    { label: "Publicadas", value: counts.published, href: "/admin/updates" },
    { label: "Coleta pendente", value: counts.rawPending, href: "/admin/raw" },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink">Painel editorial</h1>
      <p className="mt-1 text-ink-muted">
        Gerencie boletins diários e atualizações médicas.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-lg border border-ink-line bg-paper-card p-4 transition hover:border-navy/40"
          >
            <p className="text-3xl font-bold text-navy">{s.value}</p>
            <p className="text-sm text-ink-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/boletins/new"
          className="rounded-lg border border-ink-line bg-paper-card p-5 transition hover:border-navy/40"
        >
          <h2 className="font-serif text-lg font-semibold text-ink">
            Novo boletim diário
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Crie a edição de hoje ({todayISO()}) e associe atualizações.
          </p>
        </Link>
        <Link
          href="/admin/updates/new"
          className="rounded-lg border border-ink-line bg-paper-card p-5 transition hover:border-navy/40"
        >
          <h2 className="font-serif text-lg font-semibold text-ink">
            Nova atualização médica
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Escreva uma análise completa: evidência, mecanismo, Brasil e fontes.
          </p>
        </Link>
      </div>
    </div>
  );
}
