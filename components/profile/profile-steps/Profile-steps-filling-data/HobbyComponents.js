import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FadeIn } from "react-native-reanimated";
import { LayoutAnimatedView } from "./AnimatedBase";
import { COLORS } from "../../../../constants/colors";

export const HobbyItem = ({ item, isSelected }) => {
  const [name, emoji] =
    item.id === "none" ? [item.name, null] : item.name.split(" ");

  return (
    <LayoutAnimatedView
      entering={FadeIn.delay(Math.random() * 500).duration(600)}
      style={[
        styles.itemContainer,
        isSelected && styles.itemContainerSelected,
        item.id === "none" && styles.noneItemContainer,
        item.id === "none" && isSelected && styles.noneItemContainerSelected,
      ]}
    >
      {item.id !== "none" ? (
        <View
          style={[
            styles.iconContainer,
            isSelected && styles.iconContainerSelected,
          ]}
        >
          <Text
            style={[styles.emojiText, isSelected && styles.emojiTextSelected]}
          >
            {emoji}
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.noneIconContainer,
            isSelected && styles.noneIconContainerSelected,
          ]}
        >
          <Icon
            name="cancel"
            size={32}
            color={isSelected ? COLORS.white : COLORS.text}
          />
        </View>
      )}
      <Text
        style={[
          styles.itemText,
          isSelected && styles.itemTextSelected,
          item.id === "none" && styles.noneText,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {name}
      </Text>
    </LayoutAnimatedView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
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
  itemContainerSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    transform: [{ scale: 1.02 }],
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
    borderWidth: "none,",
  },
  noneItemContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderStyle: "dashed",
    borderColor: COLORS.border,
  },
  noneItemContainerSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    borderStyle: "solid",
    borderWidth: "none,",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  iconContainerSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  noneIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  noneIconContainerSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  itemText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
    color: COLORS.text,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  itemTextSelected: {
    color: COLORS.white,
    fontWeight: "600",
  },
  noneText: {
    opacity: 0.6,
    fontWeight: "400",
  },
  emojiText: {
    fontSize: 32,
    textAlign: "center",
    lineHeight: 36,
  },
  emojiTextSelected: {
    opacity: 0.9,
  },
});
