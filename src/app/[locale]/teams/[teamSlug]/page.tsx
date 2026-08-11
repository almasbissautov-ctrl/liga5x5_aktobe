import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, User } from "lucide-react";
import Container from "@/components/ui/Container";
import { getActiveSeason } from "@/lib/services/season";
import { prisma } from "@/lib/db";
import { positionLabels, matchStatusLabels } from "@/lib/labels";
import { formatMatchDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n/types";

export default async function TeamDetailPage({
  params,
}: {
  params: { locale: Locale; teamSlug: string };
}) {
  const season = await getActiveSeason();
  if (!season) notFound();

  const team = await prisma.team.findFirst({
    where: { seasonId: season.id, slug: params.teamSlug },
    include: {
      players: { orderBy: [{ number: "asc" }, { fullName: "asc" }] },
    },
  });
  if (!team) notFound();

  const matches = await prisma.match.findMany({
    where: { OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }] },
    orderBy: { matchDate: "asc" },
    include: { homeTeam: true, awayTeam: true },
  });

  return (
    <Container>
      <div className="py-12 md:py-16">
        <div className="mb-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
            {team.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={team.logoUrl} alt={team.name} className="h-full w-full object-cover" />
            ) : (
              <Users className="h-8 w-8 text-slate-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue">{season.title}</p>
            <h1 className="text-2xl font-bold text-navy md:text-3xl">{team.name}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {[team.city, team.captainName && `Капитан: ${team.captainName}`, team.coachName && `Тренер: ${team.coachName}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-navy">Состав</h2>
          {team.players.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
              Состав команды пока не добавлен.
            </p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="px-4 py-3">№</th>
                    <th className="px-4 py-3">Игрок</th>
                    <th className="px-4 py-3">Позиция</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {team.players.map((player) => (
                    <tr key={player.id}>
                      <td className="px-4 py-3 text-slate-500">{player.number ?? "—"}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/${params.locale}/players/${player.slug}`}
                          className="flex items-center gap-2 font-medium text-navy hover:text-blue"
                        >
                          <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                            {player.photoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={player.photoUrl} alt={player.fullName} className="h-full w-full object-cover" />
                            ) : (
                              <User className="h-4 w-4 text-slate-400" />
                            )}
                          </span>
                          {player.fullName}
                          {player.isCaptain && <span className="text-xs text-blue">(К)</span>}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {player.position ? positionLabels[player.position] : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-navy">Матчи</h2>
          {matches.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
              Матчи ещё не назначены.
            </p>
          ) : (
            <div className="space-y-2">
              {matches.map((match) => (
                <Link
                  key={match.id}
                  href={`/${params.locale}/matches/${match.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm hover:border-blue"
                >
                  <span className="text-slate-500">{formatMatchDate(match.matchDate)}</span>
                  <span className="font-medium text-navy">
                    {match.homeTeam.name} {match.homeScore ?? "—"}:{match.awayScore ?? "—"} {match.awayTeam.name}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {matchStatusLabels[match.status]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </Container>
  );
}
