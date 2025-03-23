import React, { useState, useRef, useEffect } from "react";
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

const ProfileFormScreen = () => {
  const userId = useSelector((state) => state.profile.data?.id);
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();

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

  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoSection />;
      case 2:
        return <LifestyleSection />;
      case 3:
        return <EducationWorkSection />;
      case 4:
        return <ProfileImageSection />;
      default:
        return null;
    }
  };

  const renderCurrentStep = () => {
    const currentStepData = FORM_STEPS[currentStep - 1];
    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepHeader}>
          <Feather
            name={currentStepData.icon}
            size={30}
            color={COLORS.primary}
          />
          <View style={styles.stepHeaderText}>
            <Text style={styles.stepTitle}>{currentStepData.title}</Text>
            <Text style={styles.stepDescription}>
              {currentStepData.description}
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
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <FormProvider {...methods}>
      <SafeAreaView style={styles.container}>
        <View style={styles.gradientBackground}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Feather name="arrow-left" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <View style={styles.headerTextContainer}>
                <Text style={styles.title}>Complete Your Profile</Text>
                <Text style={styles.subtitle}>
                  Create a profile that truly represents you
                </Text>
              </View>
            </View>

            <ProgressSteps
              steps={FORM_STEPS}
              currentStep={currentStep}
              style={styles.stepIndicator}
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

            <View style={styles.footer}>
              {currentStep > 1 && (
                <TouchableOpacity
                  style={[styles.button, styles.buttonSecondary]}
                  onPress={handlePrevious}
                >
                  <Feather name="chevron-left" size={20} color={COLORS.text} />
                  <Text style={styles.buttonTextSecondary}>Previous</Text>
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
                      {currentStep === FORM_STEPS.length ? "Submit" : "Next"}
                    </Text>
                    <Feather
                      name="chevron-right"
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
            />
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </FormProvider>
  );
};

export default ProfileFormScreen;
