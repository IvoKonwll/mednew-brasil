// Campos de formulário reutilizáveis (usados por IssueForm e UpdateForm).

const labelCls = "block text-sm font-medium text-ink-soft";
const inputCls =
  "mt-1 w-full rounded-md border border-ink-line bg-white px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";

export function TextField({
  name,
  label,
  defaultValue,
  required,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelCls}>
        {label} {required && <span className="text-impact-alerta">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? undefined}
        className={inputCls}
      />
    </div>
  );
}

export function TextArea({
  name,
  label,
  defaultValue,
  rows = 3,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelCls}>
        {label}
      </label>
      {hint && <p className="text-xs text-ink-muted">{hint}</p>}
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? undefined}
        className={inputCls}
      />
    </div>
  );
}

export function SelectField({
  name,
  label,
  options,
  defaultValue,
  required,
  includeEmpty = true,
}: {
  name: string;
  label: string;
  options: readonly string[];
  defaultValue?: string | null;
  required?: boolean;
  includeEmpty?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelCls}>
        {label} {required && <span className="text-impact-alerta">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className={inputCls}
      >
        {includeEmpty && <option value="">—</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CheckboxField({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean | null;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-soft">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={defaultChecked ?? false}
        className="h-4 w-4 rounded border-ink-line text-navy focus:ring-navy"
      />
      {label}
    </label>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-lg border border-ink-line bg-paper-card p-5">
      <legend className="px-2 font-serif text-lg font-semibold text-ink">
        {title}
      </legend>
      {description && (
        <p className="mb-3 text-sm text-ink-muted">{description}</p>
      )}
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}
