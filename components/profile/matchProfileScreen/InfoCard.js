import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import createMatchProfileStyles from "../../../styles/matchProfileStyle";
import { LanguageContext } from "../../../contexts/LanguageContext";

const InfoCard = ({ title, icon, children }) => {
  const { isRTL } = useContext(LanguageContext);
  const styles = createMatchProfileStyles(isRTL);

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
