import { prisma } from "@/lib/db";
import { getActiveSeason } from "@/lib/services/season";
import PlayerForm from "@/components/admin/PlayerForm";
import { createPlayer } from "@/lib/actions/players";

export default async function NewPlayerPage() {
  const season = await getActiveSeason();
  const teams = season
    ? await prisma.team.findMany({ where: { seasonId: season.id }, orderBy: { name: "asc" } })
    : [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Новый игрок</h1>
      <PlayerForm action={createPlayer} teams={teams} />
    </div>
  );
}
