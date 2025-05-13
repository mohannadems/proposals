import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import * as Updates from "expo-updates";

export const useLanguageToggle = ({ locale, changeLanguage, t }) => {
  const toggleLanguage = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newLang = locale === "en" ? "ar" : "en";
    const oldLangName = locale === "en" ? "English" : "العربية";
    const newLangName = newLang === "en" ? "English" : "العربية";

    const changeMessage = t("language.change_message")
      ?.replace("{current}", oldLangName)
      .replace("{new}", newLangName);

    Alert.alert(
      t("language.change_title") || "Change Language",
      changeMessage,
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.confirm"),
          onPress: async () => {
            try {
              await changeLanguage(newLang);
              setTimeout(async () => {
                await Updates.reloadAsync();
              }, 300);
            } catch (error) {
              Alert.alert(
                t("language.change_error_title") || "Error",
                t("language.change_error_message") ||
                  "Failed to change language. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return { toggleLanguage };
};
