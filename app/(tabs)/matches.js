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
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from "react-native";
import { useRoute } from "expo-router";
import { setActiveTab } from "../../store/slices/userMatchesSlice";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { SharedElement } from "react-navigation-shared-element";
import MaskedView from "@react-native-masked-view/masked-view";
import { useLocalSearchParams } from "expo-router";
import { COLORS } from "../../constants/colors";
import { Link, useRouter } from "expo-router";
import withProfileCompletion from "../../components/profile/withProfileCompletion";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileCompletionData } from "../../store/slices/profileCompletionSlice";
import {
  fetchUserMatches,
  fetchFilteredMatches,
  fetchUserLikes,
  setActiveFilters,
  setLikedFilter,
  clearFilters,
} from "../../store/slices/userMatchesSlice";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = height * 0.7;

// Empty state component for when no matches are found
const EmptyStateCard = ({ type }) => {
  const messages = {
    preferences: {
      title: "No Preference Matches",
      description:
        "We couldn't find exact matches for your preferences. Try adjusting your search criteria.",
    },
    suggested: {
      title: "No Suggested Matches",
      description:
        "No suggested matches at the moment. Check back later or modify your filters.",
    },
    liked: {
      title: "No Liked Profiles",
      description:
        "You haven't liked anyone yet. Browse matches and tap the heart icon to see them here.",
    },
  };

  const content = messages[type] || messages.suggested;

  return (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconContainer}>
        <Feather
          name={type === "liked" ? "heart" : "search"}
          size={40}
          color={COLORS.primary}
        />
      </View>
      <Text style={styles.emptyStateTitle}>{content.title}</Text>
      <Text style={styles.emptyStateDescription}>{content.description}</Text>
    </View>
  );
};

