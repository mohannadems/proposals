import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Animated,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { authService } from "../../services/auth.service";
import { searchService } from "../../services/searchService";
import styles from "../../styles/SearchScreen";
import { COLORS } from "../../constants/colors";
import withProfileCompletion from "../../components/profile/withProfileCompletion";
import SectionTile from "../../components/partner/SectionTile";
import BasicInfoSection from "../../components/partner/BasicInfoSection";
import EducationSection from "../../components/partner/EducationSection";
import PersonalSection from "../../components/partner/PersonalSection";
import LifestyleSection from "../../components/partner/LifestyleSection";
import SearchHeader from "../../components/partner/SearchHeader";
import SearchButtons from "../../components/partner/SearchButtons";
import LoadingScreen from "../../components/partner/LoadingScreen";
import ErrorView from "../../components/partner/ErrorView";
import Tip from "../../components/partner/Tip";

import {
  getSavedPreferences,
  submitSearchPreferences,
  updatePreference,
  resetPreferences,
  setInitialLoadComplete,
  clearError,
  manuallySetLoading,
  selectIsBasicSectionComplete,
  DEFAULT_AGE_RANGE,
} from "../../store/slices/searchSlice";
import {
  fetchAllProfileData,
  selectGeographic,
  selectPersonalAttributes,
  selectProfessionalEducational,
  selectLifestyleInterests,
  fetchCitiesByCountry,
} from "../../store/slices/profileAttributesSlice";

