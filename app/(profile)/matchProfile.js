import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { SharedElement } from "react-navigation-shared-element";
import { COLORS } from "../../constants/colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import { FadeInDown } from "react-native-reanimated";
import {
  setActiveTab,
  fetchUserLikes,
} from "../../store/slices/userMatchesSlice";

import {
  fetchUserProfile,
  likeUser,
  dislikeUser,
  clearUserProfile,
} from "../../store/slices/userProfileSlice";
import { fetchUserMatches } from "../../store/slices/userMatchesSlice";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = Platform.OS === "ios" ? 520 : 280;

const DislikeConfirmationBanner = ({
  visible,
  onConfirm,
  onCancel,
  userName,
  isLoading,
}) => {
  if (!visible) return null;

  return (
    <>
      {/* Blurry background overlay */}
      <BlurView intensity={20} style={styles.blurryBackground} tint="dark" />

      <Animated.View
        style={styles.dislikeConfirmationContainer}
        entering={FadeInDown.duration(300)}
      >
        <View style={styles.dislikeConfirmationContent}>
          <View style={styles.dislikeConfirmationHeader}>
            <Feather name="x-circle" size={24} color={COLORS.error} />
            <Text style={styles.dislikeConfirmationTitle}>
              Dislike Confirmation
            </Text>
          </View>

          <Text style={styles.dislikeConfirmationText}>
            Are you sure you want to dislike {userName}? This profile will no
            longer appear in your matches.
          </Text>

          <View style={styles.dislikeConfirmationActions}>
            <TouchableOpacity
              style={[
                styles.dislikeConfirmationButton,
                styles.dislikeConfirmationCancelButton,
              ]}
              onPress={onCancel}
              disabled={isLoading}
            >
              <Text style={styles.dislikeConfirmationCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dislikeConfirmationButton,
                styles.dislikeConfirmationConfirmButton,
              ]}
              onPress={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.dislikeConfirmationConfirmText}>
                  Confirm
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const LikeConfirmationModal = ({ visible, onConfirm, onCancel, userName }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Feather name="heart" size={28} color={COLORS.primary} />
            <Text style={styles.modalTitle}>Like Confirmation</Text>
          </View>

          <Text style={styles.modalText}>
            Are you sure you want to like {userName}? They will be notified
            about your interest.
          </Text>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.modalConfirmButton]}
              onPress={onConfirm}
            >
              <LinearGradient
                colors={COLORS.primaryGradient}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Text style={styles.modalConfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Success banner that shows after liking
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

const ScrollableHeaderContent = ({ scrollY, userProfile }) => {
  const translateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 200],
    outputRange: [HEADER_HEIGHT, 0],
    extrapolate: "clamp",
  });

  // Format the name and age
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

