import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/queries";

export const dynamic = "force-dynamic";

// Portão do admin: garante Supabase configurado. A autenticação/UI de painel
// fica no layout do route group (panel); login e preview renderizam "puros".
export default function AdminGateLayout({
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
        <Link href="/" className="mt-6 inline-block text-signal underline">
          Voltar ao site
        </Link>
      </div>
    );
  }

  return <div className="min-h-screen bg-paper">{children}</div>;
}
