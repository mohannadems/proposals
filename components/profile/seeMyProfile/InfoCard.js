import React from "react";
import { View, Text } from "react-native";
import styles from "../../../styles/seeMyprofile";
import COLORS from "../../../constants/colors";
import { Feather } from "@expo/vector-icons";
const InfoCard = ({ title, icon, children }) => {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoCardHeader}>
        <View style={styles.infoCardIcon}>
          <Feather name={icon} size={20} color={COLORS.primary} />
        </View>
        <Text style={styles.infoCardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
};
export default InfoCard;
