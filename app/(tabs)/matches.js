"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  PanResponder,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { SharedElement } from "react-navigation-shared-element";
import MaskedView from "@react-native-masked-view/masked-view";
import { COLORS } from "../../constants/colors";
import { useRoute } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = height * 0.7;
import { Link } from "expo-router";
import withProfileCompletion from "../../components/profile/withProfileCompletion";

const users = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 26,
    location: "New York, NY",
    bio: "Adventure seeker & coffee enthusiast ✨",
    images: [require("../../assets/images/11.jpg")],
    interests: ["Travel", "Photography", "Yoga"],
    matchPercentage: 95,
    premium: true,
    lastActive: "Just now",
    verified: true,
    distance: "2 miles away",
  },
  {
    id: 2,
    name: "Michael Chen",
    age: 28,
    location: "San Francisco, CA",
    bio: "Tech lover & foodie 🍜",
    images: [require("../../assets/images/222.jpg")],
    interests: ["Cooking", "Gaming", "Hiking"],
    matchPercentage: 88,
    premium: false,
    lastActive: "2h ago",
    verified: true,
    distance: "5 miles away",
  },
  // Add more users...
];

const SpotlightCard = ({ user, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.5,
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
    >
      <Animated.View style={[styles.spotlightCard, { transform: [{ scale }] }]}>
        <SharedElement id={`user.${user.id}.image`}>
          <Image source={user.images[0]} style={styles.spotlightImage} />
        </SharedElement>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.spotlightGradient}
        >
          <BlurView intensity={80} style={styles.spotlightInfo}>
            <View style={styles.spotlightHeader}>
              <View style={styles.nameVerifiedContainer}>
                <Text style={styles.spotlightName}>
                  {user.name}, {user.age}
                </Text>
                {user.verified && (
                  <View style={styles.verifiedBadge}>
                    <Feather name="check" size={12} color={COLORS.white} />
                  </View>
                )}
              </View>
              <Text style={styles.spotlightLocation}>{user.location}</Text>
            </View>
            <View style={styles.matchPercentageContainer}>
              <MaskedView
                maskElement={
                  <View style={styles.progressMask}>
                    <Animated.View
                      style={[
                        styles.progressBar,
                        { width: `${user.matchPercentage}%` },
                      ]}
                    />
                  </View>
                }
              >
                <LinearGradient
                  colors={COLORS.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressGradient}
                />
              </MaskedView>
              <Text style={styles.matchPercentage}>
                {user.matchPercentage}% Match
              </Text>
            </View>
          </BlurView>
        </LinearGradient>
        {user.premium && (
          <View style={styles.premiumBadge}>
            <Feather name="star" size={12} color={COLORS.primary} />
          </View>
        )}
        <View style={styles.activeStatus}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>{user.lastActive}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const QuickMatch = ({ user, onPress }) => {
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
    >
      <Animated.View
        style={[styles.quickMatchCard, { transform: [{ scale }] }]}
      >
        <Image source={user.images[0]} style={styles.quickMatchImage} />
        <BlurView intensity={80} style={styles.quickMatchInfo}>
          <View style={styles.quickMatchHeader}>
            <Text style={styles.quickMatchName}>{user.name}</Text>
            <Text style={styles.quickMatchAge}>{user.age}</Text>
          </View>
          <Text style={styles.quickMatchDistance}>{user.distance}</Text>
        </BlurView>
        {user.premium && (
          <LinearGradient
            colors={COLORS.primaryGradient}
            style={styles.premiumRing}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const FilterChip = ({ label, icon, active, onPress }) => (
  <TouchableOpacity
    style={[styles.filterChip, active && styles.filterChipActive]}
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }}
  >
    <LinearGradient
      colors={active ? COLORS.primaryGradient : ["transparent", "transparent"]}
      style={StyleSheet.absoluteFill}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    />
    <Feather
      name={icon}
      size={16}
      color={active ? COLORS.white : COLORS.text}
    />
    <Text
      style={[styles.filterChipText, active && styles.filterChipTextActive]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const MatchesScreen = () => {
  const [activeFilter, setActiveFilter] = useState("nearby");
  const [scrollY] = useState(new Animated.Value(0));
  const [showFilters, setShowFilters] = useState(false);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [
      Platform.OS === "ios" ? 130 : 100,
      Platform.OS === "ios" ? 120 : 60,
    ],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.98],
    extrapolate: "clamp",
  });

  const filtersHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(filtersHeight, {
      toValue: showFilters ? 280 : 0,
      useNativeDriver: false,
    }).start();
  }, [showFilters, filtersHeight]); // Added filtersHeight to dependencies

  const handleMatchPress = useCallback((user) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log("Match pressed:", user.id);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View
        style={[
          styles.header,
          { height: headerHeight, opacity: headerOpacity },
        ]}
      >
        <BlurView intensity={80} style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={COLORS.primaryGradient}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Discover</Text>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setShowFilters(!showFilters);
                }}
              >
                <Feather
                  name={showFilters ? "x" : "sliders"}
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </BlurView>
      </Animated.View>

      <Animated.View style={[styles.filtersPanel, { height: filtersHeight }]}>
        <BlurView intensity={80} style={StyleSheet.absoluteFill}>
          <ScrollView style={styles.filtersList}>
            <Text style={styles.filtersTitle}>Filters</Text>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Distance</Text>
              {/* Add distance slider here */}
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Age Range</Text>
              {/* Add age range slider here */}
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Interests</Text>
              <View style={styles.interestGrid}>
                {/* Add interest selection here */}
              </View>
            </View>
          </ScrollView>
        </BlurView>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          scrollY.setValue(offsetY);
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <View style={styles.filterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              <FilterChip
                label="Nearby"
                icon="map-pin"
                active={activeFilter === "nearby"}
                onPress={() => setActiveFilter("nearby")}
              />
              <FilterChip
                label="Online"
                icon="wifi"
                active={activeFilter === "online"}
                onPress={() => setActiveFilter("online")}
              />
              <FilterChip
                label="New"
                icon="star"
                active={activeFilter === "new"}
                onPress={() => setActiveFilter("new")}
              />
              <FilterChip
                label="Popular"
                icon="trending-up"
                active={activeFilter === "popular"}
                onPress={() => setActiveFilter("popular")}
              />
            </ScrollView>
          </View>

          <View style={styles.spotlightSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Spotlight</Text>
              <TouchableOpacity>
                <Link href="../(profile)/matchProfile">
                  <Text style={styles.seeAllButton}>See All</Text>
                </Link>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.spotlightScroll}
            >
              {users.map((user) => (
                <SpotlightCard
                  key={user.id}
                  user={user}
                  onPress={() => handleMatchPress(user)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.quickMatchSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Matches</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllButton}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.quickMatchGrid}>
              {users.map((user) => (
                <QuickMatch
                  key={user.id}
                  user={user}
                  onPress={() => handleMatchPress(user)}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    width: "100%",
    position: "absolute",
    top: 0,
    overflow: "hidden",
    zIndex: 100,
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 10,
  },
  headerContent: {
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: COLORS.white,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  filtersPanel: {
    position: "absolute",
    top: Platform.OS === "ios" ? 120 : 100,
    left: 0,
    right: 0,
    zIndex: 99,
    overflow: "hidden",
    zIndex: 100,
    backgroundColor: COLORS.primary,
  },
  filtersList: {
    padding: 20,
  },
  filtersTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 120 : 100,
  },
  content: {
    padding: 20,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterScroll: {
    paddingRight: 20,
    gap: 12,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    gap: 8,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  filterChipActive: {
    backgroundColor: "transparent",
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  spotlightSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  spotlightScroll: {
    paddingRight: 20,
    gap: 16,
  },
  spotlightCard: {
    width: CARD_WIDTH * 0.8,
    height: CARD_HEIGHT * 0.6,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  spotlightImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  spotlightGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  spotlightInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  spotlightHeader: {
    marginBottom: 12,
  },
  nameVerifiedContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  spotlightName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
  },
  spotlightLocation: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  matchPercentageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressMask: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "white",
  },
  progressGradient: {
    height: 4,
    width: "100%",
  },
  matchPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },
  premiumBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  activeStatus: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  activeText: {
    fontSize: 12,
    color: COLORS.white,
  },
  quickMatchSection: {
    marginBottom: 20,
  },
  quickMatchGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  quickMatchCard: {
    width: (width - 56) / 2,
    height: ((width - 56) / 2) * 1.3,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  quickMatchImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  quickMatchInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  quickMatchHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  quickMatchName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  quickMatchAge: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
  },
  quickMatchDistance: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
  },
  premiumRing: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 18,
    zIndex: -1,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.5,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  infoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userInfo: {
    marginBottom: 12,
  },
  bioContainer: {
    gap: 12,
  },
  bio: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
  },
  interests: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  choiceContainer: {
    position: "absolute",
    top: 50,
    padding: 20,
  },
  choiceBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 3,
  },
  likeBox: {
    right: 40,
    borderColor: COLORS.success,
  },
  nopeBox: {
    left: 40,
    borderColor: COLORS.error,
  },
  choiceText: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 20,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
});

export default withProfileCompletion(MatchesScreen);
