import { AdminField, AdminSelect, AdminCheckbox } from "./fields";
import { AdminImageField } from "./ImageField";

type PlayerFormValues = {
  teamId?: string;
  fullName?: string;
  number?: number | null;
  position?: string | null;
  photoUrl?: string | null;
  isCaptain?: boolean;
};

export default function PlayerForm({
  action,
  teams,
  defaultValues,
}: {
  action: (formData: FormData) => void;
  teams: { id: string; name: string }[];
  defaultValues?: PlayerFormValues;
}) {
  return (
    <form action={action} className="grid max-w-xl gap-5 rounded-2xl border border-slate-200 bg-white p-6">
      <AdminSelect
        label="Команда"
        name="teamId"
        required
        defaultValue={defaultValues?.teamId}
        options={teams.map((t) => ({ value: t.id, label: t.name }))}
      />
      <AdminField label="ФИО игрока" name="fullName" required defaultValue={defaultValues?.fullName} />
      <div className="grid gap-5 sm:grid-cols-2">
        <AdminField label="Игровой номер" name="number" type="number" defaultValue={defaultValues?.number ?? ""} />
        <AdminSelect
          label="Позиция"
          name="position"
          defaultValue={defaultValues?.position ?? ""}
          options={[
            { value: "GK", label: "Вратарь" },
            { value: "DEF", label: "Защитник" },
            { value: "MID", label: "Полузащитник" },
            { value: "FWD", label: "Нападающий" },
          ]}
        />
      </div>
      <AdminImageField
        label="Фото игрока"
        name="photoFile"
        currentUrl={defaultValues?.photoUrl}
        removeName="removePhoto"
      />
      <AdminCheckbox label="Капитан команды" name="isCaptain" defaultChecked={defaultValues?.isCaptain} />
      <button
        type="submit"
        className="justify-self-start rounded-full bg-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
      >
        Сохранить
      </button>
    </form>
  );
}
