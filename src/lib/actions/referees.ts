"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

function readRefereeInput(formData: FormData) {
  return {
    fullName: String(formData.get("fullName") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
  };
}

export async function createReferee(formData: FormData) {
  const input = readRefereeInput(formData);
  if (!input.fullName) throw new Error("Укажите ФИО судьи");

  await prisma.referee.create({
    data: { fullName: input.fullName, phone: input.phone || null },
  });

  revalidatePath("/admin/referees");
  redirect("/admin/referees");
}

export async function updateReferee(refereeId: string, formData: FormData) {
  const input = readRefereeInput(formData);
  if (!input.fullName) throw new Error("Укажите ФИО судьи");

  await prisma.referee.update({
    where: { id: refereeId },
    data: { fullName: input.fullName, phone: input.phone || null },
  });

  revalidatePath("/admin/referees");
  redirect("/admin/referees");
}

export async function deleteReferee(refereeId: string) {
  await prisma.referee.delete({ where: { id: refereeId } });
  revalidatePath("/admin/referees");
}
