import { NextResponse } from "next/server";
import { applyEnrichment, type EnrichPatch } from "@/lib/enrich";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Enriquecimento da análise clínica de atualizações — protegido por CRON_SECRET.
// Recebe patches por id ou slug e grava campos clínicos (tipo de estudo,
// mecanismo, leitura crítica, impacto). NÃO publica — apenas preenche o rascunho.
//
// Body JSON: { "items": [ { "slug": "...", "evidence_type": "...",
//   "impact_level": "...", "mechanism": {...}, "study": {...}, "appraisal": {...} } ] }
export async function POST(request: Request) {
  const url = new URL(request.url);

  // Autorização (mesma dos demais endpoints de cron).
  const secret = process.env.CRON_SECRET;
  const provided =
    url.searchParams.get("secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";
  if (secret && provided !== secret) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  let items: EnrichPatch[];
  try {
    const body = await request.json();
    items = Array.isArray(body?.items) ? (body.items as EnrichPatch[]) : [];
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (items.length === 0) {
    return NextResponse.json(
      { error: "Envie 'items' com ao menos um patch (id ou slug)." },
      { status: 400 },
    );
  }

  const results = await applyEnrichment(items);
  return NextResponse.json({
    ok: true,
    applied: results.filter((r) => r.ok).length,
    total: results.length,
    results,
  });
}
