import type { Metadata } from "next";
import { UpdateList } from "@/components/UpdateList";
import { getUpdatesThatChangePractice } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Muda conduta?",
  description:
    "Atualizações que mudam a prática clínica agora ou onde há aprovação e disponibilidade.",
};

export default async function MudaCondutaPage() {
  const updates = await getUpdatesThatChangePractice();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="border-b border-ink-line pb-6">
        <h1 className="font-serif text-3xl font-bold text-ink">Muda conduta?</h1>
        <p className="mt-2 max-w-prose text-ink-soft">
          Reunimos aqui o que tem evidência suficiente para mudar a prática já —
          ou onde há aprovação e disponibilidade. Sempre confira diretrizes
          locais, bula e situação regulatória no Brasil antes de aplicar.
        </p>
      </header>
      <div className="mt-8">
        <UpdateList
          updates={updates}
          emptyTitle="Nada que mude conduta no momento"
          emptyDescription="Quando uma novidade atingir esse patamar de evidência, ela aparece aqui."
        />
      </div>
    </div>
  );
}
