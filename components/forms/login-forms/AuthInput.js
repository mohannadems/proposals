import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function AuthInput({
  label,
  error,
  touched,
  leftIcon,
  ...props
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[styles.inputContainer, touched && error && styles.inputError]}
      >
        {leftIcon && (
          <MaterialIcons
            name={leftIcon}
            size={20}
            color={touched && error ? "#FF3B30" : "#B65165"}
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor="#999"
          {...props}
        />
      </View>
      {touched && error && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={16} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
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
