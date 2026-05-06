import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import sk from "../../public/locales/sk/common.json";
import en from "../../public/locales/en/common.json";
import de from "../../public/locales/de/common.json";
import ru from "../../public/locales/ru/common.json";
import uk from "../../public/locales/uk/common.json";
import he from "../../public/locales/he/common.json";
import hu from "../../public/locales/hu/common.json";
import ar from "../../public/locales/ar/common.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      sk: { common: sk },
      en: { common: en },
      de: { common: de },
      ru: { common: ru },
      uk: { common: uk },
      he: { common: he },
      hu: { common: hu },
      ar: { common: ar },
    },
    lng: "sk",
    fallbackLng: "sk",
    ns: ["common"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;