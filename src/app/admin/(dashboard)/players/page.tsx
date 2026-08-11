import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { getActiveSeason } from "@/lib/services/season";
import { deletePlayer } from "@/lib/actions/players";
import { positionLabels } from "@/lib/labels";

export default async function AdminPlayersPage() {
  const season = await getActiveSeason();
  const players = season
    ? await prisma.player.findMany({
        where: { team: { seasonId: season.id } },
        orderBy: { fullName: "asc" },
        include: { team: true },
      })
    : [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Игроки</h1>
        <Link
          href="/admin/players/new"
          className="inline-flex items-center gap-2 rounded-full bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          <Plus className="h-4 w-4" /> Добавить игрока
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">№</th>
              <th className="px-4 py-3">ФИО</th>
              <th className="px-4 py-3">Команда</th>
              <th className="px-4 py-3">Позиция</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {players.map((player) => (
              <tr key={player.id}>
                <td className="px-4 py-3 text-slate-600">{player.number ?? "—"}</td>
                <td className="px-4 py-3 font-medium text-navy">{player.fullName}</td>
                <td className="px-4 py-3 text-slate-600">{player.team.name}</td>
                <td className="px-4 py-3 text-slate-600">
                  {player.position ? positionLabels[player.position] : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/players/${player.id}`} className="text-sm font-medium text-blue hover:underline">
                      Изменить
                    </Link>
                    <form action={deletePlayer.bind(null, player.id)}>
                      <button type="submit" className="text-sm font-medium text-red-600 hover:underline">
                        Удалить
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {players.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Пока нет игроков.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
