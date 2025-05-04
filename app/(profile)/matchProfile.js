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
import ReportUserModal from "../../components/report/ReportUserModal";
import {
  revealContact,
  selectRevealedContact,
  selectIsRevealingContact,
} from "../../store/slices/subscriptionSlice";

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

const HiddenContactInfo = ({ onUnlockPress, style, isLoading }) => {
  const { t } = useContext(LanguageContext);

  return (
    <View style={[style, styles.hiddenContainer]}>
      <View style={styles.blurredContent}>
        <View style={styles.phoneContainer}>
          <Feather name="phone" size={20} color={COLORS.primary} />
          <Text style={styles.phoneLabel}>{t("match_profile.phone")}</Text>
          <Text style={styles.hiddenText}>0*********</Text>
        </View>

        <View style={styles.emailContainer}>
          <Feather name="mail" size={20} color={COLORS.primary} />
          <Text style={styles.emailLabel}>{t("match_profile.email")}</Text>
          <Text style={styles.hiddenText}>***@***.***</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onUnlockPress}
        style={styles.unlockButton}
        disabled={isLoading}
      >
        <LinearGradient
          colors={COLORS.primaryGradient}
          style={styles.unlockGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <Feather name="unlock" size={18} color={COLORS.white} />
              <Text style={styles.unlockText}>
                {t("match_profile.reveal_contact")}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  hiddenContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  blurredContent: {
    padding: 16,
    backgroundColor: "#F5F7FA",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    minWidth: 60,
  },
  emailLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    minWidth: 60,
  },
  hiddenText: {
    fontSize: 14,
    color: "#A0AEC0",
    marginLeft: 12,
  },
  unlockButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  unlockGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  unlockText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
};

