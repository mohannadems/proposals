// FormInput.js - Enhanced with better RTL support
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { COLORS } from "../../../../constants/colors";

const FormInput = ({
  control,
  name,
  label,
  placeholder,
  required = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = "default",
  secureTextEntry = false,
  maxLength,
  showCharacterCount = false,
  isRTL = false,
  textAlign,
  ...rest
}) => {
  // Calculate preferred textAlign based on parameters
  const getTextAlignment = () => {
    // If explicitly set, use it
    if (textAlign) return textAlign;

    // For RTL context, default to 'right'
    // For LTR context, default to 'left'
    return isRTL ? "right" : "left";
  };

  const inputTextAlign = getTextAlignment();

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.inputContainer}>
          <View
            style={[
              styles.labelContainer,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <Text
              style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}
            >
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>

            {showCharacterCount && maxLength && (
              <Text style={styles.charCount}>
                {(value || "").length}/{maxLength}
              </Text>
            )}
          </View>

          <TextInput
            style={[
              styles.input,
              multiline && styles.multilineInput,
              error && styles.inputError,
              {
                textAlign: inputTextAlign,
                writingDirection: isRTL ? "rtl" : "ltr",
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor="#A0A0A0"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value || ""}
            multiline={multiline}
            numberOfLines={multiline ? numberOfLines : 1}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            maxLength={maxLength}
            {...rest}
          />

          {error && (
            <Text
              style={[
                styles.errorText,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
    width: "100%",
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },
  required: {
    color: COLORS.error,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: "#999",
  },
});

export default FormInput;
