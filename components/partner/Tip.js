import React, { memo, useContext } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import createHomeStyles from "../../styles/SearchScreen";
import { LanguageContext } from "../../contexts/LanguageContext";

const Tip = ({ isAnyFilterApplied }) => {
  const { t, isRTL } = useContext(LanguageContext);
  const styles = createHomeStyles(isRTL);

  return (
    <View style={styles.tipsContainer}>
      <View style={styles.tipCard}>
        <Ionicons
          name="bulb-outline"
          size={24}
          color={COLORS.primary}
          style={styles.tipIcon}
        />
        <Text style={[styles.tipText, isRTL && { textAlign: "right" }]}>
          {isAnyFilterApplied
            ? t
              ? t("search.tips.partially_completed")
              : "Complete all sections to find your perfect match! You can search with partially completed preferences."
            : t
            ? t("search.tips.get_started")
            : "Tap on a section to start setting your preferences. You don't need to complete all sections to search."}
        </Text>
      </View>
    </View>
  );
};

export default memo(Tip);
