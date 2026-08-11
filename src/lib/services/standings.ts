import { prisma } from "@/lib/db";

export type StandingRow = {
  teamId: string;
  teamName: string;
  teamSlug: string;
  logoUrl: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
};

const POINTS_WIN = 3;
const POINTS_DRAW = 1;

// Турнирная таблица не хранится в базе — она всегда считается заново из
// завершённых матчей сезона. Поэтому она автоматически актуальна сразу
// после того, как администратор сохраняет результат матча.
export async function getStandings(seasonId: string): Promise<StandingRow[]> {
  const teams = await prisma.team.findMany({
    where: { seasonId },
    select: { id: true, name: true, slug: true, logoUrl: true },
  });

  const matches = await prisma.match.findMany({
    where: { seasonId, status: "FINISHED" },
    select: { homeTeamId: true, awayTeamId: true, homeScore: true, awayScore: true },
  });

  const table = new Map<string, StandingRow>();
  for (const team of teams) {
    table.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      teamSlug: team.slug,
      logoUrl: team.logoUrl,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    });
  }

  for (const match of matches) {
    if (match.homeScore == null || match.awayScore == null) continue;
    const home = table.get(match.homeTeamId);
    const away = table.get(match.awayTeamId);
    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;
    home.goalsFor += match.homeScore;
    home.goalsAgainst += match.awayScore;
    away.goalsFor += match.awayScore;
    away.goalsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.wins += 1;
      home.points += POINTS_WIN;
      away.losses += 1;
    } else if (match.homeScore < match.awayScore) {
      away.wins += 1;
      away.points += POINTS_WIN;
      home.losses += 1;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += POINTS_DRAW;
      away.points += POINTS_DRAW;
    }
  }

  for (const row of table.values()) {
    row.goalDiff = row.goalsFor - row.goalsAgainst;
  }

  return Array.from(table.values()).sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDiff - a.goalDiff ||
      b.goalsFor - a.goalsFor ||
      a.teamName.localeCompare(b.teamName)
  );
}
