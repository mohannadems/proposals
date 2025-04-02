// contexts/LanguageContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { I18nManager } from "react-native";
import * as Updates from "expo-updates";
import en from "../translations/en.json";
import ar from "../translations/ar.json";

// Initialize translations
const i18n = new I18n({
  en,
  ar,
});

// Create a context for language
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState("en");
  const [isRTL, setIsRTL] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Initialize language on app load
  useEffect(() => {
    const loadLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem("userLanguage");
        if (savedLocale) {
          setLocale(savedLocale);
          const shouldBeRTL = savedLocale === "ar";
          setIsRTL(shouldBeRTL);

          if (I18nManager.isRTL !== shouldBeRTL) {
            I18nManager.allowRTL(shouldBeRTL);
            I18nManager.forceRTL(shouldBeRTL);
          }
        } else {
          const deviceLocale = Localization.locale.split("-")[0];
          const initialLocale = ["en", "ar"].includes(deviceLocale)
            ? deviceLocale
            : "en";
          const shouldBeRTL = initialLocale === "ar";

          setLocale(initialLocale);
          setIsRTL(shouldBeRTL);

          if (I18nManager.isRTL !== shouldBeRTL) {
            I18nManager.allowRTL(shouldBeRTL);
            I18nManager.forceRTL(shouldBeRTL);
          }

          await AsyncStorage.setItem("userLanguage", initialLocale);
        }
        setIsReady(true);
      } catch (error) {
        console.error("Failed to load language settings:", error);
        setIsReady(true);
      }
    };

    loadLocale();
  }, []);

  const changeLanguage = async (lang) => {
    try {
      if (lang !== locale) {
        const shouldBeRTL = lang === "ar";

        await AsyncStorage.setItem("userLanguage", lang);

        if (I18nManager.isRTL !== shouldBeRTL) {
          I18nManager.allowRTL(shouldBeRTL);
          I18nManager.forceRTL(shouldBeRTL);

          if (Updates.isAvailable && Updates.reloadAsync) {
            console.log("Reloading app for RTL changes...");
            try {
              await Updates.reloadAsync();
            } catch (error) {
              console.error("Failed to reload the app:", error);
              // If reload fails, at least update the context
              setLocale(lang);
              setIsRTL(shouldBeRTL);
            }
          } else {
            console.log(
              "Expo Updates not available, app needs to be restarted manually"
            );
            // For development, we'll just update the context
            setLocale(lang);
            setIsRTL(shouldBeRTL);
            alert(
              "Please restart the app for RTL layout changes to take effect."
            );
          }
        } else {
          // If RTL state isn't changing, just update the language
          setLocale(lang);
          setIsRTL(shouldBeRTL);
        }
      }
    } catch (error) {
      console.error("Failed to save language setting:", error);
    }
  };

  // Set up i18n configuration
  i18n.locale = locale;
  i18n.enableFallback = true;

  // Translate function to use throughout the app
  const t = (key, options) => i18n.t(key, options);

  if (!isReady) {
    // You could return a loading screen here
    return null;
  }

  return (
    <LanguageContext.Provider value={{ locale, isRTL, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
