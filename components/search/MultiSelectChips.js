// MultiSelectChips.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MultiSelectChips = ({
  items = [],
  selectedItems = [],
  onSelectItem,
  disabled = false,
  isRTL = false,
  chipStyle,
  selectedChipStyle,
  chipTextStyle,
  selectedChipTextStyle,
}) => {
  // Toggle selection of an item
  const toggleSelection = (id) => {
    const isSelected = selectedItems.includes(id);
    let newSelectedItems;

    if (isSelected) {
      // Remove item if already selected
      newSelectedItems = selectedItems.filter((itemId) => itemId !== id);
    } else {
      // Add item if not selected
      newSelectedItems = [...selectedItems, id];
    }

    onSelectItem(newSelectedItems);
  };

  // Check if an item is selected
  const isSelected = (id) => {
    return selectedItems.includes(id);
  };

  return (
    <View style={[styles.container, disabled && styles.containerDisabled]}>
      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.chipsContainer}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.chip,
                chipStyle,
                isSelected(item.id) && styles.selectedChip,
                isSelected(item.id) && selectedChipStyle,
                disabled && styles.disabledChip,
              ]}
              onPress={() => !disabled && toggleSelection(item.id)}
              activeOpacity={disabled ? 1 : 0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  chipTextStyle,
                  isSelected(item.id) && styles.selectedChipText,
                  isSelected(item.id) && selectedChipTextStyle,
                  disabled && styles.disabledChipText,
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>

              {isSelected(item.id) && (
                <View style={styles.checkContainer}>
                  <Ionicons name="checkmark-circle" size={16} color="#4A6FA1" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    maxHeight: 160,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE1E6",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: "#E7EFF8",
    borderColor: "#4A6FA1",
  },
  disabledChip: {
    backgroundColor: "#F5F7FA",
    borderColor: "#E5E5E5",
  },
  chipText: {
    fontSize: 14,
    color: "#555",
  },
  selectedChipText: {
    color: "#4A6FA1",
    fontWeight: "500",
  },
  disabledChipText: {
    color: "#A1A1A1",
  },
  checkContainer: {
    marginLeft: 4,
  },
});

export default MultiSelectChips;
