"use client";

import { useState } from "react";
import { SOURCE_TYPES, PRIMARY_SOURCE_TYPES } from "@/lib/constants";
import type { Source } from "@/lib/types";

export interface SourceDraft {
  source_name: string;
  source_type: string;
  url: string;
  is_primary: boolean;
  accessed_at: string;
  notes: string;
}

const empty = (): SourceDraft => ({
  source_name: "",
  source_type: "Artigo original",
  url: "",
  is_primary: true,
  accessed_at: "",
  notes: "",
});

// Gerencia múltiplas fontes e serializa em um input hidden "sources_json".
export function SourceFormRepeater({
  initial,
}: {
  initial?: Source[];
}) {
  const [sources, setSources] = useState<SourceDraft[]>(
    initial && initial.length > 0
      ? initial.map((s) => ({
          source_name: s.source_name,
          source_type: s.source_type,
          url: s.url,
          is_primary: s.is_primary,
          accessed_at: s.accessed_at ?? "",
          notes: s.notes ?? "",
        }))
      : [empty()],
  );

  function update(i: number, patch: Partial<SourceDraft>) {
    setSources((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    );
  }

  function remove(i: number) {
    setSources((prev) => prev.filter((_, idx) => idx !== i));
  }

  const inputCls =
    "w-full rounded-md border border-ink-line bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";

  return (
    <div className="space-y-4">
      <input
        type="hidden"
        name="sources_json"
        value={JSON.stringify(sources.filter((s) => s.source_name && s.url))}
      />

      {sources.map((s, i) => (
        <div
          key={i}
          className="space-y-3 rounded-md border border-ink-line bg-paper-soft/30 p-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className={inputCls}
              placeholder="Nome da fonte"
              value={s.source_name}
              onChange={(e) => update(i, { source_name: e.target.value })}
            />
            <select
              className={inputCls}
              value={s.source_type}
              onChange={(e) => {
                const source_type = e.target.value;
                update(i, {
                  source_type,
                  is_primary: PRIMARY_SOURCE_TYPES.includes(
                    source_type as (typeof PRIMARY_SOURCE_TYPES)[number],
                  ),
                });
              }}
            >
              {SOURCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <input
            className={inputCls}
            placeholder="https://..."
            value={s.url}
            onChange={(e) => update(i, { url: e.target.value })}
          />
          <div className="grid items-center gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              Acessado em
              <input
                type="date"
                className={inputCls}
                value={s.accessed_at}
                onChange={(e) => update(i, { accessed_at: e.target.value })}
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={s.is_primary}
                onChange={(e) => update(i, { is_primary: e.target.checked })}
                className="h-4 w-4 rounded border-ink-line text-navy focus:ring-navy"
              />
              Fonte primária
            </label>
          </div>
          <input
            className={inputCls}
            placeholder="Notas (opcional)"
            value={s.notes}
            onChange={(e) => update(i, { notes: e.target.value })}
          />
          {sources.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-xs font-medium text-impact-alerta hover:underline"
            >
              Remover fonte
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => setSources((prev) => [...prev, empty()])}
        className="rounded-md border border-navy/30 px-4 py-2 text-sm font-medium text-navy-500 hover:bg-navy/5"
      >
        + Adicionar fonte
      </button>
    </div>
  );
}
