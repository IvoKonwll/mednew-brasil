import type { Metadata } from "next";
import Link from "next/link";
import { MEDICAL_AREAS, toSlug } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Áreas médicas",
  description: "Navegue os avanços da medicina por especialidade.",
};

export default function AreasPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="border-b border-ink-line pb-6">
        <h1 className="font-serif text-3xl font-bold text-ink">Áreas médicas</h1>
        <p className="mt-2 text-ink-soft">
          Escolha uma especialidade para ver as atualizações relacionadas.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {MEDICAL_AREAS.map((area) => (
          <Link
            key={area}
            href={`/areas/${toSlug(area)}`}
            className="rounded-lg border border-ink-line bg-paper-card px-4 py-3 text-sm font-medium text-ink-soft transition hover:border-navy/40 hover:text-navy"
          >
            {area}
          </Link>
        ))}
      </div>
    </div>
  );
}
