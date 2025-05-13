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
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { SharedElement } from "react-navigation-shared-element";
import { COLORS } from "../../constants/colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import { FadeInDown } from "react-native-reanimated";
import styles from "../../styles/seeMyprofile";
import { fetchUserProfile } from "../../store/slices/userProfileSlice";
import ScrollableHeaderContent from "../../components/profile/seeMyProfile/ScrollableHeaderContent";
import ImageCarousel from "../../components/profile/seeMyProfile/ImageCarousel";
import InfoCard from "../../components/profile/seeMyProfile/InfoCard";
import StatItem from "../../components/profile/seeMyProfile/StatItem";
import StatsGrid from "../../components/profile/seeMyProfile/StatsGrid";
const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = Platform.OS === "ios" ? 520 : 280;

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
    <>
      <ScrollView style={styles.container}>
        <StatusBar barStyle="light-content" />

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
                <StatsGrid stats={stats} profile={profile} />
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
    </>
  );
};

export default PreviewProfileScreen;
