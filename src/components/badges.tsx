import Link from "next/link";
import {
  IMPACT_META,
  STATUS_LABELS,
  toSlug,
  type ContentStatus,
  type ImpactLevel,
} from "@/lib/constants";

export type ImpactColor = "muda" | "acompanhar" | "alerta" | "neutro";

// Token de cor do impacto (usado por cards e barras de destaque).
export function impactColor(level: ImpactLevel | null | undefined): ImpactColor {
  if (!level) return "neutro";
  return IMPACT_META[level]?.color ?? "neutro";
}

// Classe de texto/fundo/anel por token de cor de impacto.
const IMPACT_COLOR_CLASSES: Record<ImpactColor, string> = {
  muda: "bg-impact-muda/10 text-impact-muda ring-impact-muda/25",
  acompanhar: "bg-impact-acompanhar/10 text-impact-acompanhar ring-impact-acompanhar/25",
  alerta: "bg-impact-alerta/10 text-impact-alerta ring-impact-alerta/25",
  neutro: "bg-impact-neutro/10 text-impact-neutro ring-impact-neutro/25",
};

// Cor sólida do "ponto" indicador.
const IMPACT_DOT: Record<ImpactColor, string> = {
  muda: "bg-impact-muda",
  acompanhar: "bg-impact-acompanhar",
  alerta: "bg-impact-alerta",
  neutro: "bg-impact-neutro",
};

const baseBadge =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold ring-1 ring-inset";

const microLabel =
  "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.08em] ring-1 ring-inset";

// Impacto prático — pílula com ponto indicador colorido.
export function ImpactBadge({
  level,
  className = "",
}: {
  level: ImpactLevel | null | undefined;
  className?: string;
}) {
  if (!level) return null;
  const color = impactColor(level);
  return (
    <span
      className={`${baseBadge} ${IMPACT_COLOR_CLASSES[color]} ${className}`}
      title={IMPACT_META[level]?.short}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${IMPACT_DOT[color]}`} />
      {level}
    </span>
  );
}

// Evidência — azul para diretriz/aprovação, vermelho para alerta/retratação.
export function EvidenceBadge({
  type,
  className = "",
}: {
  type: string | null | undefined;
  className?: string;
}) {
  if (!type) return null;
  const t = type.toLowerCase();
  let tone = "bg-navy/5 text-navy ring-navy/20";
  if (t.includes("diretriz") || t.includes("aprova")) {
    tone = "bg-signal/10 text-signal ring-signal/25";
  } else if (t.includes("alerta") || t.includes("retrata")) {
    tone = "bg-impact-alerta/10 text-impact-alerta ring-impact-alerta/25";
  }
  return <span className={`${microLabel} ${tone} ${className}`}>{type}</span>;
}

// Área médica — rótulo neutro discreto.
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
      className={`${microLabel} bg-ink/[0.04] text-ink-soft ring-ink/10 hover:bg-ink/10 ${className}`}
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

// Selo genérico ("Fase 3", "Brasil pendente", "Fonte primária" etc.).
export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "navy" | "signal" | "muda" | "alerta" | "acompanhar";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-ink/5 text-ink-soft ring-ink/10",
    navy: "bg-navy/5 text-navy ring-navy/20",
    signal: "bg-signal/10 text-signal ring-signal/25",
    muda: "bg-impact-muda/10 text-impact-muda ring-impact-muda/30",
    alerta: "bg-impact-alerta/10 text-impact-alerta ring-impact-alerta/30",
    acompanhar:
      "bg-impact-acompanhar/10 text-impact-acompanhar ring-impact-acompanhar/30",
  };
  return <span className={`${baseBadge} ${tones[tone]}`}>{children}</span>;
}
