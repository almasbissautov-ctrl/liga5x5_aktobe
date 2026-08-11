import Link from "next/link";
import { prisma } from "@/lib/db";
import { getActiveSeason } from "@/lib/services/season";

export default async function AdminDashboardPage() {
  const season = await getActiveSeason();

  const [teamsCount, playersCount, matchesCount, finishedCount, pendingApplications] = season
    ? await Promise.all([
        prisma.team.count({ where: { seasonId: season.id } }),
        prisma.player.count({ where: { team: { seasonId: season.id } } }),
        prisma.match.count({ where: { seasonId: season.id } }),
        prisma.match.count({ where: { seasonId: season.id, status: "FINISHED" } }),
        prisma.teamApplication.count({ where: { status: "NEW" } }),
      ])
    : [0, 0, 0, 0, 0];

  const cards = [
    { label: "Команды", value: teamsCount, href: "/admin/teams" },
    { label: "Игроки", value: playersCount, href: "/admin/players" },
    { label: "Матчи всего", value: matchesCount, href: "/admin/matches" },
    { label: "Матчи завершены", value: finishedCount, href: "/admin/matches" },
    { label: "Новые заявки", value: pendingApplications, href: "/admin/applications" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Обзор</h1>
      <p className="mt-1 text-sm text-slate-500">
        {season ? season.title : "Активный сезон не найден — создайте его в базе данных."}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-blue"
          >
            <p className="text-3xl font-bold text-navy">{card.value}</p>
            <p className="mt-1 text-sm text-slate-500">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
