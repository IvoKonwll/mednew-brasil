import { notFound } from "next/navigation";
import { adminGetUpdate, adminListIssues } from "@/lib/admin-queries";
import { UpdateForm } from "@/components/admin/UpdateForm";

export const dynamic = "force-dynamic";

export default async function EditUpdatePage({
  params,
}: {
  params: { id: string };
}) {
  const [update, issues] = await Promise.all([
    adminGetUpdate(params.id),
    adminListIssues(),
  ]);
  if (!update) notFound();

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-ink">
        Editar atualização
      </h1>
      <UpdateForm update={update} issues={issues} />
    </div>
  );
}
