import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider } from "react-hook-form";
import Feather from "react-native-vector-icons/Feather";
import ProgressSteps from "../../components/common/ProgressSteps";
import PersonalInfoSection from "../../components/profile/profile-steps/Profile-steps-filling-data/PersonalInfoSection";
import LifestyleSection from "../../components/profile/profile-steps/Profile-steps-filling-data/LifestyleSection";
import EducationWorkSection from "../../components/profile/profile-steps/Profile-steps-filling-data/EducationWorkSection";
import ProfileImageSection from "../../components/profile/profile-steps/Profile-steps-filling-data/ProfileImageSection";
import ErrorModal from "../../components/profile/profile-steps/Profile-steps-filling-data/ErrorModal";
import { useProfileForm } from "../../components/profile/profile-steps/Profile-steps-filling-data/useProfileForm";
import { FORM_STEPS } from "../../components/profile/profile-steps/Profile-steps-filling-data/form_steps";
import styles from "../../styles/fillProfileData";
import { COLORS } from "../../constants/colors";
import { LanguageContext } from "../../contexts/LanguageContext";

const ProfileFormScreen = () => {
  const { t, isRTL } = useContext(LanguageContext);
  const userId = useSelector((state) => state.profile.data?.id);
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const userData = useSelector((state) => state.profile.data);
  const dispatch = useDispatch();
  const userGender = userData?.gender;
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [currentErrors, setCurrentErrors] = useState([]);

  const {
    methods,
    currentStep,
    setCurrentStep,
    isSubmitting,
    setIsSubmitting,
    fadeAnim,
    handleNext,
    handlePrevious,
    handleFormSubmit,
    isLoading,
  } = useProfileForm(
    userId,
    scrollViewRef,
    setCurrentErrors,
    setErrorModalVisible
  );

  const getTranslatedStep = (step) => {
    if (!t) return step;

    return {
      ...step,
      title: t(`profile.form_steps.${step.key}.title`) || step.title,
      description:
        t(`profile.form_steps.${step.key}.description`) || step.description,
    };
  };

  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoSection isRTL={isRTL} t={t} />;
      case 2:
        return <LifestyleSection isRTL={isRTL} t={t} userGender={userGender} />;
      case 3:
        return (
          <EducationWorkSection isRTL={isRTL} t={t} userGender={userGender} />
        );
      case 4:
        return <ProfileImageSection isRTL={isRTL} t={t} />;
      default:
        return null;
    }
  };

  const renderCurrentStep = () => {
    const currentStepData = FORM_STEPS[currentStep - 1];
    const translatedStepData = getTranslatedStep(currentStepData);

    return (
      <View style={styles.stepContainer}>
        <View
          style={[
            styles.stepHeader,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <Feather
            name={currentStepData.icon}
            size={30}
            color={COLORS.primary}
          />
          <View
            style={[
              styles.stepHeaderText,
              {
                marginLeft: isRTL ? 0 : 10,
                marginRight: isRTL ? 10 : 0,
                alignItems: isRTL ? "flex-end" : "flex-start",
              },
            ]}
          >
            <Text
              style={[
                styles.stepTitle,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {translatedStepData.title}
            </Text>
            <Text
              style={[
                styles.stepDescription,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {translatedStepData.description}
            </Text>
          </View>
        </View>
        {renderCurrentStepContent()}
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>
          {t ? t("profile.loading_profile") : "Loading your profile..."}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <FormProvider {...methods}>
      <SafeAreaView
        style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}
      >
        <View style={styles.gradientBackground}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[
                  styles.backButton,
                  {
                    left: isRTL ? "auto" : 16,
                    right: isRTL ? 16 : "auto",
                  },
                ]}
              >
                <Feather
                  name={isRTL ? "arrow-right" : "arrow-left"}
                  size={24}
                  color={COLORS.text}
                />
              </TouchableOpacity>
              <View style={styles.headerTextContainer}>
                <Text
                  style={[
                    styles.title,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                >
                  {t ? t("profile.complete_profile") : "Complete Your Profile"}
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                >
                  {t
                    ? t("profile.profile_description")
                    : "Create a profile that truly represents you"}
                </Text>
              </View>
            </View>

            <ProgressSteps
              steps={FORM_STEPS.map((step, index) => ({
                ...getTranslatedStep(step),
                key: index,
              }))}
              currentStep={currentStep}
              style={styles.stepIndicator}
              isRTL={isRTL}
            />

            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
              >
                {renderCurrentStep()}
              </ScrollView>
            </Animated.View>

            <View
              style={[
                styles.footer,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              {currentStep > 1 && (
                <TouchableOpacity
                  style={[styles.button, styles.buttonSecondary]}
                  onPress={handlePrevious}
                >
                  <Feather
                    name={isRTL ? "chevron-right" : "chevron-left"}
                    size={20}
                    color={COLORS.text}
                  />
                  <Text style={styles.buttonTextSecondary}>
                    {t ? t("common.previous") : "Previous"}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={
                  currentStep === FORM_STEPS.length
                    ? handleFormSubmit
                    : handleNext
                }
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Text style={styles.buttonTextPrimary}>
                      {currentStep === FORM_STEPS.length
                        ? t
                          ? t("common.submit")
                          : "Submit"
                        : t
                        ? t("common.next")
                        : "Next"}
                    </Text>
                    <Feather
                      name={isRTL ? "chevron-left" : "chevron-right"}
                      size={20}
                      color={COLORS.white}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>

            <ErrorModal
              visible={errorModalVisible}
              errors={currentErrors}
              onClose={() => setErrorModalVisible(false)}
              isRTL={isRTL}
              t={t}
            />
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </FormProvider>
  );
};

export default ProfileFormScreen;
