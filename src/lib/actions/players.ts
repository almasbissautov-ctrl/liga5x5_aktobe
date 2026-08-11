"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { resolveImageUrl } from "@/lib/storage";

const POSITIONS = ["GK", "DEF", "MID", "FWD"] as const;
type PositionValue = (typeof POSITIONS)[number];

function readPlayerInput(formData: FormData) {
  const positionRaw = String(formData.get("position") || "");
  const position = (POSITIONS as readonly string[]).includes(positionRaw)
    ? (positionRaw as PositionValue)
    : null;

  return {
    teamId: String(formData.get("teamId") || ""),
    fullName: String(formData.get("fullName") || "").trim(),
    number: String(formData.get("number") || "").trim(),
    position,
    isCaptain: formData.get("isCaptain") === "on",
  };
}

async function uniquePlayerSlug(teamId: string, fullName: string) {
  const base = slugify(fullName);
  let slug = base;
  let i = 1;
  while (await prisma.player.findFirst({ where: { teamId, slug } })) {
    i += 1;
    slug = `${base}-${i}`;
  }
  return slug;
}

export async function createPlayer(formData: FormData) {
  const input = readPlayerInput(formData);
  if (!input.teamId) throw new Error("Выберите команду");
  if (!input.fullName) throw new Error("Укажите ФИО игрока");

  const slug = await uniquePlayerSlug(input.teamId, input.fullName);
  const photoUrl = await resolveImageUrl(formData, { fileField: "photoFile", removeField: "removePhoto", folder: "players" });

  await prisma.player.create({
    data: {
      teamId: input.teamId,
      slug,
      fullName: input.fullName,
      number: input.number ? Number(input.number) : null,
      position: input.position,
      photoUrl,
      isCaptain: input.isCaptain,
    },
  });

  revalidatePath("/admin/players");
  redirect("/admin/players");
}

export async function updatePlayer(playerId: string, formData: FormData) {
  const input = readPlayerInput(formData);
  if (!input.teamId) throw new Error("Выберите команду");
  if (!input.fullName) throw new Error("Укажите ФИО игрока");

  const existing = await prisma.player.findUnique({ where: { id: playerId }, select: { photoUrl: true } });
  const photoUrl = await resolveImageUrl(formData, {
    fileField: "photoFile",
    removeField: "removePhoto",
    folder: "players",
    existingUrl: existing?.photoUrl,
  });

  await prisma.player.update({
    where: { id: playerId },
    data: {
      teamId: input.teamId,
      fullName: input.fullName,
      number: input.number ? Number(input.number) : null,
      position: input.position,
      photoUrl,
      isCaptain: input.isCaptain,
    },
  });

  revalidatePath("/admin/players");
  redirect("/admin/players");
}

export async function deletePlayer(playerId: string) {
  try {
    await prisma.player.delete({ where: { id: playerId } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      throw new Error(
        "Нельзя удалить игрока: у него есть голы, карточки или он внесён в состав на матч. Сначала удалите эти записи."
      );
    }
    throw error;
  }
  revalidatePath("/admin/players");
}
