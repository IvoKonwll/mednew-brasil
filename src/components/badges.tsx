import Link from "next/link";
import {
  IMPACT_META,
  STATUS_LABELS,
  toSlug,
  type ContentStatus,
  type ImpactLevel,
} from "@/lib/constants";

// Cores por token de impacto -> classes Tailwind.
const IMPACT_COLOR_CLASSES: Record<string, string> = {
  muda: "bg-impact-muda/10 text-impact-muda ring-impact-muda/30",
  acompanhar: "bg-impact-acompanhar/10 text-impact-acompanhar ring-impact-acompanhar/30",
  alerta: "bg-impact-alerta/10 text-impact-alerta ring-impact-alerta/30",
  neutro: "bg-impact-neutro/10 text-impact-neutro ring-impact-neutro/30",
};

const baseBadge =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset";

export function ImpactBadge({
  level,
  className = "",
}: {
  level: ImpactLevel | null | undefined;
  className?: string;
}) {
  if (!level) return null;
  const meta = IMPACT_META[level];
  const color = meta ? IMPACT_COLOR_CLASSES[meta.color] : IMPACT_COLOR_CLASSES.neutro;
  return (
    <span className={`${baseBadge} ${color} ${className}`} title={meta?.short}>
      {level}
    </span>
  );
}

export function EvidenceBadge({
  type,
  className = "",
}: {
  type: string | null | undefined;
  className?: string;
}) {
  if (!type) return null;
  return (
    <span
      className={`${baseBadge} bg-navy/5 text-navy ring-navy/20 ${className}`}
    >
      {type}
    </span>
  );
}

export function AreaBadge({
  area,
  linked = true,
  className = "",
}: {
  area: string | null | undefined;
  linked?: boolean;
  className?: string;
}) {
  if (!area) return null;
  const content = (
    <span
      className={`${baseBadge} bg-ink/5 text-ink-soft ring-ink/10 hover:bg-ink/10 ${className}`}
    >
      {area}
    </span>
  );
  if (!linked) return content;
  return <Link href={`/areas/${toSlug(area)}`}>{content}</Link>;
}

export function StatusBadge({ status }: { status: ContentStatus }) {
  const styles: Record<ContentStatus, string> = {
    draft: "bg-ink/5 text-ink-muted ring-ink/10",
    review: "bg-impact-acompanhar/10 text-impact-acompanhar ring-impact-acompanhar/30",
    published: "bg-impact-muda/10 text-impact-muda ring-impact-muda/30",
    archived: "bg-ink/5 text-ink-muted ring-ink/10",
  };
  return (
    <span className={`${baseBadge} ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

// Badge genérico para selos como "Fase 3", "Brasil pendente", "Fonte primária".
export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "navy" | "muda" | "alerta" | "acompanhar";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-ink/5 text-ink-soft ring-ink/10",
    navy: "bg-navy/5 text-navy ring-navy/20",
    muda: "bg-impact-muda/10 text-impact-muda ring-impact-muda/30",
    alerta: "bg-impact-alerta/10 text-impact-alerta ring-impact-alerta/30",
    acompanhar:
      "bg-impact-acompanhar/10 text-impact-acompanhar ring-impact-acompanhar/30",
  };
  return <span className={`${baseBadge} ${tones[tone]}`}>{children}</span>;
}
