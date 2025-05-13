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
import { useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import COLORS from "../../constants/colors";
import { LoginForm } from "../../components/auth/LoginForm";
import { loginStyles, getRtlStyles } from "../../styles/auth.styles";
import { useLoginForm } from "../../hooks/useLoginForm";
import { useHandleLogin } from "../../hooks/useHandleLogin";
import { useLanguageToggle } from "../../hooks/useLanguageToggle";
import { LanguageContext } from "../../contexts/LanguageContext";

export default function LoginScreen() {
  const { loading } = useSelector((state) => state.auth);
  const form = useLoginForm();
  const { locale, isRTL, changeLanguage, t } = useContext(LanguageContext);
  const rtlStyles = getRtlStyles(isRTL);

  const { handleLogin, biometric } = useHandleLogin(form, t);
  const { toggleLanguage } = useLanguageToggle({ locale, changeLanguage, t });

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
          <Text style={loginStyles.languageText}>
            {locale === "en" ? "العربية" : "English"}
          </Text>
        </TouchableOpacity>

        <View style={loginStyles.topDecoration}>
          <FontAwesome
            name="heart"
            size={24}
            color={COLORS.primary}
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
