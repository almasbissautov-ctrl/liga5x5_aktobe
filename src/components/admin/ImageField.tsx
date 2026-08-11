"use client";

import { useState } from "react";

export function AdminImageField({
  label,
  name,
  currentUrl,
  removeName,
}: {
  label: string;
  name: string;
  currentUrl?: string | null;
  removeName?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [willRemove, setWillRemove] = useState(false);

  const shownUrl = preview ?? (willRemove ? null : currentUrl);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {shownUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shownUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-slate-400">нет фото</span>
          )}
        </div>
        <div className="flex-1">
          <input
            id={name}
            name={name}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : null);
              if (file) setWillRemove(false);
            }}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white file:cursor-pointer hover:file:bg-blue-dark"
          />
          <p className="mt-1 text-xs text-slate-400">JPG, PNG, WEBP или GIF, до 5 МБ.</p>
          {removeName && currentUrl && !preview && (
            <label className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <input
                type="checkbox"
                name={removeName}
                checked={willRemove}
                onChange={(e) => setWillRemove(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300"
              />
              Удалить текущее изображение
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
