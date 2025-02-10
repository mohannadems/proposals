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
import { COLORS } from "../../../../constants/colors";
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
  const [tempDate, setTempDate] = useState(null);
  const selectedDate = watch(name);

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setModalVisible(false);
      if (selectedDate) {
        setValue(name, selectedDate, { shouldValidate: true });
      }
    } else {
      setTempDate(selectedDate);
    }
  };

  const handleConfirm = () => {
    if (tempDate) {
      setValue(name, tempDate, { shouldValidate: true });
    }
    setModalVisible(false);
    setTempDate(null);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setTempDate(null);
  };

  const formatDate = (date) => {
    if (!date) return "Select Date";

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return Platform.OS === "android"
      ? date.toLocaleDateString("en-US", options)
      : date.toLocaleDateString(undefined, options);
  };

  const renderDatePicker = () => {
    const currentDate = tempDate || selectedDate || new Date();

    if (Platform.OS === "android") {
      return isModalVisible ? (
        <DateTimePicker
          mode="date"
          display="default"
          value={currentDate}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={handleDateChange}
        />
      ) : null;
    }

    return (
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <DateTimePicker
              mode="date"
              display="spinner"
              value={currentDate}
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              onChange={handleDateChange}
              textColor={COLORS.text}
              style={styles.datePicker}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <TouchableOpacity
        style={[styles.dateButton, errors[name] && styles.dateButtonError]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dateText}>
          {selectedDate ? formatDate(selectedDate) : "Select Date"}
        </Text>
      </TouchableOpacity>

      {renderDatePicker()}

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
  dateButtonError: {
    borderColor: COLORS.error,
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
    backgroundColor: Platform.OS === "ios" ? COLORS.background : COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  datePicker: {
    width: "100%",
    height: 200,
    backgroundColor: Platform.OS === "ios" ? COLORS.background : COLORS.white,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.border,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 8,
  },
});

export default FormDatePicker;
