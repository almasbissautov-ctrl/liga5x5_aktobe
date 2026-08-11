"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getActiveSeason } from "@/lib/services/season";

export type ApplicationFormState = { error?: string; success?: boolean };

// Server Action, к которой обращается публичная форма "Заявить команду".
export async function submitTeamApplication(
  _prevState: ApplicationFormState,
  formData: FormData
): Promise<ApplicationFormState> {
  const teamName = String(formData.get("teamName") || "").trim();
  const captainName = String(formData.get("captainName") || "").trim();
  const captainPhone = String(formData.get("captainPhone") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const comment = String(formData.get("comment") || "").trim();

  if (!teamName || !captainName || !captainPhone) {
    return { error: "Заполните обязательные поля: название команды, ФИО и телефон капитана." };
  }

  const season = await getActiveSeason();

  await prisma.teamApplication.create({
    data: {
      seasonId: season?.id ?? null,
      teamName,
      captainName,
      captainPhone,
      city: city || null,
      comment: comment || null,
    },
  });

  revalidatePath("/admin/applications");
  return { success: true };
}

export async function setApplicationStatus(
  applicationId: string,
  status: "NEW" | "APPROVED" | "REJECTED"
) {
  await prisma.teamApplication.update({ where: { id: applicationId }, data: { status } });
  revalidatePath("/admin/applications");
}

export async function deleteApplication(applicationId: string) {
  await prisma.teamApplication.delete({ where: { id: applicationId } });
  revalidatePath("/admin/applications");
}
