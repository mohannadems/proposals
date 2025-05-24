import React, { useState, useEffect } from "react";
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
  LinearGradient,
} from "react-native";
import { useController } from "react-hook-form";

const COLORS = {
  primary: "#9e086c",
  secondary: "#5856D6",
  background: "#F8F9FA",
  white: "#FFFFFF",
  text: "#1C1C1E",
  error: "#FF3B30",
  success: "#34C759",
  border: "#E5E5EA",
  primaryGradient: ["#9e086c", "#9e086c"],
};

const SelectableGrid = ({
  none = false,
  noneText = "None of the above",
  noneId = "none",
  control,
  name,
  items,
  multiple = false,
  placeholder = "Select item(s)",
  maxHeight = 300,
  renderSelectedItem,
}) => {
  const {
    field: { value, onChange },
  } = useController({
    control,
    name,
    defaultValue: multiple ? [] : null,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [sortedItems, setSortedItems] = useState([]);
  const screenHeight = Dimensions.get("window").height;
  const dropdownHeight = Math.min(maxHeight, screenHeight * 0.5);

  useEffect(() => {
    if (items && items.length > 0) {
      const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
      setSortedItems(sorted);
    } else {
      setSortedItems([]);
    }
  }, [items]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item) => {
    if (item.id === noneId) {
      if (!multiple) {
        onChange(noneId);
        setIsOpen(false);
        return;
      } else {
        onChange([noneId]);
        setIsOpen(false);
        return;
      }
    }

    if (!multiple) {
      onChange(parseInt(item.id));
      setIsOpen(false);
      return;
    }

    const currentSelections = value || [];

    if (currentSelections.includes(noneId)) {
      onChange([parseInt(item.id)]);
      return;
    }

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

    if (item.id === noneId) {
      return multiple
        ? Array.isArray(value) && value.includes(noneId)
        : value === noneId;
    }

    return multiple
      ? Array.isArray(value) && value.includes(parseInt(item.id))
      : value === parseInt(item.id);
  };

  const getDisplayText = () => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return placeholder;
    }

    if (!multiple && value === noneId) {
      return noneText;
    }

    if (multiple && Array.isArray(value) && value.includes(noneId)) {
      return noneText;
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

    if (value.includes(noneId)) {
      return (
        <View style={styles.selectedItemsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.selectedItemsRow}>
              <View key="selected-none" style={styles.selectedItemChip}>
                <Text style={styles.selectedItemText}>{noneText}</Text>
                <TouchableOpacity
                  onPress={() => handleSelect({ id: noneId, name: noneText })}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      );
    }

    const selectedItemObjects = value
      .map((itemId) => {
        return items.find((i) => parseInt(i.id) === itemId);
      })
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));

    return (
      <View style={styles.selectedItemsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.selectedItemsRow}>
            {selectedItemObjects.map((item) => {
              return (
                <View
                  key={`selected-${item.id}`}
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

  const DropdownButton = ({ children, style, ...props }) => {
    if (LinearGradient) {
      return (
        <TouchableOpacity {...props} style={[styles.gradientWrapper, style]}>
          <LinearGradient
            colors={COLORS.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientContent}
          >
            {children}
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity {...props} style={[styles.dropdownButton, style]}>
        {children}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dropdownButtonText,
            (!value || (Array.isArray(value) && value.length === 0)) &&
              styles.placeholderText,
          ]}
        >
          {getDisplayText()}
        </Text>
        <View style={styles.iconContainer}>
          <Text style={styles.dropdownIcon}>{isOpen ? "▲" : "▼"}</Text>
        </View>
      </TouchableOpacity>

      {renderSelectedItemsPreview()}

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View
                style={[styles.dropdownMenu, { maxHeight: dropdownHeight }]}
              >
                <View style={styles.dropdownHeader}>
                  <Text style={styles.dropdownTitle}>Select Options</Text>
                  {multiple && (
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setIsOpen(false)}
                    >
                      <Text style={styles.closeButtonText}>Done</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <ScrollView nestedScrollEnabled={true} style={styles.itemList}>
                  {sortedItems.map((item) => (
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

                  {/* "None of the above" option */}
                  {none && (
                    <TouchableOpacity
                      key={noneId}
                      style={[
                        styles.dropdownItem,
                        styles.noneOption,
                        isSelected({ id: noneId }) &&
                          styles.selectedDropdownItem,
                      ]}
                      onPress={() =>
                        handleSelect({ id: noneId, name: noneText })
                      }
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          isSelected({ id: noneId }) &&
                            styles.selectedDropdownItemText,
                        ]}
                      >
                        {noneText}
                      </Text>
                      {isSelected({ id: noneId }) && (
                        <View style={styles.checkmarkContainer}>
                          <Text style={styles.checkmark}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                </ScrollView>

                {multiple && (
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
  gradientWrapper: {
    borderRadius: 8,
    overflow: "hidden",
  },
  gradientContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  placeholderText: {
    color: COLORS.text + "80", // Adding 50% opacity
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownIcon: {
    fontSize: 12,
    color: COLORS.primary,
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
    maxHeight: 300,
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
});

export default SelectableGrid;
