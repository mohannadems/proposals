import React, { useState, useContext } from "react";
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
import { LanguageContext } from "../../../../contexts/LanguageContext";
import FeatherIcon from "react-native-vector-icons/Feather";

const FormDatePicker = ({
  name,
  label,
  maximumDate,
  minimumDate,
  required,
  isRTL: propIsRTL,
  t: propT,
  leftIcon,
}) => {
  const { isRTL: contextRTL, t: contextT } = useContext(LanguageContext) || {};
  const _isRTL = propIsRTL !== undefined ? propIsRTL : contextRTL;
  const _t = propT || contextT;

  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [isModalVisible, setModalVisible] = useState(false);
  const [tempDate, setTempDate] = useState(null);
  const selectedDate = watch(name);

  const dynamicStyles = {
    container: {
      marginBottom: 16,
    },
    labelContainer: {
      flexDirection: _isRTL ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
      textAlign: _isRTL ? "right" : "left",
      writingDirection: _isRTL ? "rtl" : "ltr",
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
      flexDirection: _isRTL ? "row-reverse" : "row",
      alignItems: "center",
    },
    dateButtonError: {
      borderColor: COLORS.error,
    },
    iconContainer: {
      marginRight: _isRTL ? 0 : 12,
      marginLeft: _isRTL ? 12 : 0,
    },
    dateText: {
      flex: 1,
      color: COLORS.text,
      fontSize: 16,
      textAlign: _isRTL ? "right" : "left",
      writingDirection: _isRTL ? "rtl" : "ltr",
    },
    placeholderText: {
      color: "#A0A0A0",
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
      flexDirection: _isRTL ? "row-reverse" : "row",
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
      textAlign: _isRTL ? "right" : "left",
      writingDirection: _isRTL ? "rtl" : "ltr",
    },
  };

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
    if (!date) return null;

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthNamesArabic = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];

    if (_isRTL) {
      return `${day} ${monthNamesArabic[month]} ${year}`;
    } else {
      return `${monthNames[month]} ${day}, ${year}`;
    }
  };

  const getPlaceholderText = () => {
    return _t ? _t("common.select_date") : "Select Date";
  };

  const renderDatePicker = () => {
    const currentDate = tempDate || selectedDate || new Date();

    const datePickerProps = {
      mode: "date",
      value: currentDate,
      maximumDate: maximumDate,
      minimumDate: minimumDate,
      onChange: handleDateChange,
      ...(Platform.OS === "android" && { calendar: "gregorian" }),
    };

    if (Platform.OS === "android") {
      return isModalVisible ? (
        <DateTimePicker {...datePickerProps} display="default" />
      ) : null;
    }

    return (
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContent}>
            <DateTimePicker
              {...datePickerProps}
              display="spinner"
              textColor={COLORS.text}
              style={dynamicStyles.datePicker}
              locale="en-US"
            />
            <View style={dynamicStyles.buttonContainer}>
              <TouchableOpacity
                style={[dynamicStyles.button, dynamicStyles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={dynamicStyles.buttonText}>
                  {_t ? _t("common.cancel") : "Cancel"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[dynamicStyles.button, dynamicStyles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={dynamicStyles.buttonText}>
                  {_t ? _t("common.confirm") : "Confirm"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const formattedDate = selectedDate ? formatDate(selectedDate) : null;
  const displayText = formattedDate || getPlaceholderText();

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.labelContainer}>
        <Text style={dynamicStyles.label}>
          {label}
          {required && <Text style={dynamicStyles.required}> *</Text>}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          dynamicStyles.dateButton,
          errors[name] && dynamicStyles.dateButtonError,
        ]}
        onPress={() => setModalVisible(true)}
      >
        {leftIcon && (
          <View style={dynamicStyles.iconContainer}>{leftIcon}</View>
        )}
        <Text
          style={[
            dynamicStyles.dateText,
            !formattedDate && dynamicStyles.placeholderText,
          ]}
        >
          {displayText}
        </Text>
      </TouchableOpacity>

      {renderDatePicker()}

      {errors[name] && (
        <Text style={dynamicStyles.errorText}>
          {_t ? _t("common.date_error") : errors[name].message}
        </Text>
      )}
    </View>
  );
};

export default FormDatePicker;
