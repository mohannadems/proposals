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
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { TYPOGRAPHY } from "../../constants/typography";
import { COLORS } from "../../constants/colors";

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 80;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const HomeScreen = () => {
  const scrollY = new Animated.Value(0);
  const [user, setUser] = useState({
    name: "Ahmed",
    age: 28,
    profileCompletion: 65,
    missingFields: ["photos", "education", "profession"],
  });
  const [showProfileCompletion, setShowProfileCompletion] = useState(true);

  useEffect(() => {
    // Check if it's the user's first login or if they haven't completed their profile
    // This is where you'd typically check your app's state or make an API call
    const checkProfileCompletion = async () => {
      // Simulating an API call or state check
      const isFirstLogin = await localStorage.getItem("isFirstLogin");
      if (isFirstLogin === null) {
        setShowProfileCompletion(true);
        localStorage.setItem("isFirstLogin", "false");
      } else {
        setShowProfileCompletion(user.profileCompletion < 100);
      }
    };

    checkProfileCompletion();
  }, []);

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
});

export default HomeScreen;
