import React from "react";
import { View, Text, TouchableOpacity, Vibration } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import AuthInput from "../forms/login-forms/AuthInput";
import { LoginButton } from "./LoginButton";
import { BiometricButton } from "./BiometricButton";
import { loginStyles } from "../../styles/auth.styles";
import { AUTH_MESSAGES } from "../../constants/auth";

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
const EnhancedLoginButton = ({ onPress, loading }) => {
  const handleLogin = async () => {
    if (!loading) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress?.();
    }
  };

  return <LoginButton onPress={handleLogin} loading={loading} />;
};

// Enhanced Biometric Button with haptic feedback
const EnhancedBiometricButton = ({ onPress }) => {
  const handleBiometric = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return <BiometricButton onPress={handleBiometric} />;
};

export const LoginForm = ({
  form,
  loading,
  isBiometricEnabled,
  onLogin,
  onBiometricAuth,
}) => {
  const { credentials, validationErrors, touched, handleChange, handleBlur } =
    form;

  const handleInputChange = (field, text) => {
    Haptics.selectionAsync(); // Light feedback for input changes
    handleChange(field, text);
  };

  return (
    <View style={loginStyles.formContainer}>
      <AuthInput
        label="Email"
        value={credentials.email}
        onChangeText={(text) => handleInputChange("email", text)}
        onBlur={() => handleBlur("email")}
        error={validationErrors.email}
        touched={touched.email}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="email"
      />

      <AuthInput
        label="Password"
        value={credentials.password}
        onChangeText={(text) => handleInputChange("password", text)}
        onBlur={() => handleBlur("password")}
        error={validationErrors.password}
        touched={touched.password}
        placeholder="Enter your password"
        secureTextEntry
        leftIcon="lock"
      />

      <HapticTouchable
        style={loginStyles.forgotPassword}
        feedback="light"
        onPress={() => {}}
      >
        <Text style={loginStyles.forgotPasswordText}>
          {AUTH_MESSAGES.FORGOT_PASSWORD}
        </Text>
      </HapticTouchable>

      {validationErrors.general && (
        <View style={loginStyles.errorContainer}>
          <MaterialIcons name="error" size={20} color="#FF3B30" />
          <Text style={loginStyles.errorText}>{validationErrors.general}</Text>
        </View>
      )}

      <EnhancedLoginButton onPress={onLogin} loading={loading} />

      {isBiometricEnabled && (
        <EnhancedBiometricButton onPress={onBiometricAuth} />
      )}
    </View>
  );
};
