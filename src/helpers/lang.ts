import i18n from "locales/i18n";
import type { ILocalizedString } from "types/global";

export function checkFixLang(lang) {
  if (lang === "en") {
    document.getElementsByTagName("html")[0].setAttribute("dir", "ltr");
    document.getElementsByTagName("body")[0].setAttribute("dir", "ltr");
  }

  if (lang === "ar") {
    document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
    document.getElementsByTagName("body")[0].setAttribute("dir", "rtl");
  }
}

export async function switchLang(lang: "en" | "ar") {
  await i18n.changeLanguage(lang);
  localStorage.setItem("lang", lang);

  document
    .getElementsByTagName("html")[0]
    .setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  document
    .getElementsByTagName("body")[0]
    .setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  if (lang === "ar") {
    document.getElementsByTagName("body")[0].classList.add("ar-lang");
  } else document.getElementsByTagName("body")[0].classList.remove("ar-lang");

  document.getElementsByTagName("html")[0].setAttribute("lang", lang);

  window.location.reload();
}

export function getLocalizedWord(
  word: ILocalizedString | string | undefined,
  defaultWord = ""
): string {
  const lang = i18n.language;

  if (!word) return defaultWord;
  if (typeof word === "string") return word;
  return word?.[lang] ?? word?.en ?? word?.ar ?? defaultWord;
}

export function getLocalizedNumber(price = 0, isPrice = false) {
  const lang = i18n.language;

  return new Intl.NumberFormat(`${lang}-EG`, {
    ...(isPrice && { style: "currency", currency: "EGP" }),
    maximumFractionDigits: 2,
  }).format(price);
}
