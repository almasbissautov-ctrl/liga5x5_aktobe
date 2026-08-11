import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { locales, type Locale } from "@/lib/i18n/types";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);

  return (
    <html lang={params.locale} className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased">
        <Header locale={params.locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer locale={params.locale} dict={dict} />
      </body>
    </html>
  );
}
