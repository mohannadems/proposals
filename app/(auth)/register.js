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
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { register } from "../../store/slices/auth.slice";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { StepIndicator } from "../../components/auth/StepIndicator";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import { registerStyles } from "../../styles/register.styles";
import { REGISTER_MESSAGES } from "../../constants/register";
import { TermsModal } from "../../components/common/TermsModal";
import { StyleSheet } from "react-native";
import { Alert } from "react-native";

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
  const [termsVisible, setTermsVisible] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const form = useRegisterForm();

  const handleValidationError = (error) => {
    setTermsVisible(false);

    if (error.errors) {
      const validationErrors = {};
      Object.entries(error.errors).forEach(([field, messages]) => {
        validationErrors[field] = messages[0];
      });

      form.setValidationErrorsWithAPI(validationErrors);

      if (error.errors.email || error.errors.phone_number) {
        // Show alert first and navigate after user acknowledges
        Alert.alert(
          "Registration Error",
          error.errors.email || error.errors.phone_number,
          [
            {
              text: "OK",
              onPress: () => {
                form.goToStep(1);
              },
            },
          ]
        );
      }
    } else {
      Alert.alert(
        "Registration Error",
        error.message || REGISTER_MESSAGES.REGISTRATION_FAILED,
        [{ text: "OK" }]
      );
      form.setValidationErrorsWithAPI({
        general: error.message || REGISTER_MESSAGES.REGISTRATION_FAILED,
      });
    }
  };
  const handleAcceptTerms = async () => {
    try {
      const result = await dispatch(register(registrationData)).unwrap();

      if (result.success) {
        setTermsVisible(false);
        setRegistrationData(null);
        router.push({
          pathname: "/(auth)/verify-otp",
          params: { email: registrationData.email },
        });
        return;
      }

      setTermsVisible(false);

      if (result.errors?.email || result.errors?.phone_number) {
        form.setValidationErrorsWithAPI(result.errors);
        setRegistrationData(null);
        form.goToStep(1);
      }
    } catch (error) {
      setTermsVisible(false);

      if (error.errors?.email || error.errors?.phone_number) {
        form.setValidationErrorsWithAPI(error.errors);
        setRegistrationData(null);
        form.goToStep(1);
      }
    }
  };

  // Also update the component's cleanup
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      setTermsVisible(false);
      setRegistrationData(null);
    };
  }, []);
  const handleDeclineTerms = () => {
    setTermsVisible(false);
    setRegistrationData(null);
  };

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
    setRegistrationData(form.formData);
    setTermsVisible(true);
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

        <TermsModal
          visible={termsVisible}
          onAccept={handleAcceptTerms}
          onDecline={handleDeclineTerms}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
