import { createContext, useMemo, useState } from "react";
import { translations } from "../utils/translations";

export const LanguageContext = createContext({
  language: "en",
  strings: translations.en,
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const value = useMemo(() => ({ language, strings: translations[language], setLanguage }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
