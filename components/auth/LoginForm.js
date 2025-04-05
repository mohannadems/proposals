import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Vibration } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import AuthInput from "../forms/login-forms/AuthInput";
import { LoginButton } from "./LoginButton";
import { BiometricButton } from "./BiometricButton";
import { loginStyles } from "../../styles/auth.styles";
import { AUTH_MESSAGES } from "../../constants/auth";
import { LanguageContext } from "../../contexts/LanguageContext";

// Enhanced TouchableOpacity with haptic feedback
const HapticTouchable = ({ onPress, feedback = "light", children, style }) => {
  const handlePress = async () => {
    switch (feedback) {
      case "light":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "error":
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      default:
        await Haptics.selectionAsync();
    }
    onPress?.();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      {children}
    </TouchableOpacity>
  );
};

// Enhanced Login Button with haptic feedback
const EnhancedLoginButton = ({ onPress, loading, buttonText }) => {
  const handleLogin = async () => {
    if (!loading) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress?.();
    }
  };

  return (
    <LoginButton
      onPress={handleLogin}
      loading={loading}
      buttonText={buttonText}
    />
  );
};

const EnhancedBiometricButton = ({ onPress, buttonText }) => {
  const handleBiometric = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };
};

export const LoginForm = ({
  form,
  loading,
  isBiometricEnabled,
  onLogin,
  onBiometricAuth,
  isRTL,
  t,
}) => {
  const { credentials, validationErrors, touched, handleChange, handleBlur } =
    form;

  const languageContext = useContext(LanguageContext);
  const translate = t || (languageContext ? languageContext.t : null);
  const rtl =
    isRTL !== undefined
      ? isRTL
      : languageContext
      ? languageContext.isRTL
      : false;

  const handleInputChange = (field, text) => {
    Haptics.selectionAsync();
    handleChange(field, text);
  };

  return (
    <View
      style={[
        loginStyles.formContainer,
        rtl && { alignItems: rtl ? "flex-end" : "flex-start" },
      ]}
    >
      <AuthInput
        label={translate ? translate("auth.email") : "Email"}
        value={credentials.email}
        onChangeText={(text) => handleInputChange("email", text)}
        onBlur={() => handleBlur("email")}
        error={validationErrors.email}
        touched={touched.email}
        placeholder={
          translate ? translate("auth.email_placeholder") : "Enter your email"
        }
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="email"
        isRTL={rtl}
      />

      <AuthInput
        label={translate ? translate("auth.password") : "Password"}
        value={credentials.password}
        onChangeText={(text) => handleInputChange("password", text)}
        onBlur={() => handleBlur("password")}
        error={validationErrors.password}
        touched={touched.password}
        placeholder={
          translate
            ? translate("auth.password_placeholder")
            : "Enter your password"
        }
        secureTextEntry
        leftIcon="lock"
        isRTL={rtl}
      />

      <HapticTouchable
        style={[loginStyles.forgotPassword, rtl && { alignSelf: "flex-start" }]}
        feedback="light"
        onPress={() => {}}
      >
        <Text
          style={[
            loginStyles.forgotPasswordText,
            rtl && { textAlign: "right" },
          ]}
        >
          {translate
            ? translate("auth.forgot_password")
            : AUTH_MESSAGES.FORGOT_PASSWORD}
        </Text>
      </HapticTouchable>

      {validationErrors.general && (
        <View
          style={[
            loginStyles.errorContainer,
            rtl && { flexDirection: "row-reverse" },
          ]}
        >
          <MaterialIcons name="error" size={20} color="#FF3B30" />
          <Text
            style={[
              loginStyles.errorText,
              rtl && { textAlign: "right", marginRight: 8, marginLeft: 0 },
            ]}
          >
            {validationErrors.general}
          </Text>
        </View>
      )}

      <EnhancedLoginButton
        onPress={onLogin}
        loading={loading}
        buttonText={
          translate ? translate("auth.continue_journey") : "Continue Journey"
        }
      />

      {isBiometricEnabled && (
        <EnhancedBiometricButton
          onPress={onBiometricAuth}
          buttonText={
            translate
              ? translate("auth.sign_in_with_face_id")
              : "Sign in with Face ID"
          }
        />
      )}
    </View>
  );
};
