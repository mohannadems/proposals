import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function SelectInput({
  label,
  value,
  options,
  onChange,
  error,
  touched,
  placeholder = "Select an option",
  searchable = false,
  multiple = false,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedOption = multiple
    ? options.filter((option) => value?.includes(option.value))
    : options.find((option) => option.value === value);

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleSelect = (option) => {
    if (multiple) {
      const newValue = value?.includes(option.value)
        ? value.filter((v) => v !== option.value)
        : [...(value || []), option.value];
      onChange(newValue);
    } else {
      onChange(option.value);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.selectButton, touched && error && styles.errorBorder]}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons
          name={multiple ? "check-box" : "arrow-drop-down"}
          size={24}
          color="#B65165"
        />
        <Text
          style={[
            styles.selectButtonText,
            !selectedOption && styles.placeholder,
          ]}
        >
          {multiple
            ? selectedOption?.map((opt) => opt.label).join(", ") || placeholder
            : selectedOption?.label || placeholder}
        </Text>
      </TouchableOpacity>

      {touched && error && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={16} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {searchable && (
              <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color="#666" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCorrect={false}
                />
              </View>
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    multiple &&
                      value?.includes(item.value) &&
                      styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                  {(multiple
                    ? value?.includes(item.value)
                    : value === item.value) && (
                    <MaterialIcons name="check" size={20} color="#B65165" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
    color: COLORS.text,
  },
  selectButton: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
  },
  selectButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },
  placeholderText: {
    color: COLORS.text + "80",
  },
  errorBorder: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedOption: {
    backgroundColor: COLORS.primary + "10",
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
});
