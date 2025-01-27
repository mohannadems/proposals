import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const GenderSelect = ({ value, onChange, error, touched }) => {
  const genders = [
    { value: "male", icon: "man", label: "Male" },
    { value: "female", icon: "woman", label: "Female" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Gender</Text>
      <View style={styles.optionsContainer}>
        {genders.map((gender) => (
          <TouchableOpacity
            key={gender.value}
            style={[
              styles.option,
              value === gender.value && styles.selectedOption,
              error && touched && styles.errorBorder,
            ]}
            onPress={() => onChange(gender.value)}
          >
            <MaterialIcons
              name={gender.icon}
              size={24}
              color={value === gender.value ? COLORS.primary : COLORS.text}
            />
            <Text
              style={[
                styles.optionText,
                value === gender.value && styles.selectedText,
              ]}
            >
              {gender.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && touched && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.text,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  selectedOption: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text,
  },
  selectedText: {
    color: COLORS.primary,
  },
  errorBorder: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default GenderSelect;
