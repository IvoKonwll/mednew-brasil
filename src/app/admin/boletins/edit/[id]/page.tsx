import { notFound } from "next/navigation";
import { adminGetIssue } from "@/lib/admin-queries";
import { IssueForm } from "@/components/admin/IssueForm";

export const dynamic = "force-dynamic";

export default async function EditIssuePage({
  params,
}: {
  params: { id: string };
}) {
  const issue = await adminGetIssue(params.id);
  if (!issue) notFound();

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-ink">
        Editar boletim
      </h1>
      <IssueForm issue={issue} />
    </div>
  );
}
