import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  ActivityIndicator,
  Platform,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { COLORS } from "../../constants/colors";
import createMatchProfileStyles from "../../styles/matchProfileStyle";
import { useProfileActions } from "../../components/profile/matchProfileScreen/useProfileActions";
import { useProfileData } from "../../components/profile/matchProfileScreen/useProfileData";
import ActionButton from "../../components/profile/matchProfileScreen/ActionButton";
import DislikeConfirmationBanner from "../../components/profile/matchProfileScreen/DislikeConfirmationBanner";
import ImageCarousel from "../../components/profile/matchProfileScreen/ImageCarousel";
import InfoCard from "../../components/profile/matchProfileScreen/InfoCard";
import LikeConfirmationModal from "../../components/profile/matchProfileScreen/LikeConfirmationModal";
import LikeSuccessBanner from "../../components/profile/matchProfileScreen/LikeSuccessBanner";
import ScrollableHeaderContent from "../../components/profile/matchProfileScreen/ScrollableHeaderContent";
import StatItem from "../../components/profile/matchProfileScreen/StatItem";
import { useSelector, useDispatch } from "react-redux";
import { matchesService } from "../../services/matchesService";
import { setActiveTab } from "../../store/slices/userMatchesSlice";
import { LanguageContext } from "../../contexts/LanguageContext";

const HEADER_HEIGHT = Platform.OS === "ios" ? 520 : 280;

