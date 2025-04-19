import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from "react";
import {
  View,
  Text,
  Animated,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  Alert,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { authService } from "../../services/auth.service";
import { COLORS } from "../../constants/colors";
import withProfileCompletion from "../../components/profile/withProfileCompletion";
import LoadingScreen from "../../components/partner/LoadingScreen";
import ErrorView from "../../components/partner/ErrorView";

import SearchHeader from "../../components/partner/SearchHeader";
import FilterProgressTracker from "../../components/search/FilterProgressTracker";
import BasicInfoFilterSection from "../../components/search/BasicInfoFilterSection";
import EducationFilterSection from "../../components/search/EducationFilterSection";
import PersonalFilterSection from "../../components/search/PersonalFilterSection";
import LifestyleFilterSection from "../../components/search/LifestyleFilterSection";
import SearchActionButtons from "../../components/search/SearchActionButtons";
import SavedPreferencesMessage from "../../components/search/SavedPreferencesMessage";

import {
  getSavedPreferences,
  submitSearchPreferences,
  updatePreference,
  resetPreferences,
  setInitialLoadComplete,
  clearError,
  manuallySetLoading,
  selectIsBasicSectionComplete,
} from "../../store/slices/searchSlice";
import {
  fetchAllProfileData,
  selectGeographic,
  selectPersonalAttributes,
  selectProfessionalEducational,
  selectLifestyleInterests,
  fetchCitiesByCountry,
  selectCities,
  selectDirectMarriageBudget,
  selectDirectReligiosityLevels,
} from "../../store/slices/profileAttributesSlice";
import { LanguageContext } from "../../contexts/LanguageContext";

import createUnifiedSearchStyles from "../../styles/SearchScreen";

const STICKY_HEADER_HEIGHT = 50;
const FILTER_TRACKER_HEIGHT = 180;

const SECTIONS = [
  {
    id: "basic",
    title: "Basic Information",
    titleKey: "search.sections.basic.title",
  },
  {
    id: "education",
    title: "Education & Career",
    titleKey: "search.sections.education.title",
  },
  {
    id: "personal",
    title: "Personal Attributes",
    titleKey: "search.sections.personal.title",
  },
  {
    id: "lifestyle",
    title: "Lifestyle & Interests",
    titleKey: "search.sections.lifestyle.title",
  },
];

const UnifiedSearchScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const getPresetLabel = useCallback(
    (min, max) => {
      if (min === 18 && max === 25)
        return t ? t("age_presets.young_adult") : "Young Adult (18-25)";
      if (min === 26 && max === 35)
        return t ? t("age_presets.early_career") : "Early Career (26-35)";
      if (min === 36 && max === 45)
        return t ? t("age_presets.established") : "Established (36-45)";
      if (min === 46 && max === 70)
        return t ? t("age_presets.mature") : "Mature (46-70)";
      return t ? t("age_presets.all_ages") : "All Ages (18-70)";
    },
    [t]
  );
  const handleAgeRangePreset = useCallback(
    (min, max) => {
      const isAgeFilterAlreadySet =
        preferences.preferred_age_min !== 18 ||
        preferences.preferred_age_max !== 70;
      const wouldBeNewFilter =
        !isAgeFilterAlreadySet && (min !== 18 || max !== 70);

      if (isMaxFiltersSelected && wouldBeNewFilter) {
        Alert.alert(
          t ? t("search.max_filters.title") : "Maximum Filters Reached",
          t
            ? t("search.max_filters.message")
            : "You've selected the maximum of 10 filters for the perfect match. To add this filter, please remove another one first.",
          [{ text: t ? t("common.ok") : "OK" }]
        );
        return;
      }

      handlePreferenceChange("preferred_age_min", min);
      handlePreferenceChange("preferred_age_max", max);
    },
    [handlePreferenceChange, preferences, isMaxFiltersSelected, t]
  );
  const { t, isRTL } = useContext(LanguageContext);
  const styles = createUnifiedSearchStyles(isRTL);
  const [preferencesUserId, setPreferencesUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedFiltersCount, setSelectedFiltersCount] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const [sectionOffsets, setSectionOffsets] = useState({});
  const [currentStickySection, setCurrentStickySection] = useState(null);

  const sectionRefs = useRef({
    basic: React.createRef(),
    education: React.createRef(),
    personal: React.createRef(),
    lifestyle: React.createRef(),
  });

  const MAX_FILTERS = 10;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const {
    preferences,
    loading,
    error: reduxError,
    initialLoadComplete,
  } = useSelector((state) => state.search);

  const geographic = useSelector(selectGeographic);
  const personalAttributes = useSelector(selectPersonalAttributes);
  const professionalEducational = useSelector(selectProfessionalEducational);
  const lifestyleInterests = useSelector(selectLifestyleInterests);
  const cities = useSelector(selectCities);
  const marriageBudget = useSelector(selectDirectMarriageBudget);
  const religiosityLevels = useSelector(selectDirectReligiosityLevels);
  const authState = useSelector((state) => state.auth);

  const selectedCountryId = preferences.preferred_country_id;

  const matchPercentage = useMemo(() => {
    return Math.min(
      Math.round((selectedFiltersCount / MAX_FILTERS) * 100),
      100
    );
  }, [selectedFiltersCount]);

  const isMaxFiltersSelected = useMemo(() => {
    return selectedFiltersCount >= MAX_FILTERS;
  }, [selectedFiltersCount]);

  const hasSmokingError = useMemo(() => {
    return (
      preferences.preferred_smoking_status === true &&
      (!preferences.preferred_smoking_tools ||
        preferences.preferred_smoking_tools.length === 0)
    );
  }, [
    preferences.preferred_smoking_status,
    preferences.preferred_smoking_tools,
  ]);

  useEffect(() => {
    if (!scrollY || Object.keys(sectionOffsets).length === 0) return;

    const scrollListener = scrollY.addListener(({ value }) => {
      const adjustedScrollY = value + FILTER_TRACKER_HEIGHT;

      let currentSection = null;
      const sections = Object.entries(sectionOffsets);

      sections.sort((a, b) => a[1] - b[1]);

      for (let i = sections.length - 1; i >= 0; i--) {
        const [section, offset] = sections[i];
        if (adjustedScrollY >= offset) {
          currentSection = section;
          break;
        }
      }

      if (currentSection !== currentStickySection) {
        setCurrentStickySection(currentSection);
      }
    });

    return () => {
      scrollY.removeListener(scrollListener);
    };
  }, [scrollY, sectionOffsets, currentStickySection]);

  const measureSectionOffsets = useCallback(() => {
    Object.entries(sectionRefs.current).forEach(([key, ref]) => {
      if (ref.current) {
        ref.current.measureInWindow((x, y, width, height) => {
          setSectionOffsets((prev) => ({
            ...prev,
            [key]: y,
          }));
        });
      }
    });
  }, []);

  const getCurrentSectionTitle = useCallback(() => {
    if (!currentStickySection) return "";

    const section = SECTIONS.find((s) => s.id === currentStickySection);
    return t ? t(section.titleKey) : section.title;
  }, [currentStickySection, t]);

  useEffect(() => {
    if (selectedCountryId) {
      dispatch(fetchCitiesByCountry(selectedCountryId));
    }
  }, [selectedCountryId, dispatch]);

  useEffect(() => {
    if (isLoading) {
      const fallbackTimer = setTimeout(() => {
        dispatch(manuallySetLoading(false));
        setIsLoading(false);
      }, 10000);

      return () => clearTimeout(fallbackTimer);
    }
  }, [isLoading, dispatch]);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      initializeScreen();
    }, 100);

    return () => {
      clearTimeout(timer);
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && initialLoadComplete) {
      const timer = setTimeout(() => {
        measureSectionOffsets();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoading, initialLoadComplete, measureSectionOffsets]);

  useEffect(() => {
    if (!isMounted || isLoading) return;

    const checkAuthStatus = async () => {
      try {
        const newUserId = await authService.getUserId();

        if (newUserId !== preferencesUserId) {
          setPreferencesUserId(newUserId);
          initializeScreen();
        } else if (authState.isAuthenticated) {
          const preferencesExist = Object.keys(preferences).some(
            (key) =>
              preferences[key] !== null &&
              preferences[key] !== undefined &&
              preferences[key] !== "" &&
              (typeof preferences[key] !== "object" ||
                Object.keys(preferences[key]).length > 0)
          );

          if (!preferencesExist) {
            initializeScreen();
          } else {
            countSelectedFilters();
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuthStatus();
  }, [authState, isLoading, preferencesUserId]);

  useEffect(() => {
    if (!isLoading && isMounted) {
      countSelectedFilters();
    }
  }, [preferences, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      startEntryAnimation();
    }
  }, [isLoading]);

  const initializeScreen = async () => {
    if (!isMounted) return;

    setIsLoading(true);
    setError(null);
    dispatch(clearError());

    try {
      const userId = await authService.getUserId();
      setPreferencesUserId(userId);

      await dispatch(fetchAllProfileData()).unwrap();

      try {
        await dispatch(getSavedPreferences()).unwrap();
        dispatch(setInitialLoadComplete(true));

        if (preferences.preferred_country_id) {
          dispatch(fetchCitiesByCountry(preferences.preferred_country_id));
        }

        setTimeout(() => {
          if (isMounted) {
            countSelectedFilters();
          }
        }, 300);
      } catch (prefsError) {
        console.error(
          "[UnifiedSearchScreen] Error loading preferences:",
          prefsError
        );
        dispatch(setInitialLoadComplete(true));
        setError(t("search.errors.preferences_load"));
      }
    } catch (error) {
      console.error(
        "[UnifiedSearchScreen] Error initializing search screen:",
        error
      );
      if (isMounted) {
        setError(t("search.errors.data_load"));
        dispatch(setInitialLoadComplete(true));
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
        dispatch(manuallySetLoading(false));
        startEntryAnimation();
      }
    }
  };

  const startEntryAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const countSelectedFilters = useCallback(() => {
    if (!isMounted) return;

    try {
      let count = 0;

      if (preferences.preferred_nationality_id) count++;
      if (preferences.preferred_origin_id) count++;
      if (preferences.preferred_country_id) count++;
      if (preferences.preferred_city_id) count++;
      if (
        preferences.preferred_age_min !== 18 ||
        preferences.preferred_age_max !== 70
      )
        count++;

      if (preferences.preferred_educational_level_id) count++;
      if (preferences.preferred_specialization_id) count++;
      if (preferences.preferred_employment_status !== null) count++;
      if (preferences.preferred_job_title_id) count++;
      if (preferences.preferred_financial_status_id) count++;
      if (preferences.preferred_marriage_budget_id) count++;

      if (preferences.preferred_height_id) count++;
      if (preferences.preferred_weight_id) count++;
      if (preferences.preferred_marital_status_id) count++;
      if (preferences.preferred_social_media_presence_id) count++;

      if (preferences.preferred_smoking_status !== null) count++;
      if (preferences.preferred_drinking_status_id) count++;
      if (preferences.preferred_sports_activity_id) count++;
      if (preferences.preferred_sleep_habit_id) count++;
      if (
        preferences.preferred_pets_id &&
        preferences.preferred_pets_id.length > 0
      )
        count++;
      if (preferences.preferred_religiosity_level_id) count++;

      setSelectedFiltersCount(count);
    } catch (error) {
      console.error("Error counting selected filters:", error);
    }
  }, [preferences, isMounted]);

  const handlePreferenceChange = useCallback(
    (field, value) => {
      const isAdding = value !== null && preferences[field] === null;

      if (isMaxFiltersSelected && isAdding) {
        Alert.alert(
          t ? t("search.max_filters.title") : "Maximum Filters Reached",
          t
            ? t("search.max_filters.message")
            : "You've selected the maximum of 10 filters for the perfect match. To add this filter, please remove another one first.",
          [{ text: t ? t("common.ok") : "OK" }]
        );
        return;
      }

      dispatch(updatePreference({ field, value }));

      if (field === "preferred_country_id") {
        dispatch(updatePreference({ field: "preferred_city_id", value: null }));
      }

      setTimeout(() => countSelectedFilters(), 100);
    },
    [dispatch, countSelectedFilters, preferences, isMaxFiltersSelected, t]
  );

  const handleSearch = useCallback(async () => {
    setIsLoading(true);

    try {
      await dispatch(submitSearchPreferences(preferences)).unwrap();
      setHasSearched(true);
      router.push("/(tabs)/matches");
    } catch (error) {
      console.error("Error submitting search preferences:", error);
      Alert.alert(t("common.error"), t("search.errors.submit_preferences"));
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, preferences, router, t]);

  const handleReset = useCallback(() => {
    Alert.alert(t("search.reset_title"), t("search.reset_message"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("search.reset_button"),
        style: "destructive",
        onPress: () => {
          dispatch(resetPreferences());
          countSelectedFilters();
          Alert.alert(t("common.success"), t("search.reset_success"));
        },
      },
    ]);
  }, [dispatch, countSelectedFilters, t]);

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    setError(null);
    initializeScreen();
  }, []);

  const isFilterDisabled = useCallback(
    (field) => {
      return isMaxFiltersSelected && preferences[field] === null;
    },
    [isMaxFiltersSelected, preferences]
  );

  if (isLoading && !initialLoadComplete) {
    return (
      <LoadingScreen
        message={t("search.loading_preferences")}
        onRetry={() => {
          setIsLoading(false);
          dispatch(manuallySetLoading(false));
          setTimeout(() => {
            initializeScreen();
          }, 500);
        }}
      />
    );
  }

  if (error) {
    return <ErrorView error={error} onRetry={handleRetry} />;
  }

  return (
    <>
      <SearchHeader t={t} />
      <View style={styles.FilterProgressTracker}>
        <FilterProgressTracker
          t={t}
          selectedFiltersCount={selectedFiltersCount}
          maxFilters={MAX_FILTERS}
          matchPercentage={matchPercentage}
          isMaxFiltersSelected={isMaxFiltersSelected}
          scrollY={scrollY}
          styles={styles}
          isRTL={isRTL}
        />
      </View>

      {/* Sticky section header */}
      {currentStickySection && (
        <Animated.View
          style={[
            stickyStyles.stickyHeader,
            {
              top: FILTER_TRACKER_HEIGHT, // Position below the FilterProgressTracker
              flexDirection: isRTL ? "row-reverse" : "row",
            },
          ]}
        >
          <Text style={stickyStyles.stickyHeaderText}>
            {getCurrentSectionTitle()}
          </Text>
        </Animated.View>
      )}

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={8}
          onLayout={measureSectionOffsets}
        >
          <StatusBar
            barStyle="light-content"
            backgroundColor={COLORS.primary}
          />

          {/* Basic Info Section with ref for sticky header */}
          <View ref={sectionRefs.current.basic}>
            <BasicInfoFilterSection
              t={t}
              isRTL={isRTL}
              preferences={preferences}
              geographic={geographic}
              personalAttributes={personalAttributes}
              cities={cities}
              handlePreferenceChange={handlePreferenceChange}
              handleAgeRangePreset={handleAgeRangePreset}
              getPresetLabel={getPresetLabel}
              isFilterDisabled={isFilterDisabled}
              isMaxFiltersSelected={isMaxFiltersSelected}
              styles={styles}
            />
          </View>

          {/* Education Section with ref for sticky header */}
          <View ref={sectionRefs.current.education}>
            <EducationFilterSection
              t={t}
              isRTL={isRTL}
              preferences={preferences}
              professionalEducational={professionalEducational}
              geographic={geographic}
              marriageBudget={marriageBudget}
              handlePreferenceChange={handlePreferenceChange}
              isFilterDisabled={isFilterDisabled}
              styles={styles}
            />
          </View>

          {/* Personal Section with ref for sticky header */}
          <View ref={sectionRefs.current.personal}>
            <PersonalFilterSection
              t={t}
              isRTL={isRTL}
              preferences={preferences}
              personalAttributes={personalAttributes}
              handlePreferenceChange={handlePreferenceChange}
              isFilterDisabled={isFilterDisabled}
              styles={styles}
            />
          </View>

          {/* Lifestyle Section with ref for sticky header */}
          <View ref={sectionRefs.current.lifestyle}>
            <LifestyleFilterSection
              t={t}
              isRTL={isRTL}
              preferences={preferences}
              lifestyleInterests={lifestyleInterests}
              personalAttributes={personalAttributes}
              religiosityLevels={religiosityLevels}
              handlePreferenceChange={handlePreferenceChange}
              isFilterDisabled={isFilterDisabled}
              isMaxFiltersSelected={isMaxFiltersSelected}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
              styles={styles}
            />
          </View>

          <SearchActionButtons
            t={t}
            loading={loading}
            hasSmokingError={hasSmokingError}
            selectedFiltersCount={selectedFiltersCount}
            handleSearch={handleSearch}
            handleReset={handleReset}
          />

          {hasSearched && <SavedPreferencesMessage t={t} />}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const stickyStyles = StyleSheet.create({
  stickyHeader: {
    position: "absolute",
    left: 0,
    right: 0,
    height: STICKY_HEADER_HEIGHT,
    backgroundColor: COLORS.background,
    zIndex: 999,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  stickyHeaderText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
});

export default withProfileCompletion(UnifiedSearchScreen);
