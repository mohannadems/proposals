import React, { useState, useCallback, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  Animated,
  Dimensions,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { setShowProfileAlert } from "../../store/slices/profile.slice";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import PersonalInfoSection from "../../components/profile/profile-steps/Profile-steps-filling-data/PersonalInfoSection";
import LifestyleSection from "../../components/profile/profile-steps/Profile-steps-filling-data/LifestyleSection";
import EducationWorkSection from "../../components/profile/profile-steps/Profile-steps-filling-data/EducationWorkSection";
import ProgressSteps from "../../components/common/ProgressSteps";
import { COLORS } from "../../constants/colors";
import { profileValidationSchema } from "../../utils/profile-validation";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/fillProfileData";
import { stepFields } from "../../utils/profile-validation";
import Feather from "react-native-vector-icons/Feather";
import { updateProfile } from "../../store/slices/profile.slice";
import { fetchProfile } from "../../store/slices/profile.slice";
import { useDispatch } from "react-redux";
import { updateProfilePhoto } from "../../store/slices/profile.slice";
import ProfileImageSection from "../../components/profile/profile-steps/Profile-steps-filling-data/ProfileImageSection";
const { width, height } = Dimensions.get("window");

const FORM_STEPS = [
  {
    id: 1,
    title: "Personal Details",
    description: "Let's get to know you",
    icon: "user",
  },
  {
    id: 2,
    title: "Lifestyle Insights",
    description: "Your unique preferences",
    icon: "activity",
  },
  {
    id: 3,
    title: "Professional Journey",
    description: "Education and career path",
    icon: "briefcase",
  },
  {
    id: 4,
    title: "Profile Picture",
    description: "Choose your profile image",
    icon: "camera",
  },
];
// Part 2: Initial Form State & Error Modal
const initialFormState = {
  bio_en: "",
  bio_ar: "",
  gender: "",
  date_of_birth: "",
  height: null,
  weight: null,
  nationality_id: null,
  country_of_residence_id: null,
  city_id: null,
  educational_level_id: null,
  specialization_id: null,
  employment_status: null,
  smoking_status: null,
  smoking_tools: [],
  drinking_status_id: null,
  sports_activity_id: null,
  religion_id: null,
  marital_status_id: null,
  number_of_children: 0,
  housing_status_id: null,
  hobbies: [],
  pets: [],
  health_issues_en: "",
  health_issues_ar: "",
  guardian_contact: "",
  financial_status_id: null,
  hijab_status: null,
  profile_image: [],
};

const ErrorModal = ({ visible, errors, onClose }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.errorModalContent}>
          <Feather name="alert-triangle" size={50} color="#FF6B6B" />
          <Text style={styles.errorModalTitle}>Oops! Something's Missing</Text>
          <Text style={styles.errorModalSubtitle}>
            Please review the following:
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.errorScrollView}
            contentContainerStyle={styles.errorScrollContent}
          >
            {errors.map((error, index) => (
              <View key={index} style={styles.errorItem}>
                <Feather name="x-circle" size={18} color="#FF6B6B" />
                <Text style={styles.backButton}>{error}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.errorModalButton} onPress={onClose}>
            <Text style={styles.errorModalButtonText}>Got It</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const STORAGE_KEYS = {
  FORM_STEP: "profile_form_step",
  FORM_DATA: "profile_form_data",
  LAST_UPDATED: "profile_form_last_updated",
};
const parseDateString = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};
const saveFormProgress = async (step, formData) => {
  try {
    // Ensure date is properly formatted before saving
    const dataToSave = {
      step,
      formData: {
        ...formData,
        date_of_birth: formData.date_of_birth
          ? formData.date_of_birth.toISOString()
          : null,
      },
      lastUpdated: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      STORAGE_KEYS.FORM_DATA,
      JSON.stringify(dataToSave)
    );
    console.log("Form progress saved:", dataToSave);
  } catch (error) {
    console.error("Error saving form progress:", error);
  }
};
const loadFormProgress = async () => {
  try {
    const savedData = await AsyncStorage.getItem(STORAGE_KEYS.FORM_DATA);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Convert date strings back to Date objects
      return {
        ...parsed,
        formData: {
          ...parsed.formData,
          date_of_birth: parseDateString(parsed.formData.date_of_birth),
        },
      };
    }
    return null;
  } catch (error) {
    console.error("Error loading form progress:", error);
    return null;
  }
};
const clearFormProgress = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.FORM_DATA);
    console.log("Form progress cleared");
  } catch (error) {
    console.error("Error clearing form progress:", error);
  }
};