const LoadingSpinner = ({ visible }) => {
  const { t } = useContext(LanguageContext);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            padding: 30,
            borderRadius: 10,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            style={{
              marginTop: 15,
              fontSize: 16,
              fontWeight: "500",
              color: COLORS.text,
            }}
          >
            {t("match_profile.checking_match")}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const MatchProfileScreen = () => {
  const { t, isRTL } = useContext(LanguageContext);
  const styles = createMatchProfileStyles(isRTL);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId, fromTab } = params;
  const dispatch = useDispatch();

  const [checkingMatch, setCheckingMatch] = useState(false);
  const [debugMode] = useState(true);

  const { likedUsers } = useSelector((state) => state.userMatches);

  const isUserLikedInRedux =
    likedUsers && likedUsers.some((user) => user.id === userId);

  const {
    userProfile,
    profile,
    photos,
    loading,
    error,
    isLiked,
    isDisliked,
    profileData,
  } = useProfileData(userId);

  const [hasBeenLiked, setHasBeenLiked] = useState(
    isLiked || fromTab === "Liked" || isUserLikedInRedux
  );

  useEffect(() => {
    if (isLiked || isUserLikedInRedux) {
      setHasBeenLiked(true);
    }
  }, [isLiked, isUserLikedInRedux]);

  const {
    likeLoading,
    dislikeLoading,
    showLikeModal,
    showDislikeModal,
    handleLike,
    handleDislike,
    handleLikeConfirm,
    handleDislikeConfirm,
    setShowLikeModal,
    setShowDislikeModal,
  } = useProfileActions(userProfile, isLiked, isDisliked);

  const handleDebugMatch = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    router.push({
      pathname: "/(profile)/match-screen",
      params: {
        matchedUserId: userId,
        isNewMatch: true,
      },
    });
  };

  const handleLocalLike = () => {
    handleLike();
  };

  const handleLocalLikeConfirm = async () => {
    setShowLikeModal(false);
    setCheckingMatch(true);

    try {
      await handleLikeConfirm();
      setHasBeenLiked(true);

      await matchesService.addLikedUserId(userId);
      const matchResult = await matchesService.checkForMatch(userId);

      if (
        matchResult &&
        matchResult.isMatch === true &&
        matchResult.matchData
      ) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        router.push({
          pathname: "/(profile)/match-screen",
          params: {
            matchedUserId: userId,
            isNewMatch: true,
          },
        });
        return;
      }

      dispatch(setActiveTab("Liked"));
    } catch (error) {
      console.error("Error checking for match:", error);
    } finally {
      setCheckingMatch(false);
    }
  };

  useEffect(() => {
    const checkForMatch = async () => {
      if (debugMode && userId) {
        try {
          if (!hasBeenLiked) {
            const result = await matchesService.checkForMatch(userId);

            if (result && result.isMatch) {
            }
          }
        } catch (err) {
          console.error("DEBUG error checking match:", err);
        }
      }
    };

    checkForMatch();
  }, [debugMode, userId, hasBeenLiked]);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 100],
    outputRange: [HEADER_HEIGHT, 100],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  if (loading.profile && !userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{t("match_profile.loading")}</Text>
      </View>
    );
  }

  if (error.profile && !userProfile) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={50} color={COLORS.error} />
        <Text style={styles.errorText}>{t("match_profile.error")}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchUserProfile(userId))}
        >
          <Text style={styles.retryButtonText}>{t("match_profile.retry")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!userProfile) return null;

  const { firstName, fullName, age, city, bio, interests, stats } = profileData;

  // Map stat labels to translated versions
  const getStatLabel = (key) => {
    return t(`match_profile.stats.${key}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.container}>
        <LoadingSpinner visible={checkingMatch} />

        <DislikeConfirmationBanner
          visible={showDislikeModal}
          onConfirm={handleDislikeConfirm}
          onCancel={() => setShowDislikeModal(false)}
          userName={firstName}
          isLoading={dislikeLoading}
        />

        <LikeConfirmationModal
          visible={showLikeModal}
          onConfirm={handleLocalLikeConfirm}
          onCancel={() => setShowLikeModal(false)}
          userName={firstName}
        />

        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <Animated.View style={{ opacity: imageOpacity }}>
            <ImageCarousel
              photos={photos}
              onPageChange={setCurrentImageIndex}
            />
          </Animated.View>

          <LinearGradient
            colors={["rgba(0,0,0,0.3)", "transparent"]}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Feather
                  name={isRTL ? "arrow-right" : "arrow-left"}
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>

              <View style={styles.imageIndicators}>
                {photos.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.imageIndicator,
                      currentImageIndex === index &&
                        styles.imageIndicatorActive,
                    ]}
                  />
                ))}
              </View>
            </View>
          </LinearGradient>

          <ScrollableHeaderContent
            scrollY={scrollY}
            userProfile={userProfile}
          />
        </Animated.View>

        <View
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.content}>
            {hasBeenLiked && <LikeSuccessBanner userName={firstName} />}

            <View
              style={[
                styles.profileHeader,
                hasBeenLiked && styles.likedProfileHeader,
              ]}
            >
              <View
                style={[
                  styles.nameContainer,
                  hasBeenLiked && styles.likedNameContainer,
                ]}
              >
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

                {hasBeenLiked && (
                  <View style={styles.likedBadge}>
                    <Feather name="heart" size={12} color={COLORS.white} />
                    <Text style={styles.likedBadgeText}>
                      {t("match_profile.liked")}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.location}>{city}</Text>

              {userProfile.match_percentage && (
                <View style={styles.matchPercentage}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    style={styles.matchBadge}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.matchText}>
                      {userProfile.match_percentage}%{" "}
                      {t("match_profile.match_percentage")}
                    </Text>
                  </LinearGradient>
                </View>
              )}
            </View>

            <View style={styles.actions}>
              {!hasBeenLiked ? (
                <ActionButton
                  icon="heart"
                  label={t("match_profile.like")}
                  onPress={handleLocalLike}
                  primary
                  loading={loading.like}
                />
              ) : (
                <View style={styles.alreadyLikedButton}>
                  <Feather name="check" size={24} color="#9E9E9E" />
                  <Text style={styles.alreadyLikedText}>
                    {t("match_profile.liked")}
                  </Text>
                </View>
              )}

              {!hasBeenLiked && (
                <ActionButton
                  icon="x"
                  label={t("match_profile.dislike")}
                  onPress={handleDislike}
                  loading={loading.dislike}
                />
              )}
            </View>

            <InfoCard title={t("match_profile.about")} icon="user">
              <Text style={styles.bio}>{bio}</Text>
              <View style={styles.basicInfo}>
                {profile.job_title && (
                  <View style={styles.infoRow}>
                    <Feather
                      name="briefcase"
                      size={16}
                      color={COLORS.primary}
                    />
                    <Text style={styles.infoText}>
                      {profile.job_title}
                      {profile.position_level
                        ? ` (${profile.position_level})`
                        : ""}
                    </Text>
                  </View>
                )}

                {profile.educational_level && (
                  <View style={styles.infoRow}>
                    <Feather name="book" size={16} color={COLORS.primary} />
                    <Text style={styles.infoText}>
                      {profile.educational_level}
                      {profile.specialization
                        ? `, ${profile.specialization}`
                        : ""}
                    </Text>
                  </View>
                )}
              </View>
            </InfoCard>

            {interests && interests.length > 0 && (
              <InfoCard title={t("match_profile.interests")} icon="heart">
                <View style={styles.interests}>
                  {interests.map((interest, index) => (
                    <View key={index} style={styles.interestTag}>
                      <Text style={styles.interestText}>
                        {typeof interest === "string"
                          ? interest
                          : interest.name || "Interest"}
                      </Text>
                    </View>
                  ))}
                </View>
              </InfoCard>
            )}

            <InfoCard title={t("match_profile.basic_info")} icon="info">
              <View style={styles.statsGrid}>
                {Object.entries(stats).map(([key, value]) => {
                  if (!value) return null;

                  const icons = {
                    height: "ruler",
                    weight: "cloud",
                    marital_status: "user",
                    children: "users",
                    smoking: "x-circle",
                    drinking: "wine",
                    employment: "briefcase",
                    education: "book",
                    religion: "heart",
                    zodiac: "star",
                    sports: "activity",
                    sleep: "moon",
                  };

                  return (
                    <StatItem
                      key={key}
                      label={getStatLabel(key)}
                      value={value}
                      icon={icons[key]}
                    />
                  );
                })}

                {profile.pets && profile.pets.length > 0 && (
                  <StatItem
                    label={t("match_profile.stats.pets")}
                    value={profile.pets.join(", ")}
                    icon="github"
                  />
                )}
              </View>
            </InfoCard>

            <View style={styles.reportContainer}>
              <TouchableOpacity
                style={styles.reportButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
              >
                <Feather name="flag" size={16} color={COLORS.text} />
                <Text style={styles.reportText}>
                  {t("match_profile.report")} {firstName}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MatchProfileScreen;
