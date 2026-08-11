import Link from "next/link";
import { Calendar, Trophy, Users, BarChart3, Video as VideoIcon, Newspaper } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import LogoBadge from "@/components/ui/LogoBadge";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";

const sectionIcons = {
  matches: Calendar,
  standings: Trophy,
  teams: Users,
  stats: BarChart3,
  videos: VideoIcon,
  news: Newspaper,
} as const;

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const { home } = dict;

  return (
    <div>
      <section className="bg-navy text-white">
        <Container className="flex flex-col items-center gap-6 py-20 text-center md:py-28">
          <LogoBadge size={100} className="p-2" />
          <span className="rounded-full bg-blue/20 px-4 py-1.5 text-sm font-semibold text-blue-light">
            {home.heroKicker}
          </span>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
            {home.heroTitle}
          </h1>
          <p className="max-w-xl text-lg text-white/75">{home.heroSubtitle}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button href={`/${params.locale}/standings`} size="lg">
              {home.heroCta}
            </Button>
            <Button href={`/${params.locale}/join`} variant="outline" size="lg">
              {home.heroCtaSecondary}
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <h2 className="text-center text-2xl font-bold text-navy md:text-3xl">
            {home.sectionsTitle}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(home.sections) as Array<keyof typeof home.sections>).map((key) => {
              const Icon = sectionIcons[key];
              const section = home.sections[key];
              return (
                <Link
                  key={key}
                  href={`/${params.locale}/${key}`}
                  className="group rounded-2xl border border-slate-200 p-6 transition-all hover:-translate-y-1 hover:border-blue hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white transition-colors group-hover:bg-blue">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-navy">{section.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{section.text}</p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
