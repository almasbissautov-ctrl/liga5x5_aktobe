import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "media";
const MAX_SIZE = 5 * 1024 * 1024; // 5 МБ
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// Загружает файл в Supabase Storage (бакет "media") и возвращает публичную
// ссылку. Требует авторизованную сессию администратора (RLS-политики
// бакета разрешают запись только роли authenticated).
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Неподдерживаемый формат файла. Разрешены JPG, PNG, WEBP, GIF.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Файл слишком большой. Максимальный размер — 5 МБ.");
  }

  const ext = ALLOWED_EXT[file.type] ?? "jpg";
  const path = `${folder}/${randomUUID()}.${ext}`;

  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    console.error("[storage] upload error:", error);
    throw new Error("Не удалось загрузить изображение. Попробуйте ещё раз.");
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Best-effort удаление старого файла при замене/удалении изображения.
// Не бросает ошибку наружу — отсутствие файла или сетевой сбой не должны
// ломать основное действие (сохранение команды/игрока/спонсора).
export async function deleteImageByUrl(url: string | null | undefined) {
  if (!url) return;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);
  if (!path) return;

  try {
    const supabase = createClient();
    await supabase.storage.from(BUCKET).remove([path]);
  } catch (error) {
    console.error("[storage] delete error:", error);
  }
}

// Определяет итоговый URL изображения для create/update-действий:
// - если в форме выбран новый файл — загружает его и удаляет старый (если был);
// - если отмечен чекбокс удаления — удаляет старый файл и возвращает null;
// - иначе оставляет текущее значение без изменений.
export async function resolveImageUrl(
  formData: FormData,
  opts: { fileField: string; removeField?: string; folder: string; existingUrl?: string | null }
): Promise<string | null> {
  const file = formData.get(opts.fileField);
  if (file instanceof File && file.size > 0) {
    const newUrl = await uploadImage(file, opts.folder);
    if (opts.existingUrl) await deleteImageByUrl(opts.existingUrl);
    return newUrl;
  }
  if (opts.removeField && formData.get(opts.removeField) === "on") {
    if (opts.existingUrl) await deleteImageByUrl(opts.existingUrl);
    return null;
  }
  return opts.existingUrl ?? null;
}
