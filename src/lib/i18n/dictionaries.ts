import ru from "./dictionaries/ru";
import kk from "./dictionaries/kk";
import type { Locale } from "./types";

const dictionaries = { ru, kk };

export async function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.ru;
}
