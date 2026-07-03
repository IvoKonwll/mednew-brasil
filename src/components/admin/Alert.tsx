// Alerta de feedback (sucesso/erro/info) para o painel.
export function Alert({
  tone,
  children,
}: {
  tone: "success" | "error" | "info";
  children: React.ReactNode;
}) {
  const styles: Record<string, string> = {
    success: "border-impact-muda/30 bg-impact-muda/5 text-impact-muda",
    error: "border-impact-alerta/30 bg-impact-alerta/5 text-impact-alerta",
    info: "border-signal/30 bg-signal/5 text-signal",
  };
  const icon = tone === "success" ? "✓" : tone === "error" ? "!" : "i";
  return (
    <div
      role="status"
      className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${styles[tone]}`}
    >
      <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-current text-[0.6rem] font-bold text-white">
        {icon}
      </span>
      <span className="text-ink-soft">{children}</span>
    </div>
  );
}
