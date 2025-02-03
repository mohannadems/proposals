import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS } from "../../../constants/colors";
import { useFormContext } from "react-hook-form";

const FormDatePicker = ({
  control,
  name,
  label,
  maximumDate,
  minimumDate,
  required,
}) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [isModalVisible, setModalVisible] = useState(false);
  const selectedDate = watch(name);

  const handleDateChange = (event, selectedDate) => {
    setModalVisible(false);
    if (selectedDate) {
      setValue(name, selectedDate, { shouldValidate: true });
    }
  };

  const formatDate = (date) => {
    return date
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Select Date";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dateText}>
          {selectedDate ? formatDate(selectedDate) : "Select Date"}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {Platform.OS === "ios" ? (
              <DateTimePicker
                mode="date"
                display="inline"
                textColor={COLORS.text}
                value={selectedDate || new Date()}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                onChange={handleDateChange}
                style={styles.datePicker}
              />
            ) : (
              <DateTimePicker
                mode="date"
                display="default"
                value={selectedDate || new Date()}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                onChange={handleDateChange}
                textColor={COLORS.text}
                style={styles.androidDatePicker}
              />
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {errors[name] && (
        <Text style={styles.errorText}>{errors[name].message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  required: {
    color: COLORS.error,
  },
  dateButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateText: {
    color: COLORS.text,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  datePicker: {
    borderRadius: 16,

    width: "100%",
    backgroundColor: COLORS.white,
    backgroundColor: "rgba(0,0,0,0.5)",
    backfaceVisibility: "hidden",
  },
  androidDatePicker: {
    width: "100%",
    backgroundColor: COLORS.white,
    color: COLORS.text,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 8,
  },
});

export default FormDatePicker;
