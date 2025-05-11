// SearchActionButtons.js - Enhanced RTL implementation
import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { LanguageContext } from "../../contexts/LanguageContext"; // Update path if needed

const SearchActionButtons = ({
  loading,
  hasSmokingError,
  selectedFiltersCount,
  handleSearch,
  handleReset,
  // Add internationalization props
  searchText = "Find Matches",
  resetText = "Reset All Filters",
  infoText = "Select filters to find your perfect match. You can select up to 10 filters.",
  errorText = "Please select at least one smoking tool.",
  horizontal = false, // Add new prop for horizontal layout
}) => {
  const { isRTL } = useContext(LanguageContext);

  const isSearchDisabled =
    selectedFiltersCount === 0 || hasSmokingError || loading;

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
      alignItems: "flex-start",
    },
    contentAlignment: {
      textAlign: isRTL ? "right" : "left",
    },
    buttonRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    resetButtonText: {
      color: "#E53935",
      fontSize: isRTL ? 13 : 16,
      fontWeight: "500",
      flexShrink: 1,
    },
    resetButtonHorizontal: {
      flex: isRTL ? 1.5 : 1,
      borderWidth: 1,
      borderColor: "#E53935",
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: isRTL ? 16 : 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFFFFF",
    },
    searchButtonSmaller: {
      flex: isRTL ? 1.5 : 2,
    },
  };

  if (horizontal) {
    return (
      <View style={styles.containerHorizontal}>
        {hasSmokingError && (
          <View style={[styles.errorBox, rtlStyles.infoBox, styles.fullWidth]}>
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

        {selectedFiltersCount === 0 && (
          <View style={[styles.infoBox, rtlStyles.infoBox, styles.fullWidth]}>
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

        <View style={rtlStyles.buttonRow}>
          {selectedFiltersCount > 0 && (
            <TouchableOpacity
              style={[
                rtlStyles.resetButtonHorizontal, // Use rtlStyles instead of styles
                isRTL
                  ? { marginLeft: 8, marginRight: 0 }
                  : { marginRight: 8, marginLeft: 0 },
              ]}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <View
                style={[rtlStyles.buttonContainer, { alignItems: "center" }]}
              >
                <Ionicons
                  name="refresh-outline"
                  size={16}
                  color="#E53935"
                  style={rtlStyles.iconMargin}
                />
                <Text
                  style={rtlStyles.resetButtonText} // Use rtlStyles
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {resetText}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.searchButtonHorizontal,
              selectedFiltersCount > 0
                ? rtlStyles.searchButtonSmaller // Use rtlStyles
                : styles.searchButtonFull,
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
                <Text
                  style={[styles.searchButtonText, rtlStyles.contentAlignment]}
                >
                  {searchText}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Original vertical layout
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
            <Text style={[styles.searchButtonText, rtlStyles.contentAlignment]}>
              {searchText}
            </Text>
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
            <Text style={[styles.resetButtonText, rtlStyles.contentAlignment]}>
              {resetText}
            </Text>
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
  containerHorizontal: {
    width: "100%",
  },
  fullWidth: {
    width: "100%",
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
  searchButtonHorizontal: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
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
  searchButtonFull: {
    flex: 1,
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
  // Remove resetButtonHorizontal from here
  // Remove resetButtonText from here
  infoBox: {
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
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
    marginTop: 8,
    marginBottom: 8,
  },
  errorText: {
    flex: 1,
    color: "#E53935",
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SearchActionButtons;
