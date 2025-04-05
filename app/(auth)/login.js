import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { login } from "../../store/slices/auth.slice";
import { LoginForm } from "../../components/auth/LoginForm";
import { useBiometric } from "../../hooks/useBiometric";
import { useLoginForm } from "../../hooks/useLoginForm";
import { loginStyles } from "../../styles/auth.styles";
import { AUTH_MESSAGES } from "../../constants/auth";
import { StyleSheet } from "react-native";
import { fetchProfile } from "../../store/slices/profile.slice";
import { LanguageContext } from "../../contexts/LanguageContext";

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const form = useLoginForm();
  const { isRTL, t } = useContext(LanguageContext);

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
        general:
          error.message ||
          t("auth.invalid_credentials") ||
          AUTH_MESSAGES.INVALID_CREDENTIALS,
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
        general:
          t("auth.invalid_credentials") || AUTH_MESSAGES.INVALID_CREDENTIALS,
      }));
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
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
              color="#9e086c"
              style={loginStyles.decorationHeart}
            />
          </View>

          <ScrollView
            style={loginStyles.content}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={loginStyles.logoContainer}>
              <Text style={loginStyles.welcomeText}>
                {t("auth.welcome_title") || AUTH_MESSAGES.WELCOME_TITLE}
              </Text>
              <Text style={loginStyles.subtitle}>
                {t("auth.welcome_subtitle") || AUTH_MESSAGES.WELCOME_SUBTITLE}
              </Text>
            </View>

            <LoginForm
              form={form}
              loading={loading}
              isBiometricEnabled={biometric.isBiometricEnabled}
              onLogin={handleLogin}
              onBiometricAuth={biometric.handleBiometricAuth}
              isRTL={isRTL}
              t={t}
            />

            <TouchableOpacity
              style={loginStyles.registerLink}
              onPress={() => router.push("/(auth)/register")}
            >
              <Text style={loginStyles.registerLinkText}>
                {t("auth.new_user") || AUTH_MESSAGES.NEW_USER}
                <Text style={loginStyles.registerLinkBold}>
                  {t("auth.sign_up") || AUTH_MESSAGES.SIGN_UP}
                </Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}
