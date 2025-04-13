import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const SearchActionButtons = ({
  t,
  loading,
  hasSmokingError,
  selectedFiltersCount,
  handleSearch,
  handleReset,
}) => {
  return (
    <View style={styles.searchButtonContainer}>
      <TouchableOpacity
        style={[
          styles.searchButton,
          selectedFiltersCount === 0 && styles.searchButtonDisabled,
          hasSmokingError && styles.searchButtonDisabled,
        ]}
        onPress={handleSearch}
        disabled={selectedFiltersCount === 0 || hasSmokingError || loading}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            <Ionicons name="search" size={20} color="white" />
            <Text style={styles.searchButtonText}>
              {t ? t("search.buttons.search") : "Find Matches"}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {selectedFiltersCount > 0 && !loading && (
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>
            {t ? t("search.buttons.reset") : "Reset All Filters"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchButtonContainer: {
    marginTop: 20,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  searchButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  resetButton: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 12,
  },
  resetButtonText: {
    color: COLORS.error,
    fontSize: 16,
  },
});

export default SearchActionButtons;
