import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { loginStyles } from "../../styles/auth.styles";
import { AUTH_MESSAGES } from "../../constants/auth";

export const BiometricButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={loginStyles.biometricButton} onPress={onPress}>
      <MaterialIcons name="face" size={24} color="#B65165" />
      <Text style={loginStyles.biometricButtonText}>
        {AUTH_MESSAGES.SIGN_IN_FACE_ID}
      </Text>
    </TouchableOpacity>
  );
};
