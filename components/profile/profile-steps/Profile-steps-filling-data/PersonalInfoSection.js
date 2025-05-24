import React, { useContext } from "react";
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

const PersonalInfoSection = ({ isRTL = false, t }) => {
  const {
    control,
    watch,
    setValue,
    userGender,
    formState: { errors },
  } = useFormContext();

  const gender = watch("gender");

  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
    }
  }, [errors]);

  const dynamicStyles = {
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
      textAlign: isRTL ? "right" : "left",
    },
    sectionSubtitle: {
      fontSize: 16,
      color: COLORS.grayDark,
      lineHeight: 22,
      textAlign: isRTL ? "right" : "left",
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
      textAlign: isRTL ? "right" : "left",
    },
    hijabOptions: {
      flexDirection: isRTL ? "row-reverse" : "row",
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
    errorText: {
      color: COLORS.error,
      fontSize: 12,
      marginTop: 4,
      textAlign: isRTL ? "right" : "left",
    },
    required: {
      color: COLORS.error,
    },
  };

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.sectionHeader}>
        <Text style={dynamicStyles.sectionTitle}>
          {t ? t("profile.personal.title") : "Tell us about yourself"}
        </Text>
        <Text style={dynamicStyles.sectionSubtitle}>
          {t
            ? t("profile.personal.subtitle")
            : "Let's start with your basic information"}
        </Text>
      </View>

      <FormInput
        placeholderTextColor={COLORS.primary}
        control={control}
        name="bio_en"
        label={t ? t("profile.personal.bio_en") : "About You (English)"}
        placeholder={
          t
            ? t("profile.personal.bio_en_placeholder")
            : "Share a brief introduction about yourself..."
        }
        multiline
        numberOfLines={4}
        maxLength={500}
        showCharacterCount
        required
        isRTL={false}
      />
      <FormInput
        placeholderTextColor={COLORS.primary}
        control={control}
        name="bio_ar"
        label={t ? t("profile.personal.bio_ar") : "About You (Arabic)"}
        placeholder={
          t
            ? t("profile.personal.bio_ar_placeholder")
            : "شارك نبذة مختصرة عن نفسك..."
        }
        multiline
        numberOfLines={4}
        maxLength={500}
        showCharacterCount
        textAlign="right"
        required
        isRTL={true}
      />

      <FormDatePicker
        control={control}
        name="date_of_birth"
        label={t ? t("profile.personal.date_of_birth") : "Date of Birth"}
        maximumDate={new Date()}
        minimumDate={new Date(1900, 0, 1)}
        required
        isRTL={isRTL}
      />

      <FormInput
        placeholderTextColor={COLORS.primary}
        control={control}
        name="guardian_contact"
        label={t ? t("profile.personal.guardian_contact") : "Guardian Contact"}
        placeholder={
          t
            ? t("profile.personal.guardian_contact_placeholder")
            : "Enter phone number"
        }
        keyboardType="phone-pad"
        maxLength={10}
        required
        isRTL={isRTL}
      />
    </View>
  );
};

export default PersonalInfoSection;
