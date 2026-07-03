import type { Source } from "@/lib/types";
import { Pill } from "./badges";
import { formatShortDate } from "@/lib/date";

// J. Fontes confiáveis
export function SourceList({ sources }: { sources: Source[] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <section className="rounded-lg border border-ink-line bg-paper-soft/40 p-5">
      <h2 className="mb-4 font-serif text-xl font-semibold text-ink">
        Fontes confiáveis
      </h2>
      <ul className="space-y-3">
        {sources.map((source) => (
          <li
            key={source.id}
            className="flex flex-col gap-1 border-b border-ink-line/60 pb-3 last:border-0 last:pb-0"
          >
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-navy-500 underline underline-offset-2 hover:text-navy"
              >
                {source.source_name}
              </a>
              <Pill tone="navy">{source.source_type}</Pill>
              {source.is_primary && <Pill tone="muda">Fonte primária</Pill>}
            </div>
            {source.notes && (
              <p className="text-sm text-ink-soft">{source.notes}</p>
            )}
            <p className="text-xs text-ink-muted">
              {source.accessed_at
                ? `Acessado em ${formatShortDate(source.accessed_at)}`
                : ""}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
