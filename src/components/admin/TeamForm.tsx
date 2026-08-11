import { AdminField } from "./fields";
import { AdminImageField } from "./ImageField";

type TeamFormValues = {
  name?: string;
  logoUrl?: string | null;
  captainName?: string | null;
  coachName?: string | null;
  city?: string | null;
};

export default function TeamForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => void;
  defaultValues?: TeamFormValues;
}) {
  return (
    <form action={action} className="grid max-w-xl gap-5 rounded-2xl border border-slate-200 bg-white p-6">
      <AdminField label="Название команды" name="name" required defaultValue={defaultValues?.name} />
      <AdminImageField
        label="Логотип команды"
        name="logoFile"
        currentUrl={defaultValues?.logoUrl}
        removeName="removeLogo"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <AdminField label="Капитан" name="captainName" defaultValue={defaultValues?.captainName ?? ""} />
        <AdminField label="Тренер" name="coachName" defaultValue={defaultValues?.coachName ?? ""} />
      </div>
      <AdminField label="Город / район" name="city" defaultValue={defaultValues?.city ?? "Актобе"} />
      <button
        type="submit"
        className="justify-self-start rounded-full bg-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
      >
        Сохранить
      </button>
    </form>
  );
}
