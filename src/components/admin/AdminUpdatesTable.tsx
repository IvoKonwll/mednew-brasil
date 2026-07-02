"use client";

import { useMemo, useState } from "react";
import type { MedicalUpdate } from "@/lib/types";
import {
  CONTENT_STATUSES,
  EVIDENCE_TYPES,
  IMPACT_LEVELS,
  MEDICAL_AREAS,
  STATUS_LABELS,
} from "@/lib/constants";
import { AdminTable } from "./AdminTable";
import { RowActions } from "./RowActions";
import { ImpactBadge, StatusBadge } from "@/components/badges";
import { formatShortDate } from "@/lib/date";

const selectCls =
  "rounded-md border border-ink-line bg-white px-2.5 py-1.5 text-sm text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";

export function AdminUpdatesTable({
  updates,
  initialStatus = "",
}: {
  updates: MedicalUpdate[];
  initialStatus?: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [area, setArea] = useState("");
  const [evidence, setEvidence] = useState("");
  const [impact, setImpact] = useState("");
  const [date, setDate] = useState("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return updates.filter((u) => {
      if (status && u.status !== status) return false;
      if (area && u.area !== area) return false;
      if (evidence && u.evidence_type !== evidence) return false;
      if (impact && u.impact_level !== impact) return false;
      if (date && u.publication_date !== date) return false;
      if (query && !u.title.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [updates, status, area, evidence, impact, date, query]);

  const activeFilters = status || area || evidence || impact || date || query;

  function clearAll() {
    setStatus("");
    setArea("");
    setEvidence("");
    setImpact("");
    setDate("");
    setQuery("");
  }

  return (
    <div>
      {/* Filtros */}
      <div className="mb-4 space-y-3 rounded-lg border border-ink-line bg-paper-card p-4 shadow-card">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título..."
          className="w-full rounded-md border border-ink-line bg-white px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
        />
        <div className="flex flex-wrap items-center gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
            <option value="">Todos os status</option>
            {CONTENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <select value={area} onChange={(e) => setArea(e.target.value)} className={selectCls}>
            <option value="">Todas as áreas</option>
            {MEDICAL_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <select value={evidence} onChange={(e) => setEvidence(e.target.value)} className={selectCls}>
            <option value="">Toda evidência</option>
            {EVIDENCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select value={impact} onChange={(e) => setImpact(e.target.value)} className={selectCls}>
            <option value="">Todo impacto</option>
            {IMPACT_LEVELS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={selectCls}
          />
          {activeFilters && (
            <button
              onClick={clearAll}
              className="rounded-md px-2.5 py-1.5 text-sm font-medium text-signal hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>
        <p className="text-xs text-ink-muted">
          {filtered.length} de {updates.length} atualizações
        </p>
      </div>

      <AdminTable
        headers={["Título", "Área", "Evidência", "Impacto", "Status", "Ações"]}
        empty={filtered.length === 0}
      >
        {filtered.map((u) => (
          <tr key={u.id} className="hover:bg-paper-soft/40">
            <td className="px-4 py-3">
              <p className="font-medium text-ink">{u.title}</p>
              {u.publication_date && (
                <p className="text-xs text-ink-muted">
                  {formatShortDate(u.publication_date)}
                </p>
              )}
            </td>
            <td className="px-4 py-3 text-ink-soft">{u.area ?? "—"}</td>
            <td className="px-4 py-3 text-xs text-ink-muted">
              {u.evidence_type ?? "—"}
            </td>
            <td className="px-4 py-3">
              <ImpactBadge level={u.impact_level} />
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={u.status} />
            </td>
            <td className="px-4 py-3">
              <RowActions
                id={u.id}
                status={u.status}
                type="update"
                editHref={`/admin/updates/edit/${u.id}`}
              />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
