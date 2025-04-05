import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  useContext,
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
import createHomeStyles from "../../styles/SearchScreen";
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
import { LanguageContext } from "../../contexts/LanguageContext";

const SearchScreen = () => {
  const { t, isRTL } = useContext(LanguageContext);
  const styles = createHomeStyles(isRTL);
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
    if (!isMounted) {
      return;
    }

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
            updateSectionStatus();
          }
        }, 300);
      } catch (prefsError) {
        console.error("[SearchScreen] Error loading preferences:", prefsError);
        dispatch(setInitialLoadComplete(true));
        setError(t("search.errors.preferences_load"));
      }
    } catch (error) {
      console.error("[SearchScreen] Error initializing search screen:", error);
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
          updateSectionStatus();
          Alert.alert(t("common.success"), t("search.reset_success"));
        },
      },
    ]);
  }, [dispatch, updateSectionStatus, t]);

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    setError(null);
    initializeScreen();
  }, []);

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
              title={t("search.sections.basic.title")}
              subtitle={t("search.sections.basic.subtitle")}
              icon="person"
              IconComponent={Ionicons}
              isComplete={sectionStatus.basic}
              onPress={() => handleNavigateToSection("basic")}
              styles={styles}
            />

            <SectionTile
              title={t("search.sections.education.title")}
              subtitle={t("search.sections.education.subtitle")}
              icon="school"
              IconComponent={Ionicons}
              isComplete={sectionStatus.education}
              onPress={() => handleNavigateToSection("education")}
            />

            <SectionTile
              title={t("search.sections.personal.title")}
              subtitle={t("search.sections.personal.subtitle")}
              icon="human-male-height"
              IconComponent={MaterialCommunityIcons}
              isComplete={sectionStatus.personal}
              onPress={() => handleNavigateToSection("personal")}
            />

            <SectionTile
              title={t("search.sections.lifestyle.title")}
              subtitle={t("search.sections.lifestyle.subtitle")}
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
                styles={styles}
                isRTL={isRTL}
                t={t}
              />
            )}
            {activeSection === "education" && (
              <EducationSection
                preferences={preferences}
                onChange={handlePreferenceChange}
                professionalEducational={professionalEducational}
                geographic={geographic}
                onComplete={handleCompleteSection}
                styles={styles}
                isRTL={isRTL}
                t={t}
              />
            )}

            {activeSection === "personal" && (
              <PersonalSection
                preferences={preferences}
                onChange={handlePreferenceChange}
                personalAttributes={personalAttributes}
                onComplete={handleCompleteSection}
                styles={styles}
                isRTL={isRTL}
                t={t}
              />
            )}

            {activeSection === "lifestyle" && (
              <LifestyleSection
                preferences={preferences}
                onChange={handlePreferenceChange}
                lifestyleInterests={lifestyleInterests}
                personalAttributes={personalAttributes}
                onComplete={handleCompleteSection}
                styles={styles}
                isRTL={isRTL}
                t={t}
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
              {t("search.preferences_saved.title")}
            </Text>
            <Text style={styles.savedPreferencesText}>
              {t("search.preferences_saved.message")}
            </Text>
          </View>
        )}
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withProfileCompletion(SearchScreen);
