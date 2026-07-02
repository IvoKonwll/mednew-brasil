import Link from "next/link";
import { SITE } from "@/lib/constants";
import { formatFullDate, todayISO } from "@/lib/date";
import { getIssueByDate, getLatestIssue } from "@/lib/queries";

const NAV = [
  { href: "/hoje", label: "Hoje" },
  { href: "/arquivo", label: "Arquivo" },
  { href: "/areas", label: "Áreas" },
  { href: "/muda-conduta", label: "Muda Conduta?" },
  { href: "/acompanhar", label: "Acompanhar" },
  { href: "/alertas", label: "Alertas" },
  { href: "/metodologia", label: "Metodologia" },
];

// Cabeçalho editorial com nome do jornal, data, edição e menu.
export async function EditorialMasthead() {
  const today = todayISO();

  // Número da edição: preferimos a de hoje; senão, a mais recente publicada.
  const issue = (await getIssueByDate(today)) ?? (await getLatestIssue());
  const editionLabel =
    issue?.issue_number != null ? `Edição nº ${issue.issue_number}` : "Edição diária";

  return (
    <header className="bg-paper">
      {/* Linha superior fina com metadados */}
      <div className="border-b border-ink-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 text-[0.68rem] uppercase tracking-[0.14em] text-ink-muted">
          <span className="hidden sm:inline">Jornal médico diário</span>
          <span className="tabular-nums">{formatFullDate(today)}</span>
          <span className="hidden sm:inline">{editionLabel}</span>
        </div>
      </div>

      {/* Bloco do título */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-2 py-7 text-center sm:py-9">
          <Link href="/" className="group inline-block">
            <h1 className="font-serif text-[2.6rem] font-bold leading-none tracking-masthead text-ink sm:text-6xl">
              {SITE.name}
            </h1>
          </Link>
          <div className="flex w-full max-w-md items-center gap-3">
            <span className="h-px flex-1 bg-ink-line" />
            <p className="text-[0.72rem] uppercase tracking-[0.16em] text-ink-muted">
              {SITE.subtitle}
            </p>
            <span className="h-px flex-1 bg-ink-line" />
          </div>
        </div>
      </div>

      {/* Navegação — rolável no mobile, centralizada no desktop */}
      <nav className="border-y-2 border-ink bg-paper">
        <div className="mx-auto max-w-6xl px-2">
          <ul className="flex items-center gap-1 overflow-x-auto whitespace-nowrap py-0 md:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block px-3.5 py-2.5 text-[0.82rem] font-semibold uppercase tracking-wide text-ink-soft transition hover:text-signal"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

// Alias mantido para compatibilidade.
export function Header() {
  return <EditorialMasthead />;
}
