import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import createMatchProfileStyles from "../../../styles/matchProfileStyle";
import { LanguageContext } from "../../../contexts/LanguageContext";
import COLORS from "../../../constants/colors";
const LikeSuccessBanner = ({ userName }) => {
  const { t, isRTL } = useContext(LanguageContext);
  const styles = createMatchProfileStyles(isRTL);
  return (
    <View style={styles.successBanner}>
      <View style={styles.successBannerIcon}>
        <Feather name="check" size={20} color={COLORS.white} />
      </View>
      <Text style={styles.successBannerText}>
        You liked {userName}! We'll notify them of your interest.
      </Text>
    </View>
  );
};

export default LikeSuccessBanner;
