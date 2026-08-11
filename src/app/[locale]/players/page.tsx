import Link from "next/link";
import { User } from "lucide-react";
import Container from "@/components/ui/Container";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getActiveSeason } from "@/lib/services/season";
import { prisma } from "@/lib/db";
import { positionLabels } from "@/lib/labels";
import type { Locale } from "@/lib/i18n/types";

export default async function PlayersPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const season = await getActiveSeason();
  const players = season
    ? await prisma.player.findMany({
        where: { team: { seasonId: season.id } },
        orderBy: [{ team: { name: "asc" } }, { fullName: "asc" }],
        include: { team: true },
      })
    : [];

  return (
    <Container>
      <div className="py-12 md:py-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue">{dict.common.season}</p>
            <h1 className="text-2xl font-bold text-navy md:text-3xl">{dict.nav.players}</h1>
          </div>
        </div>

        {players.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            Игроки появятся здесь после добавления в админ-панели.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-4 py-3">№</th>
                  <th className="px-4 py-3">Игрок</th>
                  <th className="px-4 py-3">Команда</th>
                  <th className="px-4 py-3">Позиция</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {players.map((player) => (
                  <tr key={player.id}>
                    <td className="px-4 py-3 text-slate-500">{player.number ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/${params.locale}/players/${player.slug}`}
                        className="flex items-center gap-3 font-medium text-navy hover:text-blue"
                      >
                        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                          {player.photoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={player.photoUrl} alt={player.fullName} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-4 w-4 text-slate-400" />
                          )}
                        </span>
                        {player.fullName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{player.team.name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {player.position ? positionLabels[player.position] : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
}
