"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError("E-mail ou senha inválidos.");
      return;
    }
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-ink">
            Muda Conduta?
          </h1>
          <p className="mt-1 text-sm text-ink-muted">Painel editorial</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-lg border border-ink-line bg-paper-card p-6 shadow-sm"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-ink-soft"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-ink-line px-3 py-2 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-ink-soft"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-ink-line px-3 py-2 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
            />
          </div>

          {error && <p className="text-sm text-impact-alerta">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-navy px-4 py-2 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-ink-muted">
          Acesso restrito à equipe editorial.
        </p>
      </div>
    </div>
  );
}
