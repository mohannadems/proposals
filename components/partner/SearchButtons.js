import React, { memo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import styles from "../../styles/SearchScreen";

const SearchButtons = ({
  isLoading,
  isDisabled,
  completedSections,
  hasSearched,
  onSearch,
  onReset,
  onViewResults,
}) => {
  return (
    <View style={styles.searchButtonContainer}>
      <TouchableOpacity
        style={[styles.searchButton, isDisabled && styles.disabledSearchButton]}
        onPress={onSearch}
        disabled={isDisabled || isLoading}
        accessibilityRole="button"
        accessibilityLabel="Find matches"
        accessibilityState={{ disabled: isDisabled || isLoading }}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <>
            <Ionicons
              name="search"
              size={20}
              color={COLORS.white}
              style={styles.searchIcon}
            />
            <Text style={styles.searchButtonText}>
              Find Matches ({completedSections}/4 completed)
            </Text>
          </>
        )}
      </TouchableOpacity>

      {hasSearched && (
        <TouchableOpacity
          style={styles.viewResultsButton}
          onPress={onViewResults}
          accessibilityRole="button"
          accessibilityLabel="View previous results"
        >
          <Text style={styles.viewResultsText}>View Previous Results</Text>
        </TouchableOpacity>
      )}

      {!isDisabled && (
        <TouchableOpacity
          style={styles.resetFiltersButton}
          onPress={onReset}
          accessibilityRole="button"
          accessibilityLabel="Reset all filters"
        >
          <Text style={styles.resetFiltersText}>Reset All Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(SearchButtons);
