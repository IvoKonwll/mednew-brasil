import type { MedicalUpdate } from "@/lib/types";
import { UpdateCard } from "./UpdateCard";
import { EmptyState } from "./EmptyState";

export function UpdateList({
  updates,
  emptyTitle = "Nenhuma atualização por aqui ainda",
  emptyDescription = "Assim que uma nova análise for publicada, ela aparece nesta lista.",
}: {
  updates: MedicalUpdate[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (updates.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {updates.map((update) => (
        <UpdateCard key={update.id} update={update} />
      ))}
    </div>
  );
}
