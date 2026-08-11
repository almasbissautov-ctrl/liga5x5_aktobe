import { AdminField, AdminCheckbox } from "./fields";
import { AdminImageField } from "./ImageField";

export default function SponsorForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => void;
  defaultValues?: {
    name?: string;
    logoUrl?: string | null;
    websiteUrl?: string | null;
    displayOrder?: number;
    isActive?: boolean;
  };
}) {
  return (
    <form action={action} className="grid max-w-md gap-5 rounded-2xl border border-slate-200 bg-white p-6">
      <AdminField label="Название" name="name" required defaultValue={defaultValues?.name} />
      <AdminImageField
        label="Логотип спонсора"
        name="logoFile"
        currentUrl={defaultValues?.logoUrl}
        removeName="removeLogo"
      />
      <AdminField label="Сайт" name="websiteUrl" type="url" defaultValue={defaultValues?.websiteUrl ?? ""} />
      <AdminField
        label="Порядок отображения"
        name="displayOrder"
        type="number"
        defaultValue={defaultValues?.displayOrder ?? 0}
      />
      <AdminCheckbox label="Активен (показывать на сайте)" name="isActive" defaultChecked={defaultValues?.isActive ?? true} />
      <button
        type="submit"
        className="justify-self-start rounded-full bg-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
      >
        Сохранить
      </button>
    </form>
  );
}
