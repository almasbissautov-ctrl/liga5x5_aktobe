import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/i18n/types";

export default async function NewsDetailPage({
  params,
}: {
  params: { locale: Locale; newsSlug: string };
}) {
  const item = await prisma.news.findFirst({ where: { slug: params.newsSlug, isPublished: true } });
  if (!item) notFound();

  const paragraphs = item.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <Container>
      <article className="mx-auto max-w-2xl py-12 md:py-16">
        {item.publishedAt && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue">
            {new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long", year: "numeric" }).format(item.publishedAt)}
          </p>
        )}
        <h1 className="text-3xl font-bold text-navy md:text-4xl">{item.title}</h1>
        {item.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.coverImageUrl} alt={item.title} className="mt-6 w-full rounded-2xl object-cover" />
        )}
        <div className="mt-8 space-y-4 text-base leading-relaxed text-slate-700">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </Container>
  );
}
