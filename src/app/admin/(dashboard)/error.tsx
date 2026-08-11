"use client";

import { useEffect } from "react";

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] unhandled error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6">
      <h1 className="mb-2 text-lg font-bold text-red-700">Что-то пошло не так</h1>
      <p className="mb-4 text-sm text-red-700">
        {error.message || "Не удалось выполнить действие. Попробуйте ещё раз."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        Попробовать снова
      </button>
    </div>
  );
}
