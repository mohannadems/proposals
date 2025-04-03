import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../styles/match-screen";
import {
  X,
  Heart,
  MapPin,
  Briefcase,
  Coffee,
  Book,
  Check,
  Phone,
} from "lucide-react-native";
import Confetti from "react-native-confetti";
import { BlurView } from "expo-blur";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";

import { profileService } from "../../services/profile.service";
import { matchesService } from "../../services/matchesService";
import { COLORS } from "../../constants/colors";
import ModernLoadingScreen from "../../components/common/ModernLoader";

const { width } = Dimensions.get("window");

const ERROR_MESSAGES = {
  MISSING_USER_ID: "Cannot view profile. User ID is missing.",
  NO_CONTACT: "Contact number is not available for this match.",
  GO_BACK: "Go Back",
  REVEAL_TITLE: "Reveal Contact Number",
  REVEAL_MESSAGE: "Are you sure you want to view the full contact number?",
  CANCEL: "Cancel",
  REVEAL: "Reveal",
  DEFAULT_PROFILE_ERROR: "Failed to load match details",
  MY_PROFILE_ERROR: "Failed to load your profile",
  MATCH_NOT_FOUND: "No match found or match data is incomplete",
  MATCH_ID_MISSING: "Match ID is missing",
};

const FALLBACK_IMAGES = {
  MY_PROFILE: "https://i.pravatar.cc/300?img=11",
  MATCH_PROFILE: "https://i.pravatar.cc/300?img=32",
};

const ANIMATION_CONFIG = {
  SCALE_DURATION: 500,
  OPACITY_DURATION: 600,
  FADE_DURATION: 800,
  FADE_DELAY: 300,
  CONFETTI_DURATION: 5000,
};

const ProfileDetailCard = memo(({ icon, title, value }) => (
  <View style={styles.detailCard}>
    {icon}
    <View style={styles.detailContent}>
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
));

const SafeHeader = memo(({ handleClose }) => (
  <View style={styles.header}>
    <View style={styles.headerTitleContainer}>
      <Heart color={COLORS.white} size={22} style={styles.headerIcon} />
      <Text style={styles.headerText}>Perfect Match!</Text>
    </View>
    <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
      <X color={COLORS.white} size={24} />
    </TouchableOpacity>
  </View>
));

const ProfileImages = memo(
  ({
    myImageUrl,
    myName,
    myAge,
    myLocation,
    matchImageUrl,
    matchName,
    matchAge,
    matchLocation,
  }) => (
    <View style={styles.profileContainer}>
      <View style={styles.profileCard}>
        <Image
          source={{ uri: myImageUrl }}
          style={styles.profileImage}
          defaultSource={require("../../assets/images/11.jpg")}
        />
        <BlurView intensity={80} style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {myName}
            {myAge ? `, ${myAge}` : ""}
          </Text>
          <View style={styles.profileLocation}>
            <MapPin color={COLORS.white} size={14} />
            <Text style={styles.locationText}>{myLocation}</Text>
          </View>
        </BlurView>
      </View>

      <View style={styles.profileConnector}>
        <View style={styles.connectorLine} />
        <View style={styles.connectorCircle}>
          <Check color={COLORS.white} size={16} />
        </View>
        <View style={styles.connectorLine} />
      </View>

      <View style={styles.profileCard}>
        <Image
          source={{ uri: matchImageUrl }}
          style={[styles.profileImage, { backgroundColor: "#e1e1e1" }]}
          resizeMode="cover"
        />
        <BlurView intensity={80} style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {matchName}
            {matchAge ? `, ${matchAge}` : ""}
          </Text>
          <View style={styles.profileLocation}>
            <MapPin color={COLORS.white} size={14} />
            <Text style={styles.locationText}>{matchLocation}</Text>
          </View>
        </BlurView>
      </View>
    </View>
  )
);

const ActionButtons = memo(
  ({ showFullNumber, handleShowFullNumber, handleViewProfile }) => (
    <>
      <TouchableOpacity
        style={styles.viewProfileButton}
        onPress={handleShowFullNumber}
      >
        <Phone color={COLORS.white} size={18} style={{ marginRight: 10 }} />
        <Text style={styles.viewProfileText}>
          {showFullNumber ? "Full Number" : "Reveal Number"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.viewProfileButton,
          { marginTop: 10, backgroundColor: COLORS.secondary },
        ]}
        onPress={handleViewProfile}
      >
        <Text style={styles.viewProfileText}>View Full Profile</Text>
      </TouchableOpacity>
    </>
  )
);

