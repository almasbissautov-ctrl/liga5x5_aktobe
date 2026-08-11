import Link from "next/link";
import { notFound } from "next/navigation";
import { User } from "lucide-react";
import Container from "@/components/ui/Container";
import { getActiveSeason } from "@/lib/services/season";
import { getPlayerStats } from "@/lib/services/stats";
import { prisma } from "@/lib/db";
import { positionLabels } from "@/lib/labels";
import type { Locale } from "@/lib/i18n/types";

export default async function PlayerDetailPage({
  params,
}: {
  params: { locale: Locale; playerSlug: string };
}) {
  const season = await getActiveSeason();
  if (!season) notFound();

  const player = await prisma.player.findFirst({
    where: { team: { seasonId: season.id }, slug: params.playerSlug },
    include: { team: true },
  });
  if (!player) notFound();

  const stats = await getPlayerStats(season.id);
  const playerStats = stats.find((s) => s.playerId === player.id);

  const statCards = [
    { label: "Матчи", value: playerStats?.matchesPlayed ?? 0 },
    { label: "Голы", value: playerStats?.goals ?? 0 },
    { label: "Ассисты", value: playerStats?.assists ?? 0 },
    { label: "Жёлтые карточки", value: playerStats?.yellowCards ?? 0 },
    { label: "Красные карточки", value: playerStats?.redCards ?? 0 },
  ];

  return (
    <Container>
      <div className="py-12 md:py-16">
        <div className="mb-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
            {player.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={player.photoUrl} alt={player.fullName} className="h-full w-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-slate-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue">
              {player.number ? `№ ${player.number} · ` : ""}
              {player.position ? positionLabels[player.position] : ""}
            </p>
            <h1 className="text-2xl font-bold text-navy md:text-3xl">{player.fullName}</h1>
            <Link
              href={`/${params.locale}/teams/${player.team.slug}`}
              className="mt-1 inline-block text-sm font-medium text-slate-500 hover:text-blue"
            >
              {player.team.name}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {statCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-slate-200 p-5 text-center">
              <p className="text-3xl font-bold text-navy">{card.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
