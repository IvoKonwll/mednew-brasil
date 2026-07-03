export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-ink-line bg-paper-soft/50 px-6 py-12 text-center">
      <p className="font-serif text-lg font-semibold text-ink">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
