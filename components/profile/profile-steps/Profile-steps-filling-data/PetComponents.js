import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { FadeIn } from "react-native-reanimated";
import { LayoutAnimatedView } from "./AnimatedBase";
import { COLORS } from "../../../../constants/colors";

export const PetItem = ({ item, isSelected }) => {
  // Get the name and emoji separately
  const [name, emoji] = item.name.split(" ");

  return (
    <LayoutAnimatedView
      entering={FadeIn.delay(Math.random() * 300).duration(400)}
      style={[styles.petItem, isSelected && styles.petItemSelected]}
    >
      <View
        style={[
          styles.petIconContainer,
          isSelected && styles.petIconContainerSelected,
        ]}
      >
        <Text style={styles.emojiText}>{emoji}</Text>
      </View>
      <Text
        style={[styles.petText, isSelected && styles.petTextSelected]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {name}
      </Text>
    </LayoutAnimatedView>
  );
};

const styles = StyleSheet.create({
  petItem: {
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
  petItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    transform: [{ scale: 1.05 }],
  },
  petIconContainer: {
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
  petIconContainerSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  petText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  petTextSelected: {
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
