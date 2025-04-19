import React, { useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { COLORS } from "../../constants/colors";

const SectionHeader = ({ title, forwardRef, isRTL, style, textStyle }) => {
  return (
    <View ref={forwardRef} style={[styles.sectionHeader, style]}>
      <Text
        style={[
          styles.sectionTitle,
          textStyle,
          { textAlign: isRTL ? "right" : "left" },
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    paddingVertical: 12,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
});

export default SectionHeader;
