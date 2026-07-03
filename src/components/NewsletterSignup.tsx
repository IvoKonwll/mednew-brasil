"use client";

import { useState } from "react";

export function NewsletterSignup({
  variant = "card",
}: {
  variant?: "card" | "inline";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Digite um e-mail válido.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao inscrever.");
      setStatus("ok");
      setMessage("Pronto! Você receberá o boletim diário.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Erro ao inscrever.");
    }
  }

  const wrapper =
    variant === "card"
      ? "rounded-lg border border-ink-line bg-navy p-6 text-paper"
      : "";

  return (
    <div className={wrapper}>
      {variant === "card" && (
        <>
          <h2 className="font-serif text-xl font-semibold text-white">
            Receba o boletim diário
          </h2>
          <p className="mt-1 text-sm text-paper/75">
            Um e-mail por dia com o que realmente importa na medicina, explicado
            por evidência, mecanismo e impacto prático.
          </p>
        </>
      )}
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-2 sm:flex-row"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Seu e-mail
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="flex-1 rounded-md border border-ink-line bg-white px-3 py-2 text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-md bg-impact-muda px-4 py-2 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {status === "loading" ? "Enviando..." : "Assinar"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-2 text-sm ${
            status === "error"
              ? "text-impact-alerta"
              : variant === "card"
                ? "text-paper/90"
                : "text-impact-muda"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
