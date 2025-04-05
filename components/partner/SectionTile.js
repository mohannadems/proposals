import React, { memo, useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import createHomeStyles from "../../styles/SearchScreen";
import { LanguageContext } from "../../contexts/LanguageContext";
const SectionTile = ({
  title,
  subtitle,
  icon,
  IconComponent,
  isComplete,
  onPress,
}) => {
  const { t, isRTL } = useContext(LanguageContext);
  const styles = createHomeStyles(isRTL);
  return (
    <TouchableOpacity
      style={[styles.tile, isComplete && styles.completeTile]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.tileContent}>
        <View
          style={[
            styles.tileIconContainer,
            isComplete && styles.completeTileIconContainer,
          ]}
        >
          <IconComponent
            name={icon}
            size={32}
            color={isComplete ? COLORS.white : COLORS.primary}
          />
        </View>
        <Text style={styles.tileTitle}>{title}</Text>
        <Text style={styles.tileSubtitle}>{subtitle}</Text>
        {isComplete && (
          <View style={styles.completeBadge}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.success}
            />
            <Text style={styles.completeBadgeText}>Complete</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(SectionTile);
