import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  User,
  Calendar,
  Flag,
  Newspaper,
  Building2,
  Inbox,
  FileText,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/actions/auth";

const navItems = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/teams", label: "Команды", icon: Users },
  { href: "/admin/players", label: "Игроки", icon: User },
  { href: "/admin/matches", label: "Матчи", icon: Calendar },
  { href: "/admin/referees", label: "Судьи", icon: Flag },
  { href: "/admin/news", label: "Новости", icon: Newspaper },
  { href: "/admin/sponsors", label: "Спонсоры", icon: Building2 },
  { href: "/admin/rules", label: "Регламент", icon: FileText },
  { href: "/admin/applications", label: "Заявки команд", icon: Inbox },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col bg-navy text-white md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5 font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue text-xs font-extrabold">
            5×5
          </span>
          Админка
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 hover:bg-white/10"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="border-t border-white/10 p-3">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </form>
      </aside>

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
          <span className="font-bold text-navy">Админка · Лига 5×5</span>
          <form action={signOut}>
            <button type="submit" className="text-sm font-medium text-slate-500">
              Выйти
            </button>
          </form>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
