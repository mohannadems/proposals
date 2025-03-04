// app/components/common/FormDropdown.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
  ActivityIndicator,
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
  isLoading = false,
  leftIcon,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownItems, setDropdownItems] = useState([]);

  // Update dropdown items when items prop changes
  useEffect(() => {
    if (items && Array.isArray(items)) {
      setDropdownItems(items);
    }
  }, [items]);

  const getSelectedItemLabel = (value) => {
    const selectedItem = dropdownItems.find((item) => item.id === value);
    return selectedItem ? selectedItem.name || selectedItem.budget || "" : "";
  };

  const renderPicker = ({ value, onChange }) => {
    return (
      <View>
        <TouchableOpacity
          style={[styles.dropdownButton, isLoading && styles.disabledDropdown]}
          onPress={() => !isLoading && setModalVisible(true)}
          disabled={isLoading}
        >
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

          <Text
            style={[
              value ? styles.selectedTextStyle : styles.placeholderStyle,
              { flex: 1 },
            ]}
            numberOfLines={1}
          >
            {value
              ? getSelectedItemLabel(value)
              : placeholder || `Select ${label}`}
          </Text>

          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Ionicons name="chevron-down" size={20} color={COLORS.grayDark} />
          )}
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

              {dropdownItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No options available</Text>
                </View>
              ) : (
                <FlatList
                  data={dropdownItems}
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
                        {item.name || item.budget || ""}
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
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                />
              )}
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
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                {label}
                {required && <Text style={styles.required}> *</Text>}
              </Text>
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color={COLORS.primary}
                  style={styles.labelLoader}
                />
              )}
            </View>
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
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    flex: 1,
  },
  labelLoader: {
    marginLeft: 8,
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
  iconContainer: {
    marginRight: 10,
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
  disabledDropdown: {
    backgroundColor: COLORS.grayLight,
    opacity: 0.7,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.grayDark,
    textAlign: "center",
  },
});

export default FormDropdown;
