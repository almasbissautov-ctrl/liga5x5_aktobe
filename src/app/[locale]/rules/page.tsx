import { FileText } from "lucide-react";
import Container from "@/components/ui/Container";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { prisma } from "@/lib/db";
import { DEFAULT_REGULATION } from "@/lib/content";
import type { Locale } from "@/lib/i18n/types";

export default async function RulesPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const regulation = await prisma.regulation.findFirst();
  const content = regulation?.content ?? DEFAULT_REGULATION;
  const paragraphs = content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <Container>
      <div className="py-12 md:py-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue">{dict.common.league}</p>
            <h1 className="text-2xl font-bold text-navy md:text-3xl">{dict.nav.rules}</h1>
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-4 whitespace-pre-line rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-700 md:p-10 md:text-base">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </Container>
  );
}
