import { NextResponse } from "next/server";
import { todayISO } from "@/lib/date";
import {
  buildLaunchReport,
  getDailyDraft,
  publishDailyIssue,
} from "@/lib/publish";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Portão de lançamento da edição diária.
// - Sem ?run=1: retorna o rascunho montado do dia (para REVISÃO/confirmação).
// - Com ?run=1 + CRON_SECRET: PUBLICA a edição do dia e suas atualizações.
//
// Este endpoint NÃO é agendado no cron — é o passo explícito de confirmação.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? todayISO();
  const shouldRun = url.searchParams.get("run") === "1";

  // Autorização (mesma do cron).
  const secret = process.env.CRON_SECRET;
  const provided =
    url.searchParams.get("secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";
  if (secret && provided !== secret) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Revisão: mostra o que seria publicado + relatório de lançamento.
  if (!shouldRun) {
    const [draft, report] = await Promise.all([
      getDailyDraft(date),
      buildLaunchReport(date),
    ]);
    return NextResponse.json({
      mode: "review",
      date,
      issue: draft.issue
        ? {
            title: draft.issue.title,
            status: draft.issue.status,
            issue_number: draft.issue.issue_number,
            what_matters: draft.issue.what_matters,
          }
        : null,
      report,
      hint: "Adicione ?run=1 e o CRON_SECRET para publicar.",
    });
  }

  const summary = await publishDailyIssue(date);
  return NextResponse.json({ mode: "publish", ...summary });
}