const SearchScreen = () => {
  const [preferencesUserId, setPreferencesUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isMounted, setIsMounted] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const [sectionStatus, setSectionStatus] = useState({
    basic: false,
    education: false,
    personal: false,
    lifestyle: false,
  });

  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardOffset = useRef(new Animated.Value(50)).current;

  const dispatch = useDispatch();
  const router = useRouter();

  const {
    preferences,
    searchResults,
    loading,
    error: reduxError,
    success,
    initialLoadComplete,
  } = useSelector((state) => state.search);

  const isBasicComplete = useSelector(selectIsBasicSectionComplete);
  const geographic = useSelector(selectGeographic);
  const personalAttributes = useSelector(selectPersonalAttributes);
  const professionalEducational = useSelector(selectProfessionalEducational);
  const lifestyleInterests = useSelector(selectLifestyleInterests);
  const authState = useSelector((state) => state.auth);

  const selectedCountryId = preferences.preferred_country_id;

  useEffect(() => {
    if (selectedCountryId) {
      dispatch(fetchCitiesByCountry(selectedCountryId));
    }
  }, [selectedCountryId, dispatch]);

  const isAnyFilterApplied = useMemo(
    () => Object.values(sectionStatus).some((status) => status),
    [sectionStatus]
  );

  const completedSectionsCount = useMemo(
    () => Object.values(sectionStatus).filter((status) => status).length,
    [sectionStatus]
  );

  useEffect(() => {
    if (isLoading) {
      const fallbackTimer = setTimeout(() => {
        console.log(
          "Fallback timer triggered - forcing exit from loading state"
        );
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
            updateSectionStatus();
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
      updateSectionStatus();
    }
  }, [preferences, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      startEntryAnimation();
    }
  }, [isLoading]);

  const initializeScreen = async () => {
    console.log("[SearchScreen] Starting initializeScreen");
    if (!isMounted) {
      console.log(
        "[SearchScreen] Component not mounted, exiting initializeScreen"
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    dispatch(clearError());

    try {
      console.log("[SearchScreen] Fetching user ID");
      const userId = await authService.getUserId();
      setPreferencesUserId(userId);
      console.log("[SearchScreen] User ID fetched:", userId);

      console.log("[SearchScreen] Fetching profile attributes");
      await dispatch(fetchAllProfileData()).unwrap();
      console.log("[SearchScreen] Profile attributes fetched successfully");

      try {
        console.log("[SearchScreen] Fetching saved preferences");
        await dispatch(getSavedPreferences()).unwrap();
        console.log("[SearchScreen] Preferences fetched successfully");

        dispatch(setInitialLoadComplete(true));

        if (preferences.preferred_country_id) {
          console.log(
            "[SearchScreen] Fetching cities for country:",
            preferences.preferred_country_id
          );
          dispatch(fetchCitiesByCountry(preferences.preferred_country_id));
        }

        setTimeout(() => {
          if (isMounted) {
            console.log("[SearchScreen] Updating section status after timeout");
            updateSectionStatus();
          }
        }, 300);
      } catch (prefsError) {
        console.error("[SearchScreen] Error loading preferences:", prefsError);
        dispatch(setInitialLoadComplete(true));
        setError("Failed to load preferences. Please try again.");
      }
    } catch (error) {
      console.error("[SearchScreen] Error initializing search screen:", error);
      if (isMounted) {
        setError("Failed to load search data. Please try again.");
        dispatch(setInitialLoadComplete(true));
      }
    } finally {
      console.log(
        "[SearchScreen] Completing initializeScreen, setting loading to false"
      );
      if (isMounted) {
        setIsLoading(false);
        dispatch(manuallySetLoading(false));
        startEntryAnimation();
      }
    }
  };

  const startEntryAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(cardOffset, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const updateSectionStatus = useCallback(() => {
    if (!isMounted) return;

    try {
      const newStatus = {
        basic: isBasicComplete,
        education: isEducationSectionComplete(),
        personal: isPersonalSectionComplete(),
        lifestyle: isLifestyleSectionComplete(),
      };

      setSectionStatus((prevStatus) => {
        if (JSON.stringify(prevStatus) !== JSON.stringify(newStatus)) {
          return newStatus;
        }
        return prevStatus;
      });
    } catch (error) {
      console.error("Error updating section status:", error);
    }
  }, [isBasicComplete, preferences, isMounted]);

  const isEducationSectionComplete = useCallback(() => {
    return !!(
      preferences.preferred_educational_level_id ||
      preferences.preferred_specialization_id ||
      preferences.preferred_employment_status !== null ||
      preferences.preferred_job_title_id ||
      preferences.preferred_financial_status_id ||
      preferences.preferred_marriage_budget_id
    );
  }, [preferences]);

  const isPersonalSectionComplete = useCallback(() => {
    return !!(
      preferences.preferred_height_id ||
      preferences.preferred_weight_id ||
      preferences.preferred_marital_status_id ||
      preferences.preferred_social_media_presence_id
    );
  }, [preferences]);

  const isLifestyleSectionComplete = useCallback(() => {
    return !!(
      preferences.preferred_smoking_status !== null ||
      preferences.preferred_drinking_status_id ||
      preferences.preferred_sports_activity_id ||
      preferences.preferred_sleep_habit_id ||
      (preferences.preferred_pets_id &&
        preferences.preferred_pets_id.length > 0) ||
      preferences.preferred_religiosity_level_id
    );
  }, [preferences]);

  const handlePreferenceChange = useCallback(
    (field, value) => {
      dispatch(updatePreference({ field, value }));

      if (field === "preferred_country_id") {
        dispatch(updatePreference({ field: "preferred_city_id", value: null }));
      }

      setTimeout(() => updateSectionStatus(), 100);
    },
    [dispatch, updateSectionStatus]
  );

  const handleNavigateToSection = useCallback((section) => {
    setActiveSection(section);

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, []);

  const handleReturnToTiles = useCallback(() => {
    setActiveSection(null);
  }, []);

  const handleCompleteSection = useCallback(() => {
    updateSectionStatus();
    setActiveSection(null);
  }, [updateSectionStatus]);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);

    try {
      await dispatch(submitSearchPreferences(preferences)).unwrap();
      setHasSearched(true);
      setShowResults(true);

      router.push("/(tabs)/matches");
    } catch (error) {
      console.error("Error submitting search preferences:", error);
      Alert.alert(
        "Error",
        "Failed to submit search preferences. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, preferences, router]);

  const handleReset = useCallback(() => {
    Alert.alert(
      "Reset Preferences",
      "Are you sure you want to reset all search preferences to default values?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            dispatch(resetPreferences());
            updateSectionStatus();
            Alert.alert(
              "Success",
              "Preferences have been reset to default values."
            );
          },
        },
      ]
    );
  }, [dispatch, updateSectionStatus]);

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    setError(null);
    initializeScreen();
  }, []);

  if (isLoading && !initialLoadComplete) {
    return (
      <LoadingScreen
        message="Loading preferences..."
        onRetry={() => {
          console.log("[SearchScreen] Manual retry initiated");
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <SearchHeader
        activeSection={activeSection}
        onReturn={handleReturnToTiles}
        onComplete={handleCompleteSection}
      />

      <Animated.ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        {reduxError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{reduxError}</Text>
          </View>
        )}

        {!activeSection && (
          <View style={styles.tilesContainer}>
            <SectionTile
              title="Basic Information"
              subtitle="Nationality, location, age range"
              icon="person"
              IconComponent={Ionicons}
              isComplete={sectionStatus.basic}
              onPress={() => handleNavigateToSection("basic")}
            />

            <SectionTile
              title="Education & Career"
              subtitle="Education, job, financial status"
              icon="school"
              IconComponent={Ionicons}
              isComplete={sectionStatus.education}
              onPress={() => handleNavigateToSection("education")}
            />

            <SectionTile
              title="Personal Attributes"
              subtitle="Height, weight, marital status"
              icon="human-male-height"
              IconComponent={MaterialCommunityIcons}
              isComplete={sectionStatus.personal}
              onPress={() => handleNavigateToSection("personal")}
            />

            <SectionTile
              title="Lifestyle"
              subtitle="Habits, pets, religiosity"
              icon="coffee"
              IconComponent={FontAwesome5}
              isComplete={sectionStatus.lifestyle}
              onPress={() => handleNavigateToSection("lifestyle")}
            />
          </View>
        )}

        {activeSection && (
          <Animated.View
            style={[
              styles.formContainer,
              { transform: [{ translateY: cardOffset }] },
            ]}
          >
            {activeSection === "basic" && (
              <BasicInfoSection
                preferences={preferences}
                onChange={handlePreferenceChange}
                geographic={geographic}
                personalAttributes={personalAttributes}
                onComplete={handleCompleteSection}
              />
            )}

            {activeSection === "education" && (
              <EducationSection
                preferences={preferences}
                onChange={handlePreferenceChange}
                professionalEducational={professionalEducational}
                geographic={geographic}
                onComplete={handleCompleteSection}
              />
            )}

            {activeSection === "personal" && (
              <PersonalSection
                preferences={preferences}
                onChange={handlePreferenceChange}
                personalAttributes={personalAttributes}
                onComplete={handleCompleteSection}
              />
            )}

            {activeSection === "lifestyle" && (
              <LifestyleSection
                preferences={preferences}
                onChange={handlePreferenceChange}
                lifestyleInterests={lifestyleInterests}
                personalAttributes={personalAttributes}
                onComplete={handleCompleteSection}
              />
            )}
          </Animated.View>
        )}

        {!activeSection && (
          <SearchButtons
            isLoading={loading}
            isDisabled={!isAnyFilterApplied}
            completedSections={completedSectionsCount}
            hasSearched={hasSearched}
            onSearch={handleSearch}
            onReset={handleReset}
            onViewResults={() => setShowResults(true)}
          />
        )}

        {!activeSection &&
          !Object.values(sectionStatus).every((value) => value) && (
            <Tip isAnyFilterApplied={isAnyFilterApplied} />
          )}

        {hasSearched && !activeSection && (
          <View style={styles.savedPreferencesCard}>
            <Text style={styles.savedPreferencesTitle}>
              Your filters are saved!
            </Text>
            <Text style={styles.savedPreferencesText}>
              These preferences will be automatically applied each time you
              return to the search screen.
            </Text>
          </View>
        )}
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withProfileCompletion(SearchScreen);
