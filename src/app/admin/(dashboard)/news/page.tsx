import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { deleteNews } from "@/lib/actions/news";

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Новости</h1>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 rounded-full bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          <Plus className="h-4 w-4" /> Добавить новость
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Заголовок</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {news.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-medium text-navy">{item.title}</td>
                <td className="px-4 py-3 text-slate-600">{item.isPublished ? "Опубликовано" : "Черновик"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/news/${item.id}`} className="text-sm font-medium text-blue hover:underline">
                      Изменить
                    </Link>
                    <form action={deleteNews.bind(null, item.id)}>
                      <button type="submit" className="text-sm font-medium text-red-600 hover:underline">
                        Удалить
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {news.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                  Новостей пока нет.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
