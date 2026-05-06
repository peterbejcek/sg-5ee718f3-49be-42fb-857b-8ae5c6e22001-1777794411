module.exports = {
  i18n: {
    defaultLocale: "sk",
    locales: ["sk", "en", "de", "ru", "uk", "he", "hu", "ar"],
    localeDetection: false,
  },
  reloadOnPrerender: process.env.NODE_ENV === "development",
};