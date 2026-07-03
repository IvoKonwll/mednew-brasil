import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { isSupabaseConfigured } from "@/lib/queries";

export const dynamic = "force-dynamic";

// Chrome do painel: sidebar + área de conteúdo. Só usuários autenticados
// chegam aqui (middleware protege /admin/*).
export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sem Supabase o portão (admin/layout) já mostra a mensagem de configuração;
  // aqui evitamos criar o client (que lançaria erro).
  if (!isSupabaseConfigured()) {
    return <>{children}</>;
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-paper md:flex-row">
      <AdminSidebar email={user?.email ?? undefined} />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">{children}</div>
      </div>
    </div>
  );
}
