import { prisma } from "@/lib/db";

export type PlayerStatRow = {
  playerId: string;
  fullName: string;
  slug: string;
  teamName: string;
  teamSlug: string;
  photoUrl: string | null;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  matchesPlayed: number;
};

// Статистика игроков не хранится отдельно — она считается запросами к
// таблицам Goal / Card / MatchLineup каждый раз при открытии страницы.
// Поэтому она всегда актуальна сразу после того, как администратор
// добавляет гол, ассист или карточку в матче.
export async function getPlayerStats(seasonId: string): Promise<PlayerStatRow[]> {
  const players = await prisma.player.findMany({
    where: { team: { seasonId } },
    select: {
      id: true,
      fullName: true,
      slug: true,
      photoUrl: true,
      team: { select: { name: true, slug: true } },
    },
  });

  const [goals, assists, cards, lineups] = await Promise.all([
    prisma.goal.groupBy({
      by: ["scorerId"],
      where: { match: { seasonId }, isOwnGoal: false },
      _count: { _all: true },
    }),
    prisma.goal.groupBy({
      by: ["assistId"],
      where: { match: { seasonId }, assistId: { not: null } },
      _count: { _all: true },
    }),
    prisma.card.groupBy({
      by: ["playerId", "type"],
      where: { match: { seasonId } },
      _count: { _all: true },
    }),
    prisma.matchLineup.groupBy({
      by: ["playerId"],
      where: { match: { seasonId } },
      _count: { _all: true },
    }),
  ]);

  const goalsMap = new Map(goals.map((g) => [g.scorerId, g._count._all]));
  const assistsMap = new Map(
    assists.filter((a) => a.assistId).map((a) => [a.assistId as string, a._count._all])
  );
  const yellowMap = new Map<string, number>();
  const redMap = new Map<string, number>();
  for (const c of cards) {
    if (c.type === "YELLOW") yellowMap.set(c.playerId, c._count._all);
    if (c.type === "RED") redMap.set(c.playerId, c._count._all);
  }
  const playedMap = new Map(lineups.map((l) => [l.playerId, l._count._all]));

  return players
    .map((p) => ({
      playerId: p.id,
      fullName: p.fullName,
      slug: p.slug,
      teamName: p.team.name,
      teamSlug: p.team.slug,
      photoUrl: p.photoUrl,
      goals: goalsMap.get(p.id) ?? 0,
      assists: assistsMap.get(p.id) ?? 0,
      yellowCards: yellowMap.get(p.id) ?? 0,
      redCards: redMap.get(p.id) ?? 0,
      matchesPlayed: playedMap.get(p.id) ?? 0,
    }))
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists || a.fullName.localeCompare(b.fullName));
}
