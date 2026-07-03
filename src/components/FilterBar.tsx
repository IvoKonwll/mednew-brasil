import Link from "next/link";
import {
  EVIDENCE_SLUG_LABELS,
  MEDICAL_AREAS,
  toSlug,
} from "@/lib/constants";

// Filtros rápidos por área e por tipo de evidência.
export function FilterBar({
  showAreas = true,
  showEvidence = true,
}: {
  showAreas?: boolean;
  showEvidence?: boolean;
}) {
  // Amostra de áreas mais comuns para os "filtros rápidos".
  const quickAreas = [
    "Cardiologia",
    "Oncologia",
    "Infectologia",
    "Endocrinologia",
    "Neurologia",
    "Cirurgia",
    "Pediatria",
    "Saúde Pública",
  ].filter((a) => (MEDICAL_AREAS as readonly string[]).includes(a));

  return (
    <div className="space-y-4">
      {showAreas && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Filtrar por área
          </p>
          <div className="flex flex-wrap gap-2">
            {quickAreas.map((area) => (
              <Link
                key={area}
                href={`/areas/${toSlug(area)}`}
                className="rounded-full border border-ink-line bg-paper-card px-3 py-1 text-sm text-ink-soft transition hover:border-navy/40 hover:text-navy"
              >
                {area}
              </Link>
            ))}
            <Link
              href="/areas"
              className="rounded-full px-3 py-1 text-sm font-medium text-navy-500 hover:text-navy"
            >
              Todas as áreas →
            </Link>
          </div>
        </div>
      )}

      {showEvidence && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Filtrar por tipo de evidência
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(EVIDENCE_SLUG_LABELS).map(([slug, label]) => (
              <Link
                key={slug}
                href={`/evidencias/${slug}`}
                className="rounded-full border border-ink-line bg-paper-card px-3 py-1 text-sm text-ink-soft transition hover:border-navy/40 hover:text-navy"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
