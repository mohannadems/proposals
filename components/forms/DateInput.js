// components/forms/DateInput.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";

export default function DateInput({
  label,
  value,
  onChange,
  error,
  touched,
  placeholder = "Select date",
  maximumDate = new Date(),
  minimumDate = new Date(1940, 0, 1),
}) {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    onChange(date);
    hideDatePicker();
  };

  const formattedDate = value ? format(new Date(value), "MMMM dd, yyyy") : "";

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={showDatePicker}
        style={[styles.inputContainer, touched && error && styles.errorInput]}
      >
        <MaterialIcons
          name="calendar-today"
          size={20}
          color={touched && error ? "#FF3B30" : "#B65165"}
          style={styles.icon}
        />
        <Text style={[styles.valueText, !value && styles.placeholderText]}>
          {formattedDate || placeholder}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#B65165" />
      </TouchableOpacity>

      {touched && error && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={16} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        date={value ? new Date(value) : new Date(2000, 0, 1)}
      />
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
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  errorInput: {
    borderColor: "#FF3B30",
  },
  icon: {
    marginRight: 8,
  },
  valueText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
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
