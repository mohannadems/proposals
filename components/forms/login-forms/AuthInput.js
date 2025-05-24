import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const AuthInput = ({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  leftIcon,
  isRTL,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}>
        {label}
      </Text>
      <View
        style={[
          styles.inputContainer,
          touched && error ? styles.inputError : null,
          isRTL && { flexDirection: "row-reverse" },
        ]}
      >
        {leftIcon && (
          <MaterialIcons
            name={leftIcon}
            size={20}
            color="#666"
            style={[
              styles.icon,
              isRTL
                ? { marginRight: 12, marginLeft: 0 }
                : { marginLeft: 12, marginRight: 0 },
            ]}
          />
        )}
        <TextInput
          style={[
            styles.input,
            {
              textAlign: isRTL ? "right" : "left",
              paddingLeft: isRTL ? 12 : leftIcon ? 8 : 12,
              paddingRight: isRTL ? (leftIcon ? 8 : 12) : 12,
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType || "default"}
          autoCapitalize={autoCapitalize || "sentences"}
          textAlign={isRTL ? "right" : "left"}
          writingDirection={isRTL ? "rtl" : "ltr"}
        />
      </View>
      {touched && error ? (
        <View
          style={[
            styles.errorContainer,
            isRTL ? { flexDirection: "row-reverse" } : { flexDirection: "row" },
          ]}
        >
          <MaterialIcons
            name="error-outline"
            size={16}
            color="#FF3B30"
            style={isRTL ? { marginLeft: 4 } : { marginRight: 4 }}
          />
          <Text
            style={[
              styles.errorText,
              {
                textAlign: isRTL ? "right" : "left",
                color: "#FF3B30",
                fontSize: 14,
              },
            ]}
          >
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  icon: {},
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
  },
  errorContainer: {
    alignItems: "center",
    marginTop: 4,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
  },
});

export default AuthInput;
