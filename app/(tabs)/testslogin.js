"use client";

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Feather, FontAwesome, AntDesign } from "@expo/vector-icons";

const COLORS = {
  primary: "#B65165",
  secondary: "#5856D6",
  background: "#F8F9FA",
  white: "#FFFFFF",
  text: "#1C1C1E",
  error: "#FF3B30",
  success: "#34C759",
  border: "#E5E5EA",
  primaryGradient: ["#B65165", "#D97485"],
  facebook: "#1877F2",
  google: "#DB4437",
  apple: "#000000",
};

const SOCIAL_BUTTONS = [
  {
    id: "facebook",
    label: "Continue with Facebook",
    icon: (props) => <FontAwesome name="facebook" {...props} />,
    color: COLORS.facebook,
    backgroundColor: "#E7F0FF",
  },
  {
    id: "google",
    label: "Continue with Google",
    icon: (props) => <AntDesign name="google" {...props} />,
    color: COLORS.google,
    backgroundColor: "#FFE4E3",
  },
  {
    id: "apple",
    label: "Continue with Apple",
    icon: (props) => <AntDesign name="apple1" {...props} />,
    color: COLORS.apple,
    backgroundColor: "#F1F1F1",
  },
];

const SocialButton = ({
  icon: Icon,
  label,
  color,
  backgroundColor,
  onPress,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [isLoading, setIsLoading] = useState(false);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isLoading}
    >
      <Animated.View style={[styles.socialButton, { transform: [{ scale }] }]}>
        <View style={[styles.socialIconContainer, { backgroundColor }]}>
          {isLoading ? (
            <ActivityIndicator size="small" color={color} />
          ) : (
            <Icon size={22} color={color} />
          )}
        </View>
        <Text style={styles.socialButtonText}>{label}</Text>
        <View style={styles.socialArrow}>
          <Feather name="chevron-right" size={20} color={COLORS.text + "40"} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const FormInput = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  error,
  onToggleSecure,
  keyboardType,
  autoCapitalize = "none",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error, shakeAnimation]);

  return (
    <Animated.View
      style={[
        styles.inputContainer,
        { transform: [{ translateX: shakeAnimation }] },
      ]}
    >
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
        ]}
      >
        <Feather
          name={icon}
          size={20}
          color={
            error
              ? COLORS.error
              : isFocused
              ? COLORS.primary
              : COLORS.text + "80"
          }
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text + "50"}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
        {onToggleSecure && (
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onToggleSecure();
            }}
          >
            <Feather
              name={secureTextEntry ? "eye" : "eye-off"}
              size={20}
              color={COLORS.text + "80"}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={14} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </Animated.View>
  );
};

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState({});

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const toggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setIsLogin(!isLogin);
    setForm({ email: "", password: "", name: "" });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!isLogin && !form.name) {
      newErrors.name = "Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsLoading(false);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={COLORS.primaryGradient}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.logo}>❤️</Text>
          <Text style={styles.headerTitle}>Find Your Perfect Match</Text>
          <Text style={styles.headerSubtitle}>
            {isLogin ? "Welcome back!" : "Create an account to get started"}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
          <View style={styles.socialButtons}>
            {SOCIAL_BUTTONS.map((button) => (
              <SocialButton
                key={button.id}
                icon={button.icon}
                label={button.label}
                color={button.color}
                backgroundColor={button.backgroundColor}
                onPress={() => {}}
              />
            ))}
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with email</Text>
            <View style={styles.dividerLine} />
          </View>

          {!isLogin && (
            <FormInput
              icon="user"
              placeholder="Full Name"
              value={form.name}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, name: text }))
              }
              error={errors.name}
              autoCapitalize="words"
            />
          )}

          <FormInput
            icon="mail"
            placeholder="Email Address"
            value={form.email}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, email: text }))
            }
            keyboardType="email-address"
            error={errors.email}
          />

          <FormInput
            icon="lock"
            placeholder="Password"
            value={form.password}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, password: text }))
            }
            secureTextEntry={!showPassword}
            error={errors.password}
            onToggleSecure={() => setShowPassword(!showPassword)}
          />

          {isLogin && (
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <LinearGradient
              colors={COLORS.primaryGradient}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>
                {isLogin ? "Sign In" : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleMode} onPress={toggleMode}>
            <Text style={styles.toggleModeText}>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <Text style={styles.toggleModeTextHighlight}>
                {isLogin ? "Sign Up" : "Sign In"}
              </Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : StatusBar.currentHeight + 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 48,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  formContainer: {
    marginTop: 32,
  },
  socialButtons: {
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  socialIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  socialButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  socialArrow: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    color: COLORS.text,
    opacity: 0.5,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  inputWrapperFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginLeft: 4,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  submitButton: {
    padding: 16,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
    textAlign: "center",
  },
  toggleMode: {
    alignItems: "center",
    marginBottom: 32,
  },
  toggleModeText: {
    fontSize: 14,
    color: COLORS.text,
  },
  toggleModeTextHighlight: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});

export default AuthScreen;
