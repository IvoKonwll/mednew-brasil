import { adminListIssues } from "@/lib/admin-queries";
import { UpdateForm } from "@/components/admin/UpdateForm";

export const dynamic = "force-dynamic";

export default async function NewUpdatePage() {
  const issues = await adminListIssues();
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-ink">
        Nova atualização médica
      </h1>
      <UpdateForm issues={issues} />
    </div>
  );
}
