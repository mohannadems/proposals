import React from "react";
import { Text, StyleSheet, Platform } from "react-native";
import { FadeInDown } from "react-native-reanimated";
import { LayoutAnimatedView } from "./AnimatedBase";
import { COLORS } from "../../../../constants/colors";

export const SectionHeader = () => {
  return (
    <LayoutAnimatedView
      entering={FadeInDown.duration(800).springify()}
      style={styles.sectionHeader}
    >
      <Text style={styles.sectionEmoji}>✨</Text>
      <Text style={styles.sectionTitle}>Your Lifestyle Journey</Text>
      <Text style={styles.sectionSubtitle}>
        Craft a vibrant portrait of your unique self 🌈
      </Text>
    </LayoutAnimatedView>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    marginVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.grayDark,
    textAlign: "center",
    lineHeight: 24,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  sectionEmoji: {
    fontSize: 40,
    textAlign: "center",
    marginBottom: 16,
    includeFontPadding: false,
  },
});
