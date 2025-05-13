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
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { register } from "../../store/slices/auth.slice";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { StepIndicator } from "../../components/auth/StepIndicator";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import { registerStyles } from "../../styles/register.styles";
import { TermsModal } from "../../components/auth/TermsModal";
import { LanguageContext } from "../../contexts/LanguageContext";

const WelcomeMessage = ({ isRTL, t }) => (
  <View style={registerStyles.welcomeContainer}>
    <Text style={registerStyles.welcomeEmoji}>💝</Text>
    <Text style={[registerStyles.title, isRTL && { textAlign: "right" }]}>
      {t("register.welcome_title")}
    </Text>
    <Text style={[registerStyles.subtitle, isRTL && { textAlign: "right" }]}>
      {t("register.welcome_subtitle")}
    </Text>
  </View>
);

export default function RegisterScreen() {
  const [termsVisible, setTermsVisible] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const form = useRegisterForm();
  const { locale, isRTL, changeLanguage, t } = useContext(LanguageContext);

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
          t("register.registration_error"),
          error.errors.email || error.errors.phone_number,
          [
            {
              text: t("register.ok"),
              onPress: () => {
                form.goToStep(1);
              },
            },
          ]
        );
      }
    } else {
      Alert.alert(
        t("register.registration_error"),
        error.message || t("register.registration_failed"),
        [{ text: t("register.ok") }]
      );
      form.setValidationErrorsWithAPI({
        general: error.message || t("register.registration_failed"),
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
      handleValidationError(error);
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    form.nextStep();
  };

  const handlePreviousStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    form.previousStep();
  };

  const handleRegister = async () => {
    if (!form.validateStep(2)) {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRegistrationData(form.formData);
    setTermsVisible(true);
  };

  const toggleLanguage = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    changeLanguage(locale === "en" ? "ar" : "en");
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
          style={[registerStyles.scrollView, isRTL && styles.scrollViewRtl]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={registerStyles.scrollContent}
        >
          <WelcomeMessage isRTL={isRTL} t={t} />

          <StepIndicator currentStep={form.step} isRTL={isRTL} />

          <RegisterForm
            form={form}
            loading={loading}
            onNextStep={handleNextStep}
            onPreviousStep={handlePreviousStep}
            onSubmit={handleRegister}
            t={t}
            isRTL={isRTL}
          />

          <TouchableOpacity
            style={[
              registerStyles.loginLink,
              isRTL && { alignSelf: "flex-start" },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(auth)/login");
            }}
          >
            <Text
              style={[
                registerStyles.loginLinkText,
                isRTL && { textAlign: "right" },
              ]}
            >
              {t("register.already_member")}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <TermsModal
          visible={termsVisible}
          onAccept={handleAcceptTerms}
          onDecline={handleDeclineTerms}
          t={t}
          isRTL={isRTL}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
