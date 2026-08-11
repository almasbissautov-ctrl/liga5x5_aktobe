import Link from "next/link";
import { Video, Film, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import VideoEmbed from "@/components/ui/VideoEmbed";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getActiveSeason } from "@/lib/services/season";
import { prisma } from "@/lib/db";
import { formatMatchDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n/types";

export default async function VideosPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const season = await getActiveSeason();
  const matches = season
    ? await prisma.match.findMany({
        where: {
          seasonId: season.id,
          OR: [{ fullVideoUrl: { not: null } }, { highlightsVideoUrl: { not: null } }],
        },
        orderBy: { matchDate: "desc" },
        include: { homeTeam: true, awayTeam: true },
      })
    : [];

  return (
    <Container>
      <div className="py-12 md:py-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
            <Video className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue">{dict.common.season}</p>
            <h1 className="text-2xl font-bold text-navy md:text-3xl">{dict.nav.videos}</h1>
          </div>
        </div>

        {matches.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            Видео появится здесь после того, как администратор добавит ссылки на матчи.
          </p>
        ) : (
          <div className="space-y-10">
            {matches.map((match) => (
              <div key={match.id} className="rounded-2xl border border-slate-200 p-5 md:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={`/${params.locale}/matches/${match.id}`}
                    className="text-lg font-semibold text-navy hover:text-blue"
                  >
                    {match.homeTeam.name} — {match.awayTeam.name}
                  </Link>
                  <span className="text-sm text-slate-500">{formatMatchDate(match.matchDate)}</span>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {match.fullVideoUrl && (
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
                        <Film className="h-4 w-4" /> Полное видео
                      </p>
                      <VideoEmbed url={match.fullVideoUrl} title={`${match.homeTeam.name} — ${match.awayTeam.name}`} />
                    </div>
                  )}
                  {match.highlightsVideoUrl && (
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
                        <Sparkles className="h-4 w-4" /> Лучшие моменты
                      </p>
                      <VideoEmbed url={match.highlightsVideoUrl} title={`${match.homeTeam.name} — ${match.awayTeam.name}, highlights`} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
