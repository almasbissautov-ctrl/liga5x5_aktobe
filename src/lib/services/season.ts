import { prisma } from "@/lib/db";

export async function getActiveSeason() {
  const active = await prisma.season.findFirst({
    where: { status: "ACTIVE" },
    orderBy: { year: "desc" },
  });
  if (active) return active;

  return prisma.season.findFirst({ orderBy: { year: "desc" } });
}
