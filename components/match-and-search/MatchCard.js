import React, { useContext, useCallback, useMemo, useRef } from "react";
import { SharedElement } from "react-navigation-shared-element";
import MaskedView from "@react-native-masked-view/masked-view";
import { COLORS } from "../../constants/colors";
import * as Haptics from "expo-haptics";

import { View, TouchableOpacity, Image, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { useImageUtils } from "../../hooks/useImageUtils";
import { LanguageContext } from "../../contexts/LanguageContext";
const MatchCard = ({ user, onPress, styles }) => {
  const { t } = useContext(LanguageContext);
  const { getProfileImage } = useImageUtils();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.5,
      useNativeDriver: true,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const profileImage = useMemo(() => {
    return getProfileImage(user);
  }, [user, getProfileImage]);

  const fullName = useMemo(
    () => `${user.first_name || ""} ${user.last_name || ""}`.trim(),
    [user.first_name, user.last_name]
  );

  const matchPercentage = user.match_percentage || 85;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onPress(user)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible={true}
      accessibilityLabel={`View profile of ${fullName}, ${matchPercentage}% match`}
    >
      <Animated.View style={[styles.spotlightCard, { transform: [{ scale }] }]}>
        <SharedElement id={`user.${user.id}.image`}>
          <Image
            source={profileImage}
            style={styles.spotlightImage}
            defaultSource={require("../../assets/images/11.jpg")}
          />
        </SharedElement>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.spotlightGradient}
        >
          <BlurView intensity={80} style={styles.spotlightInfo}>
            <View style={styles.spotlightHeader}>
              <View style={styles.nameVerifiedContainer}>
                <Text style={styles.spotlightName}>
                  {fullName || user.first_name || "User"}
                  {user.age ? `, ${user.age}` : ""}
                </Text>

                {user.verified && (
                  <View style={styles.verifiedBadge}>
                    <Feather name="check" size={12} color={COLORS.white} />
                  </View>
                )}
              </View>
            </View>
            <View style={styles.matchPercentageContainer}>
              <MaskedView
                maskElement={
                  <View style={styles.progressMask}>
                    <Animated.View
                      style={[
                        styles.progressBar,
                        { width: `${matchPercentage}%` },
                      ]}
                    />
                  </View>
                }
              >
                <LinearGradient
                  colors={COLORS.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressGradient}
                />
              </MaskedView>
              <Text style={styles.matchPercentage}>
                {matchPercentage}% {t("matches.cards.match")}
              </Text>
            </View>
          </BlurView>
        </LinearGradient>
        {user.premium && (
          <View style={styles.premiumBadge}>
            <Feather name="star" size={12} color={COLORS.primary} />
          </View>
        )}
        <View style={styles.activeStatus}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>
            {user.last_active || t("matches.cards.active")}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
export default React.memo(MatchCard);
