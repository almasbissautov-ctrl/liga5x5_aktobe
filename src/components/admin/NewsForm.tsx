import { AdminField, AdminTextarea, AdminCheckbox } from "./fields";

export default function NewsForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => void;
  defaultValues?: {
    title?: string;
    excerpt?: string | null;
    content?: string;
    coverImageUrl?: string | null;
    isPublished?: boolean;
  };
}) {
  return (
    <form action={action} className="grid max-w-2xl gap-5 rounded-2xl border border-slate-200 bg-white p-6">
      <AdminField label="Заголовок" name="title" required defaultValue={defaultValues?.title} />
      <AdminField label="Короткое описание" name="excerpt" defaultValue={defaultValues?.excerpt ?? ""} />
      <AdminTextarea label="Текст новости" name="content" required rows={8} defaultValue={defaultValues?.content} />
      <AdminField
        label="Обложка (URL изображения)"
        name="coverImageUrl"
        type="url"
        defaultValue={defaultValues?.coverImageUrl ?? ""}
      />
      <AdminCheckbox label="Опубликовать на сайте" name="isPublished" defaultChecked={defaultValues?.isPublished} />
      <button
        type="submit"
        className="justify-self-start rounded-full bg-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
      >
        Сохранить
      </button>
    </form>
  );
}
