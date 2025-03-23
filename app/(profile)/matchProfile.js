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
const HEADER_HEIGHT = Platform.OS === "ios" ? 520 : 280;

const MatchProfileScreen = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId } = params;

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
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <DislikeConfirmationBanner
        visible={showDislikeModal}
        onConfirm={handleDislikeConfirm}
        onCancel={() => setShowDislikeModal(false)}
        userName={firstName}
        isLoading={dislikeLoading}
      />

      <LikeConfirmationModal
        visible={showLikeModal}
        onConfirm={handleLikeConfirm}
        onCancel={() => setShowLikeModal(false)}
        userName={firstName}
      />

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
              <ActionButton
                icon="heart"
                label="Like"
                onPress={handleLike}
                primary
                loading={loading.like}
              />
            ) : (
              <View style={styles.alreadyLikedButton}>
                <Feather name="check" size={24} color="#9E9E9E" />
                <Text style={styles.alreadyLikedText}>Liked</Text>
              </View>
            )}

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
  );
};

export default MatchProfileScreen;
