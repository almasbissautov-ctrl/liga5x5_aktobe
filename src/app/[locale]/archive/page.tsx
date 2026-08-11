import Link from "next/link";
import { Archive } from "lucide-react";
import Container from "@/components/ui/Container";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/i18n/types";

export default async function ArchivePage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const seasons = await prisma.season.findMany({ orderBy: { year: "desc" } });

  return (
    <Container>
      <div className="py-12 md:py-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
            <Archive className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue">{dict.common.league}</p>
            <h1 className="text-2xl font-bold text-navy md:text-3xl">{dict.nav.archive}</h1>
          </div>
        </div>

        <div className="mx-auto max-w-xl space-y-3">
          {seasons.map((season) => (
            <Link
              key={season.id}
              href={`/${params.locale}/archive/${season.slug}`}
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-5 py-4 transition-colors hover:border-blue"
            >
              <span className="text-lg font-semibold text-navy">{season.title}</span>
              <span className="text-sm text-slate-500">
                {season.status === "ACTIVE" ? "Идёт сейчас" : season.status === "FINISHED" ? "Завершён" : "Скоро"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
