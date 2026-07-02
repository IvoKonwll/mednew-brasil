"use client";

import { useState } from "react";
import type { DailyIssue, FullMedicalUpdate } from "@/lib/types";
import {
  CONTENT_STATUSES,
  EVIDENCE_STRENGTHS,
  EVIDENCE_TYPES,
  IMPACT_LEVELS,
  MEDICAL_AREAS,
  STATUS_LABELS,
} from "@/lib/constants";
import { saveUpdate } from "@/app/admin/actions";
import {
  CheckboxField,
  FormSection,
  SelectField,
  TextArea,
  TextField,
} from "./fields";
import { SourceFormRepeater } from "./SourceFormRepeater";

export function UpdateForm({
  update,
  issues,
}: {
  update?: FullMedicalUpdate;
  issues: DailyIssue[];
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const s = update?.study_details;
  const m = update?.mechanism_details;
  const c = update?.critical_appraisal;

  async function action(fd: FormData) {
    setSaving(true);
    setError("");
    try {
      await saveUpdate(update?.id ?? null, fd);
    } catch (e) {
      setSaving(false);
      setError(e instanceof Error ? e.message : "Erro ao salvar.");
    }
  }

  return (
    <form action={action} className="space-y-6">
      {/* 1. Identificação */}
      <FormSection title="1. Identificação">
        <TextField
          name="title"
          label="Título"
          required
          defaultValue={update?.title}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="slug"
            label="Slug"
            defaultValue={update?.slug}
            placeholder="gerado automaticamente se vazio"
          />
          <TextField
            name="publication_date"
            label="Data de publicação"
            type="date"
            defaultValue={update?.publication_date}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            name="area"
            label="Área médica"
            options={MEDICAL_AREAS}
            defaultValue={update?.area}
          />
          <TextField
            name="reading_time_minutes"
            label="Leitura estimada (min)"
            type="number"
            defaultValue={update?.reading_time_minutes}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="daily_issue_id"
              className="block text-sm font-medium text-ink-soft"
            >
              Boletim associado
            </label>
            <select
              id="daily_issue_id"
              name="daily_issue_id"
              defaultValue={update?.daily_issue_id ?? ""}
              className="mt-1 w-full rounded-md border border-ink-line bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
            >
              <option value="">— Nenhum —</option>
              {issues.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.issue_date} · {it.title ?? "sem título"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-ink-soft"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={update?.status ?? "draft"}
              className="mt-1 w-full rounded-md border border-ink-line bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
            >
              {CONTENT_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {STATUS_LABELS[st]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FormSection>

      {/* 2. Resumo editorial */}
      <FormSection title="2. Resumo editorial">
        <TextArea
          name="short_summary"
          label="Resumo curto"
          rows={2}
          defaultValue={update?.short_summary}
        />
        <TextArea
          name="what_matters"
          label="O que realmente importa"
          hint="3 a 5 linhas com a mensagem central."
          rows={4}
          defaultValue={update?.what_matters}
        />
        <TextArea
          name="clinical_context"
          label="Contexto clínico"
          rows={4}
          defaultValue={update?.clinical_context}
        />
      </FormSection>

      {/* 3. Evidência */}
      <FormSection title="3. Evidência">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            name="evidence_type"
            label="Tipo de evidência"
            options={EVIDENCE_TYPES}
            defaultValue={update?.evidence_type}
          />
          <SelectField
            name="evidence_strength"
            label="Força da evidência"
            options={EVIDENCE_STRENGTHS}
            defaultValue={update?.evidence_strength}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="study_phase" label="Fase do estudo" defaultValue={s?.study_phase} />
          <TextField name="study_design" label="Desenho do estudo" defaultValue={s?.study_design} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField name="randomization" label="Randomização" defaultValue={s?.randomization} />
          <TextField name="blinding" label="Cegamento" defaultValue={s?.blinding} />
          <TextField name="sample_size" label="Tamanho da amostra" type="number" defaultValue={s?.sample_size} />
        </div>
        <CheckboxField name="multicenter" label="Estudo multicêntrico" defaultChecked={s?.multicenter} />
        <TextArea name="population" label="População" rows={2} defaultValue={s?.population} />
        <TextArea name="inclusion_criteria" label="Critérios de inclusão" rows={2} defaultValue={s?.inclusion_criteria} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="follow_up" label="Tempo de seguimento" defaultValue={s?.follow_up} />
          <TextField name="intervention" label="Intervenção" defaultValue={s?.intervention} />
        </div>
        <TextField name="control_group" label="Grupo controle" defaultValue={s?.control_group} />
        <TextArea name="primary_outcome" label="Desfecho primário" rows={2} defaultValue={s?.primary_outcome} />
        <TextArea name="secondary_outcomes" label="Desfechos secundários" rows={2} defaultValue={s?.secondary_outcomes} />
        <TextArea name="main_results" label="Como interpretar o resultado" rows={3} defaultValue={s?.main_results} />

        <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Resultados que importam
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="effect_size" label="Tamanho de efeito" defaultValue={s?.effect_size} />
          <TextField name="absolute_risk_reduction" label="Redução absoluta de risco" defaultValue={s?.absolute_risk_reduction} />
          <TextField name="nnt" label="NNT" defaultValue={s?.nnt} />
          <TextField name="hazard_ratio" label="Hazard ratio (HR)" defaultValue={s?.hazard_ratio} />
          <TextField name="relative_risk" label="Risco relativo (RR)" defaultValue={s?.relative_risk} />
          <TextField name="odds_ratio" label="Odds ratio (OR)" defaultValue={s?.odds_ratio} />
          <TextField name="p_value" label="Valor de p" defaultValue={s?.p_value} />
          <TextField name="confidence_interval" label="Intervalo de confiança" defaultValue={s?.confidence_interval} />
        </div>
      </FormSection>

      {/* 4. Mecanismo */}
      <FormSection title="4. Mecanismo e fisiopatologia">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="drug_class" label="Classe do medicamento" defaultValue={m?.drug_class} />
          <TextField name="mechanism_target" label="Alvo molecular / fisiológico" defaultValue={m?.mechanism_target} />
        </div>
        <TextArea name="mechanism" label="Mecanismo de ação" rows={4} defaultValue={m?.mechanism} />
        <TextArea name="disease_pathophysiology" label="Fisiopatologia da doença" rows={4} defaultValue={m?.disease_pathophysiology} />
        <TextArea name="why_it_works" label="Por que isso melhora a doença" rows={3} defaultValue={m?.why_it_works} />
        <TextArea name="mechanism_based_adverse_effects" label="Efeitos adversos esperados pelo mecanismo" rows={3} defaultValue={m?.mechanism_based_adverse_effects} />
      </FormSection>

      {/* 5. Interpretação crítica */}
      <FormSection title="5. Interpretação crítica">
        <TextArea name="limitations" label="Limitações" rows={3} defaultValue={c?.limitations} />
        <TextArea name="critical_interpretation" label="Interpretação crítica" rows={3} defaultValue={c?.critical_interpretation} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="conflicts_of_interest" label="Conflitos de interesse" defaultValue={c?.conflicts_of_interest} />
          <TextField name="funding" label="Financiamento" defaultValue={c?.funding} />
        </div>
      </FormSection>

      {/* 6. Impacto prático */}
      <FormSection title="6. Impacto prático e contexto Brasil">
        <SelectField
          name="impact_level"
          label="Nível de impacto"
          options={IMPACT_LEVELS}
          defaultValue={update?.impact_level}
        />
        <TextArea name="practical_impact" label="O que significa na prática" rows={3} defaultValue={c?.practical_impact} />
        <TextArea name="brazil_context" label="Contexto no Brasil" rows={3} defaultValue={c?.brazil_context} />
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField name="anvisa_status" label="Situação na Anvisa" defaultValue={c?.anvisa_status} />
          <TextField name="conitec_status" label="CONITEC" defaultValue={c?.conitec_status} />
          <TextField name="sus_status" label="SUS" defaultValue={c?.sus_status} />
        </div>
        <div className="flex flex-wrap gap-6">
          <CheckboxField name="brazil_available" label="Disponível no Brasil" defaultChecked={c?.brazil_available} />
          <CheckboxField name="changes_practice_now" label="Muda conduta agora" defaultChecked={c?.changes_practice_now} />
        </div>
      </FormSection>

      {/* 7. Fontes */}
      <FormSection
        title="7. Fontes confiáveis"
        description="Adicione uma ou mais fontes. Marque as fontes primárias."
      >
        <SourceFormRepeater initial={update?.sources} />
      </FormSection>

      {error && <p className="text-sm text-impact-alerta">{error}</p>}

      <div className="sticky bottom-0 flex gap-3 border-t border-ink-line bg-paper/95 py-4 backdrop-blur">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-navy px-5 py-2 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar atualização"}
        </button>
      </div>
    </form>
  );
}
