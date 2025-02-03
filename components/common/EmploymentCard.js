// app/components/common/EmploymentCard.js
import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { COLORS } from "../../constants/colors";
import { Controller } from "react-hook-form";
import FormInput from "../profile/profile-steps/FormInput";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EmploymentCard = ({ control, employment_status, style }) => {
  const employmentOptions = [
    { id: true, label: "Employed", icon: "briefcase" },
    { id: false, label: "Not Employed", icon: "person" },
  ];

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Employment Status</Text>

      <Controller
        control={control}
        name="employment_status"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <View>
            <View style={styles.optionsContainer}>
              {employmentOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.option,
                    value === option.id && styles.selectedOption,
                  ]}
                  onPress={() => onChange(option.id)}
                >
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={value === option.id ? COLORS.white : COLORS.primary}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      value === option.id && styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        )}
      />

      {employment_status && (
        <Animated.View style={styles.additionalFields}>
          <FormInput
            control={control}
            name="company_name"
            label="Company Name"
            placeholder="Enter your company name"
          />

          <Controller
            control={control}
            name="position_level"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <View style={styles.positionContainer}>
                <Text style={styles.label}>Position Level</Text>
                <View style={styles.positionOptions}>
                  {[
                    { id: 1, label: "Entry Level" },
                    { id: 2, label: "Mid Level" },
                    { id: 3, label: "Senior Level" },
                    { id: 4, label: "Manager" },
                  ].map((position) => (
                    <TouchableOpacity
                      key={position.id}
                      style={[
                        styles.positionOption,
                        value === position.id && styles.selectedPositionOption,
                      ]}
                      onPress={() => onChange(position.id)}
                    >
                      <Text
                        style={[
                          styles.positionText,
                          value === position.id && styles.selectedPositionText,
                        ]}
                      >
                        {position.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </View>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  option: {
    flex: 1,
    flexDirection: "row",
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
  additionalFields: {
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
  },
  positionContainer: {
    marginTop: 16,
  },
  positionOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  positionOption: {
    flex: 1,
    minWidth: "45%",
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  selectedPositionOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  positionText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  selectedPositionText: {
    color: COLORS.white,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default EmploymentCard;
