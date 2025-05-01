import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";

const FilterProgressTracker = ({
  selectedFiltersCount,
  maxFilters,
  scrollY,
  isRTL,
  // Add internationalization props
  labels = {
    match: "Match",
    perfectMatch: "Perfect Match!",
    youHaveSelected: "You have selected",
    filters: "filters",
    maxFiltersMessage:
      "Maximum filters selected! You'll get the most accurate matches.",
  },
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  // Calculate match percentage
  const matchPercentage = Math.min(
    Math.round((selectedFiltersCount / maxFilters) * 100),
    100
  );
  const isMaxFiltersSelected = selectedFiltersCount >= maxFilters;

  // Animate on scroll
  useEffect(() => {
    if (!scrollY) return;

    const scrollListener = scrollY.addListener(({ value }) => {
      const fadeThreshold = 1;
      const fadeDuration = 40;
      const opacity = Math.max(0, 1 - (value - fadeThreshold) / fadeDuration);
      const translateY = Math.min(30, value / 1.5);

      fadeAnim.setValue(opacity);
      translateAnim.setValue(translateY);
    });

    return () => {
      scrollY.removeListener(scrollListener);
    };
  }, [scrollY, fadeAnim, translateAnim]);

  // Create RTL-aware styles
  const rtlStyles = {
    infoContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    infoIconContainer: {
      [isRTL ? "marginLeft" : "marginRight"]: 12,
    },
    statusContainer: {
      textAlign: isRTL ? "right" : "left",
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.trackContainer}>
        <View style={styles.statusContainer}>
          <Text style={styles.percentageText}>
            <Text style={matchPercentage === 100 ? styles.perfectMatch : null}>
              {matchPercentage}%
            </Text>
            {matchPercentage === 100
              ? ` ${labels.perfectMatch}`
              : ` ${labels.match}`}
          </Text>

          <Text style={styles.filterCountText}>
            <Text>{labels.youHaveSelected} </Text>
            <Text style={styles.highlightText}>
              {selectedFiltersCount} / {maxFilters}
            </Text>
            <Text> {labels.filters}</Text>
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressFill,
              isMaxFiltersSelected && styles.progressFillComplete,
              { width: `${(selectedFiltersCount / maxFilters) * 100}%` },
            ]}
          />
        </View>

        {isMaxFiltersSelected && (
          <View style={[styles.infoContainer, rtlStyles.infoContainer]}>
            <View
              style={[styles.infoIconContainer, rtlStyles.infoIconContainer]}
            >
              <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
            </View>
            <Text style={styles.infoText}>{labels.maxFiltersMessage}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "transparent",
  },
  trackContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statusContainer: {
    marginBottom: 12,
  },
  percentageText: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: COLORS.primary,
    marginBottom: 4,
  },
  perfectMatch: {
    color: "#4CAF50",
    fontWeight: "800",
  },
  filterCountText: {
    fontSize: 15,
    textAlign: "center",
    color: "#555",
    fontWeight: "400",
  },
  highlightText: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressFillComplete: {
    backgroundColor: "#4CAF50",
  },
  infoContainer: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 8,
    padding: 12,
  },
  infoIconContainer: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#4CAF50",
    lineHeight: 20,
  },
});

export default FilterProgressTracker;
