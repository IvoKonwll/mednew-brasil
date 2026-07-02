import Link from "next/link";
import type { MedicalUpdate } from "@/lib/types";
import { AreaBadge, EvidenceBadge, ImpactBadge } from "./badges";
import { formatShortDate } from "@/lib/date";

export function UpdateCard({ update }: { update: MedicalUpdate }) {
  return (
    <article className="group flex h-full flex-col rounded-lg border border-ink-line bg-paper-card p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <AreaBadge area={update.area} />
        <ImpactBadge level={update.impact_level} />
      </div>

      <h3 className="font-serif text-xl font-semibold leading-snug text-ink">
        <Link
          href={`/updates/${update.slug}`}
          className="transition group-hover:text-navy-500"
        >
          {update.title}
        </Link>
      </h3>

      {update.short_summary && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
          {update.short_summary}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <EvidenceBadge type={update.evidence_type} />
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-ink-muted">
        <span>
          {update.publication_date
            ? formatShortDate(update.publication_date)
            : ""}
          {update.reading_time_minutes
            ? ` · ${update.reading_time_minutes} min de leitura`
            : ""}
        </span>
        <Link
          href={`/updates/${update.slug}`}
          className="font-medium text-navy-500 hover:text-navy"
        >
          Ler análise completa →
        </Link>
      </div>
    </article>
  );
}
