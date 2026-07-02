import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { isSupabaseConfigured } from "@/lib/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold text-ink">
          Configure o Supabase
        </h1>
        <p className="mt-3 text-ink-soft">
          O painel admin exige as variáveis de ambiente do Supabase. Copie{" "}
          <code className="rounded bg-paper-soft px-1">.env.local.example</code>{" "}
          para <code className="rounded bg-paper-soft px-1">.env.local</code> e
          preencha as chaves.
        </p>
        <Link href="/" className="mt-6 inline-block text-navy-500 underline">
          Voltar ao site
        </Link>
      </div>
    );
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sem usuário: só a página de login chega aqui (middleware protege o resto).
  if (!user) {
    return <div className="min-h-screen bg-paper">{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper md:flex-row">
      <AdminSidebar email={user.email ?? undefined} />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">{children}</div>
      </div>
    </div>
  );
}
