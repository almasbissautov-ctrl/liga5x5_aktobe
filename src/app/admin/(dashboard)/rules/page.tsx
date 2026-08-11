import { prisma } from "@/lib/db";
import { updateRegulation } from "@/lib/actions/rules";
import { DEFAULT_REGULATION } from "@/lib/content";

export default async function AdminRulesPage() {
  const regulation = await prisma.regulation.findFirst();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-navy">Регламент</h1>
      <p className="mb-6 text-sm text-slate-500">
        Этот текст показывается на публичной странице «Регламент». Пустые строки разбивают текст на абзацы.
      </p>
      <form action={updateRegulation} className="grid max-w-3xl gap-5 rounded-2xl border border-slate-200 bg-white p-6">
        <textarea
          name="content"
          rows={22}
          defaultValue={regulation?.content ?? DEFAULT_REGULATION}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm leading-relaxed focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
        />
        <button
          type="submit"
          className="justify-self-start rounded-full bg-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Сохранить
        </button>
      </form>
    </div>
  );
}
