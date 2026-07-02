import { IssueForm } from "@/components/admin/IssueForm";

export const dynamic = "force-dynamic";

export default function NewIssuePage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-ink">
        Novo boletim
      </h1>
      <IssueForm />
    </div>
  );
}
