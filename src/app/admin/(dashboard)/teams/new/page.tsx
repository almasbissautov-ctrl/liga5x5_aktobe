import TeamForm from "@/components/admin/TeamForm";
import { createTeam } from "@/lib/actions/teams";

export default function NewTeamPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Новая команда</h1>
      <TeamForm action={createTeam} />
    </div>
  );
}
