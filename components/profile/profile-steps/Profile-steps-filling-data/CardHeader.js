import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Reanimated, {
  FadeInRight,
  FadeInLeft,
  FadeInDown,
} from "react-native-reanimated";
import { LayoutAnimatedView } from "./AnimatedBase";
import { COLORS } from "../../../../constants/colors";
import { LanguageContext } from "../../../../contexts/LanguageContext";
import { getTranslatedCardConfigs } from "./constants";

export const CardHeader = ({
  title,
  iconName,
  description,
  emoji,
  isRTL,
  t,
}) => {
  const { isRTL: contextRTL, t: contextT } = useContext(LanguageContext) || {};
  const _isRTL = isRTL !== undefined ? isRTL : contextRTL;
  const _t = t || contextT;

  const safeIconName = iconName === "lifestyle" ? "style" : iconName;

  const translatedConfigs = _t ? getTranslatedCardConfigs(_t) : null;

  let translatedTitle = title;
  let translatedDescription = description;

  if (translatedConfigs) {
    for (const key in translatedConfigs) {
      if (
        translatedConfigs[key].title === title ||
        translatedConfigs[key].iconName === iconName
      ) {
        translatedTitle = translatedConfigs[key].title;
        translatedDescription = translatedConfigs[key].description;
        break;
      }
    }
  }

  const TextAnimation = _isRTL ? FadeInLeft : FadeInRight;

  return (
    <LayoutAnimatedView
      entering={FadeInDown.duration(600)}
      style={styles.cardHeader}
    >
      <View
        style={[
          styles.cardHeaderContent,
          { flexDirection: _isRTL ? "row-reverse" : "row" },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              marginRight: _isRTL ? 0 : 12,
              marginLeft: _isRTL ? 12 : 0,
            },
          ]}
        >
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
            entering={TextAnimation.duration(800)}
            style={[styles.cardTitle, { textAlign: _isRTL ? "right" : "left" }]}
          >
            {translatedTitle}
          </Reanimated.Text>
          <Reanimated.Text
            entering={TextAnimation.delay(200).duration(800)}
            style={[
              styles.cardSubtitle,
              { textAlign: _isRTL ? "right" : "left" },
            ]}
          >
            {translatedDescription}
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
