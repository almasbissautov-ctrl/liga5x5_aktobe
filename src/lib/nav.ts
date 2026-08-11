import type { Dictionary } from "./i18n/types";

export const navItems: { key: keyof Dictionary["nav"]; href: string }[] = [
  { key: "home", href: "" },
  { key: "matches", href: "matches" },
  { key: "standings", href: "standings" },
  { key: "teams", href: "teams" },
  { key: "players", href: "players" },
  { key: "stats", href: "stats" },
  { key: "videos", href: "videos" },
  { key: "news", href: "news" },
  { key: "rules", href: "rules" },
  { key: "about", href: "about" },
  { key: "archive", href: "archive" },
];
