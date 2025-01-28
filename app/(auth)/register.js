import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { register } from "../../store/slices/auth.slice";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { StepIndicator } from "../../components/auth/StepIndicator";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import { registerStyles } from "../../styles/register.styles";
import { REGISTER_MESSAGES } from "../../constants/register";
import { StyleSheet } from "react-native";
const WelcomeMessage = () => (
  <View style={registerStyles.welcomeContainer}>
    <Text style={registerStyles.welcomeEmoji}>💝</Text>
    <Text style={registerStyles.title}>{REGISTER_MESSAGES.WELCOME_TITLE}</Text>
    <Text style={registerStyles.subtitle}>
      {REGISTER_MESSAGES.WELCOME_SUBTITLE}
    </Text>
  </View>
);

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const form = useRegisterForm();

  const handleNextStep = () => {
    form.nextStep();
  };

  const handlePreviousStep = () => {
    form.previousStep();
  };

  const handleRegister = async () => {
    if (!form.validateStep(2)) {
      return;
    }

    try {
      const result = await dispatch(register(form.formData)).unwrap();
      if (result) {
        router.push("/(auth)/verify-otp");
      }
    } catch (error) {
      form.setValidationErrors((prev) => ({
        ...prev,
        general: error.message || REGISTER_MESSAGES.REGISTRATION_FAILED,
      }));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={registerStyles.container}
      >
        <LinearGradient
          colors={["rgba(65, 105, 225, 0.1)", "rgba(212, 175, 55, 0.1)"]}
          style={StyleSheet.absoluteFill}
        />

        <ScrollView
          style={registerStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={registerStyles.scrollContent}
        >
          <WelcomeMessage />

          <StepIndicator currentStep={form.step} />

          <RegisterForm
            form={form}
            loading={loading}
            onNextStep={handleNextStep}
            onPreviousStep={handlePreviousStep}
            onSubmit={handleRegister}
          />

          <TouchableOpacity
            style={registerStyles.loginLink}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={registerStyles.loginLinkText}>
              {REGISTER_MESSAGES.ALREADY_MEMBER}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