const MatchProfileScreen = () => {
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const { t, isRTL } = useContext(LanguageContext);
  const createStyles = createMatchProfileStyles;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId, fromTab } = params;
  const dispatch = useDispatch();

  const [checkingMatch, setCheckingMatch] = useState(false);
  const [debugMode] = useState(true);
  const [isMatch, setIsMatch] = useState(fromTab === "Matches");

  // Redux state for subscription
  const revealedContact = useSelector((state) =>
    selectRevealedContact(state, userId)
  );
  const isRevealingContact = useSelector(selectIsRevealingContact);

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

  const handleRevealContact = async () => {
    try {
      await dispatch(revealContact(userId)).unwrap();
    } catch (error) {
      console.error("Error revealing contact:", error);
    }
  };

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
      <View style={createStyles(isRTL).loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={createStyles(isRTL).loadingText}>
          {t("match_profile.loading")}
        </Text>
      </View>
    );
  }

  if (error.profile && !userProfile) {
    return (
      <View style={createStyles(isRTL).errorContainer}>
        <Feather name="alert-circle" size={50} color={COLORS.error} />
        <Text style={createStyles(isRTL).errorText}>
          {t("match_profile.error")}
        </Text>
        <TouchableOpacity
          style={createStyles(isRTL).retryButton}
          onPress={() => dispatch(fetchUserProfile(userId))}
        >
          <Text style={createStyles(isRTL).retryButtonText}>
            {t("match_profile.retry")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!userProfile) return null;

  const { firstName, fullName, age, city, bio, interests, stats } = profileData;

  const getStatLabel = (key) => {
    return t(`match_profile.stats.${key}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={createStyles(isRTL).container}>
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

        <Animated.View
          style={[createStyles(isRTL).header, { height: headerHeight }]}
        >
          <Animated.View style={{ opacity: imageOpacity }}>
            <ImageCarousel
              photos={photos}
              onPageChange={setCurrentImageIndex}
            />
          </Animated.View>

          <LinearGradient
            colors={["rgba(0,0,0,0.3)", "transparent"]}
            style={createStyles(isRTL).headerGradient}
          >
            <View style={createStyles(isRTL).headerContent}>
              <TouchableOpacity
                style={createStyles(isRTL).backButton}
                onPress={handleBack}
              >
                <Feather
                  name={isRTL ? "arrow-right" : "arrow-left"}
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>

              <View style={createStyles(isRTL).imageIndicators}>
                {photos.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      createStyles(isRTL).imageIndicator,
                      currentImageIndex === index &&
                        createStyles(isRTL).imageIndicatorActive,
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
          style={createStyles(isRTL).scrollView}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View style={createStyles(isRTL).content}>
            {hasBeenLiked && <LikeSuccessBanner userName={firstName} />}

            <View
              style={[
                createStyles(isRTL).profileHeader,
                hasBeenLiked && createStyles(isRTL).likedProfileHeader,
              ]}
            >
              <View
                style={[
                  createStyles(isRTL).nameContainer,
                  hasBeenLiked && createStyles(isRTL).likedNameContainer,
                ]}
              >
                <Text style={createStyles(isRTL).name}>
                  {fullName}
                  {age ? `, ${age}` : ""}
                </Text>

                {userProfile.verified && (
                  <View style={createStyles(isRTL).verifiedBadge}>
                    <Feather name="check" size={12} color={COLORS.white} />
                  </View>
                )}

                {userProfile.premium && (
                  <View style={createStyles(isRTL).premiumBadge}>
                    <Feather name="star" size={12} color={COLORS.primary} />
                  </View>
                )}

                {hasBeenLiked && (
                  <View style={createStyles(isRTL).likedBadge}>
                    <Feather name="heart" size={12} color={COLORS.white} />
                    <Text style={createStyles(isRTL).likedBadgeText}>
                      {t("match_profile.liked")}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={createStyles(isRTL).location}>{city}</Text>

              {userProfile.match_percentage && (
                <View style={createStyles(isRTL).matchPercentage}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    style={createStyles(isRTL).matchBadge}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={createStyles(isRTL).matchText}>
                      {userProfile.match_percentage}%{" "}
                      {t("match_profile.match_percentage")}
                    </Text>
                  </LinearGradient>
                </View>
              )}
            </View>

            <View style={createStyles(isRTL).actions}>
              {!hasBeenLiked && !isMatch ? (
                <>
                  <ActionButton
                    icon="heart"
                    label={t("match_profile.like")}
                    onPress={handleLocalLike}
                    primary
                    loading={loading.like}
                  />
                  <ActionButton
                    icon="x"
                    label={t("match_profile.dislike")}
                    onPress={handleDislike}
                    loading={loading.dislike}
                  />
                </>
              ) : isMatch ? (
                <View style={createStyles(isRTL).matchedActions}>
                  <View style={createStyles(isRTL).matchedHeader}>
                    <Feather name="heart" size={24} color={COLORS.primary} />
                    <Text style={createStyles(isRTL).matchedText}>
                      {t("match_profile.matched")}
                    </Text>
                  </View>
                  <Text style={createStyles(isRTL).matchedSubtext}>
                    {t("match_profile.match_description")}
                  </Text>
                </View>
              ) : (
                <View style={createStyles(isRTL).alreadyLikedButton}>
                  <Feather name="check" size={24} color="#9E9E9E" />
                  <Text style={createStyles(isRTL).alreadyLikedText}>
                    {t("match_profile.liked")}
                  </Text>
                </View>
              )}
            </View>

            <InfoCard title={t("match_profile.about")} icon="user">
              <Text style={createStyles(isRTL).bio}>{bio}</Text>
              <View style={createStyles(isRTL).basicInfo}>
                {profile.job_title && (
                  <View style={createStyles(isRTL).infoRow}>
                    <Feather
                      name="briefcase"
                      size={16}
                      color={COLORS.primary}
                    />
                    <Text style={createStyles(isRTL).infoText}>
                      {profile.job_title}
                      {profile.position_level
                        ? ` (${profile.position_level})`
                        : ""}
                    </Text>
                  </View>
                )}

                {profile.educational_level && (
                  <View style={createStyles(isRTL).infoRow}>
                    <Feather name="book" size={16} color={COLORS.primary} />
                    <Text style={createStyles(isRTL).infoText}>
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
                <View style={createStyles(isRTL).interests}>
                  {interests.map((interest, index) => (
                    <View key={index} style={createStyles(isRTL).interestTag}>
                      <Text style={createStyles(isRTL).interestText}>
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
              <View style={createStyles(isRTL).statsGrid}>
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

            {isMatch && (
              <InfoCard title={t("match_profile.contact_info")} icon="phone">
                {!revealedContact ? (
                  <HiddenContactInfo
                    onUnlockPress={handleRevealContact}
                    style={createStyles(isRTL).contactInfo}
                    isLoading={isRevealingContact}
                  />
                ) : (
                  <View style={createStyles(isRTL).revealedContent}>
                    <View style={createStyles(isRTL).contactRow}>
                      <Feather name="phone" size={20} color={COLORS.primary} />
                      <Text style={createStyles(isRTL).contactLabel}>
                        {t("match_profile.phone")}
                      </Text>
                      <Text style={createStyles(isRTL).contactValue}>
                        {revealedContact.guardian_contact}
                      </Text>
                    </View>

                    {profile.email && (
                      <View style={createStyles(isRTL).contactRow}>
                        <Feather name="mail" size={20} color={COLORS.primary} />
                        <Text style={createStyles(isRTL).contactLabel}>
                          {t("match_profile.email")}
                        </Text>
                        <Text style={createStyles(isRTL).contactValue}>
                          {profile.email}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </InfoCard>
            )}

            <View style={createStyles(isRTL).reportContainer}>
              <TouchableOpacity
                style={[
                  createStyles(isRTL).reportButton,
                  isRTL && createStyles(isRTL).reportButtonRTL,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setReportModalVisible(true);
                }}
              >
                <Feather name="flag" size={16} color={COLORS.text} />
                <Text
                  style={[
                    createStyles(isRTL).reportText,
                    isRTL && createStyles(isRTL).reportTextRTL,
                  ]}
                >
                  {isRTL ? `إبلاغ عن ${firstName}` : `Report ${firstName}`}
                </Text>
              </TouchableOpacity>
            </View>

            <ReportUserModal
              visible={reportModalVisible}
              onClose={() => setReportModalVisible(false)}
              userId={userId}
              userName={firstName}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MatchProfileScreen;
