import { prisma } from "@/lib/db";
import { getActiveSeason } from "@/lib/services/season";
import { createMatch } from "@/lib/actions/matches";
import { AdminSelect, AdminField } from "@/components/admin/fields";

export default async function NewMatchPage() {
  const season = await getActiveSeason();
  const teams = season
    ? await prisma.team.findMany({ where: { seasonId: season.id }, orderBy: { name: "asc" } })
    : [];
  const referees = await prisma.referee.findMany({ orderBy: { fullName: "asc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Новый матч</h1>
      <form action={createMatch} className="grid max-w-xl gap-5 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminSelect
            label="Хозяева"
            name="homeTeamId"
            required
            options={teams.map((t) => ({ value: t.id, label: t.name }))}
          />
          <AdminSelect
            label="Гости"
            name="awayTeamId"
            required
            options={teams.map((t) => ({ value: t.id, label: t.name }))}
          />
        </div>
        <AdminField label="Дата и время" name="matchDate" type="datetime-local" required />
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField label="Место проведения" name="venue" />
          <AdminField label="Тур" name="round" type="number" />
        </div>
        <AdminSelect
          label="Судья"
          name="refereeId"
          placeholder="Без судьи"
          options={referees.map((r) => ({ value: r.id, label: r.fullName }))}
        />
        <button
          type="submit"
          className="justify-self-start rounded-full bg-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Создать матч
        </button>
      </form>
    </div>
  );
}
