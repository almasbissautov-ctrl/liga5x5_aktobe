import { AdminField } from "./fields";

export default function RefereeForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => void;
  defaultValues?: { fullName?: string; phone?: string | null };
}) {
  return (
    <form action={action} className="grid max-w-md gap-5 rounded-2xl border border-slate-200 bg-white p-6">
      <AdminField label="ФИО судьи" name="fullName" required defaultValue={defaultValues?.fullName} />
      <AdminField label="Телефон" name="phone" type="tel" defaultValue={defaultValues?.phone ?? ""} />
      <button
        type="submit"
        className="justify-self-start rounded-full bg-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
      >
        Сохранить
      </button>
    </form>
  );
}
