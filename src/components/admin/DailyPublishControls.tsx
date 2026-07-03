"use client";

import { useState, useTransition } from "react";
import { assembleTodayAction, publishTodayAction } from "@/app/admin/actions";
import { Alert } from "./Alert";

export function DailyPublishControls() {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ tone: "success" | "error" | "info"; text: string } | null>(
    null,
  );

  function assemble() {
    setMsg(null);
    startTransition(async () => {
      try {
        const r = await assembleTodayAction();
        setMsg({
          tone: r.ran ? "success" : "info",
          text: r.ran
            ? `Rascunho montado: ${r.createdUpdates} atualização(ões) adicionada(s) à edição de hoje.`
            : `Não montado. ${r.errors.join("; ")}`,
        });
      } catch (e) {
        setMsg({ tone: "error", text: e instanceof Error ? e.message : "Erro." });
      }
    });
  }

  function publish() {
    if (
      !confirm(
        "Confirmar e PUBLICAR a edição de hoje? Ela ficará visível no site imediatamente.",
      )
    )
      return;
    setMsg(null);
    startTransition(async () => {
      try {
        const r = await publishTodayAction();
        setMsg({
          tone: r.publishedIssue ? "success" : "error",
          text: r.publishedIssue
            ? `Edição publicada — ${r.publishedUpdates} atualização(ões) no ar.`
            : `Não publicada. ${r.errors.join("; ") || "Verifique se há edição de hoje."}`,
        });
      } catch (e) {
        setMsg({ tone: "error", text: e instanceof Error ? e.message : "Erro." });
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={assemble}
          disabled={pending}
          className="rounded-md border border-ink-line bg-paper-card px-4 py-2 text-sm font-semibold text-ink-soft shadow-card transition hover:bg-paper-soft disabled:opacity-60"
        >
          {pending ? "..." : "Montar rascunho de hoje"}
        </button>
        <button
          onClick={publish}
          disabled={pending}
          className="rounded-md bg-impact-muda px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "..." : "Confirmar e publicar hoje"}
        </button>
      </div>
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
    </div>
  );
}
