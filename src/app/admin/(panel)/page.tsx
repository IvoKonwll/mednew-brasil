import Link from "next/link";
import { adminEditorialSnapshot } from "@/lib/admin-queries";
import { StatusBadge } from "@/components/badges";
import { formatLongDate, todayISO } from "@/lib/date";
import { DailyPublishControls } from "@/components/admin/DailyPublishControls";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const today = todayISO();
  const snap = await adminEditorialSnapshot(today);
  const issue = snap.todayIssue;

  const stats = [
    { label: "Rascunhos", value: snap.draft, href: "/admin/updates?status=draft", tone: "text-ink-muted" },
    { label: "Em revisão", value: snap.review, href: "/admin/updates?status=review", tone: "text-impact-acompanhar" },
    { label: "Publicados", value: snap.published, href: "/admin/updates?status=published", tone: "text-impact-muda" },
    { label: "Arquivados", value: snap.archived, href: "/admin/updates?status=archived", tone: "text-ink-muted" },
  ];

  // Próximos passos editoriais (checklist derivado do estado atual).
  const steps: { done: boolean; label: string; href: string }[] = [
    {
      done: !!issue,
      label: issue ? "Edição de hoje criada" : "Criar a edição de hoje",
      href: issue ? `/admin/boletins/edit/${issue.id}` : "/admin/boletins/new",
    },
    {
      done: !!issue?.intro,
      label: "Escrever a introdução do boletim",
      href: issue ? `/admin/boletins/edit/${issue.id}` : "/admin/boletins/new",
    },
    {
      done: !!(issue?.what_matters && issue.what_matters.length >= 3),
      label: "Adicionar 3 a 5 itens em “O que realmente importa hoje”",
      href: issue ? `/admin/boletins/edit/${issue.id}` : "/admin/boletins/new",
    },
    {
      done: snap.review === 0 && snap.draft === 0,
      label:
        snap.review > 0
          ? `Revisar ${snap.review} atualização(ões) em revisão`
          : snap.draft > 0
            ? `Finalizar ${snap.draft} rascunho(s)`
            : "Sem pendências de conteúdo",
      href: "/admin/updates",
    },
    {
      done: issue?.status === "published",
      label: "Publicar o boletim de hoje",
      href: issue ? `/admin/boletins/edit/${issue.id}` : "/admin/boletins/new",
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">
            Painel editorial
          </h1>
          <p className="mt-0.5 text-sm text-ink-muted">{formatLongDate(today)}</p>
        </div>
        <Link
          href="/admin/updates/new"
          className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:opacity-90"
        >
          + Nova atualização
        </Link>
      </div>

      {/* Boletim de hoje */}
      <section className="mb-8 overflow-hidden rounded-lg border border-ink-line bg-paper-card shadow-card">
        <div className="border-b border-ink-line bg-paper-soft/40 px-5 py-3">
          <p className="kicker">Boletim de hoje</p>
        </div>
        <div className="p-5">
          {issue ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <h2 className="font-serif text-xl font-bold text-ink">
                    {issue.title ?? `Edição de ${formatLongDate(today)}`}
                  </h2>
                  <StatusBadge status={issue.status} />
                </div>
                <p className="text-sm text-ink-muted">
                  {issue.issue_number != null
                    ? `Edição nº ${issue.issue_number} · `
                    : ""}
                  {issue.what_matters?.length ?? 0} destaque(s) em “O que importa”
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/boletins/edit/${issue.id}`}
                  className="rounded-md border border-ink-line px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-paper-soft"
                >
                  Montar edição
                </Link>
                <Link
                  href={`/boletim/${today}`}
                  target="_blank"
                  className="rounded-md border border-ink-line px-3 py-2 text-sm font-semibold text-signal hover:bg-paper-soft"
                >
                  Ver no site ↗
                </Link>
              </div>
            </div>
          ) : null}

          {/* Automação: montar rascunho e publicar hoje */}
          <div className="mt-4 border-t border-ink-line pt-4">
            <p className="mb-2 text-xs text-ink-muted">
              A coleta diária monta a edição de hoje como rascunho. Publicar é um
              passo de confirmação — nada vai ao ar sozinho.
            </p>
            <DailyPublishControls />
          </div>

          {!issue ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-ink-soft">
                Ainda não há edição para hoje. Comece a montar o boletim.
              </p>
              <Link
                href="/admin/boletins/new"
                className="rounded-md bg-impact-muda px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Criar edição de hoje
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {/* Contagens por status */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-lg border border-ink-line bg-paper-card p-4 shadow-card transition hover:border-navy/40"
          >
            <p className={`font-serif text-3xl font-bold ${s.tone}`}>{s.value}</p>
            <p className="text-sm text-ink-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Próximos passos editoriais */}
      <section className="rounded-lg border border-ink-line bg-paper-card p-5 shadow-card">
        <h2 className="mb-4 font-serif text-lg font-bold text-ink">
          Próximos passos editoriais
        </h2>
        <ul className="space-y-2">
          {steps.map((step, i) => (
            <li key={i}>
              <Link
                href={step.href}
                className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-paper-soft"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-bold ${
                    step.done
                      ? "border-impact-muda bg-impact-muda text-white"
                      : "border-ink-line text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span
                  className={`text-sm ${
                    step.done
                      ? "text-ink-muted line-through"
                      : "font-medium text-ink-soft"
                  }`}
                >
                  {step.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
