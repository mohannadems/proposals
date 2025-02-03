// app/components/common/SelectableGrid.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";
import { COLORS } from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const SelectableGrid = ({
  control,
  name,
  label,
  items = [],
  multiple = false,
  maxSelect,
  columns = 2,
  required = false,
  renderItem,
}) => {
  const getIcon = (itemName) => {
    const iconMap = {
      Photography: "camera",
      Gardening: "leaf",
      Painting: "color-palette",
      Cycling: "bicycle",
      Hiking: "walk",
      Cat: "paw",
      Dog: "paw",
      Bird: "airplane",
      Fish: "water",
      Other: "apps",
      Cigarettes: "remove-circle",
      Shisha: "water",
      "E-cigarettes": "flash",
    };
    return iconMap[itemName] || "apps";
  };

  const defaultRenderItem = (item, isSelected) => (
    <View style={[styles.item, isSelected && styles.itemSelected]}>
      <Ionicons
        name={getIcon(item.name)}
        size={24}
        color={isSelected ? COLORS.white : COLORS.primary}
      />
      <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
        {item.name}
      </Text>
    </View>
  );

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: required && "This field is required" }}
      render={({
        field: { value = multiple ? [] : null, onChange },
        fieldState: { error },
      }) => {
        const handleSelect = (itemId) => {
          if (multiple) {
            const currentValues = Array.isArray(value) ? value : [];
            if (currentValues.includes(itemId)) {
              onChange(currentValues.filter((id) => id !== itemId));
            } else if (!maxSelect || currentValues.length < maxSelect) {
              onChange([...currentValues, itemId]);
            }
          } else {
            onChange(value === itemId ? null : itemId);
          }
        };

        const isSelected = (itemId) => {
          if (multiple) {
            return Array.isArray(value) && value.includes(itemId);
          }
          return value === itemId;
        };

        return (
          <View style={styles.container}>
            {label && (
              <View style={styles.labelContainer}>
                <Text style={styles.label}>
                  {label}
                  {required && <Text style={styles.required}> *</Text>}
                </Text>
                {maxSelect && (
                  <Text style={styles.maxSelectText}>
                    Select up to {maxSelect}
                  </Text>
                )}
              </View>
            )}

            <View style={[styles.grid, { gap: 12 }]}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.gridItem, { flex: 1 / columns }]}
                  onPress={() => handleSelect(item.id)}
                  activeOpacity={0.7}
                >
                  {renderItem
                    ? renderItem(item, isSelected(item.id))
                    : defaultRenderItem(item, isSelected(item.id))}
                </TouchableOpacity>
              ))}
            </View>

            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  required: {
    color: COLORS.error,
  },
  maxSelectText: {
    fontSize: 12,
    color: COLORS.grayDark,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    marginBottom: 12,
  },
  item: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 100,
  },
  itemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  itemText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: COLORS.text,
    fontWeight: "500",
  },
  itemTextSelected: {
    color: COLORS.white,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default SelectableGrid;
