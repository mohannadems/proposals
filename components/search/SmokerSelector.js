import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MultiSelectChips from "./MultiSelectChips";
import COLORS from "../../constants/colors";

const SmokerSelector = ({
  isSmoker,
  onSmokerChange,
  selectedTools,
  onToolsChange,
  smokingTools,
  isFilterDisabled,
  isMaxFiltersSelected,
  validationError,
  labels = {
    title: "Smoking Status",
    smoker: "Smoker",
    nonSmoker: "Non-Smoker",
    selectTools: "Smoking Tools",
    toolsError: "Please select at least one smoking tool",
    clear: "Clear",
    add: "Add smoking preference",
  },
}) => {
  return (
    <View
      style={[styles.container, isFilterDisabled && styles.containerDisabled]}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.label}>{labels.title}</Text>
        {isSmoker !== null && !isFilterDisabled && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              onSmokerChange(null);
              onToolsChange([]);
            }}
          >
            <Text style={styles.clearButtonText}>{labels.clear}</Text>
          </TouchableOpacity>
        )}
      </View>

      {isSmoker !== null ? (
        <>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                isSmoker === true && styles.toggleButtonActive,
              ]}
              onPress={() => onSmokerChange(true)}
            >
              <Text
                style={[
                  styles.toggleText,
                  isSmoker === true && styles.toggleTextActive,
                ]}
              >
                {labels.smoker}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                isSmoker === false && styles.toggleButtonActive,
              ]}
              onPress={() => {
                onSmokerChange(false);
                onToolsChange([]);
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  isSmoker === false && styles.toggleTextActive,
                ]}
              >
                {labels.nonSmoker}
              </Text>
            </TouchableOpacity>
          </View>

          {isSmoker === true && (
            <View
              style={[
                styles.toolsContainer,
                validationError && styles.errorContainer,
              ]}
            >
              <Text
                style={[styles.toolsLabel, validationError && styles.errorText]}
              >
                {labels.selectTools} <Text style={styles.requiredMark}>*</Text>
              </Text>

              <MultiSelectChips
                items={(smokingTools || []).map((item) => ({
                  id: item.id,
                  name: item.name,
                }))}
                selectedItems={selectedTools || []}
                onSelectItem={(items) => {
                  onToolsChange(items);
                }}
                chipStyle={styles.toolChip}
                selectedChipStyle={styles.selectedToolChip}
                chipTextStyle={styles.toolChipText}
                selectedChipTextStyle={styles.selectedToolChipText}
              />

              {validationError && (
                <Text style={styles.errorMessage}>{labels.toolsError}</Text>
              )}
            </View>
          )}
        </>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (isMaxFiltersSelected) return;
            onSmokerChange(true);
          }}
          disabled={isFilterDisabled}
        >
          <Text style={styles.addButtonText}>{labels.add}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  clearButton: {
    backgroundColor: "rgba(74, 111, 161, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clearButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "500",
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderWidth: 1,
    borderColor: "#DDE1E6",
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toggleText: {
    fontSize: 16,
    color: "#666",
  },
  toggleTextActive: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  toolsContainer: {
    marginTop: 8,
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  errorContainer: {
    borderWidth: 1,
    borderColor: "#E53935",
  },
  toolsLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 12,
  },
  errorText: {
    color: "#E53935",
  },
  requiredMark: {
    color: "#E53935",
  },
  toolChip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE1E6",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedToolChip: {
    backgroundColor: "#E7EFF8",
    borderColor: COLORS.primary,
  },
  toolChipText: {
    fontSize: 14,
    color: "#555",
  },
  selectedToolChipText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  errorMessage: {
    color: "#E53935",
    fontSize: 12,
    marginTop: 8,
  },
  addButton: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#A1A1A1",
    borderRadius: 8,
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 16,
  },
});

export default SmokerSelector;
