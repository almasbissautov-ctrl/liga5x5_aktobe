import { Info } from "lucide-react";
import Container from "@/components/ui/Container";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { prisma } from "@/lib/db";
import { ABOUT_TEXT } from "@/lib/content";
import type { Locale } from "@/lib/i18n/types";

export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const sponsors = await prisma.sponsor.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  const paragraphs = ABOUT_TEXT.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <Container>
      <div className="py-12 md:py-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
            <Info className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue">{dict.common.league}</p>
            <h1 className="text-2xl font-bold text-navy md:text-3xl">{dict.nav.about}</h1>
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-slate-700 md:text-base">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {sponsors.length > 0 && (
          <div className="mx-auto mt-14 max-w-3xl">
            <h2 className="mb-6 text-center text-xl font-semibold text-navy">Партнёры лиги</h2>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {sponsors.map((sponsor) => {
                const logo = sponsor.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="h-14 w-auto object-contain grayscale transition hover:grayscale-0" />
                ) : (
                  <span className="text-sm font-semibold text-slate-500">{sponsor.name}</span>
                );

                return sponsor.websiteUrl ? (
                  <a key={sponsor.id} href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" title={sponsor.name}>
                    {logo}
                  </a>
                ) : (
                  <div key={sponsor.id} title={sponsor.name}>
                    {logo}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
