import React, { useContext } from "react";
import { View, Text, Animated, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/colors";
import createMatchProfileStyles from "../../../styles/matchProfileStyle";
import { LanguageContext } from "../../../contexts/LanguageContext";
const HEADER_HEIGHT = Platform.OS === "ios" ? 520 : 280;

const ScrollableHeaderContent = ({ scrollY, userProfile }) => {
  const { isRTL } = useContext(LanguageContext);
  const styles = createMatchProfileStyles(isRTL);
  const translateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 200],
    outputRange: [HEADER_HEIGHT, 0],
    extrapolate: "clamp",
  });

  const fullName = `${userProfile.first_name || ""} ${
    userProfile.last_name || ""
  }`.trim();
  const age = userProfile.profile?.age || userProfile.age || "";

  return (
    <Animated.View
      style={[styles.scrollableHeaderContent, { transform: [{ translateY }] }]}
    >
      <View style={styles.profileHeader}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>
            {fullName}
            {age ? `, ${age}` : ""}
          </Text>
          {userProfile.verified && (
            <View style={styles.verifiedBadge}>
              <Feather name="check" size={12} color={COLORS.white} />
            </View>
          )}
          {userProfile.premium && (
            <View style={styles.premiumBadge}>
              <Feather name="star" size={12} color={COLORS.primary} />
            </View>
          )}
        </View>
        <Text style={styles.location}>
          {userProfile.profile?.city ||
            userProfile.city_location ||
            "Location not provided"}
        </Text>
        {userProfile.match_percentage && (
          <View style={styles.matchPercentage}>
            <LinearGradient
              colors={COLORS.primaryGradient}
              style={styles.matchBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.matchText}>
                {userProfile.match_percentage}% Match
              </Text>
            </LinearGradient>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export default ScrollableHeaderContent;
