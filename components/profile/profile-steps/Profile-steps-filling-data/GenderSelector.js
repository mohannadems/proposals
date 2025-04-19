import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { COLORS } from "../../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const GenderSelector = ({
  control,
  name,
  label,
  isRTL = false,
  t,
  required = false,
}) => {
  const genderOptions = [
    {
      value: "male",
      label: t ? t("profile.gender.male") : "Male",
      icon: "male",
    },
    {
      value: "female",
      label: t ? t("profile.gender.female") : "Female",
      icon: "female",
    },
  ];

  const dynamicStyles = {
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.text,
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
    },
    optionsContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 12,
    },
    option: {
      flex: 1,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      backgroundColor: COLORS.white,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.border,
      gap: 8,
    },
    selectedOption: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    optionText: {
      fontSize: 16,
      color: COLORS.text,
      fontWeight: "500",
    },
    selectedOptionText: {
      color: COLORS.white,
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
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={dynamicStyles.container}>
          {label && (
            <Text style={dynamicStyles.label}>
              {label}
              {required && <Text style={dynamicStyles.required}> *</Text>}
            </Text>
          )}

          <View style={dynamicStyles.optionsContainer}>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  dynamicStyles.option,
                  value === option.value && dynamicStyles.selectedOption,
                ]}
                onPress={() => onChange(option.value)}
              >
                <Ionicons
                  name={option.icon}
                  size={24}
                  color={value === option.value ? COLORS.white : COLORS.primary}
                />
                <Text
                  style={[
                    dynamicStyles.optionText,
                    value === option.value && dynamicStyles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error && (
            <Text style={dynamicStyles.errorText}>
              {t ? t("profile.gender.error") : error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
};

export default GenderSelector;
