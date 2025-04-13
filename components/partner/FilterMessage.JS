import React, { useEffect, useRef } from "react";
import { View, Text, Animated, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";

const FilterMessage = ({
  selectedFiltersCount,
  maxFilters,
  isMaxFiltersSelected,
  t,
  styles,
  isRTL,
}) => {
  // Create animation value for fade-in effect
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Determine if we should show the message
  const shouldShowMessage =
    selectedFiltersCount > 0 && selectedFiltersCount < maxFilters;

  // Animation effect when the component mounts or when count changes
  useEffect(() => {
    if (shouldShowMessage) {
      // Fade in the message
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out if not showing
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [shouldShowMessage, selectedFiltersCount]);

  if (!shouldShowMessage) return null;

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
          backgroundColor: COLORS.lightPrimary,
          borderRadius: 12,
          marginHorizontal: 16,
          marginVertical: 8,
          padding: 16,
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
          borderLeftWidth: isRTL ? 0 : 3,
          borderRightWidth: isRTL ? 3 : 0,
          borderLeftColor: COLORS.primary,
          borderRightColor: COLORS.primary,
        },
      ]}
    >
      <View
        style={{
          backgroundColor: COLORS.primary + "30",
          borderRadius: 20,
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          marginRight: isRTL ? 0 : 12,
          marginLeft: isRTL ? 12 : 0,
        }}
      >
        <Ionicons name="information-circle" size={24} color={COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: COLORS.primary,
            marginBottom: 4,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t ? t("search.filter_message.title") : "Perfect Match Guide"}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: COLORS.text,
            lineHeight: 20,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t
            ? t("search.filter_message.content", {
                current: selectedFiltersCount,
                max: maxFilters,
                remaining: maxFilters - selectedFiltersCount,
              })
            : `You've selected ${selectedFiltersCount} of ${maxFilters} filters. Choose ${
                maxFilters - selectedFiltersCount
              } more for a 100% perfect match!`}
        </Text>
      </View>
    </Animated.View>
  );
};

export default FilterMessage;
