import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { register } from "../../store/slices/auth.slice";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { StepIndicator } from "../../components/auth/StepIndicator";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import { createRegisterStyles } from "../../styles/register.styles";
import { REGISTER_MESSAGES } from "../../constants/register";
import { TermsModal } from "../../components/auth/TermsModal";
import { StyleSheet } from "react-native";
import { LanguageContext } from "../../contexts/LanguageContext";

const WelcomeMessage = ({ t, styles }) => (
  <View style={styles.welcomeContainer}>
    <Text style={styles.welcomeEmoji}>💝</Text>
    <Text style={styles.title}>
      {t ? t("register.welcome_title") : REGISTER_MESSAGES.WELCOME_TITLE}
    </Text>
    <Text style={styles.subtitle}>
      {t ? t("register.welcome_subtitle") : REGISTER_MESSAGES.WELCOME_SUBTITLE}
    </Text>
  </View>
);

export default function RegisterScreen() {
  const [termsVisible, setTermsVisible] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const form = useRegisterForm();

  const { isRTL, t } = useContext(LanguageContext);

  const registerStyles = createRegisterStyles(isRTL);

  const handleValidationError = (error) => {
    setTermsVisible(false);

    if (error.errors) {
      const validationErrors = {};
      Object.entries(error.errors).forEach(([field, messages]) => {
        validationErrors[field] = messages[0];
      });

      form.setValidationErrorsWithAPI(validationErrors);

      if (error.errors.email || error.errors.phone_number) {
        Alert.alert(
          t ? t("register.errors.title") : "Registration Error",
          error.errors.email || error.errors.phone_number,
          [
            {
              text: t ? t("common.ok") : "OK",
              onPress: () => {
                form.goToStep(1);
              },
            },
          ]
        );
      }
    } else {
      Alert.alert(
        t ? t("register.errors.title") : "Registration Error",
        error.message ||
          (t
            ? t("register.errors.failed")
            : REGISTER_MESSAGES.REGISTRATION_FAILED),
        [{ text: t ? t("common.ok") : "OK" }]
      );
      form.setValidationErrorsWithAPI({
        general:
          error.message ||
          (t
            ? t("register.errors.failed")
            : REGISTER_MESSAGES.REGISTRATION_FAILED),
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
      } else {
        handleValidationError(error);
      }
    }
  };

  useEffect(() => {
    return () => {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <ScrollView>
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
            >
              <WelcomeMessage t={t} styles={registerStyles} />

              <StepIndicator currentStep={form.step} isRTL={isRTL} />

              <RegisterForm
                form={form}
                loading={loading}
                onNextStep={handleNextStep}
                onPreviousStep={handlePreviousStep}
                onSubmit={handleRegister}
                isRTL={isRTL}
                t={t}
                styles={registerStyles}
              />

              <TouchableOpacity
                style={registerStyles.loginLink}
                onPress={() => router.push("/(auth)/login")}
              >
                <Text style={registerStyles.loginLinkText}>
                  {t
                    ? t("register.already_member")
                    : REGISTER_MESSAGES.ALREADY_MEMBER}
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <TermsModal
              visible={termsVisible}
              onAccept={handleAcceptTerms}
              onDecline={handleDeclineTerms}
              isRTL={isRTL}
              t={t}
            />
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}
