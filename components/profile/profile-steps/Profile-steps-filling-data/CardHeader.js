import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Reanimated, { FadeInRight, FadeInDown } from "react-native-reanimated";
import { LayoutAnimatedView } from "./AnimatedBase";
import { COLORS } from "../../../../constants/colors";
export const CardHeader = ({ title, iconName, description, emoji }) => {
  // Replace 'lifestyle' with 'style' icon if needed
  const safeIconName = iconName === "lifestyle" ? "style" : iconName;

  return (
    <LayoutAnimatedView
      entering={FadeInDown.duration(600)}
      style={styles.cardHeader}
    >
      <View style={styles.cardHeaderContent}>
        <View style={styles.iconContainer}>
          <MaterialIcon
            name={safeIconName}
            size={30}
            color={COLORS.primary}
            style={styles.cardHeaderIcon}
          />
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        <View style={styles.cardHeaderText}>
          <Reanimated.Text
            entering={FadeInRight.duration(800)}
            style={styles.cardTitle}
          >
            {title}
          </Reanimated.Text>
          <Reanimated.Text
            entering={FadeInRight.delay(200).duration(800)}
            style={styles.cardSubtitle}
          >
            {description}
          </Reanimated.Text>
        </View>
      </View>
    </LayoutAnimatedView>
  );
};

const styles = StyleSheet.create({
  cardHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cardHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(65, 105, 225, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardHeaderIcon: {
    marginRight: 8,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.grayDark,
    lineHeight: 20,
  },
  emoji: {
    fontSize: 16,
  },
});
