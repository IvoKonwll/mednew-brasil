import { NextResponse } from "next/server";
import { integrations } from "@/lib/integrations";
import { collectRawUpdates } from "@/lib/collect";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Coleta automática de fontes.
// - Sem parâmetro: descreve as integrações (compatível com o placeholder).
// - Com ?run=1 e o CRON_SECRET correto: executa a coleta e grava em raw_updates.
//
// Configuração de agendamento em vercel.json (cron diário). Proteja com
// CRON_SECRET: chame /api/cron/fetch-updates?run=1&secret=SEU_SEGREDO
// ou envie o header "authorization: Bearer SEU_SEGREDO" (Vercel Cron).
export async function GET(request: Request) {
  const url = new URL(request.url);
  const shouldRun = url.searchParams.get("run") === "1";

  if (!shouldRun) {
    return NextResponse.json({
      message:
        "Future integration with PubMed, FDA, EMA, WHO, Anvisa, CDC, NICE and ClinicalTrials.gov",
      registeredIntegrations: Object.keys(integrations),
      status: "idle",
      hint: "Chame com ?run=1 e o CRON_SECRET para executar a coleta.",
    });
  }

  // Autorização do cron.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const provided =
      url.searchParams.get("secret") ??
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
      "";
    if (provided !== secret) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
  }

  const limit = Number(url.searchParams.get("limit") ?? 10);
  const summary = await collectRawUpdates({
    limit: Number.isFinite(limit) ? limit : 10,
  });

  return NextResponse.json({
    status: summary.ran ? "ok" : "skipped",
    ...summary,
  });
}
