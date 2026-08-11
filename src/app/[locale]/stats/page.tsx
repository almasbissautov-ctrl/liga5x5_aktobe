import { BarChart3 } from "lucide-react";
import Container from "@/components/ui/Container";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getActiveSeason } from "@/lib/services/season";
import { getPlayerStats } from "@/lib/services/stats";
import type { Locale } from "@/lib/i18n/types";

export default async function StatsPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const season = await getActiveSeason();
  const stats = season ? await getPlayerStats(season.id) : [];
  const topScorers = stats.filter((s) => s.goals > 0).slice(0, 20);

  return (
    <Container>
      <div className="py-12 md:py-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue">{dict.common.season}</p>
            <h1 className="text-2xl font-bold text-navy md:text-3xl">{dict.nav.stats}</h1>
          </div>
        </div>

        {topScorers.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            Статистика появится после первых забитых голов сезона.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Игрок</th>
                  <th className="px-4 py-3">Команда</th>
                  <th className="px-4 py-3 text-center">Матчи</th>
                  <th className="px-4 py-3 text-center">Голы</th>
                  <th className="px-4 py-3 text-center">Ассисты</th>
                  <th className="px-4 py-3 text-center">ЖК</th>
                  <th className="px-4 py-3 text-center">КК</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {topScorers.map((row, index) => (
                  <tr key={row.playerId}>
                    <td className="px-4 py-3 font-semibold text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-navy">{row.fullName}</td>
                    <td className="px-4 py-3 text-slate-600">{row.teamName}</td>
                    <td className="px-4 py-3 text-center">{row.matchesPlayed}</td>
                    <td className="px-4 py-3 text-center font-bold text-blue">{row.goals}</td>
                    <td className="px-4 py-3 text-center">{row.assists}</td>
                    <td className="px-4 py-3 text-center">{row.yellowCards}</td>
                    <td className="px-4 py-3 text-center">{row.redCards}</td>
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
