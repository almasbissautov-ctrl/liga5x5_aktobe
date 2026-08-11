import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

export const metadata: Metadata = {
  title: "Админ-панель — Лига 5×5 Актобе",
  robots: { index: false, follow: false },
};

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
