// app/components/common/FormInput.js
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { COLORS } from "../../../constants/colors";

const FormInput = ({
  control,
  name,
  label,
  placeholder,
  rules = {},
  multiline = false,
  numberOfLines = 1,
  maxLength,
  showCharacterCount = false,
  keyboardType = "default",
  textAlign = "left",
  containerStyle,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, value, onBlur },
        fieldState: { error },
      }) => (
        <View style={[styles.container, containerStyle]}>
          {label && <Text style={styles.label}>{label}</Text>}

          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.input,
                multiline && styles.multilineInput,
                error && styles.inputError,
                { textAlign },
              ]}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder={placeholder}
              placeholderTextColor={COLORS.grayDark}
              multiline={multiline}
              numberOfLines={numberOfLines}
              maxLength={maxLength}
              keyboardType={keyboardType}
              {...props}
            />

            {showCharacterCount && maxLength && (
              <Text style={styles.characterCount}>
                {value?.length || 0}/{maxLength}
              </Text>
            )}
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error.message}</Text>
            </View>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 48,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorContainer: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
  },
  characterCount: {
    position: "absolute",
    bottom: 8,
    right: 12,
    fontSize: 12,
    color: COLORS.grayDark,
  },
});

export default FormInput;
