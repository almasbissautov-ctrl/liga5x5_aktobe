import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { getActiveSeason } from "@/lib/services/season";
import { deleteMatch } from "@/lib/actions/matches";
import { matchStatusLabels } from "@/lib/labels";
import { formatMatchDate } from "@/lib/format";

export default async function AdminMatchesPage() {
  const season = await getActiveSeason();
  const matches = season
    ? await prisma.match.findMany({
        where: { seasonId: season.id },
        orderBy: { matchDate: "asc" },
        include: { homeTeam: true, awayTeam: true },
      })
    : [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Матчи</h1>
        <Link
          href="/admin/matches/new"
          className="inline-flex items-center gap-2 rounded-full bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          <Plus className="h-4 w-4" /> Новый матч
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Дата</th>
              <th className="px-4 py-3">Матч</th>
              <th className="px-4 py-3">Счёт</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matches.map((match) => (
              <tr key={match.id}>
                <td className="px-4 py-3 text-slate-600">{formatMatchDate(match.matchDate)}</td>
                <td className="px-4 py-3 font-medium text-navy">
                  {match.homeTeam.name} — {match.awayTeam.name}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {match.homeScore ?? "—"}:{match.awayScore ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">{matchStatusLabels[match.status]}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/matches/${match.id}`} className="text-sm font-medium text-blue hover:underline">
                      Открыть
                    </Link>
                    <form action={deleteMatch.bind(null, match.id)}>
                      <button type="submit" className="text-sm font-medium text-red-600 hover:underline">
                        Удалить
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {matches.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Матчей пока нет.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
