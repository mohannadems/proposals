import React, { memo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import styles from "../../styles/SearchScreen";

const Tip = ({ isAnyFilterApplied }) => {
  return (
    <View style={styles.tipsContainer}>
      <View style={styles.tipCard}>
        <Ionicons
          name="bulb-outline"
          size={24}
          color={COLORS.primary}
          style={styles.tipIcon}
        />
        <Text style={styles.tipText}>
          {isAnyFilterApplied
            ? "Complete all sections to find your perfect match! You can search with partially completed preferences."
            : "Tap on a section to start setting your preferences. You don't need to complete all sections to search."}
        </Text>
      </View>
    </View>
  );
};

export default memo(Tip);
