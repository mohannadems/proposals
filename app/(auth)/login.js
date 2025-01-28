import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
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

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const form = useLoginForm();

  const handleLoginSuccess = async (credentials) => {
    const result = await dispatch(login(credentials)).unwrap();
    if (result) {
      await biometric.saveBiometricCredentials(credentials);
      router.replace("/(tabs)/home");
    }
    return result;
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
        general: AUTH_MESSAGES.INVALID_CREDENTIALS,
      }));
    }
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
            <Text style={loginStyles.welcomeText}>
              {AUTH_MESSAGES.WELCOME_TITLE}
            </Text>
            <Text style={loginStyles.subtitle}>
              {AUTH_MESSAGES.WELCOME_SUBTITLE}
            </Text>
          </View>

          <LoginForm
            form={form}
            loading={loading}
            isBiometricEnabled={biometric.isBiometricEnabled}
            onLogin={handleLogin}
            onBiometricAuth={biometric.handleBiometricAuth}
          />

          <TouchableOpacity
            style={loginStyles.registerLink}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={loginStyles.registerLinkText}>
              {AUTH_MESSAGES.NEW_USER}
              <Text style={loginStyles.registerLinkBold}>
                {AUTH_MESSAGES.SIGN_UP}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
