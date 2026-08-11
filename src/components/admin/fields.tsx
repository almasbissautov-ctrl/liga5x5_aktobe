export function AdminField({
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number | null;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-blue"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
      />
    </div>
  );
}

export function AdminTextarea({
  label,
  name,
  required,
  rows = 4,
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-blue"> *</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
      />
    </div>
  );
}

export function AdminSelect({
  label,
  name,
  required,
  defaultValue,
  options,
  placeholder = "Выберите…",
}: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-blue"> *</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AdminCheckbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-slate-300 text-blue focus:ring-blue/30"
      />
      {label}
    </label>
  );
}
