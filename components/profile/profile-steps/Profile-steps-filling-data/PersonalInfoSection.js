// components/PersonalInfoSection.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useFormContext } from "react-hook-form";
import FormInput from "./FormInput";
import FormDatePicker from "./FormDatePicker";
import GenderSelector from "./GenderSelector";
import { COLORS } from "../../../../constants/colors";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
const PersonalInfoSection = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const gender = watch("gender");

  // Error logging effect
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form Errors:", errors);
    }
  }, [errors]);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tell us about yourself</Text>
        <Text style={styles.sectionSubtitle}>
          Let's start with your basic information
        </Text>
      </View>

      <FormInput
        placeholderTextColor={COLORS.primary} // Your desired placeholder color
        control={control}
        name="bio_en"
        label="About You (English)"
        placeholder="Share a brief introduction about yourself..."
        multiline
        numberOfLines={4}
        maxLength={500}
        showCharacterCount
        required
      />
      <FormInput
        placeholderTextColor={COLORS.primary} // Your desired placeholder color
        control={control}
        name="bio_ar"
        label="About You (Arabic)"
        placeholder="شارك نبذة مختصرة عن نفسك..."
        multiline
        numberOfLines={4}
        maxLength={500}
        showCharacterCount
        textAlign="right"
        required
      />

      <GenderSelector control={control} name="gender" label="Gender" required />

      {gender === "female" && (
        <View style={styles.hijabSection}>
          <Text style={styles.hijabTitle}>
            Hijab Preference
            <Text style={styles.required}> *</Text>
          </Text>
          <View style={styles.hijabOptions}>
            <TouchableOpacity
              style={[
                styles.hijabOption,
                watch("hijab_status") === 1 && styles.hijabOptionSelected,
              ]}
              onPress={() => setValue("hijab_status", 1)}
            >
              <Icon name="headscarf" size={24} color={COLORS.primary} />
              <Text style={styles.hijabOptionText}>Wears Hijab</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.hijabOption,
                watch("hijab_status") === 0 && styles.hijabOptionSelected,
              ]}
              onPress={() => setValue("hijab_status", 0)}
            >
              <Icon name="user" size={24} color={COLORS.primary} />
              <Text style={styles.hijabOptionText}>No Hijab</Text>
            </TouchableOpacity>
          </View>
          {errors.hijab_status && (
            <Text style={styles.errorText}>{errors.hijab_status.message}</Text>
          )}
        </View>
      )}

      <FormDatePicker
        control={control}
        name="date_of_birth"
        label="Date of Birth"
        maximumDate={new Date()}
        minimumDate={new Date(1900, 0, 1)}
        required
      />

      <FormInput
        placeholderTextColor={COLORS.primary} // Your desired placeholder color
        control={control}
        name="guardian_contact"
        label="Guardian Contact"
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        maxLength={10}
        required
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.grayDark,
    lineHeight: 22,
  },
  hijabSection: {
    marginTop: 20,
    backgroundColor: COLORS.grayLight,
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  hijabTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  hijabOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  hijabOption: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  hijabOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + "20",
  },
  hijabOptionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#FFE5E5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  required: {
    color: COLORS.error,
  },
  hijabSection: {
    marginTop: 20,
    backgroundColor: COLORS.grayLight,
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentWrapper: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    flex: 1,
    gap: 20,
  },
  input: {
    marginBottom: 16,
  },
});

export default PersonalInfoSection;
