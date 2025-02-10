import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AuthInput from "../forms/login-forms/AuthInput";
import { LoginButton } from "./LoginButton";
import { BiometricButton } from "./BiometricButton";
import { loginStyles } from "../../styles/auth.styles";
import { AUTH_MESSAGES } from "../../constants/auth";

export const LoginForm = ({
  form,
  loading,
  isBiometricEnabled,
  onLogin,
  onBiometricAuth,
}) => {
  const { credentials, validationErrors, touched, handleChange, handleBlur } =
    form;

  return (
    <View style={loginStyles.formContainer}>
      <AuthInput
        label="Email"
        value={credentials.email}
        onChangeText={(text) => handleChange("email", text)}
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
        onChangeText={(text) => handleChange("password", text)}
        onBlur={() => handleBlur("password")}
        error={validationErrors.password}
        touched={touched.password}
        placeholder="Enter your password"
        secureTextEntry
        leftIcon="lock"
      />

      <TouchableOpacity style={loginStyles.forgotPassword}>
        <Text style={loginStyles.forgotPasswordText}>
          {AUTH_MESSAGES.FORGOT_PASSWORD}
        </Text>
      </TouchableOpacity>

      {validationErrors.general && (
        <View style={loginStyles.errorContainer}>
          <MaterialIcons name="error" size={20} color="#FF3B30" />
          <Text style={loginStyles.errorText}>{validationErrors.general}</Text>
        </View>
      )}

      <LoginButton onPress={onLogin} loading={loading} />

      {isBiometricEnabled && <BiometricButton onPress={onBiometricAuth} />}
    </View>
  );
};
