import React, { useContext } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { LanguageContext } from "../../contexts/LanguageContext";
import { COLORS } from "../../constants/colors";
const getFlexDirection = (isRTL) => (isRTL ? "row-reverse" : "row");
const getMargins = (isRTL, left, right) => ({
  marginLeft: isRTL ? right : left,
  marginRight: isRTL ? left : right,
});
const FilterChip = ({ label, icon, active, onPress, styles }) => {
  const { isRTL } = useContext(LanguageContext);

  return (
    <TouchableOpacity
      style={[styles.filterChip, active && styles.filterChipActive]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      accessible={true}
      accessibilityLabel={`${label} filter ${active ? "selected" : ""}`}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <LinearGradient
        colors={
          active ? COLORS.primaryGradient : ["transparent", "transparent"]
        }
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View
        style={{ flexDirection: getFlexDirection(isRTL), alignItems: "center" }}
      >
        <Feather
          name={icon}
          size={16}
          color={active ? COLORS.white : COLORS.text}
        />
        <Text
          style={[
            styles.filterChipText,
            active && styles.filterChipTextActive,
            getMargins(isRTL, 6, 6),
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(FilterChip);
