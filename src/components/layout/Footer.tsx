import Link from "next/link";
import Container from "@/components/ui/Container";
import LogoBadge from "@/components/ui/LogoBadge";
import { navItems } from "@/lib/nav";
import type { Dictionary, Locale } from "@/lib/i18n/types";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="mt-24 bg-navy-dark text-white">
      <Container className="grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5 font-bold">
            <LogoBadge size={40} />
            <span className="text-lg">Лига 5×5 Актобе</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/60">
            {dict.common.season} · {dict.home.heroSubtitle}
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">
            {dict.nav.home}
          </p>
          <ul className="space-y-2 text-sm text-white/75">
            {navItems.slice(0, 6).map((item) => (
              <li key={item.key}>
                <Link href={`/${locale}/${item.href}`} className="hover:text-white">
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">
            {dict.footer.contacts}
          </p>
          <ul className="space-y-2 text-sm text-white/75">
            <li>Актобе, Казахстан</li>
            <li>info@liga5x5aktobe.kz</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-5">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-white/50 sm:flex-row">
          <span>
            © {new Date().getFullYear()} Лига 5×5 Актобе. {dict.footer.rights}
          </span>
          <span>{dict.common.season}</span>
        </Container>
      </div>
    </footer>
  );
}
