import React from "react";
import { View, Text } from "react-native";
import COLORS from "../../../constants/colors";
import styles from "../../../styles/seeMyprofile";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const StatItem = ({ label, value, icon, iconFamily = "Feather" }) => {
  const IconComponent =
    iconFamily === "Feather" ? Feather : MaterialCommunityIcons;

  return (
    <View style={styles.statItem}>
      <View style={styles.statIconContainer}>
        <IconComponent name={icon} size={16} color={COLORS.primary} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value || "Not provided"}</Text>
      </View>
    </View>
  );
};
export default StatItem;
