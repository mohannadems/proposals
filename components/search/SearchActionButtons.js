// SearchActionButtons.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";

const SearchActionButtons = ({
  loading,
  hasSmokingError,
  selectedFiltersCount,
  handleSearch,
  handleReset,
  isRTL = false,
  // Add internationalization props
  searchText = "Find Matches",
  resetText = "Reset All Filters",
  infoText = "Select filters to find your perfect match. You can select up to 10 filters.",
  errorText = "Please select at least one smoking tool.",
}) => {
  const isSearchDisabled =
    selectedFiltersCount === 0 || hasSmokingError || loading;

  // Create RTL-aware styles
  const rtlStyles = {
    buttonContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    iconMargin: {
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
    },
    infoBox: {
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    contentAlignment: {
      textAlign: isRTL ? "right" : "left",
    },
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.searchButton,
          isSearchDisabled && styles.searchButtonDisabled,
        ]}
        onPress={handleSearch}
        disabled={isSearchDisabled}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <View style={rtlStyles.buttonContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#FFFFFF"
              style={rtlStyles.iconMargin}
            />
            <Text style={styles.searchButtonText}>{searchText}</Text>
          </View>
        )}
      </TouchableOpacity>

      {selectedFiltersCount > 0 && !loading && (
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <View style={rtlStyles.buttonContainer}>
            <Ionicons
              name="refresh-outline"
              size={16}
              color="#E53935"
              style={rtlStyles.iconMargin}
            />
            <Text style={styles.resetButtonText}>{resetText}</Text>
          </View>
        </TouchableOpacity>
      )}

      {selectedFiltersCount === 0 && (
        <View style={[styles.infoBox, rtlStyles.infoBox]}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#666"
            style={rtlStyles.iconMargin}
          />
          <Text style={[styles.infoText, rtlStyles.contentAlignment]}>
            {infoText}
          </Text>
        </View>
      )}

      {hasSmokingError && (
        <View style={[styles.errorBox, rtlStyles.infoBox]}>
          <Ionicons
            name="alert-circle-outline"
            size={16}
            color="#E53935"
            style={rtlStyles.iconMargin}
          />
          <Text style={[styles.errorText, rtlStyles.contentAlignment]}>
            {errorText}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonDisabled: {
    backgroundColor: "#A1A1A1",
    shadowOpacity: 0,
    elevation: 0,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resetButton: {
    marginTop: 16,
    alignItems: "center",
    paddingVertical: 12,
    justifyContent: "center",
  },
  resetButtonText: {
    color: "#E53935",
    fontSize: 16,
    fontWeight: "500",
  },
  infoBox: {
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  infoText: {
    flex: 1,
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
  },
  errorBox: {
    alignItems: "flex-start",
    backgroundColor: "rgba(229, 57, 53, 0.08)",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    flex: 1,
    color: "#E53935",
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SearchActionButtons;