const getProfileImage = (profile, isMatchProfile = false) => {
  try {
    if (isMatchProfile && profile?.matched_user_photo) {
      const photoUrl = profile.matched_user_photo;
      // If the URL already includes http/https, use it directly
      if (photoUrl.startsWith("http")) {
        return photoUrl;
      } else {
        // Otherwise, prepend your server domain
        return `https://proposals.world${photoUrl}`; // FIXED: Removed extra quote
      }
    }

    if (profile?.profile?.photos?.length > 0) {
      const mainPhoto =
        profile.profile.photos.find((photo) => photo.is_main) ||
        profile.profile.photos[0];

      const photoUrl = mainPhoto.photo_url;
      if (photoUrl.startsWith("http")) {
        return photoUrl;
      } else {
        return `https://proposals.world${photoUrl}`; // Also ensure consistency here
      }
    }

    // If no valid profile photo is found, use fallback
    return (
      profile?.profile?.avatar_url ||
      (isMatchProfile
        ? FALLBACK_IMAGES.MATCH_PROFILE
        : FALLBACK_IMAGES.MY_PROFILE)
    );
  } catch (err) {
    console.error("Error extracting profile image:", err);
    return isMatchProfile
      ? FALLBACK_IMAGES.MATCH_PROFILE
      : FALLBACK_IMAGES.MY_PROFILE;
  }
};

const LoadingView = () => (
  <View
    style={[
      styles.container,
      { justifyContent: "center", alignItems: "center" },
    ]}
  >
    <StatusBar barStyle="light-content" />
    <LinearGradient colors={COLORS.primaryGradient} style={styles.gradient}>
      <ActivityIndicator size="large" color={COLORS.white} />
      <Text style={styles.loadingText}>Loading match details...</Text>
    </LinearGradient>
  </View>
);

const ErrorView = ({ error, onRetry }) => (
  <View
    style={[
      styles.container,
      { justifyContent: "center", alignItems: "center" },
    ]}
  >
    <StatusBar barStyle="light-content" />
    <LinearGradient colors={COLORS.primaryGradient} style={styles.gradient}>
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>{ERROR_MESSAGES.GO_BACK}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </View>
);

const MatchScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { matchedUserId, isNewMatch } = params;

  const [myProfile, setMyProfile] = useState(null);
  const [matchProfile, setMatchProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullNumber, setShowFullNumber] = useState(false);

  const currentUser = useSelector((state) => state.auth.user);

  const confettiRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);

      const myProfileResponse = await profileService.getProfile();

      if (!myProfileResponse.success) {
        throw new Error(
          myProfileResponse.message || ERROR_MESSAGES.MY_PROFILE_ERROR
        );
      }

      setMyProfile(myProfileResponse.data);

      if (!matchedUserId) {
        throw new Error(ERROR_MESSAGES.MATCH_ID_MISSING);
      }

      const matchProfileResponse = await matchesService.checkForMatch(
        matchedUserId
      );

      if (!matchProfileResponse.isMatch) {
        throw new Error(ERROR_MESSAGES.MATCH_NOT_FOUND);
      }

      setMatchProfile(matchProfileResponse.matchData);
    } catch (err) {
      setError(err.message || ERROR_MESSAGES.DEFAULT_PROFILE_ERROR);
    } finally {
      setLoading(false);
    }
  }, [matchedUserId]);

  useEffect(() => {
    let isMounted = true;

    fetchProfiles();

    return () => {
      isMounted = false;
    };
  }, [fetchProfiles]);

  useEffect(() => {
    if (
      !loading &&
      matchProfile &&
      isNewMatch === "true" &&
      confettiRef.current
    ) {
      confettiRef.current.startConfetti();
    }

    const animationSet = Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: ANIMATION_CONFIG.SCALE_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: ANIMATION_CONFIG.OPACITY_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: ANIMATION_CONFIG.FADE_DURATION,
        delay: ANIMATION_CONFIG.FADE_DELAY,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: ANIMATION_CONFIG.FADE_DURATION,
        delay: ANIMATION_CONFIG.FADE_DELAY,
        useNativeDriver: true,
      }),
    ]);

    animationSet.start();

    let timer;
    if (isNewMatch === "true") {
      timer = setTimeout(() => {
        if (confettiRef.current) {
          confettiRef.current.stopConfetti();
        }
      }, ANIMATION_CONFIG.CONFETTI_DURATION);
    }

    return () => {
      animationSet.stop();
      if (timer) clearTimeout(timer);
    };
  }, [loading, matchProfile, isNewMatch]);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleViewProfile = useCallback(() => {
    if (!matchedUserId) {
      Alert.alert("Error", ERROR_MESSAGES.MISSING_USER_ID);
      return;
    }

    router.push({
      pathname: "/(profile)/matchProfile",
      params: { userId: matchedUserId },
    });
  }, [router, matchedUserId]);

  const handleShowFullNumber = useCallback(() => {
    if (matchProfile?.matched_user_phone) {
      if (!showFullNumber) {
        Alert.alert(
          ERROR_MESSAGES.REVEAL_TITLE,
          ERROR_MESSAGES.REVEAL_MESSAGE,
          [
            {
              text: ERROR_MESSAGES.CANCEL,
              style: "cancel",
            },
            {
              text: ERROR_MESSAGES.REVEAL,
              onPress: () => setShowFullNumber(true),
            },
          ]
        );
      }
    } else {
      Alert.alert("No Contact", ERROR_MESSAGES.NO_CONTACT);
    }
  }, [matchProfile, showFullNumber]);

  if (loading) {
    return <ModernLoadingScreen />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={handleClose} />;
  }

  const myImageUrl = myProfile
    ? getProfileImage(myProfile)
    : FALLBACK_IMAGES.MY_PROFILE;
  const matchImageUrl = matchProfile
    ? getProfileImage(matchProfile, true)
    : FALLBACK_IMAGES.MATCH_PROFILE;

  const myName = myProfile?.first_name || "You";
  const myAge = myProfile?.profile?.age || "";
  const myLocation = myProfile?.profile?.city || "Your location";

  const matchName = matchProfile?.matched_user_name || "Match";
  const matchAge = matchProfile?.matched_user_age || "";
  const matchLocation = matchProfile?.matched_user_city || "Unknown location";

  const maskedPhoneNumber = matchProfile?.matched_user_phone
    ? `${matchProfile.matched_user_phone.slice(
        0,
        3
      )}****${matchProfile.matched_user_phone.slice(-3)}`
    : "Not Available";
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={COLORS.primaryGradient} style={styles.gradient}>
        <SafeHeader handleClose={handleClose} />

        {isNewMatch === "true" && <Confetti ref={confettiRef} />}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.matchBadge}>
              <Text style={styles.matchPercentage}>90%</Text>
              <Text style={styles.matchLabel}>Match</Text>
            </View>

            <ProfileImages
              myImageUrl={myImageUrl}
              myName={myName}
              myAge={myAge}
              myLocation={myLocation}
              matchImageUrl={matchImageUrl}
              matchName={matchName}
              matchAge={matchAge}
              matchLocation={matchLocation}
            />

            <Animated.View
              style={[
                styles.detailsContainer,
                {
                  opacity: fadeInAnim,
                  transform: [{ translateY: slideUpAnim }],
                },
              ]}
            >
              <Text style={styles.sectionTitle}>What You Have in Common</Text>

              <View style={styles.detailsContent}>
                <ProfileDetailCard
                  icon={<Briefcase color={COLORS.primary} size={18} />}
                  title="Careers"
                  value={`${myProfile?.profile?.job_title || "Your career"} & ${
                    matchProfile?.profile?.job_title || "Their career"
                  }`}
                />

                <ProfileDetailCard
                  icon={<Book color={COLORS.primary} size={18} />}
                  title="Education"
                  value={`${
                    myProfile?.profile?.educational_level || "Your education"
                  } & ${
                    matchProfile?.profile?.educational_level ||
                    "Their education"
                  }`}
                />

                <ProfileDetailCard
                  icon={<Coffee color={COLORS.primary} size={18} />}
                  title="Contact Number"
                  value={
                    showFullNumber
                      ? matchProfile?.matched_user_phone || "Not Available"
                      : maskedPhoneNumber
                  }
                />

                <View style={styles.matchTextContainer}>
                  <Text style={styles.matchText}>
                    You and {matchName} have liked each other! You both seem to
                    have a lot in common.
                  </Text>
                </View>

                <ActionButtons
                  showFullNumber={showFullNumber}
                  handleShowFullNumber={handleShowFullNumber}
                  handleViewProfile={handleViewProfile}
                />
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default MatchScreen;
