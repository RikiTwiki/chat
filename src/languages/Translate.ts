import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "assets/locales/eng/translation.json";
import ru from "assets/locales/ru/translation.json";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

export const initTranslation = i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    resources: {
      ru: {
        translation: ru,
      },
      en: {
        translation: en,
      },
    },
    fallbackLng: "ru",
    detection: {
      order: ["localStorage", "querystring", "cookie", "path", "subdomain"],
      caches: ["localStorage"],
    },
    backend: {
      loadPath: "assets/locales/{{lng}}/translation.json",
    },
    react: { useSuspense: false },

    interpolation: {
      escapeValue: false,
    },
  });
