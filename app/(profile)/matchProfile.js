import React, { useState, useRef, useEffect } from "react";
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
import styles from "../../styles/matchProfileStyle";
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

const HEADER_HEIGHT = Platform.OS === "ios" ? 520 : 280;

// Full-screen loading spinner component
const LoadingSpinner = ({ visible }) => {
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
            Checking for a match...
          </Text>
        </View>
      </View>
    </Modal>
  );
};

// Debug test match button
const DebugMatchButton = ({ onPress, visible = true }) => {
  if (!visible) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: "absolute",
        top: Platform.OS === "ios" ? 100 : 70,
        right: 20,
        backgroundColor: "#ff3b30",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        zIndex: 999,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Feather name="zap" size={16} color="#fff" style={{ marginRight: 5 }} />
      <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
        TEST MATCH
      </Text>
    </TouchableOpacity>
  );
};

const MatchProfileScreen = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId, fromTab } = params;
  const dispatch = useDispatch();

  // Add state for tracking match checking
  const [checkingMatch, setCheckingMatch] = useState(false);

  // Add state for debug mode - turn this on for testing
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

  // Debug function to simulate a match being found
  const handleDebugMatch = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Navigate to match screen for testing
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
    // First close the confirmation modal
    setShowLikeModal(false);

    // Then show the loading spinner
    setCheckingMatch(true);

    try {
      // Call the original like confirm handler
      await handleLikeConfirm();

      // Set the liked state
      setHasBeenLiked(true);

      // Save this user ID to liked users
      await matchesService.addLikedUserId(userId);

      // Check if there's a mutual match
      const matchResult = await matchesService.checkForMatch(userId);

      console.log("🚀 Match result:", matchResult); // Debugging output

      if (matchResult && matchResult.isMatch) {
        // Provide haptic feedback for a match
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Navigate to match screen if there's a mutual match
        router.push({
          pathname: "/(profile)/match-screen",
          params: {
            matchedUserId: userId,
            isNewMatch: true,
          },
        });
        return;
      }

      // If no match, update the liked tab
      dispatch(setActiveTab("Liked"));
    } catch (error) {
      console.error("Error checking for match:", error);
    } finally {
      setCheckingMatch(false);
    }
  };

  // DEBUGGING: Automatically check for a match on profile load if debugMode is enabled
  useEffect(() => {
    const checkForMatch = async () => {
      if (debugMode && userId) {
        try {
          // We don't want to auto-match if already liked
          if (!hasBeenLiked) {
            console.log("🔍 DEBUG: Checking for match with user ID:", userId);
            const result = await matchesService.checkForMatch(userId);
            console.log("🔍 DEBUG: Match result:", result);

            if (result && result.isMatch) {
              console.log(
                "✅ DEBUG: Match found! Can navigate to match screen."
              );
              // We don't auto-navigate here, let the user click the debug button
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
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error.profile && !userProfile) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={50} color={COLORS.error} />
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchUserProfile(userId))}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!userProfile) return null;

  const { firstName, fullName, age, city, bio, interests, stats } = profileData;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      {/* Debug match testing button */}
      {debugMode && <DebugMatchButton onPress={handleDebugMatch} />}

      <ScrollView style={styles.container}>
        {/* Full-screen loading spinner for match checking */}
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
                <Feather name="arrow-left" size={24} color={COLORS.white} />
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
                    <Text style={styles.likedBadgeText}>You Liked</Text>
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
                      {userProfile.match_percentage}% Match
                    </Text>
                  </LinearGradient>
                </View>
              )}
            </View>

            <View style={styles.actions}>
              {!hasBeenLiked ? (
                <ActionButton
                  icon="heart"
                  label="Like"
                  onPress={handleLocalLike}
                  primary
                  loading={loading.like}
                />
              ) : (
                <View style={styles.alreadyLikedButton}>
                  <Feather name="check" size={24} color="#9E9E9E" />
                  <Text style={styles.alreadyLikedText}>Liked</Text>
                </View>
              )}

              {!hasBeenLiked && (
                <ActionButton
                  icon="x"
                  label="Dislike"
                  onPress={handleDislike}
                  loading={loading.dislike}
                />
              )}
            </View>

            <InfoCard title="About" icon="user">
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
              <InfoCard title="Interests" icon="heart">
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

            <InfoCard title="Basic Info" icon="info">
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

                  const labels = {
                    height: "Height",
                    weight: "Weight",
                    marital_status: "Marital Status",
                    children: "Children",
                    smoking: "Smoking",
                    drinking: "Drinking",
                    employment: "Employment",
                    education: "Education",
                    religion: "Religion",
                    zodiac: "Zodiac",
                    sports: "Sports Activity",
                    sleep: "Sleep Habit",
                  };

                  return (
                    <StatItem
                      key={key}
                      label={labels[key]}
                      value={value}
                      icon={icons[key]}
                    />
                  );
                })}

                {profile.pets && profile.pets.length > 0 && (
                  <StatItem
                    label="Pets"
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
                <Text style={styles.reportText}>Report {firstName}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MatchProfileScreen;
