import Link from "next/link";
import { Users } from "lucide-react";
import Container from "@/components/ui/Container";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getActiveSeason } from "@/lib/services/season";
import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/i18n/types";

export default async function TeamsPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const season = await getActiveSeason();
  const teams = season
    ? await prisma.team.findMany({
        where: { seasonId: season.id },
        orderBy: { name: "asc" },
        include: { _count: { select: { players: true } } },
      })
    : [];

  return (
    <Container>
      <div className="py-12 md:py-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue">{dict.common.season}</p>
            <h1 className="text-2xl font-bold text-navy md:text-3xl">{dict.nav.teams}</h1>
          </div>
        </div>

        {teams.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            Команды появятся здесь после добавления в админ-панели.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Link
                key={team.id}
                href={`/${params.locale}/teams/${team.slug}`}
                className="group rounded-2xl border border-slate-200 p-5 transition-all hover:-translate-y-1 hover:border-blue hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                    {team.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={team.logoUrl} alt={team.name} className="h-full w-full object-cover" />
                    ) : (
                      <Users className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy group-hover:text-blue">{team.name}</h3>
                    <p className="text-sm text-slate-500">
                      {team._count.players} {playersWord(team._count.players)}
                    </p>
                  </div>
                </div>
                {(team.captainName || team.coachName) && (
                  <div className="mt-4 space-y-1 text-sm text-slate-600">
                    {team.captainName && <p>Капитан: {team.captainName}</p>}
                    {team.coachName && <p>Тренер: {team.coachName}</p>}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

function playersWord(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "игрок";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "игрока";
  return "игроков";
}
