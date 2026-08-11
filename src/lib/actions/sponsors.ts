"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { resolveImageUrl } from "@/lib/storage";

function readSponsorInput(formData: FormData) {
  return {
    name: String(formData.get("name") || "").trim(),
    websiteUrl: String(formData.get("websiteUrl") || "").trim(),
    displayOrder: String(formData.get("displayOrder") || "0").trim(),
    isActive: formData.get("isActive") === "on",
  };
}

export async function createSponsor(formData: FormData) {
  const input = readSponsorInput(formData);
  if (!input.name) throw new Error("Укажите название спонсора");

  const logoUrl = await resolveImageUrl(formData, { fileField: "logoFile", removeField: "removeLogo", folder: "sponsors" });

  await prisma.sponsor.create({
    data: {
      name: input.name,
      logoUrl,
      websiteUrl: input.websiteUrl || null,
      displayOrder: Number(input.displayOrder) || 0,
      isActive: input.isActive,
    },
  });

  revalidatePath("/admin/sponsors");
  redirect("/admin/sponsors");
}

export async function updateSponsor(sponsorId: string, formData: FormData) {
  const input = readSponsorInput(formData);
  if (!input.name) throw new Error("Укажите название спонсора");

  const existing = await prisma.sponsor.findUnique({ where: { id: sponsorId }, select: { logoUrl: true } });
  const logoUrl = await resolveImageUrl(formData, {
    fileField: "logoFile",
    removeField: "removeLogo",
    folder: "sponsors",
    existingUrl: existing?.logoUrl,
  });

  await prisma.sponsor.update({
    where: { id: sponsorId },
    data: {
      name: input.name,
      logoUrl,
      websiteUrl: input.websiteUrl || null,
      displayOrder: Number(input.displayOrder) || 0,
      isActive: input.isActive,
    },
  });

  revalidatePath("/admin/sponsors");
  redirect("/admin/sponsors");
}

export async function deleteSponsor(sponsorId: string) {
  await prisma.sponsor.delete({ where: { id: sponsorId } });
  revalidatePath("/admin/sponsors");
}