const ImageCarousel = ({ photos, onPageChange }) => {
  const flatListRef = useRef(null);

  const renderItem = ({ item }) => {
    // Check if item is an object with photo_url property or a direct image require
    const imageSource = item.photo_url ? { uri: item.photo_url } : item;

    return (
      <Image
        source={imageSource}
        style={{
          width,
          height: HEADER_HEIGHT,
          resizeMode: "cover",
        }}
        defaultSource={require("../../assets/images/11.jpg")}
      />
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      onPageChange(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <FlatList
      ref={flatListRef}
      data={photos}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      keyExtractor={(item, index) =>
        (item.photo_url ? item.photo_url : `photo-${index}`) + index.toString()
      }
    />
  );
};

const ActionButton = ({ icon, label, onPress, primary, loading }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={loading}
    >
      <Animated.View
        style={[
          styles.actionButton,
          primary ? styles.primaryButton : styles.secondaryButton,
          { transform: [{ scale }] },
        ]}
      >
        <LinearGradient
          colors={
            primary ? COLORS.primaryGradient : ["transparent", "transparent"]
          }
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        {loading ? (
          <ActivityIndicator
            color={primary ? COLORS.white : COLORS.primary}
            size="small"
          />
        ) : (
          <>
            <Feather
              name={icon}
              size={24}
              color={primary ? COLORS.white : COLORS.primary}
            />
            <Text
              style={[
                styles.actionButtonText,
                primary && styles.primaryButtonText,
              ]}
            >
              {label}
            </Text>
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const InfoCard = ({ title, icon, children }) => (
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

const StatItem = ({ label, value, icon }) => (
  <View style={styles.statItem}>
    <View style={styles.statIconContainer}>
      <Feather name={icon} size={16} color={COLORS.primary} />
    </View>
    <View style={styles.statContent}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value || "Not provided"}</Text>
    </View>
  </View>
);

const MatchProfileScreen = () => {
  const [dislikeLoading, setDislikeLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [showDislikeModal, setShowDislikeModal] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const params = useLocalSearchParams();
  const dispatch = useDispatch();

  // Get the userId from route params
  const { userId } = params;

  // Get profile data from Redux
  const { userProfile, loading, error, likedUsers, dislikedUsers } =
    useSelector((state) => state.userProfile);

  // Check if this user has already been liked or disliked
  const isLiked = userProfile ? likedUsers.includes(userProfile.id) : false;
  const isDisliked = userProfile
    ? dislikedUsers.includes(userProfile.id)
    : false;

  // Fetch user profile data when component mounts
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
    }

    // Clean up when component unmounts
    return () => {
      dispatch(clearUserProfile());
    };
  }, [dispatch, userId]);

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

  const handleLikeConfirm = useCallback(async () => {
    if (userProfile && !isLiked) {
      try {
        // Set loading state to true
        setLikeLoading(true);

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Like the user and get the response
        const likeResponse = await dispatch(likeUser(userProfile.id)).unwrap();

        // Short delay to ensure the like is processed
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Close the modal
        setShowLikeModal(false);

        // Check if it's a match (in your API response)
        const isMatch = likeResponse?.is_match === true;

        if (isMatch) {
          // If it's a match, navigate to the match screen with the matched user ID
          router.push({
            pathname: `/match-screen`,
            params: { matchedUserId: userProfile.id },
          });
        } else {
          // If not a match, show a success message
          showMessage({
            message: "Success",
            description: `You liked ${userProfile.first_name}!`,
            type: "success",
          });

          // Set Redux state to show "Liked" tab when returning to matches screen
          dispatch(setActiveTab("Liked"));

          // Prefetch the liked users so they're ready when navigating
          dispatch(fetchUserLikes());

          // Navigate back to the matches screen (tab)
          // For expo-router, use string params
          router.push({
            pathname: "/(tabs)/matches",
            params: { showLiked: "true" },
          });
        }

        // Reset loading state
        setLikeLoading(false);
      } catch (error) {
        console.error("Error liking user:", error);
        showMessage({
          message: "Error",
          description: "There was a problem liking this profile",
          type: "danger",
        });
        setShowLikeModal(false);
        setLikeLoading(false);
      }
    } else {
      setShowLikeModal(false);
    }
  }, [dispatch, userProfile, isLiked, router]);

  const handleLike = useCallback(() => {
    if (userProfile && !isLiked) {
      setShowLikeModal(true);
    }
  }, [userProfile, isLiked]);

  const handleDislike = useCallback(() => {
    if (userProfile && !isDisliked) {
      setShowDislikeModal(true);
    }
    dispatch(fetchUserMatches());
  }, [userProfile, isDisliked]);

  const handleDislikeConfirm = useCallback(async () => {
    if (userProfile && !isDisliked) {
      try {
        setDislikeLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Dislike the user
        await dispatch(dislikeUser(userProfile.id)).unwrap();

        // Add a delay to show loading
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Navigate back to the previous screen
        dispatch(fetchUserMatches());
        router.back();
      } catch (error) {
        console.error("Error disliking user:", error);
        showMessage({
          message: "Error",
          description: "There was a problem disliking this profile",
          type: "danger",
        });
      } finally {
        setDislikeLoading(false);
        setShowDislikeModal(false);
      }
    }
  }, [dispatch, userProfile, isDisliked, router]);
  // Make sure this is defined at the component level (same level as your other handler functions)
  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);
  // If profile is loading, show loading screen
  if (loading.profile && !userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // If there was an error loading the profile, show error screen
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

  // If no user profile data, return null
  if (!userProfile) {
    return null;
  }

  // Process photos for display
  let photos = [];
  if (
    userProfile.profile &&
    userProfile.profile.photos &&
    userProfile.profile.photos.length > 0
  ) {
    photos = userProfile.profile.photos;
  } else if (userProfile.photos && userProfile.photos.length > 0) {
    photos = userProfile.photos;
  } else {
    // Fallback to a default image
    photos = [
      {
        photo_url:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      },
    ];
  }

  // Extract profile data
  const profile = userProfile.profile || {};

  // Get user information
  const fullName = `${userProfile.first_name || ""} ${
    userProfile.last_name || ""
  }`.trim();
  const firstName = userProfile.first_name || "";
  const age = profile.age || userProfile.age || "";
  const city =
    profile.city || userProfile.city_location || "Location not provided";
  const bio = profile.bio || "No bio provided";

  // Extract hobbies/interests
  const interests = profile.hobbies || [];

  // Construct stats object
  const stats = {
    height: profile.height,
    weight: profile.weight,
    marital_status: profile.marital_status,
    children: profile.children ? `${profile.children} children` : null,
    smoking: profile.smoking_status ? "Yes" : "No",
    drinking: profile.drinking_status,
    employment: profile.employment_status ? "Employed" : "Unemployed",
    education: profile.educational_level,
    religion: profile.religion,
    zodiac: profile.zodiac_sign,
    sports: profile.sports_activity,
    sleep: profile.sleep_habit,
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <DislikeConfirmationBanner
        visible={showDislikeModal}
        onConfirm={handleDislikeConfirm}
        onCancel={() => setShowDislikeModal(false)}
        userName={firstName}
        isLoading={dislikeLoading}
      />
      {/* Like confirmation modal */}
      <LikeConfirmationModal
        visible={showLikeModal}
        onConfirm={handleLikeConfirm}
        onCancel={() => setShowLikeModal(false)}
        userName={firstName}
      />
      {/* Dislike confirmation modal */}

      {/* Show dislike banner if disliked */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View style={{ opacity: imageOpacity }}>
          <ImageCarousel photos={photos} onPageChange={setCurrentImageIndex} />
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
                    currentImageIndex === index && styles.imageIndicatorActive,
                  ]}
                />
              ))}
            </View>
          </View>
        </LinearGradient>
        <ScrollableHeaderContent scrollY={scrollY} userProfile={userProfile} />
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
          {/* Show success banner if liked */}
          {isLiked && <LikeSuccessBanner userName={firstName} />}

          <View
            style={[styles.profileHeader, isLiked && styles.likedProfileHeader]}
          >
            <View
              style={[
                styles.nameContainer,
                isLiked && styles.likedNameContainer,
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

              {/* Show "You liked" badge if liked */}
              {isLiked && (
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
            {!isLiked ? (
              // Show Like button if not already liked
              <ActionButton
                icon="heart"
                label="Like"
                onPress={handleLike}
                primary
                loading={loading.like}
              />
            ) : (
              // Show "Liked" button if already liked
              <View style={styles.alreadyLikedButton}>
                <Feather name="check" size={24} color="#9E9E9E" />
                <Text style={styles.alreadyLikedText}>Liked</Text>
              </View>
            )}

            {/* Only show Dislike button if not already liked */}
            {!isLiked && (
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
                  <Feather name="briefcase" size={16} color={COLORS.primary} />
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
              {stats.height && (
                <StatItem label="Height" value={stats.height} icon="ruler" />
              )}
              {stats.weight && (
                <StatItem label="Weight" value={stats.weight} icon="cloud" />
              )}
              {stats.marital_status && (
                <StatItem
                  label="Marital Status"
                  value={stats.marital_status}
                  icon="user"
                />
              )}
              {stats.children !== null && (
                <StatItem
                  label="Children"
                  value={stats.children}
                  icon="users"
                />
              )}
              <StatItem label="Smoking" value={stats.smoking} icon="x-circle" />
              {stats.drinking && (
                <StatItem label="Drinking" value={stats.drinking} icon="wine" />
              )}
              {stats.employment && (
                <StatItem
                  label="Employment"
                  value={stats.employment}
                  icon="briefcase"
                />
              )}
              {stats.education && (
                <StatItem
                  label="Education"
                  value={stats.education}
                  icon="book"
                />
              )}
              {stats.religion && (
                <StatItem
                  label="Religion"
                  value={stats.religion}
                  icon="heart"
                />
              )}
              {stats.zodiac && (
                <StatItem label="Zodiac" value={stats.zodiac} icon="star" />
              )}
              {stats.sports && (
                <StatItem
                  label="Sports Activity"
                  value={stats.sports}
                  icon="activity"
                />
              )}
              {stats.sleep && (
                <StatItem label="Sleep Habit" value={stats.sleep} icon="moon" />
              )}
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
                // Handle report action
              }}
            >
              <Feather name="flag" size={16} color={COLORS.text} />
              <Text style={styles.reportText}>Report {firstName}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 10,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageIndicators: {
    flexDirection: "row",
    gap: 8,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: "center",
  },
  imageIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  imageIndicatorActive: {
    backgroundColor: COLORS.white,
    width: 20,
  },
  scrollView: {
    flex: 1,
    marginTop: HEADER_HEIGHT - 50,
    zIndex: 900,
  },
  scrollContent: {
    paddingTop: HEADER_HEIGHT,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  profileHeader: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  // Styled profile header when liked
  likedProfileHeader: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  // Styled profile header when disliked
  dislikedProfileHeader: {
    borderWidth: 2,
    borderColor: COLORS.error,
    opacity: 0.9,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  // Styled name container when liked
  likedNameContainer: {
    backgroundColor: "rgba(237, 64, 102, 0.05)",
    borderRadius: 10,
    padding: 8,
    marginLeft: -8,
    marginRight: -8,
  },
  // Styled name container when disliked
  dislikedNameContainer: {
    backgroundColor: "rgba(255, 59, 48, 0.05)",
    borderRadius: 10,
    padding: 8,
    marginLeft: -8,
    marginRight: -8,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  location: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.7,
    marginBottom: 12,
  },
  matchPercentage: {
    alignSelf: "flex-start",
  },
  matchBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  matchText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  // Dislike button styling
  dislikeButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  // Dislike button text
  dislikeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.error,
  },
  primaryButtonText: {
    color: COLORS.white,
  },
  // Already liked button
  alreadyLikedButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    gap: 8,
    backgroundColor: "#E0E0E0", // Light gray background instead of primary color
    overflow: "hidden",
  },
  alreadyLikedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9E9E9E", // Muted text color instead of white
  },
  // Already disliked button
  alreadyDislikedButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    gap: 8,
    backgroundColor: COLORS.error,
    overflow: "hidden",
  },
  alreadyDislikedText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  infoCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  bio: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  basicInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 15,
    color: COLORS.text,
  },
  interests: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.primary + "15",
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
  },
  interestText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "45%",
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  premiumBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  // You Liked badge
  likedBadge: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  likedBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.white,
  },
  // You Disliked badge
  dislikedBadge: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.error,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  dislikedBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.white,
  },
  reportContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
  },
  reportText: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
  },
  scrollableHeaderContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
  },
  // Loading and error states
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: COLORS.error,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  // Like confirmation modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelButton: {
    backgroundColor: "#F5F5F5",
  },
  modalConfirmButton: {
    backgroundColor: COLORS.primary,
    overflow: "hidden",
  },
  // Dislike confirmation button
  dislikeConfirmButton: {
    backgroundColor: COLORS.error,
    overflow: "hidden",
  },
  modalCancelText: {
    fontWeight: "600",
    color: COLORS.text,
  },
  modalConfirmText: {
    fontWeight: "600",
    color: COLORS.white,
  },
  // Success banner
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.success,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  successBannerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  successBannerText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "500",
  },
  // Dislike banner
  dislikeBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.error,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  dislikeBannerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  dislikeBannerText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "500",
  },
  dislikeConfirmationContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 10,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  dislikeConfirmationContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  dislikeConfirmationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  dislikeConfirmationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  dislikeConfirmationText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
    marginBottom: 16,
  },
  dislikeConfirmationActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  dislikeConfirmationButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dislikeConfirmationCancelButton: {
    backgroundColor: "#F5F5F5",
  },
  dislikeConfirmationConfirmButton: {
    backgroundColor: COLORS.error,
  },
  dislikeConfirmationCancelText: {
    fontWeight: "600",
    color: COLORS.text,
  },
  dislikeConfirmationConfirmText: {
    fontWeight: "600",
    color: COLORS.white,
  },
  blurryBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  dislikeConfirmationContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 100 : StatusBar.currentHeight + 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  dislikeConfirmationContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  dislikeConfirmationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  dislikeConfirmationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  dislikeConfirmationText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
    marginBottom: 16,
  },
  dislikeConfirmationActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  dislikeConfirmationButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  dislikeConfirmationCancelButton: {
    backgroundColor: "#F5F5F5",
  },
  dislikeConfirmationConfirmButton: {
    backgroundColor: COLORS.error,
  },
  dislikeConfirmationCancelText: {
    fontWeight: "600",
    color: COLORS.text,
  },
  dislikeConfirmationConfirmText: {
    fontWeight: "600",
    color: COLORS.white,
  },
});
export default MatchProfileScreen;
