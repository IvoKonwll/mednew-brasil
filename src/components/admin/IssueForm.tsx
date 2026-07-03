"use client";

import { useState } from "react";
import type { DailyIssue } from "@/lib/types";
import { CONTENT_STATUSES, STATUS_LABELS } from "@/lib/constants";
import { saveIssue } from "@/app/admin/actions";
import { FormSection, TextArea, TextField } from "./fields";
import { Alert } from "./Alert";

export function IssueForm({ issue }: { issue?: DailyIssue }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function action(fd: FormData) {
    setSaving(true);
    setError("");
    try {
      await saveIssue(issue?.id ?? null, fd);
    } catch (e) {
      setSaving(false);
      setError(e instanceof Error ? e.message : "Erro ao salvar.");
    }
  }

  return (
    <form action={action} className="space-y-6">
      <FormSection title="Boletim diário">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="issue_date"
            label="Data da edição"
            type="date"
            required
            defaultValue={issue?.issue_date}
          />
          <TextField
            name="issue_number"
            label="Número da edição"
            type="number"
            defaultValue={issue?.issue_number}
          />
        </div>
        <TextField
          name="title"
          label="Título do boletim"
          defaultValue={issue?.title}
          placeholder="Ex.: Boletim de 1 de julho de 2026"
        />
        <TextArea
          name="intro"
          label="Introdução / chamada"
          rows={3}
          defaultValue={issue?.intro}
        />
        <TextArea
          name="what_matters"
          label="O que realmente importa hoje"
          hint="Um destaque por linha (3 a 5 linhas)."
          rows={5}
          defaultValue={issue?.what_matters?.join("\n")}
        />
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
            defaultValue={issue?.status ?? "draft"}
            className="mt-1 w-full rounded-md border border-ink-line bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
          >
            {CONTENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </FormSection>

      {error && <Alert tone="error">{error}</Alert>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-navy px-5 py-2 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar boletim"}
        </button>
      </div>
    </form>
  );
}
