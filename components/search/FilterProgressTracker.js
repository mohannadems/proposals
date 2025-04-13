import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const FilterProgressTracker = ({
  t,
  selectedFiltersCount,
  maxFilters,
  matchPercentage,
  isMaxFiltersSelected,
  scrollY,
  styles: propStyles,
  isRTL,
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(1)).current;

  const shouldShowInfoMessage =
    selectedFiltersCount > 0 && selectedFiltersCount < maxFilters;

  useEffect(() => {
    if (!scrollY) return;

    const scrollListener = scrollY.addListener(({ value }) => {
      const fadeThreshold = 1;
      const fadeDuration = 40;
      const opacity = Math.max(0, 1 - (value - fadeThreshold) / fadeDuration);

      const translateY = Math.min(30, value / 1.5);

      const heightScale = Math.max(
        0,
        1 - (value - fadeThreshold) / (fadeDuration - 10)
      );

      fadeAnim.setValue(opacity);
      translateAnim.setValue(translateY);
      heightAnim.setValue(heightScale);
    });

    return () => {
      scrollY.removeListener(scrollListener);
    };
  }, [scrollY, fadeAnim, translateAnim, heightAnim]);

  const combinedStyles = {
    ...styles,
    ...(propStyles || {}),
  };

  return (
    <>
      <View style={combinedStyles.filterCountContainer}>
        <Text style={combinedStyles.matchPercentage}>
          <Text
            style={matchPercentage === 100 ? combinedStyles.perfectMatch : null}
          >
            {matchPercentage}%
          </Text>
          {matchPercentage === 100
            ? ` ${t ? t("search.perfect_match") : "Perfect Match!"}`
            : ` ${t ? t("search.match") : "Match"}`}
        </Text>

        <Text style={combinedStyles.filterCountText}>
          {t
            ? t("search.unified.filter_count", {
                count: selectedFiltersCount,
                max: maxFilters,
              })
            : `You have selected `}
          <Text style={combinedStyles.filterCountHighlight}>
            {selectedFiltersCount} / {maxFilters}
          </Text>
          {t ? "" : ` filters`}
        </Text>

        <View style={combinedStyles.filterProgressBar}>
          <View
            style={[
              combinedStyles.filterProgressFill,
              isMaxFiltersSelected && combinedStyles.filterMaxReached,
              { width: `${(selectedFiltersCount / maxFilters) * 100}%` },
            ]}
          />
        </View>
      </View>

      {shouldShowInfoMessage && (
        <Animated.View
          style={[
            combinedStyles.maxFiltersInfoBox,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: translateAnim,
                },
              ],
              maxHeight: heightAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 120],
              }),
              transform: [
                { translateY: translateAnim },
                {
                  scale: heightAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
              // Adjust padding and margin based on the animation progress
              paddingTop: heightAnim.interpolate({
                inputRange: [0, 0.3, 1],
                outputRange: [0, 5, 18],
              }),
              paddingBottom: heightAnim.interpolate({
                inputRange: [0, 0.3, 1],
                outputRange: [0, 5, 18],
              }),
              paddingHorizontal: heightAnim.interpolate({
                inputRange: [0, 0.3, 1],
                outputRange: [0, 10, 18],
              }),
              marginBottom: heightAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 10],
              }),
              flexDirection: isRTL ? "row-reverse" : "row",
              borderLeftWidth: isRTL ? 0 : 3,
              borderRightWidth: isRTL ? 3 : 0,
              borderLeftColor: COLORS.primary,
              borderRightColor: COLORS.primary,
              overflow: "hidden",
            },
          ]}
        >
          <Animated.View
            style={{
              marginRight: isRTL ? 0 : 12,
              marginLeft: isRTL ? 12 : 0,
              opacity: fadeAnim,
            }}
          >
            <View style={combinedStyles.iconContainer}>
              <Ionicons
                name="information-circle"
                size={24}
                color={COLORS.primary}
              />
            </View>
          </Animated.View>

          <Animated.View
            style={{
              flex: 1,
              opacity: fadeAnim.interpolate({
                inputRange: [0, 0.7, 1],
                outputRange: [0, 0.8, 1],
              }),
            }}
          >
            <Text
              style={[
                combinedStyles.maxFiltersTitle,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {t ? t("search.filter_message.title") : "Perfect Match Guide"}
            </Text>

            <Text
              style={[
                combinedStyles.maxFiltersInfoText,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {t
                ? t("search.filter_message.content", {
                    current: selectedFiltersCount,
                    max: maxFilters,
                    remaining: maxFilters - selectedFiltersCount,
                  })
                : `Select ${
                    maxFilters - selectedFiltersCount
                  } more filters to achieve a 100% perfect match!`}
            </Text>
          </Animated.View>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  filterCountContainer: {
    backgroundColor: COLORS.background,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    zIndex: 10,
  },
  filterCountText: {
    fontSize: 15,
    textAlign: "center",
    color: "#444",
    marginTop: 6,
    fontWeight: "500",
  },
  filterCountHighlight: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  filterProgressBar: {
    height: 5,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    marginTop: 14,
    overflow: "hidden",
  },
  filterProgressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  filterMaxReached: {
    backgroundColor: "#4CAF50",
  },
  matchPercentage: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 6,
  },
  perfectMatch: {
    color: "#4CAF50",
  },
  maxFiltersInfoBox: {
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    overflow: "hidden",
  },
  maxFiltersInfoText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  maxFiltersTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  iconContainer: {
    backgroundColor: COLORS.primary + "15",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FilterProgressTracker;
