export function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-ink">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="w-full rounded-md border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  required,
  rows = 4,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-ink">{label}</span>
      {hint && <span className="mb-1 block text-xs text-ink-faint">{hint}</span>}
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        rows={rows}
        className="w-full rounded-md border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
      />
    </label>
  );
}

export function Select({
  label,
  name,
  defaultValue,
  options,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-ink">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
