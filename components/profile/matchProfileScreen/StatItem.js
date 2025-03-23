import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import styles from "../../../styles/matchProfileStyle";

const StatItem = ({ label, value, icon }) => (
  <View style={styles.statItem}>
    <View style={styles.statIconContainer}>
      <Feather name={icon} size={16} color={COLORS.primary} />
    </View>
    <View style={styles.statContent}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value || "Not provided"}</Text>
    </View>
  </View>
);

export default StatItem;
