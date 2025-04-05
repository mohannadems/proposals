import React, { memo, useContext } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import createHomeStyles from "../../styles/SearchScreen";
import { LanguageContext } from "../../contexts/LanguageContext";

const SearchButtons = ({
  isLoading,
  isDisabled,
  completedSections,
  hasSearched,
  onSearch,
  onReset,
  onViewResults,
}) => {
  const { t, isRTL } = useContext(LanguageContext);
  const styles = createHomeStyles(isRTL);

  return (
    <View style={styles.searchButtonContainer}>
      <TouchableOpacity
        style={[styles.searchButton, isDisabled && styles.disabledSearchButton]}
        onPress={onSearch}
        disabled={isDisabled || isLoading}
        accessibilityRole="button"
        accessibilityLabel={
          t ? t("search.buttons.find_matches_accessibility") : "Find matches"
        }
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
              {t
                ? t("search.buttons.find_matches", {
                    completed: completedSections,
                  })
                : `Find Matches (${completedSections}/4 completed)`}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {hasSearched && (
        <TouchableOpacity
          style={styles.viewResultsButton}
          onPress={onViewResults}
          accessibilityRole="button"
          accessibilityLabel={
            t
              ? t("search.buttons.view_results_accessibility")
              : "View previous results"
          }
        >
          <Text style={styles.viewResultsText}>
            {t ? t("search.buttons.view_results") : "View Previous Results"}
          </Text>
        </TouchableOpacity>
      )}

      {!isDisabled && (
        <TouchableOpacity
          style={styles.resetFiltersButton}
          onPress={onReset}
          accessibilityRole="button"
          accessibilityLabel={
            t
              ? t("search.buttons.reset_filters_accessibility")
              : "Reset all filters"
          }
        >
          <Text style={styles.resetFiltersText}>
            {t ? t("search.buttons.reset_filters") : "Reset All Filters"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(SearchButtons);
