import Link from "next/link";
import { SITE } from "@/lib/constants";
import { formatFullDate, todayISO } from "@/lib/date";

const NAV = [
  { href: "/hoje", label: "Hoje" },
  { href: "/arquivo", label: "Arquivo" },
  { href: "/areas", label: "Áreas" },
  { href: "/muda-conduta", label: "Muda Conduta?" },
  { href: "/acompanhar", label: "Acompanhar" },
  { href: "/alertas", label: "Alertas" },
  { href: "/metodologia", label: "Metodologia" },
];

// Cabeçalho editorial com nome do jornal, data e menu.
export function EditorialMasthead() {
  const today = todayISO();
  return (
    <header className="border-b border-ink-line bg-paper">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-1 py-6 text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-ink-muted">
            {formatFullDate(today)}
          </p>
          <Link href="/" className="group">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              {SITE.name}
            </h1>
          </Link>
          <p className="max-w-xl text-sm text-ink-muted">{SITE.subtitle}</p>
        </div>
      </div>
      <nav className="border-t border-ink-line bg-navy text-paper">
        <div className="mx-auto max-w-6xl px-4">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 py-2 text-sm font-medium">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block py-1 text-paper/85 transition hover:text-white"
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

// Header simples (usado em páginas internas onde o masthead completo é demais).
export function Header() {
  return <EditorialMasthead />;
}
