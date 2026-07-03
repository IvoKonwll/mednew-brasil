import Link from "next/link";
import { EditorialMasthead } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <EditorialMasthead />
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="text-center">
          <p className="font-serif text-6xl font-bold text-navy">404</p>
          <h1 className="mt-4 font-serif text-2xl font-semibold text-ink">
            Página não encontrada
          </h1>
          <p className="mx-auto mt-2 max-w-md text-ink-soft">
            A edição ou análise que você procura não existe ou ainda não foi
            publicada.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/"
              className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Ir para a home
            </Link>
            <Link
              href="/arquivo"
              className="rounded-md border border-ink-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-paper-soft"
            >
              Ver arquivo
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
