import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import TeamForm from "@/components/admin/TeamForm";
import { updateTeam } from "@/lib/actions/teams";

export default async function EditTeamPage({ params }: { params: { id: string } }) {
  const team = await prisma.team.findUnique({ where: { id: params.id } });
  if (!team) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Команда: {team.name}</h1>
      <TeamForm action={updateTeam.bind(null, team.id)} defaultValues={team} />
    </div>
  );
}
