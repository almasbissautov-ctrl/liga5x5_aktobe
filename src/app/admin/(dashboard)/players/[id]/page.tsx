import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getActiveSeason } from "@/lib/services/season";
import PlayerForm from "@/components/admin/PlayerForm";
import { updatePlayer } from "@/lib/actions/players";

export default async function EditPlayerPage({ params }: { params: { id: string } }) {
  const player = await prisma.player.findUnique({ where: { id: params.id } });
  if (!player) notFound();

  const season = await getActiveSeason();
  const teams = season
    ? await prisma.team.findMany({ where: { seasonId: season.id }, orderBy: { name: "asc" } })
    : [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Игрок: {player.fullName}</h1>
      <PlayerForm action={updatePlayer.bind(null, player.id)} teams={teams} defaultValues={player} />
    </div>
  );
}
