import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { login } from "../../store/slices/auth.slice";
import AuthInput from "../../components/forms/AuthInput";

const BIOMETRIC_KEY = "BIOMETRIC_CREDENTIALS";

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
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

      // Log for debugging
      console.log("Biometric status:", {
        compatible,
        enrolled,
        hasSavedCredentials: !!savedCredentials,
      });

      // Only set these if all conditions are met
      setIsBiometricSupported(compatible && enrolled);
      setIsBiometricEnabled(Boolean(savedCredentials));
    } catch (error) {
      console.error("Biometric check failed:", error);
    }
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const handleChange = (field, value) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (touched[field]) {
      const validationFunction =
        field === "email" ? validateEmail : validatePassword;
      const error = validationFunction(value);
      setValidationErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    const validationFunction =
      field === "email" ? validateEmail : validatePassword;
    const error = validationFunction(credentials[field]);
    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
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
          // Call login directly with saved credentials
          const loginResult = await dispatch(login(parsedCredentials)).unwrap();
          if (loginResult) {
            router.replace("/(tabs)/home");
          }
        }
      }
    } catch (error) {
      console.error("Biometric auth error:", error);
      setValidationErrors((prev) => ({
        ...prev,
        general:
          "Face ID authentication failed. Please try again or use your password.",
      }));
    }
  };

  const handleSuccessfulLogin = async (loginCredentials) => {
    if (isBiometricSupported) {
      // Check if we already have saved credentials
      const existingCredentials = await AsyncStorage.getItem(BIOMETRIC_KEY);
      if (!existingCredentials) {
        Alert.alert(
          "Enable Face ID",
          "Would you like to enable Face ID for quick login next time?",
          [
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
                    JSON.stringify({
                      email: loginCredentials.email,
                      password: loginCredentials.password,
                    })
                  );
                  setIsBiometricEnabled(true);
                  Alert.alert(
                    "Success",
                    "Face ID has been enabled for future logins"
                  );
                } catch (error) {
                  console.error("Failed to save biometric credentials:", error);
                  Alert.alert(
                    "Error",
                    "Failed to enable Face ID. Please try again later."
                  );
                }
              },
            },
          ]
        );
      }
    }
  };

  const handleLogin = async (loginCredentials = credentials) => {
    const emailError = validateEmail(loginCredentials.email);
    const passwordError = validatePassword(loginCredentials.password);

    setValidationErrors({
      email: emailError,
      password: passwordError,
    });

    setTouched({
      email: true,
      password: true,
    });

    if (emailError || passwordError) {
      return;
    }

    try {
      const result = await dispatch(login(loginCredentials)).unwrap();
      if (result) {
        await handleSuccessfulLogin(loginCredentials);
        router.replace("/(tabs)/home"); // Replace the stack with the home screen
      }
    } catch (error) {
      setValidationErrors((prev) => ({
        ...prev,
        general: "Invalid email or password. Please try again.",
      }));
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <LinearGradient
          colors={["rgba(65, 105, 225, 0.1)", "rgba(212, 175, 55, 0.1)"]}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.topDecoration}>
          <FontAwesome
            name="heart"
            size={24}
            color="#B65165"
            style={styles.decorationHeart}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Ready to continue your journey to love?
            </Text>
          </View>

          <View style={styles.formContainer}>
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

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {validationErrors.general && (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error" size={20} color="#FF3B30" />
                <Text style={styles.errorText}>{validationErrors.general}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.buttonDisabled]}
              onPress={() => handleLogin()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <FontAwesome name="heart" size={20} color="#fff" />
                  <Text style={styles.loginButtonText}>Continue Journey</Text>
                </>
              )}
            </TouchableOpacity>

            {isBiometricEnabled && ( // Change from isBiometricSupported to isBiometricEnabled
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricAuth}
              >
                <MaterialIcons name="face" size={24} color="#B65165" />
                <Text style={styles.biometricButtonText}>
                  Sign in with Face ID
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.registerLinkText}>
              New to finding love?{" "}
              <Text style={styles.registerLinkBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topDecoration: {
    position: "absolute",
    top: 40,
    right: 40,
  },
  decorationHeart: {
    transform: [{ rotate: "15deg" }],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#B65165",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#B65165",
    fontSize: 14,
  },
  loginButton: {
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#B65165",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  biometricButton: {
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#B65165",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  biometricButtonText: {
    color: "#B65165",
    fontSize: 18,
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B3010",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#FF3B30",
    marginLeft: 8,
    fontSize: 14,
  },
  registerLink: {
    marginTop: 24,
    alignItems: "center",
  },
  registerLinkText: {
    fontSize: 16,
    color: "#666",
  },
  registerLinkBold: {
    color: "#B65165",
    fontWeight: "600",
  },
});
