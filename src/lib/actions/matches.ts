"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function createMatch(formData: FormData) {
  const homeTeamId = String(formData.get("homeTeamId") || "");
  const awayTeamId = String(formData.get("awayTeamId") || "");
  const matchDate = String(formData.get("matchDate") || "");
  const venue = String(formData.get("venue") || "").trim();
  const round = String(formData.get("round") || "").trim();
  const refereeId = String(formData.get("refereeId") || "");

  if (!homeTeamId || !awayTeamId) throw new Error("Выберите обе команды");
  if (homeTeamId === awayTeamId) throw new Error("Команда не может играть сама с собой");
  if (!matchDate) throw new Error("Укажите дату и время матча");

  const homeTeam = await prisma.team.findUnique({ where: { id: homeTeamId } });
  if (!homeTeam) throw new Error("Команда не найдена");

  const match = await prisma.match.create({
    data: {
      seasonId: homeTeam.seasonId,
      homeTeamId,
      awayTeamId,
      matchDate: new Date(matchDate),
      venue: venue || null,
      round: round ? Number(round) : null,
      refereeId: refereeId || null,
      status: "SCHEDULED",
    },
  });

  revalidatePath("/admin/matches");
  redirect(`/admin/matches/${match.id}`);
}

export async function updateMatchCore(matchId: string, formData: FormData) {
  const matchDate = String(formData.get("matchDate") || "");
  const venue = String(formData.get("venue") || "").trim();
  const round = String(formData.get("round") || "").trim();
  const refereeId = String(formData.get("refereeId") || "");
  const status = String(formData.get("status") || "SCHEDULED");
  const mvpPlayerId = String(formData.get("mvpPlayerId") || "");
  const fullVideoUrl = String(formData.get("fullVideoUrl") || "").trim();
  const highlightsVideoUrl = String(formData.get("highlightsVideoUrl") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!matchDate) throw new Error("Укажите дату и время матча");

  await prisma.match.update({
    where: { id: matchId },
    data: {
      matchDate: new Date(matchDate),
      venue: venue || null,
      round: round ? Number(round) : null,
      refereeId: refereeId || null,
      status: status as "SCHEDULED" | "FINISHED" | "POSTPONED" | "CANCELED",
      mvpPlayerId: mvpPlayerId || null,
      fullVideoUrl: fullVideoUrl || null,
      highlightsVideoUrl: highlightsVideoUrl || null,
      notes: notes || null,
    },
  });

  revalidatePath(`/admin/matches/${matchId}`);
  revalidatePath("/admin/matches");
}

export async function deleteMatch(matchId: string) {
  await prisma.match.delete({ where: { id: matchId } });
  revalidatePath("/admin/matches");
}

// Счёт матча не вводится вручную — он всегда пересчитывается по количеству
// голов, засчитанных каждой команде в таблице Goal (включая автоголы,
// т.к. там teamId — это команда-бенефициар, а не команда автора гола).
async function syncMatchScore(matchId: string) {
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) return;

  const [homeGoals, awayGoals] = await Promise.all([
    prisma.goal.count({ where: { matchId, teamId: match.homeTeamId } }),
    prisma.goal.count({ where: { matchId, teamId: match.awayTeamId } }),
  ]);

  await prisma.match.update({
    where: { id: matchId },
    data: { homeScore: homeGoals, awayScore: awayGoals },
  });
}

export async function addGoal(matchId: string, formData: FormData) {
  const teamId = String(formData.get("teamId") || "");
  const scorerId = String(formData.get("scorerId") || "");
  const assistId = String(formData.get("assistId") || "");
  const minute = Number(formData.get("minute") || 0);
  const isOwnGoal = formData.get("isOwnGoal") === "on";
  const isPenalty = formData.get("isPenalty") === "on";

  if (!teamId || !scorerId) throw new Error("Укажите команду и автора гола");

  const scorer = await prisma.player.findUnique({ where: { id: scorerId } });
  if (!scorer) throw new Error("Автор гола не найден");
  if (isOwnGoal && scorer.teamId === teamId) {
    throw new Error("Автогол засчитывается сопернику: выберите автора из команды-соперника.");
  }
  if (!isOwnGoal && scorer.teamId !== teamId) {
    throw new Error("Автор гола должен играть за выбранную команду (или отметьте «Автогол»).");
  }
  if (assistId) {
    const assist = await prisma.player.findUnique({ where: { id: assistId } });
    if (!assist || assist.teamId !== teamId) {
      throw new Error("Ассистент должен играть за ту же команду, что и гол.");
    }
  }

  await prisma.goal.create({
    data: { matchId, teamId, scorerId, assistId: assistId || null, minute, isOwnGoal, isPenalty },
  });

  await syncMatchScore(matchId);
  revalidatePath(`/admin/matches/${matchId}`);
}

export async function deleteGoal(matchId: string, goalId: string) {
  await prisma.goal.delete({ where: { id: goalId } });
  await syncMatchScore(matchId);
  revalidatePath(`/admin/matches/${matchId}`);
}

export async function addCard(matchId: string, formData: FormData) {
  const teamId = String(formData.get("teamId") || "");
  const playerId = String(formData.get("playerId") || "");
  const type = String(formData.get("type") || "YELLOW");
  const minute = Number(formData.get("minute") || 0);
  const reason = String(formData.get("reason") || "").trim();

  if (!teamId || !playerId) throw new Error("Укажите команду и игрока");

  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player || player.teamId !== teamId) {
    throw new Error("Игрок должен играть за выбранную команду.");
  }

  await prisma.card.create({
    data: { matchId, teamId, playerId, type: type as "YELLOW" | "RED", minute, reason: reason || null },
  });

  revalidatePath(`/admin/matches/${matchId}`);
}

export async function deleteCard(matchId: string, cardId: string) {
  await prisma.card.delete({ where: { id: cardId } });
  revalidatePath(`/admin/matches/${matchId}`);
}

export async function setLineup(matchId: string, teamId: string, formData: FormData) {
  const players = await prisma.player.findMany({ where: { teamId }, select: { id: true } });
  const selectedIds = new Set(formData.getAll("playerIds").map(String));

  for (const player of players) {
    if (selectedIds.has(player.id)) {
      await prisma.matchLineup.upsert({
        where: { matchId_playerId: { matchId, playerId: player.id } },
        update: { isStarting: true, teamId },
        create: { matchId, teamId, playerId: player.id, isStarting: true },
      });
    } else {
      await prisma.matchLineup.deleteMany({ where: { matchId, playerId: player.id } });
    }
  }

  revalidatePath(`/admin/matches/${matchId}`);
}