const MatchCard = ({ user, onPress }) => {
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

  // Get the main profile photo
  const mainPhoto =
    user.photos && user.photos.length > 0
      ? user.photos.find((photo) => photo.is_main === 1) || user.photos[0]
      : null;

  // Check if user has a photo property, fallback to a default image
  const profileImage =
    mainPhoto && mainPhoto.photo_url
      ? { uri: mainPhoto.photo_url }
      : require("../../assets/images/11.jpg");

  // Format full name
  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onPress(user)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.spotlightCard, { transform: [{ scale }] }]}>
        <SharedElement id={`user.${user.id}.image`}>
          <Image source={profileImage} style={styles.spotlightImage} />
        </SharedElement>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.spotlightGradient}
        >
          <BlurView intensity={80} style={styles.spotlightInfo}>
            <View style={styles.spotlightHeader}>
              <View style={styles.nameVerifiedContainer}>
                <Text style={styles.spotlightName}>
                  {fullName || user.first_name || "User"}
                  {user.age ? `, ${user.age}` : ""}
                </Text>
                {user.verified && (
                  <View style={styles.verifiedBadge}>
                    <Feather name="check" size={12} color={COLORS.white} />
                  </View>
                )}
              </View>
              {/* <Text style={styles.spotlightLocation}>
                {user.location || user.city || "Unknown location"}
              </Text> */}
            </View>
            <View style={styles.matchPercentageContainer}>
              <MaskedView
                maskElement={
                  <View style={styles.progressMask}>
                    <Animated.View
                      style={[
                        styles.progressBar,
                        { width: `${user.match_percentage || 85}%` },
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
                {user.match_percentage || 85}% Match
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
          <Text style={styles.activeText}>
            {user.last_active || "Just now"}
          </Text>
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

  // Get the main profile photo
  const mainPhoto =
    user.photos && user.photos.length > 0
      ? user.photos.find((photo) => photo.is_main === 1) || user.photos[0]
      : null;

  // Check if user has a photo property, fallback to a default image
  const profileImage =
    mainPhoto && mainPhoto.photo_url
      ? { uri: mainPhoto.photo_url }
      : require("../../assets/images/222.jpg");

  // Format full name
  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onPress(user)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[styles.quickMatchCard, { transform: [{ scale }] }]}
      >
        <Image source={profileImage} style={styles.quickMatchImage} />
        <BlurView intensity={80} style={styles.quickMatchInfo}>
          <View style={styles.quickMatchHeader}>
            <Text style={styles.quickMatchName}>
              {fullName || user.first_name || "User"}
            </Text>
            <Text style={styles.quickMatchAge}>{user.age || ""}</Text>
          </View>
          <Text style={styles.quickMatchDistance}>
            {user.distance ||
              `${Math.floor(Math.random() * 10) + 1} miles away`}
          </Text>
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
  const [activeFilter, setActiveFilter] = useState("All");
  const [scrollY] = useState(new Animated.Value(0));
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useLocalSearchParams();
  // Get data from Redux state
  const {
    preferenceMatches,
    suggestedMatches,
    likedUsers,
    suggestionPercentage,
    loading,
    error,
    activeFilters,
    activeTab,
  } = useSelector((state) => state.userMatches);

  // On component mount, fetch profile data, matches, and liked users
  useEffect(() => {
    dispatch(fetchProfileCompletionData());

    // Set "All" as default and fetch initial matches without filter flag
    setActiveFilter("All");
    dispatch(clearFilters());
    dispatch(fetchUserMatches());

    // Also fetch liked users so they're available when filter is changed
    dispatch(fetchUserLikes());
  }, [dispatch]);

  useEffect(() => {
    // If activeTab is set to "Liked" in Redux, or we have a parameter to show liked
    // This handles navigation from other screens after liking
    if (activeTab === "Liked" || params.showLiked === "true") {
      setActiveFilter("Liked");

      // Delay the filter change slightly to ensure animations work properly
      setTimeout(() => {
        handleFilterChange("Liked");

        // Reset the activeTab in Redux after using it
        dispatch(setActiveTab("All"));
      }, 200);
    }
  }, [activeTab, params, dispatch]);

  // Handle filter chip clicks
  const handleFilterChange = (filter) => {
    // Don't do anything if the filter is already active
    if (activeFilter === filter) return;

    setActiveFilter(filter);

    if (filter === "All") {
      // For "All", reset filters and show regular matches
      dispatch(clearFilters());
      dispatch(fetchUserMatches());
    } else if (filter === "Liked") {
      // For "Liked", set the liked filter flag to true
      dispatch(setLikedFilter(true));

      // Refresh liked users data (in case there are new likes)
      dispatch(fetchUserLikes());
    } else {
      // For other filters (like "nearby"), handle accordingly
      dispatch(clearFilters());
      dispatch(setActiveFilters({ isFilter: true }));
      dispatch(fetchFilteredMatches({ isFilter: true }));
    }
  };

  // Handle refresh based on active filter
  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    if (activeFilter === "Liked") {
      // Refresh liked users
      dispatch(fetchUserLikes()).finally(() => setRefreshing(false));
    } else {
      // Refresh regular matches
      dispatch(fetchUserMatches()).finally(() => setRefreshing(false));
    }
  }, [dispatch, activeFilter]);

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
      toValue: showFilters ? 350 : 0,
      useNativeDriver: false,
    }).start();
  }, [showFilters, filtersHeight]);

  const handleMatchPress = useCallback(
    (user) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // Navigate to user profile details using expo-router
      router.push({
        pathname: "/(profile)/matchProfile",
        params: { userId: user.id },
      });
    },
    [router]
  );

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
              <Text style={styles.filterSectionTitle}>Age Range</Text>
              <View style={styles.ageRangeInputContainer}>
                <View style={styles.ageInputWrapper}>
                  <Text style={styles.ageInputLabel}>Min</Text>
                  <TextInput
                    style={styles.ageInput}
                    placeholder="18"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    keyboardType="number-pad"
                    maxLength={2}
                    value={
                      activeFilters.age_min
                        ? activeFilters.age_min.toString()
                        : ""
                    }
                    onChangeText={(text) => {
                      dispatch(
                        setActiveFilters({
                          age_min: text ? parseInt(text) : null,
                        })
                      );
                    }}
                  />
                </View>
                <View style={styles.ageSeparator} />
                <View style={styles.ageInputWrapper}>
                  <Text style={styles.ageInputLabel}>Max</Text>
                  <TextInput
                    style={styles.ageInput}
                    placeholder="50"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    keyboardType="number-pad"
                    maxLength={2}
                    value={
                      activeFilters.age_max
                        ? activeFilters.age_max.toString()
                        : ""
                    }
                    onChangeText={(text) => {
                      dispatch(
                        setActiveFilters({
                          age_max: text ? parseInt(text) : null,
                        })
                      );
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Apply Filter Button */}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                // Apply the filters
                const filters = {
                  ...activeFilters,
                  isFilter: true,
                };

                if (!filters.age_min && !filters.age_max) {
                  // If no age filters, don't send isFilter
                  delete filters.isFilter;
                }

                dispatch(setActiveFilters(filters));
                dispatch(fetchFilteredMatches(filters));
                setShowFilters(false);
              }}
            >
              <LinearGradient
                colors={COLORS.primaryGradient}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>

            {/* Reset Filters Button */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                dispatch(clearFilters());
                // Reset by fetching without isFilter parameter
                dispatch(fetchUserMatches());
                setShowFilters(false);
                setActiveFilter("All");
              }}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={styles.content}>
          <View style={styles.filterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              <FilterChip
                label="All"
                icon="map-pin"
                active={activeFilter === "All"}
                onPress={() => handleFilterChange("All")}
              />
              <FilterChip
                label="Liked"
                icon="heart"
                active={activeFilter === "Liked"}
                onPress={() => handleFilterChange("Liked")}
              />
            </ScrollView>
          </View>

          {/* Preference Matches Section (formerly Spotlight) */}
          <View style={styles.spotlightSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {activeFilter === "Liked"
                  ? "Profiles You Liked"
                  : "Preference Matches"}
              </Text>
              <TouchableOpacity>
                <Link href="../(profile)/match-screen">
                  <Text style={styles.seeAllButton}>See All</Text>
                </Link>
              </TouchableOpacity>
            </View>

            {activeFilter === "Liked" ? (
              // Liked filter selected
              loading.likes ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
              ) : likedUsers.length === 0 ? (
                <EmptyStateCard type="liked" />
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.spotlightScroll}
                >
                  {likedUsers.map((user, index) => (
                    <MatchCard
                      key={user.id ? `user-${user.id}` : `liked-${index}`}
                      user={user}
                      onPress={handleMatchPress}
                    />
                  ))}
                </ScrollView>
              )
            ) : // All or other filter selected
            loading.preferences ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            ) : preferenceMatches.length === 0 ? (
              <EmptyStateCard type="preferences" />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.spotlightScroll}
              >
                {preferenceMatches.map((user) => (
                  <MatchCard
                    key={user.id}
                    user={user}
                    onPress={handleMatchPress}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          {/* Suggested Matches Section (formerly Quick Matches) */}
          <View style={styles.quickMatchSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {activeFilter === "Liked"
                  ? "More Profiles may Liked"
                  : "Suggested Matches"}
              </Text>
              <View style={styles.sectionHeaderRight}>
                {activeFilter !== "Liked" && suggestionPercentage > 0 && (
                  <View style={styles.percentageContainer}>
                    <Text style={styles.percentageText}>
                      {suggestionPercentage}% match
                    </Text>
                  </View>
                )}
                <TouchableOpacity>
                  <Text style={styles.seeAllButton}>See All</Text>
                </TouchableOpacity>
              </View>
            </View>

            {activeFilter === "Liked" ? (
              // Liked filter selected for bottom section
              loading.likes ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
              ) : likedUsers.length === 0 ? (
                <EmptyStateCard type="liked" />
              ) : (
                <View style={styles.quickMatchGrid}>
                  {likedUsers.map((user) => (
                    <QuickMatch
                      key={user.id}
                      user={user}
                      onPress={handleMatchPress}
                    />
                  ))}
                </View>
              )
            ) : // All or other filter selected for bottom section
            loading.suggested ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            ) : suggestedMatches.length === 0 ? (
              <EmptyStateCard type="suggested" />
            ) : (
              <View style={styles.quickMatchGrid}>
                {suggestedMatches.map((user) => (
                  <QuickMatch
                    key={user.id}
                    user={user}
                    onPress={handleMatchPress}
                  />
                ))}
              </View>
            )}
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
  sectionHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  percentageContainer: {
    marginRight: 10,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.primary,
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
    width: 100,
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
  loaderContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButton: {
    marginTop: 10,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  resetButton: {
    marginTop: 10,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.white,
  },
  ageRangeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  ageInputWrapper: {
    flex: 1,
  },
  ageInputLabel: {
    fontSize: 12,
    color: COLORS.white,
    marginBottom: 4,
  },
  ageInput: {
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    color: COLORS.white,
    fontSize: 16,
    paddingHorizontal: 15,
    textAlign: "center",
  },
  ageSeparator: {
    width: 20,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 10,
  },
  // Empty state styles
  emptyStateContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  emptyStateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 10,
    textAlign: "center",
  },
  emptyStateDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
    opacity: 0.7,
    textAlign: "center",
  },
});

export default withProfileCompletion(MatchesScreen);
