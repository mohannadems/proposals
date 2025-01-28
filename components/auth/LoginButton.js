import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { loginStyles } from "../../styles/auth.styles";
import { AUTH_MESSAGES } from "../../constants/auth";

export const LoginButton = ({ onPress, loading }) => {
  return (
    <TouchableOpacity
      style={[loginStyles.loginButton, loading && loginStyles.buttonDisabled]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <FontAwesome name="heart" size={20} color="#fff" />
          <Text style={loginStyles.loginButtonText}>
            {AUTH_MESSAGES.CONTINUE_JOURNEY}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};
