"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import LogoBadge from "@/components/ui/LogoBadge";
import { navItems } from "@/lib/nav";
import type { Dictionary, Locale } from "@/lib/i18n/types";

export default function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(/^\/(ru|kk)/, "") || "";

  function localeHref(loc: Locale) {
    return `/${loc}${pathWithoutLocale}`;
  }

  return (
    <header className="sticky top-0 z-50 bg-navy text-white shadow-md">
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5 font-bold"
          onClick={() => setOpen(false)}
        >
          <LogoBadge size={44} priority />
          <span className="hidden leading-tight sm:flex sm:flex-col">
            <span className="text-base">Лига 5×5</span>
            <span className="text-xs font-normal text-blue-light">Актобе · 2026</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={`/${locale}/${item.href}`}
              className="text-sm font-medium text-white/85 transition-colors hover:text-white"
            >
              {dict.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <Link
              href={localeHref("ru")}
              className={cn(locale === "ru" ? "text-white" : "text-white/45 hover:text-white/70")}
            >
              RU
            </Link>
            <span className="text-white/30">/</span>
            <Link
              href={localeHref("kk")}
              className={cn(locale === "kk" ? "text-white" : "text-white/45 hover:text-white/70")}
            >
              KK
            </Link>
          </div>
          <Button href={`/${locale}/join`} size="md">
            {dict.join.cta}
          </Button>
        </div>

        <button
          aria-label="Menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-white/10 bg-navy lg:hidden">
          <Container className="flex flex-col gap-1 py-3">
            <div className="mb-2 flex items-center gap-3 border-b border-white/10 pb-3">
              <LogoBadge size={48} />
              <div className="leading-tight">
                <p className="text-base font-bold">Лига 5×5 Актобе</p>
                <p className="text-xs text-blue-light">Сезон 2026</p>
              </div>
            </div>
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={`/${locale}/${item.href}`}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {dict.nav[item.key]}
              </Link>
            ))}
            <Link
              href={`/${locale}/join`}
              className="mt-2 rounded-lg bg-blue px-3 py-2.5 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              {dict.join.cta}
            </Link>
            <div className="mt-3 flex gap-3 border-t border-white/10 pt-3 text-sm font-semibold">
              <Link
                href={localeHref("ru")}
                className={cn(locale === "ru" ? "text-white" : "text-white/45")}
                onClick={() => setOpen(false)}
              >
                Русский
              </Link>
              <span className="text-white/30">/</span>
              <Link
                href={localeHref("kk")}
                className={cn(locale === "kk" ? "text-white" : "text-white/45")}
                onClick={() => setOpen(false)}
              >
                Қазақша
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
