import type { Metadata } from "next";
import { UpdateList } from "@/components/UpdateList";
import { getUpdatesToWatch } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Acompanhar",
  description:
    "Novidades promissoras que ainda não mudam a prática, mas merecem atenção.",
};

export default async function AcompanharPage() {
  const updates = await getUpdatesToWatch();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="border-b border-ink-line pb-6">
        <h1 className="font-serif text-3xl font-bold text-ink">Acompanhar</h1>
        <p className="mt-2 max-w-prose text-ink-soft">
          Sinais promissores, dados preliminares e avanços que ainda não mudam a
          conduta — mas que vale a pena manter no radar.
        </p>
      </header>
      <div className="mt-8">
        <UpdateList
          updates={updates}
          emptyTitle="Nada para acompanhar no momento"
          emptyDescription="Novidades promissoras aparecerão aqui."
        />
      </div>
    </div>
  );
}
