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

import { fetchUserProfile } from "../../store/slices/userProfileSlice";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = Platform.OS === "ios" ? 520 : 280;

const ScrollableHeaderContent = ({ scrollY, userProfile }) => {
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

const ImageCarousel = ({ photos, onPageChange }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderItem = ({ item, index }) => {
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
      const index = viewableItems[0].index;
      setCurrentIndex(index);
      onPageChange(index);
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

const PreviewProfileScreen = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  const { userId } = params;

  const { userProfile, loading, error } = useSelector(
    (state) => state.userProfile
  );

  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));

      const currentUserId = "your-user-id";
      setIsOwnProfile(userId === currentUserId);
    }
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

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

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

  if (!userProfile) {
    return null;
  }

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
    photos = [
      {
        photo_url:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      },
    ];
  }

  const profile = userProfile.profile || {};

  const fullName = `${userProfile.first_name || ""} ${
    userProfile.last_name || ""
  }`.trim();
  const firstName = userProfile.first_name || "";
  const age = profile.age || userProfile.age || "";
  const city =
    profile.city || userProfile.city_location || "Location not provided";
  const bio = profile.bio || "No bio provided";

  const interests = profile.hobbies || [];

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

  const viewModeText = isOwnProfile ? "Profile Preview" : "Profile View";

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />

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

            <View style={styles.previewModeContainer}>
              <Feather name="eye" size={16} color={COLORS.white} />
              <Text style={styles.previewModeText}>{viewModeText}</Text>
            </View>

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

          {isOwnProfile && (
            <View style={styles.previewMessage}>
              <Feather name="info" size={20} color={COLORS.primary} />
              <Text style={styles.previewMessageText}>
                This is how your profile appears to others.
              </Text>
            </View>
          )}

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

          {isOwnProfile && (
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/edit-profile");
              }}
            >
              <LinearGradient
                colors={COLORS.primaryGradient}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Feather name="edit-2" size={18} color={COLORS.white} />
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}

          <View style={styles.bottomSpacing} />
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
  previewModeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  previewModeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
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
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
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
  previewMessage: {
    flexDirection: "row",
    backgroundColor: COLORS.primary + "10",
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    alignItems: "flex-start",
    gap: 10,
  },
  previewMessageText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    marginTop: 16,
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
  scrollableHeaderContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
  },
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
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  editProfileButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 40,
  },
});
export default PreviewProfileScreen;
