import Link from "next/link";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-line bg-navy text-paper/80">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-serif text-xl font-bold text-white">
              {SITE.name}
            </p>
            <p className="mt-2 text-sm text-paper/70">{SITE.subtitle}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-paper/60">
              Edições
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li><Link href="/hoje" className="hover:text-white">Boletim de hoje</Link></li>
              <li><Link href="/ontem" className="hover:text-white">Boletim de ontem</Link></li>
              <li><Link href="/arquivo" className="hover:text-white">Arquivo completo</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-paper/60">
              Seções
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li><Link href="/muda-conduta" className="hover:text-white">Muda conduta?</Link></li>
              <li><Link href="/acompanhar" className="hover:text-white">Acompanhar</Link></li>
              <li><Link href="/alertas" className="hover:text-white">Alertas de segurança</Link></li>
              <li><Link href="/areas" className="hover:text-white">Áreas médicas</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-paper/60">
              O projeto
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li><Link href="/sobre" className="hover:text-white">Sobre</Link></li>
              <li><Link href="/metodologia" className="hover:text-white">Metodologia</Link></li>
              <li><Link href="/newsletter" className="hover:text-white">Newsletter</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rule border-paper/15 pt-6">
          <p className="text-xs leading-relaxed text-paper/60">
            {SITE.disclaimer}
          </p>
          <p className="mt-3 text-xs text-paper/50">
            © {new Date().getFullYear()} {SITE.name}. Conteúdo educacional.
            Aprovação FDA/EMA não significa disponibilidade no Brasil.
          </p>
        </div>
      </div>
    </footer>
  );
}
