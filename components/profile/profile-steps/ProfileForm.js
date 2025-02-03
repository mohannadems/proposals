// components/ProfileForm.js
import React, { useState, useCallback } from "react";
import { View, Animated, Alert } from "react-native";
import { COLORS } from "../../../constants/colors";
import {
  profileValidationSchema,
  initialProfileState,
} from "../validation/profileValidation";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ProgressSteps from "./ProgressSteps";
import FormHeader from "./FormHeader";
import FormNavigation from "./FormNavigation";

const FORM_STEPS = [
  { id: 1, title: "Personal Info", description: "Basic personal information" },
  {
    id: 2,
    title: "Lifestyle",
    description: "Your preferences and lifestyle choices",
  },
  {
    id: 3,
    title: "Education & Work",
    description: "Educational and professional details",
  },
  {
    id: 4,
    title: "Location",
    description: "Residence and contact information",
  },
];

const ProfileForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const methods = useForm({
    defaultValues: initialProfileState,
    resolver: yupResolver(profileValidationSchema),
    mode: "onChange",
  });

  const animateTransition = useCallback(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim]);

  const handleNext = useCallback(async () => {
    const currentFields = getFieldsForStep(currentStep);
    const isStepValid = await methods.trigger(currentFields);

    if (isStepValid) {
      animateTransition();
      setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length));
    } else {
      Alert.alert(
        "Incomplete Information",
        "Please fill in all required fields correctly before proceeding.",
        [{ text: "OK", style: "default" }]
      );
    }
  }, [currentStep, methods, animateTransition]);

  const handlePrevious = useCallback(() => {
    animateTransition();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, [animateTransition]);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await profileService.updateProfile(data);
      Alert.alert(
        "✨ Profile Updated",
        "Your profile has been successfully updated!",
        [{ text: "Great!", style: "default" }]
      );
    } catch (error) {
      Alert.alert("Update Failed", error.message || "Please try again later.", [
        { text: "OK", style: "default" },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    return (
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        {currentStep === 1 && <PersonalInfoSection />}
        {currentStep === 2 && <LifestyleSection />}
        {currentStep === 3 && <EducationWorkSection />}
        {currentStep === 4 && <LocationSection />}
      </Animated.View>
    );
  };

  return (
    <FormProvider {...methods}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <FormHeader
            currentStep={currentStep}
            totalSteps={FORM_STEPS.length}
          />

          <ProgressSteps
            steps={FORM_STEPS}
            currentStep={currentStep}
            style={styles.stepIndicator}
          />

          <ScrollView
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {renderCurrentStep()}
          </ScrollView>

          <FormNavigation
            currentStep={currentStep}
            totalSteps={FORM_STEPS.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSubmit={methods.handleSubmit(handleSubmit)}
            isSubmitting={isSubmitting}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </FormProvider>
  );
};

export default ProfileForm;
