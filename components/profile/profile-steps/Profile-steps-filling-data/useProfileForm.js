import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Animated, Alert } from "react-native";
import { useDispatch } from "react-redux";

import {
  profileValidationSchema,
  initialFormState,
  stepFields,
} from "../../../../utils/profile-validation";

import {
  fetchProfile,
  updateProfile,
  updateProfilePhoto,
} from "../../../../store/slices/profile.slice";
import {
  saveFormProgress,
  loadFormProgress,
  clearFormProgress,
  calculateAge,
} from "./storageHelpers";
import { FORM_STEPS } from "./form_steps";
import { useNavigation } from "@react-navigation/native";

export const useProfileForm = (
  userId,
  scrollViewRef,
  setCurrentErrors,
  setErrorModalVisible
) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const methods = useForm({
    defaultValues: initialFormState,
    resolver: yupResolver(profileValidationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const loadSavedProgress = async () => {
      try {
        setIsLoading(true);

        if (!userId) {
          methods.reset(initialFormState);
          return;
        }

        const savedProgress = await loadFormProgress(userId);

        if (savedProgress) {
          const { step, formData, lastUpdated } = savedProgress;

          const savedDate = new Date(lastUpdated);
          const now = new Date();
          const hoursDiff = (now - savedDate) / (1000 * 60 * 60);

          if (hoursDiff < 24) {
            setCurrentStep(step);
            methods.reset(formData);
          } else {
            await clearFormProgress(userId);
            methods.reset(initialFormState);
          }
        } else {
          methods.reset(initialFormState);
        }
      } catch (error) {
        console.error("Error loading saved progress:", error);
        methods.reset(initialFormState);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedProgress();
  }, [userId]);

  useEffect(() => {
    const saveProgress = async () => {
      if (userId) {
        const formData = methods.getValues();
        await saveFormProgress(userId, currentStep, formData);
      }
    };

    saveProgress();
  }, [currentStep, methods.watch(), userId]);

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

        nationality_id: Number(data.nationality_id) || null,
        country_of_residence_id: Number(data.country_of_residence_id) || null,
        city_id: Number(data.city_id) || null,
        origin_id: Number(data.origin_id) || null,

        height: Number(data.height) || null,
        weight: Number(data.weight) || null,
        eye_color_id: Number(data.eye_color_id) || null,

        hair_color_id: Number(data.hair_color_id) || null,
        skin_color_id: Number(data.skin_color_id) || null,

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

        financial_status_id: Number(data.financial_status_id) || null,
        housing_status_id: Number(data.housing_status_id) || null,
        car_ownership: Boolean(data.car_ownership) === true,
        marriage_budget_id: Number(data.marriage_budget_id) || null,

        marital_status_id: Number(data.marital_status_id) || null,
        number_of_children: Number(data.number_of_children) || 0,

        religion_id: Number(data.religion_id) || null,
        religiosity_level_id: Number(data.religiosity_level_id) || null,

        sleep_habit_id: Number(data.sleep_habit_id) || null,
        sports_activity_id: Number(data.sports_activity_id) || null,
        social_media_presence_id: Number(data.social_media_presence_id) || null,
        drinking_status_id: Number(data.drinking_status_id) || null,

        hobbies:
          Array.isArray(data.hobbies) && data.hobbies.length > 0
            ? data.hobbies.map((id) => parseInt(id, 10))
            : [],
        pets:
          Array.isArray(data.pets) && data.pets.length > 0
            ? data.pets.map((id) => parseInt(id, 10))
            : [],

        health_issues_en: String(data.health_issues_en || ""),
        health_issues_ar: String(data.health_issues_ar || ""),
        zodiac_sign_id: Number(data.zodiac_sign_id) || null,

        smoking_status: Number(data.smoking_status) === 1 ? 0 : 1,
      };

      if (Number(data.smoking_status) > 1) {
        submissionData.smoking_tools = Array.isArray(data.smoking_tools)
          ? data.smoking_tools.map(Number)
          : [];
      }

      if (data.gender === "female") {
        submissionData.hijab_status = Number(data.hijab_status) || 0;
      }

      Object.keys(submissionData).forEach((key) => {
        if (submissionData[key] === undefined) {
          delete submissionData[key];
        }
      });

      const resultAction = await dispatch(updateProfile(submissionData));

      if (updateProfile.fulfilled.match(resultAction)) {
        if (data.profile_image && data.profile_image.base64) {
          const imageData = {
            base64: data.profile_image.base64,
            type: data.profile_image.type || "image/jpeg",
          };
          await dispatch(updateProfilePhoto(imageData));
        }
        await clearFormProgress(userId);
        await dispatch(fetchProfile());

        Alert.alert(
          "🎉 Success!",
          "Your profile has been updated successfully!",
          [
            {
              text: "Continue",
              onPress: () => {
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

  const handleNext = useCallback(async () => {
    try {
      const currentStepFields = stepFields[currentStep];
      const formValues = methods.getValues();

      const validationResult = await methods.trigger(currentStepFields);

      const stepErrors = Object.entries(methods.formState.errors)
        .filter(([key]) => currentStepFields.includes(key))
        .map(([key, error]) => {
          const fieldName = key.replace(/_/g, " ").toLowerCase();
          return error.message || `Please fill in ${fieldName} correctly`;
        });

      if (validationResult && stepErrors.length === 0) {
        if (currentStep === FORM_STEPS.length) {
          const isValid = await methods.trigger();

          if (isValid) {
            const formData = methods.getValues();
            await onSubmit(formData);
            return;
          } else {
            const allErrors = Object.entries(methods.formState.errors).map(
              ([key, error]) => error.message
            );
            setCurrentErrors(allErrors);
            setErrorModalVisible(true);
            return;
          }
        }

        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setCurrentStep((prev) => {
            const newStep = Math.min(prev + 1, FORM_STEPS.length);
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
        let errorsToShow = stepErrors;

        if (errorsToShow.length === 0) {
          errorsToShow = ["Please fill in all required fields correctly"];
        }

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
  }, [
    currentStep,
    methods,
    fadeAnim,
    onSubmit,
    setCurrentErrors,
    setErrorModalVisible,
  ]);

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

  const handleFormSubmit = useCallback(async () => {
    try {
      const isValid = await methods.trigger();

      if (isValid) {
        const formData = methods.getValues();

        await onSubmit(formData);
      } else {
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

  return {
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
    onSubmit,
  };
};
