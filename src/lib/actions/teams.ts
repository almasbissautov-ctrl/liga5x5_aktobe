"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { getActiveSeason } from "@/lib/services/season";
import { resolveImageUrl } from "@/lib/storage";

function readTeamInput(formData: FormData) {
  return {
    name: String(formData.get("name") || "").trim(),
    captainName: String(formData.get("captainName") || "").trim(),
    coachName: String(formData.get("coachName") || "").trim(),
    city: String(formData.get("city") || "").trim(),
  };
}

async function uniqueTeamSlug(seasonId: string, name: string) {
  const base = slugify(name);
  let slug = base;
  let i = 1;
  while (await prisma.team.findFirst({ where: { seasonId, slug } })) {
    i += 1;
    slug = `${base}-${i}`;
  }
  return slug;
}

export async function createTeam(formData: FormData) {
  const input = readTeamInput(formData);
  if (!input.name) throw new Error("Укажите название команды");

  const season = await getActiveSeason();
  if (!season) throw new Error("Нет активного сезона. Создайте сезон в базе данных.");

  const slug = await uniqueTeamSlug(season.id, input.name);
  const logoUrl = await resolveImageUrl(formData, { fileField: "logoFile", removeField: "removeLogo", folder: "teams" });

  await prisma.team.create({
    data: {
      seasonId: season.id,
      slug,
      name: input.name,
      logoUrl,
      captainName: input.captainName || null,
      coachName: input.coachName || null,
      city: input.city || null,
    },
  });

  revalidatePath("/admin/teams");
  redirect("/admin/teams");
}

export async function updateTeam(teamId: string, formData: FormData) {
  const input = readTeamInput(formData);
  if (!input.name) throw new Error("Укажите название команды");

  const existing = await prisma.team.findUnique({ where: { id: teamId }, select: { logoUrl: true } });
  const logoUrl = await resolveImageUrl(formData, {
    fileField: "logoFile",
    removeField: "removeLogo",
    folder: "teams",
    existingUrl: existing?.logoUrl,
  });

  await prisma.team.update({
    where: { id: teamId },
    data: {
      name: input.name,
      logoUrl,
      captainName: input.captainName || null,
      coachName: input.coachName || null,
      city: input.city || null,
    },
  });

  revalidatePath("/admin/teams");
  redirect("/admin/teams");
}

export async function deleteTeam(teamId: string) {
  try {
    await prisma.team.delete({ where: { id: teamId } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      throw new Error(
        "Нельзя удалить команду: за ней закреплены матчи. Сначала удалите или переназначьте эти матчи."
      );
    }
    throw error;
  }
  revalidatePath("/admin/teams");
}
