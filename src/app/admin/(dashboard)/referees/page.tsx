import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { deleteReferee } from "@/lib/actions/referees";

export default async function AdminRefereesPage() {
  const referees = await prisma.referee.findMany({ orderBy: { fullName: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Судьи</h1>
        <Link
          href="/admin/referees/new"
          className="inline-flex items-center gap-2 rounded-full bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          <Plus className="h-4 w-4" /> Добавить судью
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">ФИО</th>
              <th className="px-4 py-3">Телефон</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {referees.map((referee) => (
              <tr key={referee.id}>
                <td className="px-4 py-3 font-medium text-navy">{referee.fullName}</td>
                <td className="px-4 py-3 text-slate-600">{referee.phone || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/referees/${referee.id}`} className="text-sm font-medium text-blue hover:underline">
                      Изменить
                    </Link>
                    <form action={deleteReferee.bind(null, referee.id)}>
                      <button type="submit" className="text-sm font-medium text-red-600 hover:underline">
                        Удалить
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {referees.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                  Пока нет судей.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
