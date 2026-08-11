import { PrismaClient } from "@prisma/client";
import { DEFAULT_REGULATION } from "../src/lib/content";

const prisma = new PrismaClient();

async function main() {
  const existingSeason = await prisma.season.findFirst({ where: { year: 2026 } });
  if (existingSeason) {
    console.log("Сезон 2026 уже существует, пропускаем.");
  } else {
    await prisma.season.create({
      data: {
        year: 2026,
        slug: "2026",
        title: "Сезон 2026",
        status: "ACTIVE",
      },
    });
    console.log("Сезон 2026 создан.");
  }

  const existingRegulation = await prisma.regulation.findFirst();
  if (existingRegulation) {
    console.log("Регламент уже есть в базе, пропускаем.");
  } else {
    await prisma.regulation.create({ data: { content: DEFAULT_REGULATION } });
    console.log("Регламент по умолчанию создан.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
