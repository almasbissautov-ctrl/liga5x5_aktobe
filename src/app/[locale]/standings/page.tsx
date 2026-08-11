import { Trophy } from "lucide-react";
import Container from "@/components/ui/Container";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getActiveSeason } from "@/lib/services/season";
import { getStandings } from "@/lib/services/standings";
import type { Locale } from "@/lib/i18n/types";

export default async function StandingsPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const season = await getActiveSeason();
  const standings = season ? await getStandings(season.id) : [];

  return (
    <Container>
      <div className="py-12 md:py-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue">{dict.common.season}</p>
            <h1 className="text-2xl font-bold text-navy md:text-3xl">{dict.nav.standings}</h1>
          </div>
        </div>

        {standings.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            Таблица появится, как только в базе будут команды и завершённые матчи сезона.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Команда</th>
                  <th className="px-4 py-3 text-center">И</th>
                  <th className="px-4 py-3 text-center">В</th>
                  <th className="px-4 py-3 text-center">Н</th>
                  <th className="px-4 py-3 text-center">П</th>
                  <th className="px-4 py-3 text-center">Мячи</th>
                  <th className="px-4 py-3 text-center">Р.М.</th>
                  <th className="px-4 py-3 text-center">Очки</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {standings.map((row, index) => (
                  <tr key={row.teamId}>
                    <td className="px-4 py-3 font-semibold text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-navy">{row.teamName}</td>
                    <td className="px-4 py-3 text-center">{row.played}</td>
                    <td className="px-4 py-3 text-center">{row.wins}</td>
                    <td className="px-4 py-3 text-center">{row.draws}</td>
                    <td className="px-4 py-3 text-center">{row.losses}</td>
                    <td className="px-4 py-3 text-center">
                      {row.goalsFor}:{row.goalsAgainst}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-blue">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
}
