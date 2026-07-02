import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sobre",
  description: "A missão do Muda Conduta?",
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="border-b border-ink-line pb-6">
        <h1 className="font-serif text-3xl font-bold text-ink">Sobre</h1>
        <p className="mt-2 text-ink-soft">{SITE.subtitle}</p>
      </header>

      <div className="editorial-prose mt-8">
        <p>
          <strong>{SITE.name}</strong> é um jornal médico digital brasileiro com
          boletins diários sobre os principais avanços da medicina no mundo. Não
          somos um blog de notícias: cada item responde às mesmas perguntas — o
          que saiu, como funciona no corpo, como foi estudado, qual evidência
          sustenta e, principalmente, <em>se muda conduta no Brasil</em>.
        </p>

        <h2>Para quem é</h2>
        <p>
          Estudantes de medicina, residentes e médicos que querem entender os
          avanços recentes com profundidade, sem sensacionalismo e com contexto
          nacional.
        </p>

        <h2>O que fazemos de diferente</h2>
        <ul>
          <li>Diferenciamos evidência forte de evidência preliminar.</li>
          <li>
            Explicamos o mecanismo de ação de forma didática e o desenho de cada
            estudo.
          </li>
          <li>
            Deixamos claro se muda conduta agora ou se é apenas para acompanhar.
          </li>
          <li>
            Sinalizamos quando algo depende de Anvisa, CONITEC, SUS, convênios,
            diretrizes nacionais ou disponibilidade local.
          </li>
        </ul>

        <p>
          Veja também a nossa{" "}
          <Link href="/metodologia">metodologia editorial</Link>.
        </p>

        <p className="rounded-md bg-paper-soft/60 p-4 text-sm text-ink-muted">
          {SITE.disclaimer}
        </p>
      </div>
    </div>
  );
}
