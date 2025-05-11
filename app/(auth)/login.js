import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { login } from "../../store/slices/auth.slice";
import { LoginForm } from "../../components/auth/LoginForm";
import { useBiometric } from "../../hooks/useBiometric";
import { useLoginForm } from "../../hooks/useLoginForm";
import { loginStyles } from "../../styles/auth.styles";
import { fetchProfile } from "../../store/slices/profile.slice";
import { LanguageContext } from "../../contexts/LanguageContext";
import { Alert } from "react-native";
import * as Updates from "expo-updates";
export const BIOMETRIC_KEY = "BIOMETRIC_CREDENTIALS";

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const form = useLoginForm();
  const { locale, isRTL, changeLanguage, t } = useContext(LanguageContext);

  const handleLoginSuccess = async (credentials) => {
    try {
      const result = await dispatch(login(credentials)).unwrap();
      if (result) {
        await biometric.saveBiometricCredentials(credentials);
        router.replace("/(tabs)/home");
        await dispatch(fetchProfile());
      }
      return result;
    } catch (error) {
      form.setValidationErrors((prev) => ({
        ...prev,
        general: error.message || t("auth.invalid_credentials"),
      }));
      throw error;
    }
  };

  const biometric = useBiometric(handleLoginSuccess);

  const handleLogin = async () => {
    if (!form.validateForm()) {
      return;
    }

    try {
      await handleLoginSuccess(form.credentials);
    } catch (error) {
      form.setValidationErrors((prev) => ({
        ...prev,
        general: t("auth.invalid_credentials"),
      }));
    }
  };

  const toggleLanguage = async () => {
    // Add haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newLanguage = locale === "en" ? "ar" : "en";
    const currentLanguageName = locale === "en" ? "English" : "العربية";
    const newLanguageName = newLanguage === "en" ? "English" : "العربية";

    const changeMessage = t
      ? t("language.change_message")
          .replace("{current}", currentLanguageName)
          .replace("{new}", newLanguageName)
      : `Are you sure you want to change the language from ${currentLanguageName} to ${newLanguageName}?`;

    Alert.alert(
      t("language.change_title") || "Change Language",
      changeMessage,
      [
        {
          text: t("common.cancel") || "Cancel",
          style: "cancel",
        },
        {
          text: t("common.confirm") || "Confirm",
          style: "default",
          onPress: async () => {
            try {
              await changeLanguage(newLanguage);

              if (Updates && Updates.reloadAsync) {
                setTimeout(async () => {
                  try {
                    await Updates.reloadAsync();
                  } catch (reloadError) {
                    console.error("Failed to reload app:", reloadError);

                    Alert.alert(
                      t("language.reload_failed_title") || "Reload Failed",
                      t("language.reload_failed_message") ||
                        "Please restart the app manually to apply the language change.",
                      [{ text: t("common.ok") || "OK" }]
                    );
                  }
                }, 300);
              } else {
                Alert.alert(
                  t("language.restart_required_title") || "Restart Required",
                  t("language.restart_required_message") ||
                    "Please restart the app to apply the language change.",
                  [{ text: t("common.ok") || "OK" }]
                );
              }
            } catch (error) {
              console.error("Error changing language:", error);

              // Show error message
              Alert.alert(
                t("language.change_error_title") || "Error",
                t("language.change_error_message") ||
                  "Failed to change language. Please try again.",
                [{ text: t("common.ok") || "OK" }]
              );
            }
          },
        },
      ]
    );
  };

  const rtlStyles = {
    content: {
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    logoContainer: {
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    textAlign: {
      textAlign: isRTL ? "right" : "left",
    },
    languageToggle: {
      position: "absolute",
      top: 40,
      ...(isRTL ? { left: 20 } : { right: 20 }),
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      zIndex: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    registerLink: {
      alignSelf: isRTL ? "flex-end" : "flex-start",
    },
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={loginStyles.container}
      >
        <LinearGradient
          colors={["rgba(65, 105, 225, 0.1)", "rgba(212, 175, 55, 0.1)"]}
          style={StyleSheet.absoluteFill}
        />

        <TouchableOpacity
          style={rtlStyles.languageToggle}
          onPress={toggleLanguage}
        >
          <Text style={styles.languageText}>
            {locale === "en" ? "العربية" : "English"}
          </Text>
        </TouchableOpacity>

        <View style={loginStyles.topDecoration}>
          <FontAwesome
            name="heart"
            size={24}
            color="#B65165"
            style={loginStyles.decorationHeart}
          />
        </View>

        <View style={[loginStyles.content, rtlStyles.content]}>
          <View style={[loginStyles.logoContainer, rtlStyles.logoContainer]}>
            <Text style={[loginStyles.welcomeText, rtlStyles.textAlign]}>
              {t("auth.welcome_title")}
            </Text>
            <Text style={[loginStyles.subtitle, rtlStyles.textAlign]}>
              {t("auth.welcome_subtitle")}
            </Text>
          </View>

          <LoginForm
            form={form}
            loading={loading}
            isBiometricEnabled={biometric.isBiometricEnabled}
            onLogin={handleLogin}
            onBiometricAuth={biometric.handleBiometricAuth}
            t={t}
            isRTL={isRTL}
          />

          <TouchableOpacity
            style={[loginStyles.registerLink, rtlStyles.registerLink]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(auth)/register");
            }}
          >
            <Text style={[loginStyles.registerLinkText, rtlStyles.textAlign]}>
              {t("auth.new_user")}{" "}
              <Text style={loginStyles.registerLinkBold}>
                {t("auth.sign_up")}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  languageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9e086c",
  },
});
