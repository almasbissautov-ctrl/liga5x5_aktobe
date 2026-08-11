import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { deleteSponsor } from "@/lib/actions/sponsors";

export default async function AdminSponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Спонсоры</h1>
        <Link
          href="/admin/sponsors/new"
          className="inline-flex items-center gap-2 rounded-full bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          <Plus className="h-4 w-4" /> Добавить спонсора
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Название</th>
              <th className="px-4 py-3">Порядок</th>
              <th className="px-4 py-3">Активен</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sponsors.map((sponsor) => (
              <tr key={sponsor.id}>
                <td className="px-4 py-3 font-medium text-navy">{sponsor.name}</td>
                <td className="px-4 py-3 text-slate-600">{sponsor.displayOrder}</td>
                <td className="px-4 py-3 text-slate-600">{sponsor.isActive ? "Да" : "Нет"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/sponsors/${sponsor.id}`} className="text-sm font-medium text-blue hover:underline">
                      Изменить
                    </Link>
                    <form action={deleteSponsor.bind(null, sponsor.id)}>
                      <button type="submit" className="text-sm font-medium text-red-600 hover:underline">
                        Удалить
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {sponsors.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  Спонсоров пока нет.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
