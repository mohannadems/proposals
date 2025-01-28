import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";
import { BIOMETRIC_KEY, AUTH_MESSAGES } from "../constants/auth";

export const useBiometric = (onLoginSuccess) => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const savedCredentials = await AsyncStorage.getItem(BIOMETRIC_KEY);

      setIsBiometricSupported(compatible && enrolled);
      setIsBiometricEnabled(Boolean(savedCredentials));
    } catch (error) {
      console.error("Biometric check failed:", error);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login with Face ID",
        disableDeviceFallback: false,
        fallbackLabel: "Enter passcode",
      });

      if (result.success) {
        const savedCredentials = await AsyncStorage.getItem(BIOMETRIC_KEY);
        if (savedCredentials) {
          const parsedCredentials = JSON.parse(savedCredentials);
          await onLoginSuccess(parsedCredentials);
        }
      }
    } catch (error) {
      console.error("Biometric auth error:", error);
      return AUTH_MESSAGES.BIOMETRIC_ERROR;
    }
  };

  const saveBiometricCredentials = async (loginCredentials) => {
    if (isBiometricSupported) {
      const existingCredentials = await AsyncStorage.getItem(BIOMETRIC_KEY);
      if (!existingCredentials) {
        Alert.alert("Enable Face ID", AUTH_MESSAGES.FACE_ID_ENABLE, [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              try {
                await AsyncStorage.setItem(
                  BIOMETRIC_KEY,
                  JSON.stringify(loginCredentials)
                );
                setIsBiometricEnabled(true);
                Alert.alert("Success", AUTH_MESSAGES.FACE_ID_SUCCESS);
              } catch (error) {
                console.error("Failed to save biometric credentials:", error);
                Alert.alert("Error", AUTH_MESSAGES.FACE_ID_ERROR);
              }
            },
          },
        ]);
      }
    }
  };

  return {
    isBiometricSupported,
    isBiometricEnabled,
    handleBiometricAuth,
    saveBiometricCredentials,
  };
};
