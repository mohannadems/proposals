import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
import { useDispatch, useSelector } from "react-redux";

// Import services
import { profileService } from "../../services/profile.service";
import { matchesService } from "../../services/matchesService";

const COLORS = {
  primary: "#9e086c",
  secondary: "#5856D6",
  background: "#F8F9FA",
  white: "#FFFFFF",
  text: "#1C1C1E",
  error: "#FF3B30",
  success: "#34C759",
  border: "#E5E5EA",
  primaryGradient: ["#9e086c", "#5856D6"],
  darkOverlay: "rgba(0, 0, 0, 0.5)",
};

const { width, height } = Dimensions.get("window");

const ProfileDetailCard = ({ icon, title, value }) => (
  <View style={styles.detailCard}>
    {icon}
    <View style={styles.detailContent}>
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const MatchScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { matchedUserId, isNewMatch } = params;
  const dispatch = useDispatch();

  // State for profiles
  const [myProfile, setMyProfile] = useState(null);
  const [matchProfile, setMatchProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullNumber, setShowFullNumber] = useState(false);

  // Get current user from Redux (fallback)
  const currentUser = useSelector((state) => state.auth.user);

  // Animation refs
  const confettiRef = useRef();
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

  const getProfileImage = (profile, isMatchProfile = false) => {
    try {
      // For match profile with matched_user_photo
      if (isMatchProfile && profile?.matched_user_photo) {
        return profile.matched_user_photo.startsWith("http")
          ? profile.matched_user_photo
          : `https://proposals.world${profile.matched_user_photo}`;
      }

      // For regular profile
      if (profile?.profile?.photos?.length > 0) {
        const mainPhoto =
          profile.profile.photos.find((photo) => photo.is_main) ||
          profile.profile.photos[0];

        return mainPhoto.photo_url.startsWith("http")
          ? mainPhoto.photo_url
          : `https://proposals.world${mainPhoto.photo_url}`;
      }

      // Fallback avatars
      return (
        profile?.profile?.avatar_url ||
        (isMatchProfile
          ? "https://i.pravatar.cc/300?img=32"
          : "https://i.pravatar.cc/300?img=11")
      );
    } catch (err) {
      console.error("Error extracting profile image:", err);
      return isMatchProfile
        ? "https://i.pravatar.cc/300?img=32"
        : "https://i.pravatar.cc/300?img=11";
    }
  };
  // Fetch profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);

        // Fetch my profile
        const myProfileResponse = await profileService.getProfile();
        if (myProfileResponse.success) {
          setMyProfile(myProfileResponse.data);
        }

        // Fetch match profile
        if (matchedUserId) {
          const matchProfileResponse = await matchesService.checkForMatch(
            matchedUserId
          );
          if (matchProfileResponse.isMatch) {
            setMatchProfile(matchProfileResponse.matchData);
          } else {
            throw new Error("No match found");
          }
        }
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError(err.message || "Failed to load match details");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [matchedUserId]);

  // Animations and confetti
  useEffect(() => {
    if (!loading && matchProfile && isNewMatch && confettiRef.current) {
      confettiRef.current.startConfetti();
    }

    // Animate in the content
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      if (confettiRef.current) {
        confettiRef.current.stopConfetti();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [loading, matchProfile, isNewMatch]);

  // Handlers
  const handleClose = () => {
    router.back();
  };

  const handleViewProfile = () => {
    router.push({
      pathname: "/(profile)/matchProfile",
      params: { userId: matchedUserId },
    });
  };

  const handleShowFullNumber = () => {
    if (matchProfile?.matched_user_phone) {
      // First time showing, ask for confirmation
      if (!showFullNumber) {
        Alert.alert(
          "Reveal Contact Number",
          "Are you sure you want to view the full contact number?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Reveal",
              onPress: () => setShowFullNumber(true),
            },
          ]
        );
      }
    } else {
      Alert.alert(
        "No Contact",
        "Contact number is not available for this match."
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.white} />
        <Text style={{ color: COLORS.white, fontSize: 16, marginTop: 10 }}>
          Loading match details...
        </Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center", padding: 20 },
        ]}
      >
        <Text
          style={{
            color: COLORS.white,
            fontSize: 16,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {error}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const myImageUrl = myProfile
    ? getProfileImage(myProfile)
    : "https://i.pravatar.cc/300?img=11";
  const matchImageUrl = matchProfile
    ? getProfileImage(matchProfile, true)
    : "https://i.pravatar.cc/300?img=32";

  const myName = myProfile?.first_name || "You";
  const myAge = myProfile?.profile?.age || "";
  const myLocation = myProfile?.profile?.city || "Your location";

  const matchName = matchProfile?.matched_user_name || "Match";
  const matchAge = matchProfile?.matched_user_age || "";
  const matchLocation = matchProfile?.matched_user_city || "Unknown location";

  // Mask phone number for privacy
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
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Heart color={COLORS.white} size={22} style={styles.headerIcon} />
            <Text style={styles.headerText}>Perfect Match!</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X color={COLORS.white} size={24} />
          </TouchableOpacity>
        </View>

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

            <View style={styles.profileContainer}>
              <View style={styles.profileCard}>
                <Image
                  source={{ uri: myImageUrl }}
                  style={styles.profileImage}
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
                  style={styles.profileImage}
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

                <TouchableOpacity
                  style={styles.viewProfileButton}
                  onPress={handleShowFullNumber}
                >
                  <Phone
                    color={COLORS.white}
                    size={18}
                    style={{ marginRight: 10 }}
                  />
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
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 8,
  },
  headerText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30, // Added padding at the bottom
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  matchBadge: {
    backgroundColor: COLORS.white,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  matchPercentage: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 4,
  },
  matchLabel: {
    color: COLORS.text,
    fontSize: 14,
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  profileCard: {
    width: width * 0.38,
    height: width * 0.5,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  profileName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  profileLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 4,
  },
  profileConnector: {
    alignItems: "center",
    width: width * 0.08,
  },
  connectorLine: {
    height: 1,
    width: width * 0.08,
    backgroundColor: COLORS.white,
  },
  connectorCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
  },
  detailsContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: "100%",
    paddingVertical: 50, // Increased padding
    paddingHorizontal: 20,
    minHeight: 600, // Ensure it's tall enough even with little content
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 20,
    textAlign: "center",
  },
  detailsContent: {
    paddingBottom: 20,
  },
  detailCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: 12,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailTitle: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  matchTextContainer: {
    marginTop: 15,
    marginBottom: 25,
    paddingHorizontal: 6,
  },
  matchText: {
    fontSize: 15,
    color: COLORS.text,
    opacity: 0.8,
    lineHeight: 22,
    textAlign: "center",
  },
  viewProfileButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 20,
  },
  viewProfileText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default MatchScreen;
