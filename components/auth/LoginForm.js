import React, { useContext } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import AuthInput from "../forms/login-forms/AuthInput";
import { LoginButton } from "./LoginButton";
import { BiometricButton } from "./BiometricButton";
import { loginStyles } from "../../styles/auth.styles";
import { AUTH_MESSAGES } from "../../constants/auth";
import { LanguageContext } from "../../contexts/LanguageContext";

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

  const rtlStyles = {
    formContainer: {
      width: "100%",
    },
    forgotPassword: {
      alignSelf: rtl ? "flex-start" : "flex-end",
    },
    errorContainer: {
      flexDirection: rtl ? "row-reverse" : "row",
    },
    errorText: {
      marginLeft: rtl ? 0 : 8,
      marginRight: rtl ? 8 : 0,
      textAlign: rtl ? "right" : "left",
    },
    textAlign: {
      textAlign: rtl ? "right" : "left",
    },
    button: {
      flexDirection: rtl ? "row-reverse" : "row",
    },
  };

  return (
    <View style={[loginStyles.formContainer, rtlStyles.formContainer]}>
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
        style={[loginStyles.forgotPassword, rtlStyles.forgotPassword]}
        feedback="light"
        onPress={() => {}}
      >
        <Text style={[loginStyles.forgotPasswordText, rtlStyles.textAlign]}>
          {translate
            ? translate("auth.forgot_password")
            : AUTH_MESSAGES.FORGOT_PASSWORD}
        </Text>
      </HapticTouchable>

      {validationErrors.general && (
        <View style={[loginStyles.errorContainer, rtlStyles.errorContainer]}>
          <MaterialIcons name="error" size={20} color="#FF3B30" />
          <Text style={[loginStyles.errorText, rtlStyles.errorText]}>
            {validationErrors.general}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[loginStyles.loginButton, rtlStyles.button]}
        onPress={onLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={loginStyles.loginButtonText}>
            {translate
              ? translate("auth.continue_journey")
              : "Continue Journey"}
          </Text>
        )}
      </TouchableOpacity>

      {isBiometricEnabled && (
        <TouchableOpacity
          style={[loginStyles.biometricButton, rtlStyles.button]}
          onPress={onBiometricAuth}
        >
          <MaterialIcons name="fingerprint" size={24} color="#9e086c" />
          <Text style={loginStyles.biometricButtonText}>
            {translate
              ? translate("auth.sign_in_with_face_id")
              : "Sign in with Face ID"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
