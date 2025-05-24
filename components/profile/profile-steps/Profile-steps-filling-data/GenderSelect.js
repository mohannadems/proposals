import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/colors";
import { LanguageContext } from "../../../../contexts/LanguageContext";

const GenderSelect = ({ value, onChange, error, touched, isRTL, t }) => {
  const languageContext = useContext(LanguageContext);
  const _isRTL =
    isRTL !== undefined
      ? isRTL
      : languageContext
      ? languageContext.isRTL
      : false;
  const _t = t || (languageContext ? languageContext.t : null);

  const genders = [
    {
      value: "male",
      icon: "man",
      label: _t ? _t("register.male") : "Male",
    },
    {
      value: "female",
      icon: "woman",
      label: _t ? _t("register.female") : "Female",
    },
  ];

  const orderedGenders = _isRTL ? [...genders].reverse() : genders;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, _isRTL && styles.rtlText]}>
        {_t ? _t("register.gender") : "Gender"}
      </Text>

      <View style={styles.optionsContainer}>
        {orderedGenders.map((gender) => (
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
                _isRTL && styles.rtlOptionText,
              ]}
            >
              {gender.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && touched && (
        <Text style={[styles.errorText, _isRTL && styles.rtlText]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.text,
  },
  rtlText: {
    textAlign: "right",
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
  rtlOptionText: {
    marginLeft: 0,
    marginRight: 8,
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
