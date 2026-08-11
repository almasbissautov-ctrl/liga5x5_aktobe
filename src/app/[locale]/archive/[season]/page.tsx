import { notFound } from "next/navigation";
import { Archive, Trophy } from "lucide-react";
import Container from "@/components/ui/Container";
import { prisma } from "@/lib/db";
import { getStandings } from "@/lib/services/standings";
import { getPlayerStats } from "@/lib/services/stats";
import type { Locale } from "@/lib/i18n/types";

export default async function ArchiveSeasonPage({
  params,
}: {
  params: { locale: Locale; season: string };
}) {
  const season = await prisma.season.findUnique({ where: { slug: params.season } });
  if (!season) notFound();

  const standings = await getStandings(season.id);
  const topScorers = (await getPlayerStats(season.id)).filter((s) => s.goals > 0).slice(0, 10);

  return (
    <Container>
      <div className="py-12 md:py-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
            <Archive className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-navy md:text-3xl">{season.title}</h1>
        </div>

        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-navy">
            <Trophy className="h-5 w-5 text-blue" /> Турнирная таблица
          </h2>
          {standings.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">Нет данных.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Команда</th>
                    <th className="px-4 py-3 text-center">И</th>
                    <th className="px-4 py-3 text-center">Мячи</th>
                    <th className="px-4 py-3 text-center">Очки</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {standings.map((row, index) => (
                    <tr key={row.teamId}>
                      <td className="px-4 py-3 font-semibold text-slate-500">{index + 1}</td>
                      <td className="px-4 py-3 font-medium text-navy">{row.teamName}</td>
                      <td className="px-4 py-3 text-center">{row.played}</td>
                      <td className="px-4 py-3 text-center">
                        {row.goalsFor}:{row.goalsAgainst}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-blue">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-navy">Лучшие бомбардиры</h2>
          {topScorers.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">Нет данных.</p>
          ) : (
            <ul className="space-y-2">
              {topScorers.map((row, index) => (
                <li
                  key={row.playerId}
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm"
                >
                  <span className="font-medium text-navy">
                    {index + 1}. {row.fullName} <span className="text-slate-500">({row.teamName})</span>
                  </span>
                  <span className="font-bold text-blue">{row.goals}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Container>
  );
}