// Part 3: Component Setup & Handlers
const fillProfileData = () => {
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [currentErrors, setCurrentErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fadeAnim = useState(new Animated.Value(1))[0];

  const methods = useForm({
    defaultValues: initialFormState,
    resolver: yupResolver(profileValidationSchema),
    mode: "onChange",
  });
  const handleNext = useCallback(async () => {
    try {
      // Debug logs for step tracking
      console.log("Current step:", currentStep);
      console.log("FORM_STEPS length:", FORM_STEPS.length);
      console.log("Is last step?:", currentStep === FORM_STEPS.length);
      console.log("Current step data:", FORM_STEPS[currentStep - 1]);

      const currentStepFields = stepFields[currentStep];
      const formValues = methods.getValues();

      // Only validate current step fields
      const validationResult = await methods.trigger(currentStepFields);
      console.log("Step validation result:", validationResult);

      const currentErrors = Object.entries(methods.formState.errors)
        .filter(([key]) => currentStepFields.includes(key))
        .map(([key, error]) => {
          const fieldName = key.replace(/_/g, " ").toLowerCase();
          return error.message || `Please fill in ${fieldName} correctly`;
        });

      if (validationResult && currentErrors.length === 0) {
        // Check if we're on step 4 (Profile Picture)
        if (currentStep === 4) {
          console.log("On final step (Profile Picture), attempting submission");
          // Validate all fields before submission
          const isValid = await methods.trigger();
          console.log("Final validation result:", isValid);

          if (isValid) {
            console.log("All validations passed, preparing form data");
            const formData = methods.getValues();
            console.log("Form data ready for submission:", formData);

            try {
              console.log("Calling onSubmit...");
              await onSubmit(formData);
              console.log("Submission completed successfully");
              return;
            } catch (submitError) {
              console.error("Submission failed:", submitError);
              throw submitError;
            }
          } else {
            console.log("Final validation failed, showing errors");
            const allErrors = Object.entries(methods.formState.errors).map(
              ([key, error]) => error.message
            );
            setCurrentErrors(allErrors);
            setErrorModalVisible(true);
            return;
          }
        }

        // If not on last step, proceed to next step
        console.log("Moving to next step");
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setCurrentStep((prev) => {
            const newStep = Math.min(prev + 1, FORM_STEPS.length);
            console.log("Moving to step:", newStep);
            return newStep;
          });

          setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          }, 100);

          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        });
      } else {
        console.log("Validation errors found:", currentErrors);
        let errorsToShow = currentErrors;

        if (errorsToShow.length === 0) {
          errorsToShow = ["Please fill in all required fields correctly"];
        }

        // Step-specific validations
        if (currentStep === 1) {
          const dateOfBirth = formValues.date_of_birth;
          if (dateOfBirth) {
            const age = calculateAge(dateOfBirth);
            if (age < 18) {
              errorsToShow.push("You must be at least 18 years old");
            }
          }

          if (
            formValues.gender === "female" &&
            formValues.hijab_status === null
          ) {
            errorsToShow.push("Hijab status is required for female users");
          }
        }

        setCurrentErrors(errorsToShow);
        setErrorModalVisible(true);
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
    } catch (error) {
      console.error("HandleNext error:", error);
      Alert.alert(
        "Error",
        error.message || "There was a problem validating your information.",
        [{ text: "OK", onPress: () => setIsSubmitting(false) }],
        { cancelable: false }
      );
    }
  }, [currentStep, methods, fadeAnim, onSubmit]);
  useEffect(() => {
    const loadSavedProgress = async () => {
      try {
        setIsLoading(true);
        const savedProgress = await loadFormProgress();

        if (savedProgress) {
          const { step, formData, lastUpdated } = savedProgress;

          // Check if saved data is less than 24 hours old
          const savedDate = new Date(lastUpdated);
          const now = new Date();
          const hoursDiff = (now - savedDate) / (1000 * 60 * 60);

          if (hoursDiff < 24) {
            // Ensure all form data is properly typed before setting
            const processedFormData = {
              ...initialFormState, // Start with default values
              ...formData,
              date_of_birth: parseDateString(formData.date_of_birth),
            };

            setCurrentStep(step);
            methods.reset(processedFormData);
          } else {
            // Clear old data
            await clearFormProgress();
          }
        }
      } catch (error) {
        console.error("Error loading saved progress:", error);
        // If there's an error, reset to initial state
        methods.reset(initialFormState);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedProgress();
  }, []);
  useEffect(() => {
    const saveProgress = async () => {
      const formData = methods.getValues();
      // Ensure date is valid before saving
      if (formData.date_of_birth && !(formData.date_of_birth instanceof Date)) {
        formData.date_of_birth = parseDateString(formData.date_of_birth);
      }
      await saveFormProgress(currentStep, formData);
    };

    saveProgress();
  }, [currentStep, methods.watch()]);
  // Also add this debug log at the component level
  useEffect(() => {
    console.log("Step changed to:", currentStep);
    console.log("Is final step?:", currentStep === 4);
  }, [currentStep]);

  // Also add this console log where FORM_STEPS is defined
  console.log("FORM_STEPS:", FORM_STEPS);

  // Helper function to calculate age
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };
  const handlePrevious = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [fadeAnim]);
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
      };

      const submissionData = {
        // Personal Information
        bio_en: String(data.bio_en || ""),
        bio_ar: String(data.bio_ar || ""),
        date_of_birth: formatDate(data.date_of_birth),
        guardian_contact: String(data.guardian_contact || ""),
        gender: String(data.gender || ""),

        // Location Information
        nationality_id: Number(data.nationality_id) || null,
        country_of_residence_id: Number(data.country_of_residence_id) || null,
        city_id: Number(data.city_id) || null,
        origin_id: Number(data.origin_id) || null,

        // Physical Attributes
        height: Number(data.height) || null,
        weight: Number(data.weight) || null,
        hair_color_id: Number(data.hair_color_id) || null,
        skin_color_id: Number(data.skin_color_id) || null,

        // Education and Work
        educational_level_id: Number(data.educational_level_id) || null,
        specialization_id: Number(data.specialization_id) || null,
        employment_status: data.employment_status === true,
        job_title_id:
          data.employment_status === true
            ? Number(data.job_title_id) || null
            : null,
        position_level_id:
          data.employment_status === true
            ? Number(data.position_level_id) || null
            : null,

        // Financial and Housing
        financial_status_id: Number(data.financial_status_id) || null,
        housing_status_id: Number(data.housing_status_id) || null,
        car_ownership: Boolean(data.car_ownership) === true,
        marriage_budget_id: Number(data.marriage_budget_id) || null,

        // Marital and Family
        marital_status_id: Number(data.marital_status_id) || null,
        number_of_children: Number(data.number_of_children) || 0,

        // Religious and Cultural
        religion_id: Number(data.religion_id) || null,
        religiosity_level_id: Number(data.religiosity_level_id) || null,

        // Lifestyle
        sleep_habit_id: Number(data.sleep_habit_id) || null,
        sports_activity_id: Number(data.sports_activity_id) || null,
        social_media_presence_id: Number(data.social_media_presence_id) || null,
        drinking_status_id: Number(data.drinking_status_id) || null,

        // Arrays
        hobbies: Array.isArray(data.hobbies) ? data.hobbies.map(Number) : [],
        pets: Array.isArray(data.pets) ? data.pets.map(Number) : [],

        // Additional Information
        health_issues_en: String(data.health_issues_en || ""),
        health_issues_ar: String(data.health_issues_ar || ""),
        zodiac_sign_id: Number(data.zodiac_sign_id) || null,

        // Smoking status
        smoking_status: Number(data.smoking_status) === 1 ? 0 : 1,
      };

      // Handle smoking tools
      if (Number(data.smoking_status) > 1) {
        submissionData.smoking_tools = Array.isArray(data.smoking_tools)
          ? data.smoking_tools.map(Number)
          : [];
      }

      // Handle female-specific fields
      if (data.gender === "female") {
        submissionData.hijab_status = Number(data.hijab_status) || 0;
      }

      // Keep null values in the submission
      // Only remove undefined values
      Object.keys(submissionData).forEach((key) => {
        if (submissionData[key] === undefined) {
          delete submissionData[key];
        }
      });

      console.log("Submitting data:", submissionData);

      // First update profile
      const resultAction = await dispatch(updateProfile(submissionData));

      if (updateProfile.fulfilled.match(resultAction)) {
        // Handle profile image if exists
        if (data.profile_image && data.profile_image.base64) {
          const imageData = {
            base64: data.profile_image.base64,
            type: data.profile_image.type || "image/jpeg",
          };
          await dispatch(updateProfilePhoto(imageData));
        }
        await clearFormProgress();
        // Fetch fresh profile data
        await dispatch(fetchProfile());

        Alert.alert(
          "🎉 Success!",
          "Your profile has been updated successfully!",
          [
            {
              text: "Continue",
              onPress: () => {
                dispatch(setShowProfileAlert(false));
                navigation.goBack();
              },
              style: "default",
            },
          ],
          { cancelable: false }
        );
      } else {
        throw new Error(resultAction.payload || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update failed:", error);

      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.entries(validationErrors)
          .map(([field, messages]) => `• ${field}: ${messages[0]}`)
          .join("\n");

        Alert.alert(
          "🚨 Validation Error",
          `Please fix the following issues:\n\n${errorMessages}`,
          [{ text: "OK", style: "cancel" }]
        );
      } else {
        Alert.alert(
          "❌ Error",
          "Failed to update profile. Please check your connection and try again.",
          [{ text: "OK", style: "cancel" }]
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleFormSubmit = useCallback(async () => {
    console.log("handleFormSubmit called");
    try {
      // Validate all fields
      const isValid = await methods.trigger();
      console.log("Form validation result:", isValid);

      if (isValid) {
        // Get form data
        const formData = methods.getValues();
        console.log("Form data before submission:", formData);

        // Call onSubmit
        await onSubmit(formData);
      } else {
        console.log("Form validation failed:", methods.formState.errors);
        const allErrors = Object.entries(methods.formState.errors).map(
          ([_, error]) => error.message
        );
        setCurrentErrors(allErrors);
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      Alert.alert(
        "Error",
        "There was a problem submitting your form. Please try again.",
        [{ text: "OK" }]
      );
    }
  }, [methods, onSubmit]);
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

export default fillProfileData;
