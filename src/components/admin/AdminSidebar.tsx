"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Painel", exact: true },
  { href: "/admin/boletins", label: "Boletins" },
  { href: "/admin/updates", label: "Atualizações" },
  { href: "/admin/sources", label: "Fontes" },
  { href: "/admin/raw", label: "Coleta bruta" },
];

export function AdminSidebar({ email }: { email?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-col border-b border-ink-line bg-navy text-paper md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
      <div className="p-5">
        <Link href="/admin" className="font-serif text-xl font-bold text-white">
          Muda Conduta?
        </Link>
        <p className="text-xs text-paper/60">Painel editorial</p>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {LINKS.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-md px-3 py-2 text-sm transition ${
                    active
                      ? "bg-white/15 font-medium text-white"
                      : "text-paper/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          className="block text-xs text-paper/70 hover:text-white"
          target="_blank"
        >
          Ver site público ↗
        </Link>
        {email && (
          <p className="mt-3 truncate text-xs text-paper/50">{email}</p>
        )}
        <button
          onClick={handleLogout}
          className="mt-2 text-xs font-medium text-paper/80 hover:text-white"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
