import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TYPOGRAPHY } from "../../constants/typography";
import { COLORS } from "../../constants/colors";

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 80;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const { width } = Dimensions.get("window");
const HomeScreen = () => {
  const scrollY = new Animated.Value(0);
  const [user, setUser] = useState({
    name: "Ahmed",
    age: 28,
    profileCompletion: 28,
    missingFields: ["photos", "education", "profession"],
  });
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Check if it's a new user who just registered
        const newUserFlag = await AsyncStorage.getItem("isNewUser");
        const profileCompletionStatus = await AsyncStorage.getItem(
          "profileCompletionStatus"
        );

        if (newUserFlag === "true") {
          // This is a new user who just registered
          setIsNewUser(true);
          setShowProfileCompletion(true);

          // Optional: Show a welcome modal or alert
          Alert.alert(
            "Welcome to Islamic Matrimony!",
            "Please complete your profile to get started and find your perfect match.",
            [{ text: "OK", onPress: () => {} }]
          );

          // Remove the new user flag after processing
          await AsyncStorage.removeItem("isNewUser");
        } else if (profileCompletionStatus !== "complete") {
          // User has an incomplete profile
          setShowProfileCompletion(true);
        } else {
          // Profile is complete
          setShowProfileCompletion(false);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      }
    };

    checkUserStatus();
  }, []);

  const handleCompleteProfile = () => {
    // Navigate to profile completion screen
    router.push("/(profile)/FillProfileData");
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  const headerContentOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // Add this method before the return statement
  const renderProfileCompletionModal = () => {
    if (!showProfileCompletion) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Gradient Background Overlay */}
          <View style={styles.gradientBackground}>
            <View style={styles.gradientOverlay} />
          </View>

          {/* Modal Content */}
          <View style={styles.modalContent}>
            {/* Animated Profile Completion Illustration */}
            <View style={styles.illustrationContainer}>
              <Animated.View
                style={[
                  styles.profileCompletionCircle,
                  { transform: [{ scale: new Animated.Value(1.2) }] },
                ]}
              >
                <Feather name="user-plus" size={60} color={COLORS.white} />
              </Animated.View>
            </View>

            {/* Title and Subtitle */}
            <Text style={styles.modalTitle}>
              {isNewUser ? "Start Your Journey" : "Profile Completion"}
            </Text>
            <Text style={styles.modalSubtitle}>
              {isNewUser
                ? "Create a compelling profile to connect with your potential match"
                : "You're closer than ever to finding your perfect partner"}
            </Text>

            {/* Missing Fields Section */}
            <View style={styles.missingFieldsContainer}>
              <View style={styles.missingFieldsHeader}>
                <Feather
                  name="alert-triangle"
                  size={20}
                  color={COLORS.secondary}
                  style={styles.missingFieldsHeaderIcon}
                />
                <Text style={styles.missingFieldsHeaderText}>
                  Missing Profile Information
                </Text>
              </View>

              {user.missingFields.map((field, index) => (
                <View key={index} style={styles.missingFieldItem}>
                  <View style={styles.missingFieldBadge}>
                    <Feather
                      name="check-circle"
                      size={18}
                      color={COLORS.primary}
                      style={styles.missingFieldCheckIcon}
                    />
                    <Text style={styles.missingFieldText}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Progress Section */}
            <View style={styles.progressSection}>
              <View style={styles.progressLabelContainer}>
                <Text style={styles.progressLabel}>Profile Completion</Text>
                <Text style={styles.progressPercentage}>
                  {user.profileCompletion}%
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${user.profileCompletion}%`,
                      backgroundColor:
                        user.profileCompletion < 50
                          ? COLORS.secondary
                          : user.profileCompletion < 75
                          ? COLORS.primary
                          : COLORS.success,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Complete Profile CTA */}
            <TouchableOpacity
              style={styles.completeProfileButton}
              onPress={handleCompleteProfile}
            >
              <Text style={styles.completeProfileButtonText}>
                Complete Profile
              </Text>
              <View style={styles.buttonIconContainer}>
                <Feather name="arrow-right" size={20} color={COLORS.primary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <Animated.View style={[styles.header, { height: headerHeight }]}>
      <View style={styles.headerBackground}>
        <Animated.View
          style={[styles.headerContent, { opacity: headerContentOpacity }]}
        >
          <Text style={styles.welcomeHeader}>Assalamu Alaikum</Text>
          <Text style={styles.headerQuote}>
            "And of His signs is that He created for you from yourselves mates
            that you may find tranquility in them" - Quran 30:21
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.collapsedHeaderContent,
            { opacity: headerTitleOpacity },
          ]}
        >
          <Text style={styles.collapsedHeaderTitle}>Islamic Matrimony</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );

  const renderProfileCard = () => (
    <View style={styles.profileCard}>
      <View style={styles.profileCardHeader}>
        <View>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.nameText}>{user.name}</Text>
        </View>
        {showProfileCompletion && (
          <TouchableOpacity
            onPress={() => router.push("/(profile)/FillProfileData")}
            style={styles.completeProfileButton}
          >
            <Text style={styles.completeProfileText}>Complete Profile</Text>
            <Text style={styles.completeProfilePercentage}>
              {user.profileCompletion}%
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {showProfileCompletion && (
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${user.profileCompletion}%` },
            ]}
          />
        </View>
      )}
      {showProfileCompletion && (
        <Text style={styles.missingFieldsText}>
          Please complete: {user.missingFields.join(", ")}
        </Text>
      )}
    </View>
  );

  const renderFeaturedProfiles = () => (
    <View style={styles.featuredSection}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Featured Profiles</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2, 3].map((index) => (
          <TouchableOpacity key={index} style={styles.featuredCard}>
            <Image
              source={{
                uri: `https://randomuser.me/api/portraits/${
                  index % 2 === 0 ? "women" : "men"
                }/${index}.jpg`,
              }}
              style={styles.featuredImage}
            />
            <View style={styles.featuredInfo}>
              <Text style={styles.featuredName}>Fatima, 26</Text>
              <Text style={styles.featuredLocation}>Riyadh, Saudi Arabia</Text>
              <View style={styles.featuredTags}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Doctor</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Hafiz</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderEvents = () => (
    <View style={styles.eventsSection}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          {
            title: "Islamic Marriage Seminar",
            date: "May 15, 2025",
            location: "Grand Mosque",
          },
          {
            title: "Meet & Greet for Singles",
            date: "May 20, 2025",
            location: "Community Center",
          },
          {
            title: "Pre-Marital Workshop",
            date: "May 25, 2025",
            location: "Islamic Institute",
          },
        ].map((event, index) => (
          <TouchableOpacity key={index} style={styles.eventCard}>
            <View style={styles.eventIconContainer}>
              <Feather name="calendar" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDate}>{event.date}</Text>
              <Text style={styles.eventLocation}>{event.location}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderArticles = () => (
    <View style={styles.articlesSection}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Islamic Guidance</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.articlesGrid}>
        {[
          { title: "The Importance of Marriage in Islam", icon: "heart" },
          {
            title: "Rights and Responsibilities in Marriage",
            icon: "book-open",
          },
          { title: "Selecting a Spouse: Islamic Perspective", icon: "users" },
          {
            title: "Preparing for Marriage: A Muslim Guide",
            icon: "clipboard",
          },
        ].map((article, index) => (
          <TouchableOpacity key={index} style={styles.articleCard}>
            <View style={styles.articleIconContainer}>
              <Feather name={article.icon} size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.articleTitle}>{article.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: HEADER_MAX_HEIGHT }}>
          {renderProfileCard()}
          {renderFeaturedProfiles()}
          {renderEvents()}
          {renderArticles()}
        </View>
      </Animated.ScrollView>

      {renderProfileCompletionModal()}
    </View>
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
    zIndex: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  headerBackground: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingTop: 60,
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  welcomeHeader: {
    ...TYPOGRAPHY.h1,
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 8,
    textAlign: "center",
  },
  headerQuote: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
    ...TYPOGRAPHY.bodyMedium,
  },
  collapsedHeaderContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  collapsedHeaderTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 100,
  },

  profileCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  profileCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.text,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  completeProfileButton: {
    backgroundColor: COLORS.primary + "15",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  completeProfileText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  completeProfilePercentage: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginTop: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  missingFieldsText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.text,
    fontStyle: "italic",
  },
  featuredSection: {
    marginBottom: 24,
    paddingLeft: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  viewAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: COLORS.secondary + "15",
  },
  viewAllText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
  featuredCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: 200,
  },
  featuredInfo: {
    padding: 16,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  featuredLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  featuredTags: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    backgroundColor: COLORS.background,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.text,
  },
  eventsSection: {
    marginBottom: 24,
    paddingLeft: 16,
  },
  eventCard: {
    width: 250,
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  eventIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 14,
    color: "#666",
  },
  articlesSection: {
    padding: 16,
  },
  articlesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  articleCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  articleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: COLORS.primary + "15",
    borderRadius: 20,
  },
  navText: {
    fontSize: 12,
    color: COLORS.text,
    marginTop: 4,
  },
  navTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalContainer: {
    width: "85%",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 20,
  },
  missingFieldsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  missingFieldsHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  missingFieldItem: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 10,
    marginBottom: 5,
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 20,
  },
  completeProfileButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
  },
  completeProfileButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 500,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  backgroundDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  backgroundCircle1: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primary + "20",
  },
  backgroundCircle2: {
    position: "absolute",
    bottom: -50,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.secondary + "20",
  },
  modalContent: {
    padding: 25,
    alignItems: "center",
    zIndex: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
  },
  missingFieldsContainer: {
    width: "100%",
    backgroundColor: COLORS.background,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  missingFieldsHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.secondary,
    marginBottom: 10,
    alignItems: "center",
  },
  missingFieldItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkIcon: {
    marginRight: 10,
  },
  missingFieldText: {
    fontSize: 15,
    color: COLORS.text,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: "center",
  },
  completeProfileButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  completeProfileButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    zIndex: 9,
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 500,
    backgroundColor: COLORS.white,
    borderRadius: 25,
    overflow: "hidden",
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: COLORS.primary + "90",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  modalContent: {
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 25,
    alignItems: "center",
  },
  illustrationContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profileCompletionCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: COLORS.white,
    elevation: 10,
    marginBottom: 50,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 25,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  missingFieldsContainer: {
    width: "100%",
    backgroundColor: COLORS.background,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  missingFieldsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  missingFieldsHeaderIcon: {
    marginRight: 10,
  },
  missingFieldsHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  missingFieldItem: {
    marginBottom: 8,
  },
  missingFieldBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 8,
    elevation: 2,
  },
  missingFieldCheckIcon: {
    marginRight: 10,
  },
  missingFieldText: {
    fontSize: 15,
    color: COLORS.text,
  },
  progressSection: {
    width: "100%",
    marginBottom: 20,
  },
  progressLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  completeProfileButton: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  completeProfileButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  buttonIconContainer: {
    backgroundColor: COLORS.primary + "20",
    borderRadius: 20,
    padding: 5,
  },
});

export default HomeScreen;
