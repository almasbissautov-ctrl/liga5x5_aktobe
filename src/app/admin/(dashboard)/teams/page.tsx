import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { getActiveSeason } from "@/lib/services/season";
import { deleteTeam } from "@/lib/actions/teams";

export default async function AdminTeamsPage() {
  const season = await getActiveSeason();
  const teams = season
    ? await prisma.team.findMany({
        where: { seasonId: season.id },
        orderBy: { name: "asc" },
        include: { _count: { select: { players: true } } },
      })
    : [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Команды</h1>
          <p className="text-sm text-slate-500">{season ? season.title : "Нет активного сезона"}</p>
        </div>
        <Link
          href="/admin/teams/new"
          className="inline-flex items-center gap-2 rounded-full bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          <Plus className="h-4 w-4" /> Добавить команду
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Название</th>
              <th className="px-4 py-3">Капитан</th>
              <th className="px-4 py-3">Тренер</th>
              <th className="px-4 py-3">Игроков</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {teams.map((team) => (
              <tr key={team.id}>
                <td className="px-4 py-3 font-medium text-navy">{team.name}</td>
                <td className="px-4 py-3 text-slate-600">{team.captainName || "—"}</td>
                <td className="px-4 py-3 text-slate-600">{team.coachName || "—"}</td>
                <td className="px-4 py-3 text-slate-600">{team._count.players}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/teams/${team.id}`} className="text-sm font-medium text-blue hover:underline">
                      Изменить
                    </Link>
                    <form action={deleteTeam.bind(null, team.id)}>
                      <button type="submit" className="text-sm font-medium text-red-600 hover:underline">
                        Удалить
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {teams.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Пока нет команд — добавьте первую.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
