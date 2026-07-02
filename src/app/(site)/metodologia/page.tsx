import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metodologia",
  description:
    "Como o Muda Conduta? seleciona fontes, classifica evidência e define impacto prático.",
};

export default function MetodologiaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="border-b border-ink-line pb-6">
        <h1 className="font-serif text-3xl font-bold text-ink">Metodologia</h1>
        <p className="mt-2 text-ink-soft">
          Como transformamos publicações e comunicados em análises úteis para a
          prática clínica brasileira.
        </p>
      </header>

      <div className="editorial-prose mt-8">
        <h2>Hierarquia de fontes</h2>
        <p>
          Priorizamos fontes primárias: artigos originais revisados por pares,
          diretrizes de sociedades e órgãos, documentos regulatórios (FDA, EMA,
          Anvisa), registros de ensaios (ClinicalTrials.gov) e bulas oficiais.
          Fontes jornalísticas entram apenas como complemento, nunca como prova.
        </p>

        <h2>Como classificamos a evidência</h2>
        <p>
          Cada atualização recebe um tipo de evidência (diretriz, ensaio
          randomizado de fase 3, estudo observacional, metanálise, alerta de
          segurança etc.) e uma força de evidência (alta, moderada, baixa ou
          preliminar). Ensaios randomizados, duplo-cegos e multicêntricos com
          desfechos clínicos duros pesam mais do que desfechos substitutos.
        </p>

        <h2>Como classificamos o impacto prático</h2>
        <ul>
          <li>
            <strong>Muda conduta agora</strong> — evidência suficiente para
            alterar a prática já.
          </li>
          <li>
            <strong>Muda apenas onde aprovado</strong> — muda a prática onde há
            aprovação e disponibilidade.
          </li>
          <li>
            <strong>Merece acompanhar</strong> — promissor, mas ainda não muda
            conduta.
          </li>
          <li>
            <strong>Não muda conduta ainda</strong> — sem impacto prático
            imediato.
          </li>
          <li>
            <strong>Alerta de segurança</strong> — sinal de segurança que exige
            atenção.
          </li>
        </ul>

        <h2>Aprovação regulatória ≠ incorporação no Brasil</h2>
        <p>
          Aprovação do FDA ou da EMA não significa disponibilidade no Brasil.
          Sempre sinalizamos situação na Anvisa, avaliação da CONITEC,
          incorporação no SUS, cobertura por convênios e presença em diretrizes
          nacionais.
        </p>

        <h2>Nossos princípios</h2>
        <ul>
          <li>Não fazemos recomendação individual de tratamento.</li>
          <li>
            Sempre consulte bula, diretrizes locais e órgãos regulatórios.
          </li>
          <li>
            Aprovação FDA/EMA não significa disponibilidade no Brasil.
          </li>
          <li>Pré-prints são tratados como evidência preliminar.</li>
          <li>
            Press releases não são tratados como prova definitiva.
          </li>
          <li>
            Todo conteúdo passa por revisão humana antes da publicação.
          </li>
        </ul>

        <h2>Coleta automática (em desenvolvimento)</h2>
        <p>
          Estamos preparando integrações com PubMed, FDA, EMA, OMS, Anvisa, CDC,
          NICE e ClinicalTrials.gov. Itens coletados automaticamente entram como
          rascunhos brutos e só são publicados após curadoria e revisão
          editorial humana.
        </p>
      </div>
    </div>
  );
}
