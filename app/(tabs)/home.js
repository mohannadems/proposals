import React, { useState } from "react";
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

const COLORS = {
  primary: "#B65165",
  secondary: "#5856D6",
  background: "#F8F9FA",
  white: "#FFFFFF",
  text: "#1C1C1E",
  error: "#FF3B30",
  success: "#34C759",
  border: "#E5E5EA",
};
import { router } from "expo-router";
import statickImage from "../../assets/images/11.jpg";
const HEADER_MAX_HEIGHT = 250;
const HEADER_MIN_HEIGHT = 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const HomeScreen = () => {
  const scrollY = new Animated.Value(0);
  const [user] = useState({
    name: "Alex",
    age: 28,
    profileCompletion: 65,
    missingFields: ["photos", "work", "bio"],
  });

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
          <View style={styles.headerTextContainer}>
            <Text style={styles.welcomeHeader}>Find Love Today</Text>
            <Text style={styles.headerQuote}>
              "Every great love story starts with a simple hello"
            </Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1.2K</Text>
                <Text style={styles.statLabel}>Active Users</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>85%</Text>
                <Text style={styles.statLabel}>Match Rate</Text>
              </View>
            </View>
          </View>
        </Animated.View>
        <Animated.View
          style={[
            styles.collapsedHeaderContent,
            { opacity: headerTitleOpacity },
          ]}
        >
          <Text style={styles.collapsedHeaderTitle}>Love Journey</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );

  const renderProfileCard = () => (
    <View style={styles.profileCard}>
      <View style={styles.profileCardHeader}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{user.name} ✨</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(profile)/FillProfileData")}
          style={styles.completeProfileButton}
        >
          <Text style={styles.completeProfileText}>Complete Profile</Text>
          <Text style={styles.completeProfilePercentage}>
            {user.profileCompletion}%
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.progressBarContainer}>
        <View
          style={[styles.progressBar, { width: `${user.profileCompletion}%` }]}
        />
      </View>
    </View>
  );

  const renderDailyMatches = () => (
    <View style={styles.matchesSection}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Perfect Matches</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2, 3].map((index) => (
          <TouchableOpacity key={index} style={styles.matchCard}>
            <Image source={statickImage} style={styles.matchImage} />
            <View style={styles.matchOverlay}>
              <View style={styles.matchBadge}>
                <Text style={styles.matchPercentage}>95% Match</Text>
              </View>
            </View>
            <View style={styles.matchInfo}>
              <Text style={styles.matchName}>Sarah, 26</Text>
              <Text style={styles.matchLocation}>2 miles away</Text>
              <View style={styles.matchTags}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Artist</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Travel</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderNearbySection = () => (
    <View style={styles.nearbySection}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Nearby Singles</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.nearbyGrid}>
        {[1, 2, 3, 4].map((index) => (
          <TouchableOpacity key={index} style={styles.nearbyCard}>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              style={styles.nearbyImage}
            />
            <View style={styles.nearbyInfo}>
              <Text style={styles.nearbyName}>Jessica, 24</Text>
              <Text style={styles.nearbyDistance}>1.5 miles</Text>
            </View>
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
          {renderDailyMatches()}
          {renderNearbySection()}
        </View>
      </Animated.ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={[styles.navText, styles.navTextActive]}>Matches</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
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
  headerTextContainer: {
    alignItems: "center",
  },
  welcomeHeader: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 8,
  },
  headerQuote: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: "center",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.white,
    opacity: 0.3,
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
  // ... (continuing with more styles)
  matchesSection: {
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
  matchCard: {
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
  matchImage: {
    width: "100%",
    height: 250,
  },
  matchOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  matchBadge: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  matchPercentage: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  matchInfo: {
    padding: 16,
  },
  matchName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  matchLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  matchTags: {
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
  nearbySection: {
    padding: 16,
  },
  nearbyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  nearbyCard: {
    width: "47%",
    borderRadius: 16,
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  nearbyImage: {
    width: "100%",
    height: 180,
  },
  nearbyInfo: {
    padding: 12,
  },
  nearbyName: {
    fontSize: 16,
    fontWeight: "600",
  },
  nearbyDistance: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
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
    fontSize: 14,
    color: COLORS.text,
  },
  navTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});

export default HomeScreen;
