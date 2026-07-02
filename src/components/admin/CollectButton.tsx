"use client";

import { useState, useTransition } from "react";
import { runCollectionAction } from "@/app/admin/actions";
import type { CollectionSummary } from "@/lib/collect";
import { Alert } from "./Alert";

export function CollectButton() {
  const [pending, startTransition] = useTransition();
  const [summary, setSummary] = useState<CollectionSummary | null>(null);
  const [error, setError] = useState("");

  function run() {
    setError("");
    setSummary(null);
    startTransition(async () => {
      try {
        const res = await runCollectionAction();
        setSummary(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha na coleta.");
      }
    });
  }

  return (
    <div className="space-y-3">
      <button
        onClick={run}
        disabled={pending}
        className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Coletando..." : "Coletar agora"}
      </button>

      {error && <Alert tone="error">{error}</Alert>}

      {summary && (
        <Alert tone={summary.ran ? "success" : "info"}>
          {summary.ran ? (
            <span>
              Coleta concluída: {summary.totalInserted} novo(s) item(ns) de{" "}
              {summary.totalFetched} coletado(s).{" "}
              {summary.perSource
                .map((s) => `${s.source}: ${s.inserted}`)
                .join(" · ")}
              {summary.errors.length > 0 && (
                <span className="block text-impact-alerta">
                  Erros: {summary.errors.join("; ")}
                </span>
              )}
            </span>
          ) : (
            <span>
              Coleta não executada. {summary.errors.join("; ") || "Verifique a configuração."}
            </span>
          )}
        </Alert>
      )}
    </div>
  );
}
