// app/components/common/FormDropdown.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { Controller } from "react-hook-form";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const FormDropdown = ({
  control,
  name,
  label,
  items = [],
  placeholder,
  containerStyle,
  required = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const getSelectedItemLabel = (value) => {
    const selectedItem = items.find((item) => item.id === value);
    return selectedItem ? selectedItem.name : "";
  };

  const renderPicker = ({ value, onChange }) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setModalVisible(true)}
        >
          <Text
            style={value ? styles.selectedTextStyle : styles.placeholderStyle}
          >
            {value
              ? getSelectedItemLabel(value)
              : placeholder || `Select ${label}`}
          </Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.grayDark} />
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{label}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      value === item.id && styles.selectedOption,
                    ]}
                    onPress={() => {
                      onChange(item.id);
                      setModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        value === item.id && styles.selectedOptionText,
                      ]}
                    >
                      {item.name}
                    </Text>
                    {value === item.id && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={COLORS.primary}
                      />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: required && "This field is required" }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={[styles.container, containerStyle]}>
          {label && (
            <Text style={styles.label}>
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
          )}

          {renderPicker({ value, onChange })}

          {error && <Text style={styles.errorText}>{error.message}</Text>}
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
  required: {
    color: COLORS.error,
  },
  dropdownButton: {
    height: 48,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  placeholderStyle: {
    fontSize: 16,
    color: COLORS.grayDark,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: COLORS.text,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  selectedOption: {
    backgroundColor: COLORS.grayLight,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});

export default FormDropdown;
