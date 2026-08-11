import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getActiveSeason } from "@/lib/services/season";
import { prisma } from "@/lib/db";
import { matchStatusLabels } from "@/lib/labels";
import { formatMatchDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n/types";

export default async function MatchesPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const season = await getActiveSeason();
  const matches = season
    ? await prisma.match.findMany({
        where: { seasonId: season.id },
        orderBy: { matchDate: "asc" },
        include: { homeTeam: true, awayTeam: true },
      })
    : [];

  return (
    <Container>
      <div className="py-12 md:py-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue">{dict.common.season}</p>
            <h1 className="text-2xl font-bold text-navy md:text-3xl">{dict.nav.matches}</h1>
          </div>
        </div>

        {matches.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            Расписание появится здесь после добавления матчей в админ-панели.
          </p>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <Link
                key={match.id}
                href={`/${params.locale}/matches/${match.id}`}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-5 transition-colors hover:border-blue sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>{formatMatchDate(match.matchDate)}</span>
                  {match.venue && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {match.venue}
                    </span>
                  )}
                  {match.round && <span>Тур {match.round}</span>}
                </div>
                <div className="flex flex-1 items-center justify-center gap-4 text-base font-semibold text-navy">
                  <span className="flex-1 text-right">{match.homeTeam.name}</span>
                  <span className="rounded-lg bg-slate-100 px-3 py-1 text-navy">
                    {match.status === "FINISHED" ? `${match.homeScore ?? 0}:${match.awayScore ?? 0}` : "—:—"}
                  </span>
                  <span className="flex-1">{match.awayTeam.name}</span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 sm:text-right">
                  {matchStatusLabels[match.status]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
