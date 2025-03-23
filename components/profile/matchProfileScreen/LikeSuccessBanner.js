import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "../../../styles/matchProfileStyle";
import COLORS from "../../../constants/colors";
const LikeSuccessBanner = ({ userName }) => {
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
