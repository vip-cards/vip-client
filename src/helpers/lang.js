import i18n from "locales/i18n";

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

export function switchLang(lang) {
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

  // editTitle(lang);

  window.location.reload();
}

export function getLocalizedWord(word, defaultWord = "") {
  const lang = i18n.language;
  return (
    word?.[lang] ??
    word?.en ??
    word?.ar ??
    ((typeof word === "string" && word) || defaultWord)
  );
}
