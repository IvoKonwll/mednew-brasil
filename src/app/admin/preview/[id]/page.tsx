import Link from "next/link";
import { notFound } from "next/navigation";
import { adminGetUpdate } from "@/lib/admin-queries";
import { UpdateArticle } from "@/components/UpdateArticle";
import { EditorialMasthead } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { STATUS_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

// Pré-visualização pública de uma atualização ANTES de publicar.
// Protegida pelo middleware (/admin/*). Renderiza o layout real do site.
export default async function AdminPreviewPage({
  params,
}: {
  params: { id: string };
}) {
  const update = await adminGetUpdate(params.id);
  if (!update) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Faixa de preview */}
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-2 bg-navy px-4 py-2 text-sm text-white">
        <span className="font-semibold">
          Pré-visualização · status:{" "}
          <span className="opacity-90">{STATUS_LABELS[update.status]}</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="hidden text-white/70 sm:inline">
            Ainda não está no ar até ser publicada.
          </span>
          <Link
            href={`/admin/updates/edit/${update.id}`}
            className="rounded-md bg-white/15 px-3 py-1 font-semibold hover:bg-white/25"
          >
            ← Voltar a editar
          </Link>
        </div>
      </div>

      <EditorialMasthead />
      <main className="flex-1">
        <UpdateArticle update={update} />
      </main>
      <Footer />
    </div>
  );
}
