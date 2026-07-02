// Integração com ClinicalTrials.gov (API v2). API pública, sem chave.
//
// Traz estudos recém-atualizados por termo. Objetivo: acompanhar ensaios
// clínicos relevantes para curadoria editorial.

import { fetchJson } from "./http";
import type {
  FetchOptions,
  IntegrationFetcher,
  IntegrationResult,
  RawUpdateInput,
} from "./types";

const API = "https://clinicaltrials.gov/api/v2/studies";

interface CtgResponse {
  studies?: Array<{
    protocolSection?: {
      identificationModule?: { nctId?: string; briefTitle?: string };
      statusModule?: {
        overallStatus?: string;
        lastUpdatePostDateStruct?: { date?: string };
      };
      designModule?: { phases?: string[] };
    };
  }>;
}

export const clinicaltrialsFetcher: IntegrationFetcher = async (
  options?: FetchOptions,
): Promise<IntegrationResult> => {
  const now = new Date().toISOString();
  const limit = Math.min(options?.limit ?? 10, 50);
  const term = options?.query ?? "phase 3";

  const url =
    `${API}?pageSize=${limit}` +
    `&sort=LastUpdatePostDate:desc` +
    `&fields=protocolSection` +
    `&query.term=${encodeURIComponent(term)}`;

  const data = await fetchJson<CtgResponse>(url);
  const studies = data?.studies ?? [];

  const items: RawUpdateInput[] = studies
    .map((st): RawUpdateInput | null => {
      const idm = st.protocolSection?.identificationModule;
      const nctId = idm?.nctId;
      const title = idm?.briefTitle;
      if (!nctId || !title) return null;
      const phases = st.protocolSection?.designModule?.phases ?? [];
      const status = st.protocolSection?.statusModule?.overallStatus ?? "";
      const updated =
        st.protocolSection?.statusModule?.lastUpdatePostDateStruct?.date ?? null;
      return {
        title,
        source_name: `ClinicalTrials.gov · ${nctId}`,
        source_url: `https://clinicaltrials.gov/study/${nctId}`,
        source_type: "ClinicalTrials.gov",
        published_at: updated ? safeDate(updated) : null,
        raw_summary: [phases.join("/"), status].filter(Boolean).join(" · ") || null,
        raw_payload: { nctId, phases, status },
      };
    })
    .filter((x): x is RawUpdateInput => x !== null);

  return {
    source: "ClinicalTrials.gov",
    fetchedAt: now,
    items,
    placeholder: false,
  };
};

function safeDate(value: string): string | null {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
