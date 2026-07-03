import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UpdateList } from "@/components/UpdateList";
import { getUpdatesByEvidenceTypes } from "@/lib/queries";
import { EVIDENCE_SLUG_LABELS, EVIDENCE_SLUG_MAP } from "@/lib/constants";

export const revalidate = 300;

export function generateStaticParams() {
  return Object.keys(EVIDENCE_SLUG_MAP).map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: { type: string };
}): Promise<Metadata> {
  const label = EVIDENCE_SLUG_LABELS[params.type];
  if (!label) return { title: "Evidência" };
  return {
    title: label,
    description: `Atualizações classificadas como ${label.toLowerCase()}.`,
  };
}

export default async function EvidenceTypePage({
  params,
}: {
  params: { type: string };
}) {
  const types = EVIDENCE_SLUG_MAP[params.type];
  const label = EVIDENCE_SLUG_LABELS[params.type];
  if (!types || !label) notFound();

  const updates = await getUpdatesByEvidenceTypes(types);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="border-b border-ink-line pb-6">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-navy-500">
          Tipo de evidência
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-ink">{label}</h1>
      </header>
      <div className="mt-8">
        <UpdateList
          updates={updates}
          emptyTitle={`Ainda sem ${label.toLowerCase()}`}
          emptyDescription="Novas análises deste tipo aparecerão aqui."
        />
      </div>
    </div>
  );
}
