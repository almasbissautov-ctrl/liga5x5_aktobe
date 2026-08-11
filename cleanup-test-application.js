// One-off cleanup script: removes the QA test team application created
// during end-to-end admin panel testing. There is no delete action for
// TeamApplication in the admin UI, so this direct-DB script is used instead.
// Safe to delete this file after running.
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.kbdncxochgnufqfetabq:yeOD3MA3UARAcwvw@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
    },
  },
});

async function main() {
  const apps = await prisma.teamApplication.findMany({
    where: { teamName: "ТЕСТ ФК Заявка" },
  });

  if (apps.length === 0) {
    console.log("Тестовая заявка не найдена — удалять нечего.");
    return;
  }

  for (const app of apps) {
    await prisma.teamApplication.delete({ where: { id: app.id } });
    console.log("Удалена тестовая заявка:", app.id, app.teamName);
  }
}

main()
  .catch((e) => {
    console.error("Ошибка:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
