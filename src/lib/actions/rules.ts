"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function updateRegulation(formData: FormData) {
  const content = String(formData.get("content") || "").trim();
  if (!content) throw new Error("Текст регламента не может быть пустым");

  const existing = await prisma.regulation.findFirst();

  if (existing) {
    await prisma.regulation.update({ where: { id: existing.id }, data: { content } });
  } else {
    await prisma.regulation.create({ data: { content } });
  }

  revalidatePath("/admin/rules");
  revalidatePath("/ru/rules");
  revalidatePath("/kk/rules");
}
