import type { Dictionary } from "./dictionaries/ru";

export const locales = ["ru", "kk"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";
export type { Dictionary };
