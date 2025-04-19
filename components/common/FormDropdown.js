import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useController } from "react-hook-form";
import { COLORS } from "../../constants/colors";

const FormDropdown = ({
  control,
  name,
  items = [],
  multiple = false,
  placeholder = "Select item(s)",
  maxHeight = 300,
  renderSelectedItem,
  label,
  leftIcon,
  required = false,
  containerStyle,
  isLoading = false,
  placeholderTextColor,
  ...props
}) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    control,
    name,
    defaultValue: multiple ? [] : null,
  });

  const [isOpen, setIsOpen] = useState(false);
  const screenHeight = Dimensions.get("window").height;
  const dropdownHeight = Math.min(maxHeight, screenHeight * 0.5);

  const toggleDropdown = () => {
    if (!isLoading) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (item) => {
    if (!multiple) {
      onChange(parseInt(item.id));
      setIsOpen(false);
      return;
    }

    const currentSelections = value || [];

    if (currentSelections.includes(parseInt(item.id))) {
      onChange(currentSelections.filter((id) => id !== parseInt(item.id)));
    } else {
      onChange([...currentSelections, parseInt(item.id)]);
    }
  };

  const handleClearAll = () => {
    onChange(multiple ? [] : null);
  };

  const isSelected = (item) => {
    if (!value) return false;
    return multiple
      ? value.includes(parseInt(item.id))
      : value === parseInt(item.id);
  };

  const getDisplayText = () => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return placeholder;
    }

    if (!multiple) {
      const selectedItem = items.find((item) => parseInt(item.id) === value);
      return selectedItem ? selectedItem.name : placeholder;
    }

    if (value.length === 1) {
      const selectedItem = items.find((item) => parseInt(item.id) === value[0]);
      return selectedItem ? selectedItem.name : placeholder;
    }

    return `${value.length} items selected`;
  };

  const renderSelectedItemsPreview = () => {
    if (!multiple || !value || value.length === 0) return null;

    return (
      <View style={styles.selectedItemsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.selectedItemsRow}>
            {value.map((itemId) => {
              const item = items.find((i) => parseInt(i.id) === itemId);
              if (!item) return null;
              return (
                <View
                  key={`selected-${itemId}`}
                  style={styles.selectedItemChip}
                >
                  {renderSelectedItem ? (
                    renderSelectedItem(item)
                  ) : (
                    <Text style={styles.selectedItemText}>{item.name}</Text>
                  )}
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.requiredStar}> *</Text>}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.dropdownButton, error && styles.errorBorder]}
        onPress={toggleDropdown}
        activeOpacity={0.7}
        {...props}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <Text
          style={[
            styles.dropdownButtonText,
            (!value || (Array.isArray(value) && value.length === 0)) && {
              color: placeholderTextColor || COLORS.text + "80",
            },
          ]}
        >
          {getDisplayText()}
        </Text>

        {isLoading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <View style={styles.iconContainer}>
            <Text style={styles.dropdownIcon}>{isOpen ? "▲" : "▼"}</Text>
          </View>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error.message}</Text>}

      {renderSelectedItemsPreview()}

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View
                style={[styles.dropdownMenu, { maxHeight: dropdownHeight }]}
              >
                <View style={styles.dropdownHeader}>
                  <Text style={styles.dropdownTitle}>
                    Select {label || "Options"}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setIsOpen(false)}
                  >
                    <Text style={styles.closeButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>

                {items.length > 0 ? (
                  <ScrollView
                    nestedScrollEnabled={true}
                    style={styles.itemList}
                  >
                    {items.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.dropdownItem,
                          isSelected(item) && styles.selectedDropdownItem,
                        ]}
                        onPress={() => handleSelect(item)}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            isSelected(item) && styles.selectedDropdownItemText,
                          ]}
                        >
                          {item.name}
                        </Text>
                        {isSelected(item) && (
                          <View style={styles.checkmarkContainer}>
                            <Text style={styles.checkmark}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No items available</Text>
                  </View>
                )}

                {multiple && items.length > 0 && (
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={handleClearAll}
                    >
                      <Text style={styles.clearButtonText}>Clear All</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 1,
    marginBottom: 15,
  },
  labelContainer: {
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  requiredStar: {
    color: COLORS.error,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  errorBorder: {
    borderColor: COLORS.error,
  },
  leftIconContainer: {
    marginRight: 10,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  dropdownIcon: {
    fontSize: 12,
    color: COLORS.primary,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 15,
  },
  dropdownMenu: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  closeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  itemList: {
    maxHeight: 250,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + "30",
  },
  selectedDropdownItem: {
    backgroundColor: COLORS.primary + "10",
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedDropdownItemText: {
    fontWeight: "500",
    color: COLORS.primary,
  },
  checkmarkContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: COLORS.white,
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  clearButtonText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: "600",
  },
  selectedItemsContainer: {
    marginTop: 10,
  },
  selectedItemsRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  selectedItemChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary + "15",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
  },
  selectedItemText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  removeButton: {
    marginLeft: 6,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: COLORS.text + "70",
    fontSize: 16,
  },
});

export default FormDropdown;
