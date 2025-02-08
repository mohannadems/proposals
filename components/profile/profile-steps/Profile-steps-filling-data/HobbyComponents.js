import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FadeIn } from "react-native-reanimated";
import { LayoutAnimatedView } from "./AnimatedBase";
import { COLORS } from "../../../../constants/colors";
import { HOBBY_ICONS } from "./constants";

export const HobbyItem = ({ item, isSelected }) => {
  // Get the name and emoji separately
  const [name, emoji] = item.name.split(" ");

  return (
    <LayoutAnimatedView
      entering={FadeIn.delay(Math.random() * 500).duration(600)}
      style={[styles.hobbyItem, isSelected && styles.hobbyItemSelected]}
    >
      <View
        style={[
          styles.hobbyIconContainer,
          isSelected && styles.hobbyIconContainerSelected,
        ]}
      >
        <Text style={styles.emojiText}>{emoji}</Text>
      </View>
      <Text
        style={[styles.hobbyText, isSelected && styles.hobbyTextSelected]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {name}
      </Text>
    </LayoutAnimatedView>
  );
};

const styles = StyleSheet.create({
  hobbyItem: {
    flex: 1,
    backgroundColor: COLORS.grayLight,
    borderRadius: 16,
    padding: 16,
    margin: 6,
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    borderWidth: 2,
    borderColor: "transparent",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  hobbyItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    transform: [{ scale: 1.05 }],
  },
  hobbyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    flexDirection: "column",
    gap: 4,
  },
  hobbyIconContainerSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  hobbyText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  hobbyTextSelected: {
    color: COLORS.white,
    fontWeight: "700",
  },
  emojiText: {
    fontSize: 20,
    marginTop: 4,
  },
  emojiTextSelected: {
    opacity: 0.9,
  },
  emojiText: {
    fontSize: 32, // Made larger for better visibility
    textAlign: "center",
  },
});
