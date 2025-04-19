import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import { LanguageContext } from "../../../contexts/LanguageContext";
import createMatchProfileStyles from "../../../styles/matchProfileStyle";
const StatItem = ({ label, value, icon }) => {
  const { isRTL } = useContext(LanguageContext);
  const styles = createMatchProfileStyles(isRTL);

  return (
    <View style={styles.statItem}>
      <View style={styles.statIconContainer}>
        <Feather name={icon} size={16} color={COLORS.primary} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
};

export default StatItem;
