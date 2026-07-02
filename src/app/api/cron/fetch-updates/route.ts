import { NextResponse } from "next/server";
import { integrations } from "@/lib/integrations";

// Rota placeholder para a futura coleta automática de fontes.
// Quando implementada, iterará sobre `integrations`, coletará itens e
// os inserirá em `raw_updates` (status "pending") para revisão editorial.
export async function GET() {
  const sources = Object.keys(integrations);

  return NextResponse.json({
    message:
      "Future integration with PubMed, FDA, EMA, WHO, Anvisa, CDC, NICE and ClinicalTrials.gov",
    registeredIntegrations: sources,
    status: "placeholder",
  });
}
