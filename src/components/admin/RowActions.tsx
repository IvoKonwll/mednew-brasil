"use client";

import Link from "next/link";
import { useTransition } from "react";
import type { ContentStatus } from "@/lib/constants";
import {
  deleteIssue,
  deleteUpdate,
  setIssueStatus,
  setUpdateStatus,
} from "@/app/admin/actions";

export function RowActions({
  id,
  status,
  type,
  editHref,
}: {
  id: string;
  status: ContentStatus;
  type: "issue" | "update";
  editHref: string;
}) {
  const [pending, startTransition] = useTransition();

  const setStatus = (s: ContentStatus) =>
    startTransition(async () => {
      if (type === "issue") await setIssueStatus(id, s);
      else await setUpdateStatus(id, s);
    });

  const remove = () =>
    startTransition(async () => {
      if (!confirm("Excluir definitivamente? Esta ação não pode ser desfeita."))
        return;
      if (type === "issue") await deleteIssue(id);
      else await deleteUpdate(id);
    });

  const btn =
    "rounded px-2 py-1 text-xs font-medium transition disabled:opacity-50";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Link
        href={editHref}
        className={`${btn} border border-ink-line text-ink-soft hover:bg-paper-soft`}
      >
        Editar
      </Link>
      {status !== "published" ? (
        <button
          disabled={pending}
          onClick={() => setStatus("published")}
          className={`${btn} bg-impact-muda/10 text-impact-muda hover:bg-impact-muda/20`}
        >
          Publicar
        </button>
      ) : (
        <button
          disabled={pending}
          onClick={() => setStatus("draft")}
          className={`${btn} bg-ink/5 text-ink-soft hover:bg-ink/10`}
        >
          Despublicar
        </button>
      )}
      {status !== "review" && status !== "published" && (
        <button
          disabled={pending}
          onClick={() => setStatus("review")}
          className={`${btn} bg-impact-acompanhar/10 text-impact-acompanhar hover:bg-impact-acompanhar/20`}
        >
          Em revisão
        </button>
      )}
      {type === "update" && status !== "archived" && (
        <button
          disabled={pending}
          onClick={() => setStatus("archived")}
          className={`${btn} bg-ink/5 text-ink-soft hover:bg-ink/10`}
        >
          Arquivar
        </button>
      )}
      <button
        disabled={pending}
        onClick={remove}
        className={`${btn} text-impact-alerta hover:bg-impact-alerta/10`}
      >
        Excluir
      </button>
    </div>
  );
}
