import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { profileService } from "../../services/profile.service";
// Import COLORS
export const COLORS = {
  primary: "#B65165",
  secondary: "#5856D6",
  background: "#F8F9FA",
  white: "#FFFFFF",
  text: "#1C1C1E",
  error: "#FF3B30",
  success: "#34C759",
  border: "#E5E5EA",
};

const fillProfileData = () => {
  const [profileData, setProfileData] = useState({
    bio_en: "Developer with a passion for creating innovative solutions.",
    bio_ar: "مرحبا، أنا مطور برمجيات شغوف بإنشاء حلول مبتكرة.",
    gender: "male",
    date_of_birth: "1990-05-20",
    height: 1,
    weight: 1,
    nationality_id: 4,
    country_of_residence_id: 5,
    city_id: 1,
    educational_level_id: 4,
    specialization_id: 1,
    employment_status: 1,
    smoking_status: 1,
    smoking_tools: [2],
    drinking_status_id: 2,
    sports_activity_id: 5,
    social_media_presence_id: 1,
    religion_id: 2,
    hair_color_id: 2,
    skin_color_id: 2,
    marital_status_id: 1,
    number_of_children: 2,
    housing_status_id: 4,
    hobbies: [1, 3, 5],
    pets: [2],
    health_issues_en: "None",
    health_issues_ar: "لا شيء",
    zodiac_sign_id: 1,
    car_ownership: 1,
    guardian_contact: "0123456789",
    financial_status_id: 1,
    hijab_status: undefined, // Will be set for females
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validate employment status is a boolean
    if (![0, 1].includes(profileData.employment_status)) {
      newErrors.employment_status = "Employment status must be 0 or 1";
    }

    // Validate hijab status for females
    if (
      profileData.gender === "female" &&
      (profileData.hijab_status === undefined ||
        profileData.hijab_status === null)
    ) {
      newErrors.hijab_status = "Hijab status is required for females";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    setProfileData((prev) => {
      // Special handling for gender
      if (key === "gender") {
        // Reset hijab_status when gender changes
        return {
          ...prev,
          [key]: value,
          hijab_status: value === "female" ? 0 : undefined,
        };
      }
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const handleSubmit = async () => {
    // Reset previous errors
    setErrors({});

    // Validate the form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data, ensuring only relevant fields are sent
      const submissionData = { ...profileData };

      // Remove hijab_status for males
      if (submissionData.gender === "male") {
        delete submissionData.hijab_status;
      }

      const response = await profileService.updateProfile(submissionData);
      console.log("Profile updated successfully:", response);

      // Handle successful update (e.g., show success message, navigate)
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Profile update failed:", error);

      // Handle API errors
      const apiErrors = error.response?.data?.errors || {};
      setErrors(apiErrors);

      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (label, key, placeholder, isTextArea = false) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isTextArea && styles.textArea]}
        value={profileData[key]}
        onChangeText={(text) => handleInputChange(key, text)}
        placeholder={placeholder}
        multiline={isTextArea}
        numberOfLines={isTextArea ? 4 : 1}
      />
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  const renderRadioGroup = (label, key, options) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.radioGroup}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.radioButton,
              profileData[key] === option.value && styles.radioButtonSelected,
            ]}
            onPress={() => handleInputChange(key, option.value)}
          >
            <Text
              style={[
                styles.radioButtonText,
                profileData[key] === option.value &&
                  styles.radioButtonTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {renderInput(
          "English Bio",
          "bio_en",
          "Enter your bio in English",
          true
        )}
        {renderInput(
          "Arabic Bio",
          "bio_ar",
          "أدخل سيرتك الذاتية بالعربية",
          true
        )}
        {renderInput("Date of Birth", "date_of_birth", "YYYY-MM-DD")}
        {renderInput("Guardian Contact", "guardian_contact", "0123456789")}
        {renderRadioGroup("Gender", "gender", [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ])}
        {profileData.gender === "female" &&
          renderRadioGroup("Hijab Status", "hijab_status", [
            { label: "No Hijab", value: 0 },
            { label: "Wears Hijab", value: 1 },
          ])}
      </View>

      {/* Employment Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Employment</Text>
        {renderRadioGroup("Employment Status", "employment_status", [
          { label: "Employed", value: true },
          { label: "Unemployed", value: false },
        ])}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.submitButtonText}>Update Profile</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: COLORS.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: COLORS.text,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    fontSize: 14,
    color: COLORS.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  radioButtonText: {
    fontSize: 14,
    color: COLORS.text,
  },
  radioButtonTextSelected: {
    color: COLORS.white,
  },
  errorText: {
    color: COLORS.error,
    marginTop: 4,
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default fillProfileData;
