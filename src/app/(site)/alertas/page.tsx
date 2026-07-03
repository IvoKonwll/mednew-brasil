import type { Metadata } from "next";
import { UpdateList } from "@/components/UpdateList";
import { getSafetyAlerts } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Alertas de segurança",
  description:
    "Retratações, alertas regulatórios, novos efeitos adversos e mudanças de bula.",
};

export default async function AlertasPage() {
  const updates = await getSafetyAlerts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="border-b border-impact-alerta/30 pb-6">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-impact-alerta">
          Farmacovigilância e regulação
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-ink">
          Alertas de segurança
        </h1>
        <p className="mt-2 max-w-prose text-ink-soft">
          Retratações de estudos, alertas regulatórios, novos efeitos adversos,
          suspensões de medicamento e mudanças de bula.
        </p>
      </header>
      <div className="mt-8">
        <UpdateList
          updates={updates}
          emptyTitle="Nenhum alerta de segurança ativo"
          emptyDescription="Alertas regulatórios e de farmacovigilância aparecerão aqui."
        />
      </div>
    </div>
  );
}
