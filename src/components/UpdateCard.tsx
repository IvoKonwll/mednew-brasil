import Link from "next/link";
import type { MedicalUpdate } from "@/lib/types";
import { AreaBadge, EvidenceBadge, ImpactBadge, impactColor } from "./badges";
import { formatShortDate } from "@/lib/date";

// Barra de acento superior por cor de impacto.
const ACCENT_BAR: Record<string, string> = {
  muda: "bg-impact-muda",
  acompanhar: "bg-impact-acompanhar",
  alerta: "bg-impact-alerta",
  neutro: "bg-ink-line",
};

export function UpdateCard({
  update,
  variant = "default",
}: {
  update: MedicalUpdate;
  variant?: "default" | "compact";
}) {
  const accent = ACCENT_BAR[impactColor(update.impact_level)];

  if (variant === "compact") {
    return (
      <article className="group flex gap-3 border-b border-ink-line py-3 last:border-0">
        <span className={`mt-1 h-full w-0.5 shrink-0 rounded-full ${accent}`} />
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <AreaBadge area={update.area} />
          </div>
          <h3 className="font-serif text-[0.98rem] font-semibold leading-snug text-ink">
            <Link href={`/updates/${update.slug}`} className="hover:text-signal">
              {update.title}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-ink-muted">
            {update.publication_date
              ? formatShortDate(update.publication_date)
              : ""}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-ink-line bg-paper-card shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-ink-line hover:shadow-card-hover">
      {/* Barra de acento por impacto */}
      <span className={`h-1 w-full ${accent}`} />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
          <AreaBadge area={update.area} />
          <EvidenceBadge type={update.evidence_type} />
        </div>

        <h3 className="font-serif text-[1.35rem] font-semibold leading-snug text-ink">
          <Link
            href={`/updates/${update.slug}`}
            className="transition group-hover:text-signal"
          >
            {update.title}
          </Link>
        </h3>

        {update.short_summary && (
          <p className="mt-2 line-clamp-3 text-[0.9rem] leading-relaxed text-ink-soft">
            {update.short_summary}
          </p>
        )}

        <div className="mt-3">
          <ImpactBadge level={update.impact_level} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-ink-line pt-3.5 text-xs text-ink-muted">
          <span className="tabular-nums">
            {update.publication_date
              ? formatShortDate(update.publication_date)
              : ""}
            {update.reading_time_minutes
              ? ` · ${update.reading_time_minutes} min`
              : ""}
          </span>
          <Link
            href={`/updates/${update.slug}`}
            className="font-semibold text-signal transition group-hover:gap-2 hover:text-navy"
          >
            Ler análise →
          </Link>
        </div>
      </div>
    </article>
  );
}
