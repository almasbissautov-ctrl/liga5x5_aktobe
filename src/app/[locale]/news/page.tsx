import Link from "next/link";
import { Newspaper } from "lucide-react";
import Container from "@/components/ui/Container";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/i18n/types";

export default async function NewsPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const news = await prisma.news.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <Container>
      <div className="py-12 md:py-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
            <Newspaper className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-navy md:text-3xl">{dict.nav.news}</h1>
        </div>

        {news.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            Новостей пока нет — они появятся здесь после публикации в админ-панели.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/${params.locale}/news/${item.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 transition-all hover:-translate-y-1 hover:border-blue hover:shadow-lg"
              >
                {item.coverImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.coverImageUrl} alt={item.title} className="h-44 w-full object-cover" />
                )}
                <div className="p-5">
                  {item.publishedAt && (
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long", year: "numeric" }).format(
                        item.publishedAt
                      )}
                    </p>
                  )}
                  <h3 className="text-lg font-semibold text-navy group-hover:text-blue">{item.title}</h3>
                  {item.excerpt && <p className="mt-2 text-sm text-slate-600">{item.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
