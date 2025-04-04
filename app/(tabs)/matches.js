import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  memo,
  useMemo,
  useContext,
} from "react";
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
  ActivityIndicator,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import { useLocalSearchParams, Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { SharedElement } from "react-navigation-shared-element";
import MaskedView from "@react-native-masked-view/masked-view";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../constants/colors";
import createStyles from "../../styles/matches";
import withProfileCompletion from "../../components/profile/withProfileCompletion";
import { useImageUtils } from "../../hooks/useImageUtils";
import { fetchProfileCompletionData } from "../../store/slices/profileCompletionSlice";
import {
  fetchUserMatches,
  fetchFilteredMatches,
  fetchUserLikes,
  setActiveFilters,
  setLikedFilter,
  clearFilters,
  setActiveTab,
} from "../../store/slices/userMatchesSlice";
import { LanguageContext } from "../../contexts/LanguageContext";

const EmptyStateCard = memo(({ type, styles }) => {
  const { t } = useContext(LanguageContext);

  const messages = {
    preferences: {
      title: t("matches.empty_states.preferences.title"),
      description: t("matches.empty_states.preferences.description"),
      icon: "search",
    },
    suggested: {
      title: t("matches.empty_states.suggested.title"),
      description: t("matches.empty_states.suggested.description"),
      icon: "search",
    },
    liked: {
      title: t("matches.empty_states.liked.title"),
      description: t("matches.empty_states.liked.description"),
      icon: "heart",
    },
  };

  const content = messages[type] || messages.suggested;

  return (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconContainer}>
        <Feather name={content.icon} size={40} color={COLORS.primary} />
      </View>
      <Text style={styles.emptyStateTitle}>{content.title}</Text>
      <Text style={styles.emptyStateDescription}>{content.description}</Text>
    </View>
  );
});

