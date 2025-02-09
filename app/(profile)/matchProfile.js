import React, { useState, useRef, useCallback } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { SharedElement } from "react-navigation-shared-element";
import { COLORS } from "../../constants/colors";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = Platform.OS === "ios" ? 520 : 280;
const matchData = {
  id: 1,
  name: "Sarah Johnson",
  age: 26,
  location: "New York, NY",
  bio: "Adventure seeker & coffee enthusiast ✨ Love exploring new places and meeting new people. Always up for a good conversation over coffee!",
  occupation: "UX Designer at Google",
  education: "Master Design, NYU",
  images: [
    require("../../assets/images/11.jpg"),
    require("../../assets/images/222.jpg"),
    require("../../assets/images/444.jpg"),
  ],
  interests: ["Travel", "Photography", "Yoga", "Coffee", "Art", "Music"],
  matchPercentage: 95,
  premium: true,
  lastActive: "Just now",
  verified: true,
  distance: "2 miles away",
  stats: {
    height: "5'7\"",
    exercise: "4-5 times a week",
    drinking: "Social drinker",
    smoking: "Never",
    looking: "Long-term relationship",
    children: "Want someday",
    pets: "Dog lover 🐕",
    zodiac: "Libra",
  },
};
const ScrollableHeaderContent = ({ scrollY, matchData }) => {
  const translateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 200],
    outputRange: [HEADER_HEIGHT, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[styles.scrollableHeaderContent, { transform: [{ translateY }] }]}
    >
      <View style={styles.profileHeader}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>
            {matchData.name}, {matchData.age}
          </Text>
          {matchData.verified && (
            <View style={styles.verifiedBadge}>
              <Feather name="check" size={12} color={COLORS.white} />
            </View>
          )}
          {matchData.premium && (
            <View style={styles.premiumBadge}>
              <Feather name="star" size={12} color={COLORS.primary} />
            </View>
          )}
        </View>
        <Text style={styles.location}>{matchData.location}</Text>
        <View style={styles.matchPercentage}>
          <LinearGradient
            colors={COLORS.primaryGradient}
            style={styles.matchBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.matchText}>
              {matchData.matchPercentage}% Match
            </Text>
          </LinearGradient>
        </View>
      </View>
    </Animated.View>
  );
};
const ImageCarousel = ({ images, onPageChange }) => {
  const flatListRef = useRef(null);

  const renderItem = ({ item }) => (
    <Image
      source={item}
      style={{
        width,
        height: HEADER_HEIGHT,
        resizeMode: "cover",
      }}
    />
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      onPageChange(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <FlatList
      ref={flatListRef}
      data={images}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      keyExtractor={(_, index) => index.toString()}
    />
  );
};
const ActionButton = ({ icon, label, onPress, primary }) => {
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
        style={[
          styles.actionButton,
          primary ? styles.primaryButton : styles.secondaryButton,
          { transform: [{ scale }] },
        ]}
      >
        <LinearGradient
          colors={
            primary ? COLORS.primaryGradient : ["transparent", "transparent"]
          }
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Feather
          name={icon}
          size={24}
          color={primary ? COLORS.white : COLORS.primary}
        />
        <Text
          style={[styles.actionButtonText, primary && styles.primaryButtonText]}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
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
      <Text style={styles.statValue}>{value}</Text>
    </View>
  </View>
);
const matchProfileScreen = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;

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

  const handleMessage = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Handle message action
  }, []);

  const handleLike = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Handle like action
  }, []);

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View style={{ opacity: imageOpacity }}>
          <ImageCarousel
            images={matchData.images}
            onPageChange={setCurrentImageIndex}
          />
        </Animated.View>
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "transparent"]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Feather name="arrow-left" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.imageIndicators}>
              {matchData.images.map((_, index) => (
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
        <ScrollableHeaderContent scrollY={scrollY} matchData={matchData} />
      </Animated.View>
      <ScrollView
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
                {matchData.name}, {matchData.age}
              </Text>
              {matchData.verified && (
                <View style={styles.verifiedBadge}>
                  <Feather name="check" size={12} color={COLORS.white} />
                </View>
              )}
              {matchData.premium && (
                <View style={styles.premiumBadge}>
                  <Feather name="star" size={12} color={COLORS.primary} />
                </View>
              )}
            </View>
            <Text style={styles.location}>{matchData.location}</Text>
            <View style={styles.matchPercentage}>
              <LinearGradient
                colors={COLORS.primaryGradient}
                style={styles.matchBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.matchText}>
                  {matchData.matchPercentage}% Match
                </Text>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.actions}>
            <ActionButton
              icon="message-circle"
              label="Message"
              onPress={handleMessage}
              primary
            />
            <ActionButton icon="heart" label="Like" onPress={handleLike} />
          </View>
          <InfoCard title="About" icon="user">
            <Text style={styles.bio}>{matchData.bio}</Text>
            <View style={styles.basicInfo}>
              <View style={styles.infoRow}>
                <Feather name="briefcase" size={16} color={COLORS.primary} />
                <Text style={styles.infoText}>{matchData.occupation}</Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="book" size={16} color={COLORS.primary} />
                <Text style={styles.infoText}>{matchData.education}</Text>
              </View>
            </View>
          </InfoCard>

          <InfoCard title="Interests" icon="heart">
            <View style={styles.interests}>
              {matchData.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </InfoCard>

          <InfoCard title="Basic Info" icon="info">
            <View style={styles.statsGrid}>
              <StatItem
                label="Height"
                value={matchData.stats.height}
                icon="ruler"
              />
              <StatItem
                label="Exercise"
                value={matchData.stats.exercise}
                icon="activity"
              />
              <StatItem
                label="Drinking"
                value={matchData.stats.drinking}
                icon="wine"
              />
              <StatItem
                label="Smoking"
                value={matchData.stats.smoking}
                icon="x-circle"
              />
              <StatItem
                label="Looking for"
                value={matchData.stats.looking}
                icon="search"
              />
              <StatItem
                label="Children"
                value={matchData.stats.children}
                icon="users"
              />
              <StatItem
                label="Pets"
                value={matchData.stats.pets}
                icon="github"
              />
              <StatItem
                label="Zodiac"
                value={matchData.stats.zodiac}
                icon="star"
              />
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
              <Text style={styles.reportText}>Report {matchData.name}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  actions: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  primaryButtonText: {
    color: COLORS.white,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
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
  reportContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
  },
  reportText: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
  },
  scrollableHeaderContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
  },
});
export default matchProfileScreen;
