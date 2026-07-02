"use client";

import { useTransition } from "react";
import { promoteRawToUpdate, setRawStatus } from "@/app/admin/actions";

export function RawActions({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const btn = "rounded px-2 py-1 text-xs font-medium transition disabled:opacity-50";

  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        disabled={pending}
        onClick={() => startTransition(() => promoteRawToUpdate(id))}
        className={`${btn} bg-navy/10 text-navy hover:bg-navy/20`}
      >
        Promover → rascunho
      </button>
      <button
        disabled={pending}
        onClick={() => startTransition(() => setRawStatus(id, "reviewed"))}
        className={`${btn} bg-impact-muda/10 text-impact-muda hover:bg-impact-muda/20`}
      >
        Revisado
      </button>
      <button
        disabled={pending}
        onClick={() => startTransition(() => setRawStatus(id, "discarded"))}
        className={`${btn} text-impact-alerta hover:bg-impact-alerta/10`}
      >
        Descartar
      </button>
    </div>
  );
}
