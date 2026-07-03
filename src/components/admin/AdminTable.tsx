export function AdminTable({
  headers,
  children,
  empty,
}: {
  headers: string[];
  children: React.ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-ink-line bg-paper-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-ink-line bg-paper-soft/50 text-xs uppercase tracking-wider text-ink-muted">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-line">
          {empty ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-10 text-center text-ink-muted"
              >
                Nada por aqui ainda.
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}
