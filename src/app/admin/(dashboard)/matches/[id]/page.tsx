import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminField, AdminSelect, AdminCheckbox } from "@/components/admin/fields";
import {
  updateMatchCore,
  addGoal,
  deleteGoal,
  addCard,
  deleteCard,
  setLineup,
} from "@/lib/actions/matches";
import { matchStatusLabels, cardTypeLabels } from "@/lib/labels";
import { toDateTimeLocalValue } from "@/lib/format";

export default async function EditMatchPage({ params }: { params: { id: string } }) {
  const match = await prisma.match.findUnique({
    where: { id: params.id },
    include: {
      homeTeam: { include: { players: { orderBy: { fullName: "asc" } } } },
      awayTeam: { include: { players: { orderBy: { fullName: "asc" } } } },
      goals: { include: { scorer: true, assist: true, team: true }, orderBy: { minute: "asc" } },
      cards: { include: { player: true, team: true }, orderBy: { minute: "asc" } },
      lineups: true,
    },
  });
  if (!match) notFound();

  const referees = await prisma.referee.findMany({ orderBy: { fullName: "asc" } });
  const allPlayers = [...match.homeTeam.players, ...match.awayTeam.players];
  const startingIds = new Set(match.lineups.filter((l) => l.isStarting).map((l) => l.playerId));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue">
          {matchStatusLabels[match.status]} · Счёт: {match.homeScore ?? 0}:{match.awayScore ?? 0}
        </p>
        <h1 className="text-2xl font-bold text-navy">
          {match.homeTeam.name} — {match.awayTeam.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Счёт считается автоматически по количеству забитых голов ниже — вводить его вручную не нужно.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-navy">Основная информация</h2>
        <form action={updateMatchCore.bind(null, match.id)} className="grid gap-5 sm:grid-cols-2">
          <AdminField
            label="Дата и время"
            name="matchDate"
            type="datetime-local"
            required
            defaultValue={toDateTimeLocalValue(match.matchDate)}
          />
          <AdminSelect
            label="Статус"
            name="status"
            required
            defaultValue={match.status}
            options={[
              { value: "SCHEDULED", label: "Запланирован" },
              { value: "FINISHED", label: "Завершён" },
              { value: "POSTPONED", label: "Перенесён" },
              { value: "CANCELED", label: "Отменён" },
            ]}
          />
          <AdminField label="Место проведения" name="venue" defaultValue={match.venue ?? ""} />
          <AdminField label="Тур" name="round" type="number" defaultValue={match.round ?? ""} />
          <AdminSelect
            label="Судья"
            name="refereeId"
            placeholder="Без судьи"
            defaultValue={match.refereeId ?? ""}
            options={referees.map((r) => ({ value: r.id, label: r.fullName }))}
          />
          <AdminSelect
            label="Лучший игрок матча"
            name="mvpPlayerId"
            placeholder="Не выбран"
            defaultValue={match.mvpPlayerId ?? ""}
            options={allPlayers.map((p) => ({
              value: p.id,
              label: `${p.fullName} (${p.teamId === match.homeTeamId ? match.homeTeam.name : match.awayTeam.name})`,
            }))}
          />
          <AdminField
            label="Ссылка на полное видео (YouTube/VK)"
            name="fullVideoUrl"
            type="url"
            defaultValue={match.fullVideoUrl ?? ""}
          />
          <AdminField
            label="Ссылка на нарезку лучших моментов"
            name="highlightsVideoUrl"
            type="url"
            defaultValue={match.highlightsVideoUrl ?? ""}
          />
          <div className="sm:col-span-2">
            <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-slate-700">
              Заметки
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={match.notes ?? ""}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>
          <button
            type="submit"
            className="justify-self-start rounded-full bg-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark sm:col-span-2"
          >
            Сохранить
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-navy">Составы</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <LineupForm
            teamName={match.homeTeam.name}
            action={setLineup.bind(null, match.id, match.homeTeamId)}
            players={match.homeTeam.players}
            startingIds={startingIds}
          />
          <LineupForm
            teamName={match.awayTeam.name}
            action={setLineup.bind(null, match.id, match.awayTeamId)}
            players={match.awayTeam.players}
            startingIds={startingIds}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-navy">Голы</h2>
        <ul className="mb-5 space-y-2 text-sm">
          {match.goals.map((goal) => (
            <li key={goal.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span>
                {goal.minute}&apos; — {goal.scorer.fullName} ({goal.team.name})
                {goal.assist ? `, ассист: ${goal.assist.fullName}` : ""}
                {goal.isOwnGoal ? " · автогол" : ""}
                {goal.isPenalty ? " · пенальти" : ""}
              </span>
              <form action={deleteGoal.bind(null, match.id, goal.id)}>
                <button type="submit" className="text-red-600 hover:underline">
                  Удалить
                </button>
              </form>
            </li>
          ))}
          {match.goals.length === 0 && <li className="text-slate-400">Голов пока нет.</li>}
        </ul>
        <form action={addGoal.bind(null, match.id)} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminSelect
            label="Команда (кому засчитан гол)"
            name="teamId"
            required
            options={[
              { value: match.homeTeamId, label: match.homeTeam.name },
              { value: match.awayTeamId, label: match.awayTeam.name },
            ]}
          />
          <AdminSelect
            label="Автор гола"
            name="scorerId"
            required
            options={allPlayers.map((p) => ({
              value: p.id,
              label: `${p.fullName} (${p.teamId === match.homeTeamId ? match.homeTeam.name : match.awayTeam.name})`,
            }))}
          />
          <AdminSelect
            label="Ассистент"
            name="assistId"
            placeholder="Без ассистента"
            options={allPlayers.map((p) => ({
              value: p.id,
              label: `${p.fullName} (${p.teamId === match.homeTeamId ? match.homeTeam.name : match.awayTeam.name})`,
            }))}
          />
          <p className="text-xs text-slate-500 sm:col-span-2 lg:col-span-3">
            Для автогола выберите команду, которой засчитан гол, а автором укажите игрока
            команды-соперника — команда и автор нарочно могут быть из разных команд.
          </p>
          <AdminField label="Минута" name="minute" type="number" required />
          <AdminCheckbox label="Автогол" name="isOwnGoal" />
          <AdminCheckbox label="Пенальти" name="isPenalty" />
          <button
            type="submit"
            className="justify-self-start rounded-full bg-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark lg:col-span-3"
          >
            Добавить гол
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-navy">Карточки</h2>
        <ul className="mb-5 space-y-2 text-sm">
          {match.cards.map((card) => (
            <li key={card.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span>
                {card.minute}&apos; — {cardTypeLabels[card.type]}: {card.player.fullName} ({card.team.name})
              </span>
              <form action={deleteCard.bind(null, match.id, card.id)}>
                <button type="submit" className="text-red-600 hover:underline">
                  Удалить
                </button>
              </form>
            </li>
          ))}
          {match.cards.length === 0 && <li className="text-slate-400">Карточек пока нет.</li>}
        </ul>
        <form action={addCard.bind(null, match.id)} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminSelect
            label="Команда"
            name="teamId"
            required
            options={[
              { value: match.homeTeamId, label: match.homeTeam.name },
              { value: match.awayTeamId, label: match.awayTeam.name },
            ]}
          />
          <AdminSelect
            label="Игрок"
            name="playerId"
            required
            options={allPlayers.map((p) => ({
              value: p.id,
              label: `${p.fullName} (${p.teamId === match.homeTeamId ? match.homeTeam.name : match.awayTeam.name})`,
            }))}
          />
          <AdminSelect
            label="Тип карточки"
            name="type"
            required
            options={[
              { value: "YELLOW", label: "Жёлтая" },
              { value: "RED", label: "Красная" },
            ]}
          />
          <AdminField label="Минута" name="minute" type="number" required />
          <AdminField label="Причина" name="reason" />
          <button
            type="submit"
            className="justify-self-start rounded-full bg-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark lg:col-span-3"
          >
            Добавить карточку
          </button>
        </form>
      </section>
    </div>
  );
}

function LineupForm({
  teamName,
  action,
  players,
  startingIds,
}: {
  teamName: string;
  action: (formData: FormData) => void;
  players: { id: string; fullName: string; number: number | null }[];
  startingIds: Set<string>;
}) {
  return (
    <form action={action} className="rounded-xl border border-slate-200 p-4">
      <p className="mb-3 text-sm font-semibold text-navy">{teamName}</p>
      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {players.map((player) => (
          <label key={player.id} className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="playerIds"
              value={player.id}
              defaultChecked={startingIds.has(player.id)}
              className="h-4 w-4 rounded border-slate-300 text-blue focus:ring-blue/30"
            />
            {player.fullName} {player.number ? `(#${player.number})` : ""}
          </label>
        ))}
        {players.length === 0 && <p className="text-sm text-slate-400">В команде пока нет игроков.</p>}
      </div>
      <button
        type="submit"
        className="mt-3 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light"
      >
        Сохранить состав
      </button>
    </form>
  );
}
