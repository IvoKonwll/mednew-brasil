import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UpdateList } from "@/components/UpdateList";
import { getUpdatesByArea } from "@/lib/queries";
import { AREA_SLUG_MAP, MEDICAL_AREAS, toSlug } from "@/lib/constants";

export const revalidate = 300;

export function generateStaticParams() {
  return MEDICAL_AREAS.map((area) => ({ area: toSlug(area) }));
}

export async function generateMetadata({
  params,
}: {
  params: { area: string };
}): Promise<Metadata> {
  const area = AREA_SLUG_MAP[params.area];
  if (!area) return { title: "Área" };
  return {
    title: area,
    description: `Avanços médicos em ${area}, explicados por evidência e impacto prático.`,
  };
}

export default async function AreaPage({
  params,
}: {
  params: { area: string };
}) {
  const area = AREA_SLUG_MAP[params.area];
  if (!area) notFound();

  const updates = await getUpdatesByArea(area);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="border-b border-ink-line pb-6">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-navy-500">
          Área médica
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-ink">{area}</h1>
        <p className="mt-2 text-ink-soft">
          {updates.length} análise{updates.length === 1 ? "" : "s"} publicada
          {updates.length === 1 ? "" : "s"} nesta área.
        </p>
      </header>
      <div className="mt-8">
        <UpdateList
          updates={updates}
          emptyTitle={`Ainda sem atualizações em ${area}`}
          emptyDescription="Novas análises desta área aparecerão aqui."
        />
      </div>
    </div>
  );
}
