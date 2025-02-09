import React, { useState, useCallback, useRef } from "react";
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
  KeyboardAvoidingViewComponent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { setShowProfileAlert } from "../../store/slices/profile.slice";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import PersonalInfoSection from "../../components/profile/profile-steps/PersonalInfoSection";
import LifestyleSection from "../../components/profile/profile-steps/Profile-steps-filling-data/LifestyleSection";
import EducationWorkSection from "../../components/profile/profile-steps/Profile-steps-filling-data/EducationWorkSection";
import ProgressSteps from "../../components/common/ProgressSteps";
import { COLORS } from "../../constants/colors";
import { profileValidationSchema } from "../../utils/profile-validation";
import { useNavigation } from "@react-navigation/native";
import { profileService } from "../../services/profile.service";
import { stepValidations } from "../../utils/profile-validation";
import { stepFields } from "../../utils/profile-validation";
import Feather from "react-native-vector-icons/Feather";
import { updateProfile } from "../../store/slices/profile.slice";
import { fetchProfile } from "../../store/slices/profile.slice";
import withProfileCompletion from "../../components/profile/withProfileCompletion";
import ProfileImageSection from "../../components/profile/profile-steps/ProfileImageSection";
import { calculateProfileProgress } from "../../utils/profileProgress";
import { useDispatch } from "react-redux";
import { updateProfilePhoto } from "../../store/slices/profile.slice";
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

// Part 3: Component Setup & Handlers
const fillProfileData = () => {
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [currentErrors, setCurrentErrors] = useState([]);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const methods = useForm({
    defaultValues: initialFormState,
    resolver: yupResolver(profileValidationSchema),
    mode: "onChange",
  });

  const handleNext = useCallback(async () => {
    try {
      const currentStepFields = stepFields[currentStep];
      const isStepValid = await methods.trigger(currentStepFields);

      if (isStepValid) {
        // Smooth transition animation
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length));
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        });
      } else {
        // Collect and display errors in a more user-friendly way
        const currentErrors = Object.entries(methods.formState.errors)
          .filter(([key]) => currentStepFields.includes(key))
          .map(([key, error]) => error.message || "Invalid input");

        // Ensure we have at least one error message
        const errorsToShow =
          currentErrors.length > 0
            ? currentErrors
            : ["Please fill in all required fields"];

        setCurrentErrors(errorsToShow);
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error("Validation error:", error);
      Alert.alert("Error", "There was a problem validating your information.", [
        { text: "OK" },
      ]);
    }
  }, [currentStep, methods, fadeAnim]);

  const handlePrevious = useCallback(() => {
    // Add a smooth transition animation for previous step
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
        bio_en: String(data.bio_en || ""),
        bio_ar: String(data.bio_ar || ""),
        date_of_birth: formatDate(data.date_of_birth),
        guardian_contact: String(data.guardian_contact || ""),
        gender: String(data.gender || ""),
        height: Number(data.height) || null,
        weight: Number(data.weight) || null,
        nationality_id: Number(data.nationality_id) || null,
        country_of_residence_id: Number(data.country_of_residence_id) || null,
        city_id: Number(data.city_id) || null,
        educational_level_id: Number(data.educational_level_id) || null,
        hair_color_id: Number(data.hair_color_id) || null,
        skin_color_id: Number(data.skin_color_id) || null,
        religion_id: Number(data.religion_id) || null,
        marital_status_id: Number(data.marital_status_id) || null,
        financial_status_id: Number(data.financial_status_id) || null,
        employment_status: data.employment_status === true,
        car_ownership: Boolean(data.car_ownership) === true,
        specialization_id: Number(data.specialization_id) || null,
        drinking_status_id: Number(data.drinking_status_id) || null,
        sports_activity_id: Number(data.sports_activity_id) || null,
        social_media_presence_id: Number(data.social_media_presence_id) || null,
        housing_status_id: Number(data.housing_status_id) || null,
        number_of_children: Number(data.number_of_children) || 0,
        zodiac_sign_id: Number(data.zodiac_sign_id) || null,
        hobbies: Array.isArray(data.hobbies) ? data.hobbies.map(Number) : [],
        pets: Array.isArray(data.pets) ? data.pets.map(Number) : [],
        health_issues_en: String(data.health_issues_en || ""),
        health_issues_ar: String(data.health_issues_ar || ""),
        origin_id: Number(data.origin) || null,
        zodiac_sign_id: Number(data.zodiac_sign) || null,
        marriage_budget_id: Number(data.marriage_budget_id) || null,
        religiosity_level_id: Number(data.religiosity_level_id) || null,
        sleep_habit_id: Number(data.sleep_habit_id) || null,
        job_title_id: Number(data.job_title_id) || null,
        position_level_id: Number(data.position_level) || null,
        social_media_presence_id: Number(data.social_media_presence) || null,
        photos: Array.isArray(data.photos)
          ? data.photos.filter((item) => !isNaN(item)).map(Number)
          : [],
      };

      if (data.employment_status === true) {
        submissionData.job_title = String(data.job_title || "");
        submissionData.position_level_id = Number(data.position_level) || null;
      }

      // Handle smoking status
      submissionData.smoking_status = Number(data.smoking_status) === 1 ? 0 : 1;

      // Include smoking_tools only for smokers
      if (Number(data.smoking_status) > 1) {
        submissionData.smoking_tools = Array.isArray(data.smoking_tools)
          ? data.smoking_tools.map(Number)
          : [];
      }

      // Handle hijab status
      if (data.gender === "female") {
        submissionData.hijab_status = Number(data.hijab_status) || 0;
      }

      // Remove null values
      Object.keys(submissionData).forEach(
        (key) => submissionData[key] === null && delete submissionData[key]
      );

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
                    ? methods.handleSubmit(onSubmit)
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
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%", // Ensure it covers the whole screen
    backgroundColor: "#F4F7FA",
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: "#F4F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  stepIndicator: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
  stepContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    backgroundColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  stepHeaderText: {
    marginLeft: 12,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
  },
  stepDescription: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  buttonTextPrimary: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  // Error Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  blurContainer: {
    width: width * 0.85,
    borderRadius: 16,
    overflow: "hidden",
  },
  errorModalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  errorModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
    marginTop: 12,
    marginBottom: 8,
  },
  errorModalSubtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 12,
  },
  errorScrollView: {
    maxHeight: height * 0.3,
    width: "100%",
    marginBottom: 16,
  },
  errorScrollContent: {
    paddingVertical: 8,
  },
  errorItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  errorItemText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#2C3E50",
    flex: 1,
  },
  errorModalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorModalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default fillProfileData;
