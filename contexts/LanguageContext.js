import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { I18nManager } from "react-native";
import * as Updates from "expo-updates";
import en from "../translations/en.json";
import ar from "../translations/ar.json";

// Safe translation utility
const safeTranslate = (translations, key, fallback = "") => {
  // If key is not a string or translations is not an object, return fallback
  if (
    typeof key !== "string" ||
    typeof translations !== "object" ||
    translations === null
  ) {
    return fallback;
  }

  // Split the key into parts to handle nested translations
  const keyParts = key.split(".");

  let currentValue = translations;

  // Traverse the nested object
  for (const part of keyParts) {
    // If we can't find the next level, return fallback
    if (!currentValue || typeof currentValue !== "object") {
      return fallback;
    }

    currentValue = currentValue[part];
  }

  // If final value is an object, try to extract a string
  if (typeof currentValue === "object") {
    // Try to find a string value in common keys
    const stringKeys = ["value", "label", "text", "title", "name"];
    for (const stringKey of stringKeys) {
      if (
        currentValue[stringKey] &&
        typeof currentValue[stringKey] === "string"
      ) {
        return currentValue[stringKey];
      }
    }

    // If no string key found, try to convert object to string
    try {
      return Object.values(currentValue)
        .filter((val) => val !== null && val !== undefined)
        .map(String)
        .join(", ");
    } catch {
      return fallback;
    }
  }

  // If it's a string, return it
  if (typeof currentValue === "string") {
    return currentValue;
  }

  // Convert to string or return fallback
  return currentValue !== null && currentValue !== undefined
    ? String(currentValue)
    : fallback;
};

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

  // Replace the changeLanguage function with this improved version:
  const changeLanguage = async (lang) => {
    try {
      if (lang !== locale) {
        const shouldBeRTL = lang === "ar";

        // Save the language preference first
        await AsyncStorage.setItem("userLanguage", lang);

        // Update the locale state immediately
        setLocale(lang);
        setIsRTL(shouldBeRTL);

        // Check if RTL settings need to change
        if (I18nManager.isRTL !== shouldBeRTL) {
          // Apply RTL changes
          I18nManager.allowRTL(shouldBeRTL);
          I18nManager.forceRTL(shouldBeRTL);

          // Force a full reload (needed for RTL layout changes)
          if (Updates.isAvailable && Updates.reloadAsync) {
            try {
              // Add a small delay before reloading to ensure settings are applied
              setTimeout(async () => {
                await Updates.reloadAsync();
              }, 100);
            } catch (error) {
              console.error("Failed to reload the app:", error);
              // Alert user to manually reload
              alert(
                "Please restart the app for layout changes to take effect."
              );
            }
          } else {
            // If Updates API is not available
            alert(
              "Please restart the app for RTL layout changes to take effect."
            );
          }
        }
      }
    } catch (error) {
      console.error("Failed to save language setting:", error);
    }
  };
  // Set up i18n configuration
  i18n.locale = locale;
  i18n.enableFallback = true;

  // Custom translate function using safe translation
  const t = (key, options) => {
    // Use safeTranslate to handle complex translation objects
    const translations = locale === "ar" ? ar : en;

    // First try i18n translation
    try {
      const originalTranslation = i18n.t(key, options);

      // If original translation is an object, use safeTranslate
      if (typeof originalTranslation === "object") {
        return safeTranslate(translations, key, key);
      }

      // If it's a string, return it
      if (typeof originalTranslation === "string") {
        return originalTranslation;
      }
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
    }

    // Fallback to safeTranslate
    return safeTranslate(translations, key, key);
  };

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
