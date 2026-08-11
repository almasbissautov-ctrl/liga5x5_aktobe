import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import NewsForm from "@/components/admin/NewsForm";
import { updateNews } from "@/lib/actions/news";

export default async function EditNewsPage({ params }: { params: { id: string } }) {
  const item = await prisma.news.findUnique({ where: { id: params.id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Новость: {item.title}</h1>
      <NewsForm action={updateNews.bind(null, item.id)} defaultValues={item} />
    </div>
  );
}
