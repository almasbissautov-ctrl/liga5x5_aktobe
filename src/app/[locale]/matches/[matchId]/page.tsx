import { notFound } from "next/navigation";
import { Calendar, MapPin, Flag, Star } from "lucide-react";
import Container from "@/components/ui/Container";
import VideoEmbed from "@/components/ui/VideoEmbed";
import { prisma } from "@/lib/db";
import { matchStatusLabels, cardTypeLabels } from "@/lib/labels";
import { formatMatchDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n/types";

export default async function MatchDetailPage({
  params,
}: {
  params: { locale: Locale; matchId: string };
}) {
  const match = await prisma.match.findUnique({
    where: { id: params.matchId },
    include: {
      homeTeam: true,
      awayTeam: true,
      referee: true,
      mvpPlayer: true,
      goals: { include: { scorer: true, assist: true, team: true }, orderBy: { minute: "asc" } },
      cards: { include: { player: true, team: true }, orderBy: { minute: "asc" } },
      lineups: {
        where: { isStarting: true },
        include: { player: true },
      },
    },
  });
  if (!match) notFound();

  const homeLineup = match.lineups.filter((l) => l.teamId === match.homeTeamId);
  const awayLineup = match.lineups.filter((l) => l.teamId === match.awayTeamId);

  const events = [
    ...match.goals.map((g) => ({
      minute: g.minute,
      isHome: g.teamId === match.homeTeamId,
      kind: "goal" as const,
      label: `${g.scorer.fullName}${g.isOwnGoal ? " (автогол)" : ""}${g.isPenalty ? " (пен.)" : ""}`,
      sub: g.assist ? `Ассист: ${g.assist.fullName}` : undefined,
    })),
    ...match.cards.map((c) => ({
      minute: c.minute,
      isHome: c.teamId === match.homeTeamId,
      kind: c.type === "YELLOW" ? ("yellow" as const) : ("red" as const),
      label: c.player.fullName,
      sub: c.reason ?? undefined,
    })),
  ].sort((a, b) => a.minute - b.minute);

  return (
    <Container>
      <div className="py-10 md:py-14">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> {formatMatchDate(match.matchDate)}
          </span>
          {match.venue && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {match.venue}
            </span>
          )}
          {match.referee && (
            <span className="flex items-center gap-1.5">
              <Flag className="h-4 w-4" /> Судья: {match.referee.fullName}
            </span>
          )}
          {match.round && <span>Тур {match.round}</span>}
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {matchStatusLabels[match.status]}
          </span>
        </div>

        <div className="mb-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:p-10">
          <h2 className="text-right text-lg font-bold text-navy sm:text-2xl">{match.homeTeam.name}</h2>
          <div className="rounded-2xl bg-navy px-6 py-3 text-center text-3xl font-extrabold text-white sm:text-4xl">
            {match.status === "FINISHED" ? `${match.homeScore ?? 0} : ${match.awayScore ?? 0}` : "— : —"}
          </div>
          <h2 className="text-lg font-bold text-navy sm:text-2xl">{match.awayTeam.name}</h2>
        </div>

        {match.mvpPlayer && (
          <div className="mb-10 flex items-center justify-center gap-2 rounded-2xl border border-blue/30 bg-blue/5 px-6 py-4 text-center">
            <Star className="h-5 w-5 text-blue" />
            <span className="text-sm font-semibold text-navy">
              Лучший игрок матча: {match.mvpPlayer.fullName}
            </span>
          </div>
        )}

        {(match.fullVideoUrl || match.highlightsVideoUrl) && (
          <section className="mb-12 grid gap-6 md:grid-cols-2">
            {match.fullVideoUrl && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Полное видео матча</h3>
                <VideoEmbed url={match.fullVideoUrl} title={`${match.homeTeam.name} — ${match.awayTeam.name}, полное видео`} />
              </div>
            )}
            {match.highlightsVideoUrl && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Лучшие моменты</h3>
                <VideoEmbed url={match.highlightsVideoUrl} title={`${match.homeTeam.name} — ${match.awayTeam.name}, лучшие моменты`} />
              </div>
            )}
          </section>
        )}

        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-navy">События матча</h2>
          {events.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
              События матча ещё не внесены.
            </p>
          ) : (
            <ul className="space-y-2">
              {events.map((event, index) => (
                <li
                  key={index}
                  className={`flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm ${
                    event.isHome ? "" : "flex-row-reverse text-right"
                  }`}
                >
                  <span className="w-10 shrink-0 font-semibold text-slate-400">{event.minute}&apos;</span>
                  <EventIcon kind={event.kind} />
                  <div>
                    <p className="font-medium text-navy">{event.label}</p>
                    {event.sub && <p className="text-xs text-slate-500">{event.sub}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-navy">Составы</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <LineupList teamName={match.homeTeam.name} lineup={homeLineup} />
            <LineupList teamName={match.awayTeam.name} lineup={awayLineup} />
          </div>
        </section>
      </div>
    </Container>
  );
}

function EventIcon({ kind }: { kind: "goal" | "yellow" | "red" }) {
  if (kind === "goal") {
    return <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue/10 text-xs">⚽</span>;
  }
  if (kind === "yellow") {
    return <span className="h-4 w-3 shrink-0 rounded-sm bg-yellow-400" title={cardTypeLabels.YELLOW} />;
  }
  return <span className="h-4 w-3 shrink-0 rounded-sm bg-red-600" title={cardTypeLabels.RED} />;
}

function LineupList({
  teamName,
  lineup,
}: {
  teamName: string;
  lineup: { player: { id: string; fullName: string; number: number | null }; isCaptainForMatch: boolean }[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <p className="mb-3 text-sm font-semibold text-navy">{teamName}</p>
      {lineup.length === 0 ? (
        <p className="text-sm text-slate-400">Состав не указан.</p>
      ) : (
        <ul className="space-y-1.5 text-sm text-slate-600">
          {lineup.map((entry) => (
            <li key={entry.player.id}>
              {entry.player.number ? `#${entry.player.number} ` : ""}
              {entry.player.fullName}
              {entry.isCaptainForMatch && <span className="text-xs text-blue"> (К)</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
