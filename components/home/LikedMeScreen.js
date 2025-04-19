"use client";

import { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../../constants/colors";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
const HEADER_HEIGHT = Platform.OS === "ios" ? 100 : 80;

const LIKED_USERS = [
  {
    id: "1",
    name: "Jessica Parker",
    age: 28,
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    distance: "5 miles away",
    matchPercentage: 85,
    isOnline: true,
    lastActive: null,
    interests: ["Photography", "Travel", "Cooking"],
  },
  {
    id: "2",
    name: "Michael Chen",
    age: 31,
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    distance: "12 miles away",
    matchPercentage: 92,
    isOnline: false,
    lastActive: "2h ago",
    interests: ["Hiking", "Technology", "Movies"],
  },
  {
    id: "3",
    name: "Sophia Rodriguez",
    age: 26,
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    distance: "8 miles away",
    matchPercentage: 78,
    isOnline: true,
    lastActive: null,
    interests: ["Fitness", "Music", "Art"],
  },
  {
    id: "4",
    name: "David Kim",
    age: 29,
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    distance: "15 miles away",
    matchPercentage: 88,
    isOnline: false,
    lastActive: "5h ago",
    interests: ["Reading", "Gaming", "Coffee"],
  },
  {
    id: "5",
    name: "Emma Wilson",
    age: 27,
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    distance: "3 miles away",
    matchPercentage: 95,
    isOnline: true,
    lastActive: null,
    interests: ["Yoga", "Painting", "Dancing"],
  },
];

const LikedMeScreen = () => {
  const [selectedTab, setSelectedTab] = useState("all"); 
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -10],
    extrapolate: "clamp",
  });

  const renderInterestTag = (interest) => (
    <View key={interest} style={styles.interestTag}>
      <Text style={styles.interestText}>{interest}</Text>
    </View>
  );

  const renderProfileCard = ({ item, index }) => {
    const gradientDirection =
      index % 2 === 0 ? ["#9e086c", "#c7097e"] : ["#c7097e", "#9e086c"];

    return (
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              {
                scale: scrollY.interpolate({
                  inputRange: [-100, 0, 100 * index, 100 * (index + 1)],
                  outputRange: [1, 1, 1, 0.95],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: `${item.image}?w=500&h=500&fit=crop` }}
            style={styles.profileImage}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.imageGradient}
            start={{ x: 0, y: 0.6 }}
            end={{ x: 0, y: 1 }}
          />
          <View style={styles.onlineIndicatorContainer}>
            <View
              style={[
                styles.onlineIndicator,
                {
                  backgroundColor: item.isOnline
                    ? COLORS.success
                    : "transparent",
                },
              ]}
            />
            <Text style={styles.onlineText}>
              {item.isOnline ? "Online" : item.lastActive}
            </Text>
          </View>

          <View style={styles.matchBadge}>
            <LinearGradient
              colors={gradientDirection}
              style={styles.matchBadgeGradient}
            >
              <Text style={styles.matchPercentage}>
                {item.matchPercentage}%
              </Text>
              <Text style={styles.matchLabel}>Match</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {item.name}, <Text style={styles.age}>{item.age}</Text>
            </Text>
            <TouchableOpacity style={styles.favoriteButton}>
              <View style={styles.favoriteIconContainer}>
                <Text style={styles.favoriteIcon}>♥</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.locationContainer}>
            <Text style={styles.location}>{item.location}</Text>
            <Text style={styles.distance}>{item.distance}</Text>
          </View>

          <View style={styles.interestsContainer}>
            {item.interests.map(renderInterestTag)}
          </View>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.primaryButton}>
              <LinearGradient
                colors={COLORS.primaryGradient}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>Connect</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslate }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Likes You</Text>
        </View>
      </Animated.View>

      <Animated.FlatList
        data={LIKED_USERS}
        renderItem={renderProfileCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          { paddingTop: HEADER_HEIGHT + 20 }, // Adjust top padding to account for header
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    zIndex: 10,
    position: "absolute",
    width: "100%",
  },
  headerContent: {
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: width * 0.09, // Responsive font size
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginBottom: 30,
    overflow: "hidden",
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
    width: CARD_WIDTH,
    alignSelf: "center",
    transform: [{ translateY: 0 }], // This helps with the shadow rendering on Android
  },
  cardImageContainer: {
    position: "relative",
    height: height * 0.25, // Responsive image height
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  onlineIndicatorContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  onlineText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "500",
  },
  matchBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  matchBadgeGradient: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  matchPercentage: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  matchLabel: {
    color: COLORS.white,
    fontSize: 10,
    opacity: 0.8,
  },
  cardContent: {
    padding: 20,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },
  age: {
    fontWeight: "600",
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(158, 8, 108, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteIcon: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  location: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
    marginRight: 8,
  },
  distance: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: "500",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  interestTag: {
    backgroundColor: "rgba(88, 86, 214, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: "500",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  primaryButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginLeft: 8,
  },
  primaryButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "rgba(158, 8, 108, 0.1)",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginRight: 8,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default LikedMeScreen;
