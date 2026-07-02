import type { Metadata } from "next";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Receba o boletim médico diário por e-mail.",
};

export default function NewsletterPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <header className="text-center">
        <h1 className="font-serif text-3xl font-bold text-ink">
          Boletim diário no seu e-mail
        </h1>
        <p className="mx-auto mt-3 max-w-prose text-ink-soft">
          Um e-mail por dia com o que realmente importa na medicina — explicado
          por evidência, mecanismo e impacto prático, com contexto brasileiro.
          Sem spam, cancele quando quiser.
        </p>
      </header>

      <div className="mt-8">
        <NewsletterSignup />
      </div>

      <p className="mt-6 text-center text-xs text-ink-muted">
        Ao assinar, você concorda em receber comunicações do Muda Conduta?. Seu
        e-mail não será compartilhado com terceiros.
      </p>
    </div>
  );
}
