import { prisma } from "@/lib/db";
import { setApplicationStatus, deleteApplication } from "@/lib/actions/applications";
import { applicationStatusLabels } from "@/lib/labels";
import { formatMatchDate } from "@/lib/format";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";

export default async function AdminApplicationsPage() {
  const applications = await prisma.teamApplication.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Заявки команд</h1>

      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-navy">{app.teamName}</p>
                <p className="text-sm text-slate-500">{formatMatchDate(app.createdAt)}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {applicationStatusLabels[app.status]}
              </span>
            </div>
            <dl className="mt-3 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <dt className="inline font-medium text-slate-700">Капитан: </dt>
                <dd className="inline">{app.captainName}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-slate-700">Телефон: </dt>
                <dd className="inline">{app.captainPhone}</dd>
              </div>
              {app.city && (
                <div>
                  <dt className="inline font-medium text-slate-700">Город: </dt>
                  <dd className="inline">{app.city}</dd>
                </div>
              )}
            </dl>
            {app.comment && <p className="mt-2 text-sm text-slate-600">«{app.comment}»</p>}
            <div className="mt-4 flex gap-3">
              <form action={setApplicationStatus.bind(null, app.id, "APPROVED")}>
                <button
                  type="submit"
                  className="rounded-full bg-blue px-4 py-2 text-xs font-semibold text-white hover:bg-blue-dark"
                >
                  Принять
                </button>
              </form>
              <form action={setApplicationStatus.bind(null, app.id, "REJECTED")}>
                <button
                  type="submit"
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Отклонить
                </button>
              </form>
              <form action={deleteApplication.bind(null, app.id)}>
                <ConfirmSubmitButton
                  confirmMessage={`Удалить заявку «${app.teamName}»? Это действие нельзя отменить.`}
                  className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Удалить
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
        {applications.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            Заявок пока нет.
          </p>
        )}
      </div>
    </div>
  );
}
