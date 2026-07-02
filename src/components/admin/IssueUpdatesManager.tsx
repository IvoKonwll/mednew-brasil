"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { MedicalUpdate } from "@/lib/types";
import { setIssueUpdates } from "@/app/admin/actions";
import { ImpactBadge, StatusBadge } from "@/components/badges";
import { Alert } from "./Alert";

// Monta a edição: escolhe quais updates entram e em que ordem (por relevância).
export function IssueUpdatesManager({
  issueId,
  allUpdates,
  associatedIds,
}: {
  issueId: string;
  allUpdates: MedicalUpdate[];
  associatedIds: string[];
}) {
  // Ordem inicial: associados primeiro (na ordem recebida).
  const [selected, setSelected] = useState<string[]>(associatedIds);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(
    null,
  );

  const byId = new Map(allUpdates.map((u) => [u.id, u]));
  const available = allUpdates.filter((u) => !selected.includes(u.id));

  function add(id: string) {
    setSelected((prev) => [...prev, id]);
    setMsg(null);
  }
  function removeItem(id: string) {
    setSelected((prev) => prev.filter((x) => x !== id));
    setMsg(null);
  }
  function move(index: number, dir: -1 | 1) {
    setSelected((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
    setMsg(null);
  }

  function save() {
    startTransition(async () => {
      try {
        await setIssueUpdates(issueId, selected);
        setMsg({ tone: "success", text: "Edição montada e ordenada." });
      } catch (e) {
        setMsg({
          tone: "error",
          text: e instanceof Error ? e.message : "Erro ao salvar.",
        });
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Selecionados / ordenáveis */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">
            Nesta edição ({selected.length})
          </p>
          <span className="text-xs text-ink-muted">
            Ordene por relevância — o topo aparece primeiro
          </span>
        </div>
        {selected.length === 0 ? (
          <p className="rounded-md border border-dashed border-ink-line bg-paper-soft/40 px-3 py-4 text-sm text-ink-muted">
            Nenhuma atualização associada ainda. Adicione abaixo.
          </p>
        ) : (
          <ul className="space-y-2">
            {selected.map((id, i) => {
              const u = byId.get(id);
              if (!u) return null;
              return (
                <li
                  key={id}
                  className="flex items-center gap-3 rounded-md border border-ink-line bg-paper-card p-3"
                >
                  <span className="font-serif text-lg font-bold text-signal tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {u.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={u.status} />
                      <ImpactBadge level={u.impact_level} />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="rounded border border-ink-line px-2 py-1 text-xs disabled:opacity-30"
                      aria-label="Mover para cima"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === selected.length - 1}
                      className="rounded border border-ink-line px-2 py-1 text-xs disabled:opacity-30"
                      aria-label="Mover para baixo"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(id)}
                      className="rounded px-2 py-1 text-xs font-medium text-impact-alerta hover:bg-impact-alerta/10"
                    >
                      Remover
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Disponíveis */}
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">
          Disponíveis ({available.length})
        </p>
        {available.length === 0 ? (
          <p className="text-sm text-ink-muted">
            Todas as atualizações já estão nesta edição, ou não há outras.{" "}
            <Link href="/admin/updates/new" className="text-signal hover:underline">
              Criar nova →
            </Link>
          </p>
        ) : (
          <ul className="max-h-64 space-y-1.5 overflow-y-auto rounded-md border border-ink-line bg-paper-soft/30 p-2">
            {available.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between gap-2 rounded px-2 py-1.5 hover:bg-paper-card"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink-soft">{u.title}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <StatusBadge status={u.status} />
                    <span className="text-xs text-ink-muted">
                      {u.area ?? "—"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => add(u.id)}
                  className="shrink-0 rounded border border-signal/30 px-2 py-1 text-xs font-semibold text-signal hover:bg-signal/5"
                >
                  + Adicionar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}

      <button
        type="button"
        onClick={save}
        disabled={pending}
        className="rounded-md bg-navy px-5 py-2 font-semibold text-white shadow-card transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar composição da edição"}
      </button>
    </div>
  );
}
