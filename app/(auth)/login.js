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
    changeLanguage(locale === "en" ? "ar" : "en");
  };

  // Create dynamic styles based on RTL
  const dynamicStyles = {
    container: {
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    textAlign: {
      textAlign: isRTL ? "right" : "left",
    },
    content: {
      ...loginStyles.content,
      alignItems: isRTL ? "flex-end" : "flex-start",
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

        <View style={loginStyles.topDecoration}>
          <FontAwesome
            name="heart"
            size={24}
            color="#B65165"
            style={loginStyles.decorationHeart}
          />
        </View>

        <View style={loginStyles.content}>
          <View style={loginStyles.logoContainer}>
            <Text style={[loginStyles.welcomeText, dynamicStyles.textAlign]}>
              {t("auth.welcome_title")}
            </Text>
            <Text style={[loginStyles.subtitle, dynamicStyles.textAlign]}>
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
            style={[
              loginStyles.registerLink,
              isRTL && { alignSelf: "flex-end" },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(auth)/register");
            }}
          >
            <Text
              style={[loginStyles.registerLinkText, dynamicStyles.textAlign]}
            >
              {t("auth.new_user")}
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
  languageToggle: {
    position: "absolute",
    top: 40,
    right: 20,
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
  languageToggleRtl: {
    right: "auto",
    left: 20,
  },
  languageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
});
