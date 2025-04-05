import React, { useContext } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LanguageContext } from "../../../contexts/LanguageContext";

export default function AuthInput({
  label,
  error,
  touched,
  leftIcon,
  isRTL,
  ...props
}) {
  const languageContext = useContext(LanguageContext);
  const rtl =
    isRTL !== undefined
      ? isRTL
      : languageContext
      ? languageContext.isRTL
      : false;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          rtl && { textAlign: "right", alignSelf: "flex-start", width: "100%" },
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.inputContainer,
          touched && error && styles.inputError,
          rtl && { flexDirection: "row-reverse" },
        ]}
      >
        {leftIcon && (
          <MaterialIcons
            name={leftIcon}
            size={20}
            color={touched && error ? "#FF3B30" : "#9e086c"}
            style={[
              styles.icon,
              rtl ? { marginLeft: 8, marginRight: 0 } : { marginRight: 8 },
            ]}
          />
        )}
        <TextInput
          style={[styles.input, rtl && { textAlign: "right" }]}
          placeholderTextColor="#999"
          textAlign={rtl ? "right" : "left"}
          writingDirection={rtl ? "rtl" : "ltr"}
          {...props}
        />
      </View>
      {touched && error && (
        <View
          style={[
            styles.errorContainer,
            rtl && { flexDirection: "row-reverse", alignSelf: "flex-start" },
          ]}
        >
          <MaterialIcons name="error" size={16} color="#FF3B30" />
          <Text
            style={[
              styles.errorText,
              rtl
                ? { marginRight: 4, marginLeft: 0, textAlign: "right" }
                : { marginLeft: 4 },
            ]}
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#333",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginLeft: 4,
  },
});