const MatchCard = memo(({ user, onPress, styles }) => {
  const { t } = useContext(LanguageContext);
  const { getProfileImage } = useImageUtils();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.5,
      useNativeDriver: true,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const profileImage = useMemo(() => {
    return getProfileImage(user);
  }, [user, getProfileImage]);

  const fullName = useMemo(
    () => `${user.first_name || ""} ${user.last_name || ""}`.trim(),
    [user.first_name, user.last_name]
  );

  const matchPercentage = user.match_percentage || 85;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onPress(user)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible={true}
      accessibilityLabel={`View profile of ${fullName}, ${matchPercentage}% match`}
    >
      <Animated.View style={[styles.spotlightCard, { transform: [{ scale }] }]}>
        <SharedElement id={`user.${user.id}.image`}>
          <Image
            source={profileImage}
            style={styles.spotlightImage}
            defaultSource={require("../../assets/images/11.jpg")}
          />
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
            </View>
            <View style={styles.matchPercentageContainer}>
              <MaskedView
                maskElement={
                  <View style={styles.progressMask}>
                    <Animated.View
                      style={[
                        styles.progressBar,
                        { width: `${matchPercentage}%` },
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
                {matchPercentage}% {t("matches.cards.match")}
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
            {user.last_active || t("matches.cards.active")}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
});

const QuickMatch = memo(({ user, onPress, styles }) => {
  const { t } = useContext(LanguageContext);
  const { getProfileImage } = useImageUtils();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const profileImage = useMemo(() => {
    return getProfileImage(user, require("../../assets/images/222.jpg"));
  }, [user, getProfileImage]);

  const fullName = useMemo(
    () => `${user.first_name || ""} ${user.last_name || ""}`.trim(),
    [user.first_name, user.last_name]
  );

  const distance = useMemo(
    () =>
      user.distance ||
      `${Math.floor(Math.random() * 10) + 1} ${t("matches.cards.miles_away")}`,
    [user.distance, t]
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onPress(user)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible={true}
      accessibilityLabel={`View profile of ${fullName}, ${user.age || ""}`}
    >
      <Animated.View
        style={[styles.quickMatchCard, { transform: [{ scale }] }]}
      >
        <Image
          source={profileImage}
          style={styles.quickMatchImage}
          defaultSource={require("../../assets/images/222.jpg")}
        />
        <BlurView intensity={80} style={styles.quickMatchInfo}>
          <View style={styles.quickMatchHeader}>
            <Text style={styles.quickMatchName} numberOfLines={1}>
              {fullName || user.first_name || "User"}
            </Text>
            <Text style={styles.quickMatchAge}>{user.age || ""}</Text>
          </View>
          <Text style={styles.quickMatchDistance} numberOfLines={1}>
            {distance}
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
});

const FilterChip = memo(({ label, icon, active, onPress, styles }) => (
  <TouchableOpacity
    style={[styles.filterChip, active && styles.filterChipActive]}
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }}
    accessible={true}
    accessibilityLabel={`${label} filter ${active ? "selected" : ""}`}
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
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
));

const FiltersPanel = memo(
  ({
    showFilters,
    filtersHeight,
    activeFilters,
    dispatch,
    onClose,
    onApply,
    onReset,
    styles,
  }) => {
    const { t } = useContext(LanguageContext);

    return (
      <Animated.View style={[styles.filtersPanel, { height: filtersHeight }]}>
        <BlurView intensity={80} style={StyleSheet.absoluteFill}>
          <ScrollView style={styles.filtersList}>
            <Text style={styles.filtersTitle}>
              {t("matches.filters.title")}
            </Text>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>
                {t("matches.filters.age_range")}
              </Text>
              <View style={styles.ageRangeInputContainer}>
                <View style={styles.ageInputWrapper}>
                  <Text style={styles.ageInputLabel}>
                    {t("matches.filters.min")}
                  </Text>
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
                  <Text style={styles.ageInputLabel}>
                    {t("matches.filters.max")}
                  </Text>
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

            <TouchableOpacity style={styles.applyButton} onPress={onApply}>
              <LinearGradient
                colors={COLORS.primaryGradient}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Text style={styles.applyButtonText}>
                {t("matches.filters.apply")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={onReset}>
              <Text style={styles.resetButtonText}>
                {t("matches.filters.reset")}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </Animated.View>
    );
  }
);

const SectionHeader = memo(
  ({ title, percentage, showPercentage, onSeeAllPress, styles }) => {
    const { t } = useContext(LanguageContext);

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionHeaderRight}>
          {showPercentage && percentage > 0 && (
            <View style={styles.percentageContainer}>
              <Text style={styles.percentageText}>
                {percentage}% {t("matches.sections.match")}
              </Text>
            </View>
          )}
          <TouchableOpacity onPress={onSeeAllPress}>
            <Text style={styles.seeAllButton}>
              {t("matches.sections.see_all")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

const LoadingIndicator = memo(({ styles }) => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
));

const MatchesScreen = () => {
  const { t, isRTL } = useContext(LanguageContext);
  const styles = createStyles(isRTL);

  const [activeFilter, setActiveFilter] = useState("All");
  const [scrollY] = useState(new Animated.Value(0));
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filtersHeight = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const router = useRouter();
  const params = useLocalSearchParams();

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

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 2;

    const fetchInitialData = async () => {
      try {
        setActiveFilter("All");
        dispatch(clearFilters());

        try {
          await dispatch(fetchProfileCompletionData()).unwrap();
        } catch (error) {
          console.warn(
            "Error fetching profile completion data, continuing anyway:",
            error
          );
        }

        if (!isMounted) return;

        await dispatch(fetchUserMatches()).unwrap();

        setTimeout(async () => {
          if (isMounted) {
            try {
              await dispatch(fetchUserLikes()).unwrap();
            } catch (error) {
              console.warn("Error fetching liked users:", error);
            }
          }
        }, 500);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        if (isMounted) {
          if (retryCount < MAX_RETRIES) {
            retryCount++;

            setTimeout(fetchInitialData, 1000);
          } else {
            Alert.alert(t("common.error"), t("matches.errors.data_load"));
          }
        }
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, [dispatch, t]);

  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (activeTab === "Liked" || params.showLiked === "true") {
      setActiveFilter("Liked");

      dispatch(setLikedFilter(true));

      setTimeout(() => {
        dispatch(setActiveTab("All"));
      }, 0);
    }
  }, [params.showLiked, activeTab, dispatch]);

  const prevActiveFilterRef = useRef(activeFilter);
  useEffect(() => {
    if (
      activeFilter === "Liked" &&
      prevActiveFilterRef.current !== "Liked" &&
      !loading.likes
    ) {
      dispatch(fetchUserLikes());
    }

    prevActiveFilterRef.current = activeFilter;
  }, [activeFilter, dispatch, loading.likes]);

  useEffect(() => {
    Animated.spring(filtersHeight, {
      toValue: showFilters ? 350 : 0,
      useNativeDriver: false,
    }).start();
  }, [showFilters, filtersHeight]);

  const handleFilterChange = useCallback(
    (filter) => {
      if (activeFilter === filter) return;

      setActiveFilter(filter);

      if (filter === "All") {
        dispatch(clearFilters());
        dispatch(fetchUserMatches());
      } else if (filter === "Liked") {
        dispatch(setLikedFilter(true));

        if (likedUsers.length === 0 || !loading.likes) {
          dispatch(fetchUserLikes());
        }
      } else {
        dispatch(clearFilters());
        dispatch(setActiveFilters({ isFilter: true }));
        dispatch(fetchFilteredMatches({ isFilter: true }));
      }
    },
    [activeFilter, dispatch, likedUsers.length, loading.likes]
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    const refreshAction =
      activeFilter === "Liked"
        ? dispatch(fetchUserLikes())
        : dispatch(fetchUserMatches());

    refreshAction
      .then(() => setRefreshing(false))
      .catch((error) => {
        console.error("Error refreshing data:", error);
        setRefreshing(false);
        Alert.alert(t("common.error"), t("matches.errors.refresh_failed"));
      });
  }, [dispatch, activeFilter, t]);

  const handleMatchPress = useCallback(
    (user) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      router.push({
        pathname: "/(profile)/matchProfile",
        params: {
          userId: user.id,
          fromTab: activeFilter,
        },
      });
    },
    [router, activeFilter]
  );

  // Handle applying filters
  const handleApplyFilters = useCallback(() => {
    const filters = {
      ...activeFilters,
      isFilter: true,
    };

    if (!filters.age_min && !filters.age_max) {
      delete filters.isFilter;
    }

    dispatch(setActiveFilters(filters));
    dispatch(fetchFilteredMatches(filters));
    setShowFilters(false);
  }, [activeFilters, dispatch]);

  const handleResetFilters = useCallback(() => {
    dispatch(clearFilters());
    dispatch(fetchUserMatches());
    setShowFilters(false);
    setActiveFilter("All");
  }, [dispatch]);

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

  const preferenceSectionTitle = useMemo(
    () =>
      activeFilter === "Liked"
        ? t("matches.sections.profiles_liked")
        : t("matches.sections.preference_matches"),
    [activeFilter, t]
  );

  const suggestedSectionTitle = useMemo(
    () =>
      activeFilter === "Liked"
        ? t("matches.sections.more_profiles_liked")
        : t("matches.sections.suggested_matches"),
    [activeFilter, t]
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
              <Text style={styles.headerTitle}>
                {t("matches.header.discover")}
              </Text>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setShowFilters(!showFilters);
                }}
                accessibilityLabel={
                  showFilters
                    ? t("matches.header.close_filters")
                    : t("matches.header.open_filters")
                }
                accessibilityRole="button"
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

      <FiltersPanel
        showFilters={showFilters}
        filtersHeight={filtersHeight}
        activeFilters={activeFilters}
        dispatch={dispatch}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        styles={styles}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
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
                label={t("matches.filters.all")}
                icon="map-pin"
                active={activeFilter === "All"}
                onPress={() => handleFilterChange("All")}
                styles={styles}
              />
              <FilterChip
                label={t("matches.filters.liked")}
                icon="heart"
                active={activeFilter === "Liked"}
                onPress={() => handleFilterChange("Liked")}
                styles={styles}
              />
            </ScrollView>
          </View>

          <View style={styles.spotlightSection}>
            <SectionHeader
              title={preferenceSectionTitle}
              onSeeAllPress={() => {}}
              styles={styles}
            />

            {activeFilter === "Liked" ? (
              loading.likes ? (
                <LoadingIndicator styles={styles} />
              ) : likedUsers.length === 0 ? (
                <EmptyStateCard type="liked" styles={styles} />
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
                      styles={styles}
                    />
                  ))}
                </ScrollView>
              )
            ) : loading.preferences ? (
              <LoadingIndicator styles={styles} />
            ) : preferenceMatches.length === 0 ? (
              <EmptyStateCard type="preferences" styles={styles} />
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
                    styles={styles}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.quickMatchSection}>
            <SectionHeader
              title={suggestedSectionTitle}
              percentage={suggestionPercentage}
              showPercentage={activeFilter !== "Liked"}
              onSeeAllPress={() => {}}
              styles={styles}
            />

            {activeFilter === "Liked" ? (
              loading.likes ? (
                <LoadingIndicator styles={styles} />
              ) : likedUsers.length === 0 ? (
                <EmptyStateCard type="liked" styles={styles} />
              ) : (
                <View style={styles.quickMatchGrid}>
                  {likedUsers.map((user) => (
                    <QuickMatch
                      key={user.id}
                      user={user}
                      onPress={handleMatchPress}
                      styles={styles}
                    />
                  ))}
                </View>
              )
            ) : loading.suggested ? (
              <LoadingIndicator styles={styles} />
            ) : suggestedMatches.length === 0 ? (
              <EmptyStateCard type="suggested" styles={styles} />
            ) : (
              <View style={styles.quickMatchGrid}>
                {suggestedMatches.map((user) => (
                  <QuickMatch
                    key={user.id}
                    user={user}
                    onPress={handleMatchPress}
                    styles={styles}
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

export default withProfileCompletion(MatchesScreen);
