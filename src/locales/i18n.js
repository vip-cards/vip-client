import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import commonAr from "./modules/common.ar.json";
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translations: require("./en.json"),
        common: require("./modules/common.en.json"),
      },
      ar: {
        translations: require("./ar.json"),
        common: commonAr,
      },
    },
    lng: localStorage.getItem("lang") || "en",
    fallbackLng: "en", //currentLang(), // "ar",
    // debug: true,
    ns: ["common", "translations"],
    defaultNS: "translations",
    interpolation: {
      escapeValue: false,
    },
  });



export default i18n;
