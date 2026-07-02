import type { Metadata } from "next";
import Link from "next/link";
import { ArchiveCalendar } from "@/components/ArchiveCalendar";
import { listIssues } from "@/lib/queries";
import { todayISO, yesterdayISO } from "@/lib/date";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Arquivo",
  description: "Todos os boletins médicos publicados, organizados por data.",
};

export default async function ArquivoPage() {
  const issues = await listIssues(120);

  const quickLinks = [
    { href: "/hoje", label: "Hoje" },
    { href: "/ontem", label: "Ontem" },
    { href: `/boletim/${todayISO()}`, label: "Edição de hoje" },
    { href: `/boletim/${yesterdayISO()}`, label: "Edição de ontem" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="border-b border-ink-line pb-6">
        <h1 className="font-serif text-3xl font-bold text-ink">Arquivo</h1>
        <p className="mt-2 text-ink-soft">
          Todos os boletins publicados. O site é atualizado diariamente — cada
          edição fica registrada aqui por data.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border border-ink-line bg-paper-card px-3 py-1 text-sm text-ink-soft transition hover:border-navy/40 hover:text-navy"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </header>

      <div className="mt-8">
        <ArchiveCalendar issues={issues} />
      </div>
    </div>
  );
}
