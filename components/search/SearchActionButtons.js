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
}) => {
  const isSearchDisabled =
    selectedFiltersCount === 0 || hasSmokingError || loading;

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
          <>
            <Ionicons
              name="search"
              size={20}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.searchButtonText}>Find Matches</Text>
          </>
        )}
      </TouchableOpacity>

      {selectedFiltersCount > 0 && !loading && (
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Ionicons
            name="refresh-outline"
            size={16}
            color="#E53935"
            style={styles.resetIcon}
          />
          <Text style={styles.resetButtonText}>Reset All Filters</Text>
        </TouchableOpacity>
      )}

      {selectedFiltersCount === 0 && (
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#666"
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>
            Select filters to find your perfect match. You can select up to 10
            filters.
          </Text>
        </View>
      )}

      {hasSmokingError && (
        <View style={styles.errorBox}>
          <Ionicons
            name="alert-circle-outline"
            size={16}
            color="#E53935"
            style={styles.errorIcon}
          />
          <Text style={styles.errorText}>
            Please select at least one smoking tool.
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
    flexDirection: "row",
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
  buttonIcon: {
    marginRight: 8,
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
    flexDirection: "row",
    justifyContent: "center",
  },
  resetIcon: {
    marginRight: 6,
  },
  resetButtonText: {
    color: "#E53935",
    fontSize: 16,
    fontWeight: "500",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(229, 57, 53, 0.08)",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  errorIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  errorText: {
    flex: 1,
    color: "#E53935",
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SearchActionButtons;
