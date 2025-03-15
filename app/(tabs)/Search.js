import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Animated,
  Platform,
  Image,
  KeyboardAvoidingView,
  Alert,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { authService } from "../../services/auth.service";
import { useRouter } from "expo-router";

import { searchService } from "../../services/searchService";
import {
  getSavedPreferences,
  submitSearchPreferences,
  updatePreference,
  resetPreferences,
} from "../../store/slices/searchSlice";
import {
  fetchAllProfileData,
  selectGeographic,
  selectPersonalAttributes,
  selectProfessionalEducational,
  selectLifestyleInterests,
  selectCitiesByCountry,
  fetchCitiesByCountry,
} from "../../store/slices/profileAttributesSlice";
import { COLORS } from "../../constants/colors";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

// Import custom components
import ModernDropdown from "../../components/search/ModernDropdown";
import RangeSlider from "../../components/search/RangeSlider";
import MultiSelectChips from "../../components/search/MultiSelectChips";
// Age range presets for easier selection
const AGE_RANGE_PRESETS = [
  { label: "18-25", min: 18, max: 25 },
  { label: "26-35", min: 26, max: 35 },
  { label: "36-45", min: 36, max: 45 },
  { label: "46-60", min: 46, max: 60 },
  { label: "All Ages", min: 18, max: 70 },
];

const { width } = Dimensions.get("window");
const TILE_SIZE = (width - 48) / 2; // 2 tiles per row with 16px padding on each side

const SearchScreen = ({ navigation }) => {
  const router = useRouter();
  const [preferencesUserId, setPreferencesUserId] = useState(null);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeSection, setActiveSection] = useState(null); // null means showing the tile view
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardOffset = useRef(new Animated.Value(50)).current;
  const [isMounted, setIsMounted] = useState(true);

  // State to track completion of each section
  const [sectionStatus, setSectionStatus] = useState({
    basic: false,
    education: false,
    personal: false,
    lifestyle: false,
  });

  // Get all the required data from Redux store
  const { preferences, searchResults, loading, error, success } = useSelector(
    (state) => state.search
  );
  const geographic = useSelector(selectGeographic);
  const personalAttributes = useSelector(selectPersonalAttributes);
  const professionalEducational = useSelector(selectProfessionalEducational);
  const lifestyleInterests = useSelector(selectLifestyleInterests);

  // Get cities based on the selected country
  const selectedCountryId = preferences.preferred_country_id;
  const cities = useSelector((state) =>
    selectCitiesByCountry(state, selectedCountryId)
  );

  // Debug helper function
  const debugSearchPreferences = async () => {
    try {
      const debugInfo = await searchService.debugPreferences();
      console.log("Debug Info:", debugInfo);
      Alert.alert("Preferences Debug Info", JSON.stringify(debugInfo, null, 2));
    } catch (error) {
      console.error("Debug error:", error);
      Alert.alert("Debug Error", error.message);
    }
  };

  // Define initializeScreen function outside of any useEffect
  const initializeScreen = async () => {
    if (!isMounted) return;
    setIsLoading(true);

    try {
      console.log("Initializing search screen...");

      // First, ensure we have a valid user ID for preferences
      const userId = await authService.getUserId();
      setPreferencesUserId(userId);
      console.log(`Using user ID for preferences: ${userId || "none"}`);

      // Fetch all profile attributes data first
      await dispatch(fetchAllProfileData()).unwrap();
      console.log("Fetched profile attributes data");

      // Get user preferences with detailed logging
      console.log("Getting saved preferences...");
      try {
        const preferencesResult = await dispatch(
          getSavedPreferences()
        ).unwrap();

        console.log(
          "Loaded preferences:",
          preferencesResult
            ? `Found ${Object.keys(preferencesResult).length} preference keys`
            : "No preferences found"
        );

        // If a country is selected, fetch its cities
        if (preferencesResult?.preferred_country_id) {
          dispatch(
            fetchCitiesByCountry(preferencesResult.preferred_country_id)
          );
          console.log(
            `Fetching cities for country ID: ${preferencesResult.preferred_country_id}`
          );
        }

        // Force a manual status update after API response
        setTimeout(() => {
          if (isMounted) {
            updateSectionStatus();
            console.log("Section status updated after preferences loaded");
          }
        }, 200);
      } catch (prefsError) {
        console.error("Error loading preferences:", prefsError);
      }

      // Animate content in
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
    } catch (error) {
      console.error("Error initializing search screen:", error);
      if (isMounted) {
        Alert.alert("Error", "Failed to load search data. Please try again.");
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  // Run initializeScreen on component mount
  useEffect(() => {
    setIsMounted(true);

    // First run - initialize the screen
    initializeScreen();

    // Cleanup function
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Instead of navigation focus, use an effect to check auth status changes
  // This will help detect login/logout changes
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isMounted || isLoading) return;

    console.log("Auth state changed - checking if preferences need refreshing");

    // When auth state changes, check if we need to refresh
    authService
      .getUserId()
      .then(async (newUserId) => {
        console.log(
          `Current user ID: ${preferencesUserId}, New user ID: ${newUserId}`
        );

        if (newUserId !== preferencesUserId) {
          console.log("User ID changed, refreshing preferences");
          setPreferencesUserId(newUserId);

          // Force-debug to see what's happening with preferences
          const debugInfo = await searchService.debugPreferences();
          console.log("Preferences debug info:", debugInfo);

          // Full refresh
          initializeScreen();
        } else if (authState.isAuthenticated) {
          // Same user but ensure preferences are loaded
          console.log(
            "Auth state changed but same user ID, checking preferences"
          );

          const preferencesExist = Object.keys(preferences).some(
            (key) =>
              preferences[key] !== null &&
              preferences[key] !== undefined &&
              preferences[key] !== "" &&
              (typeof preferences[key] !== "object" ||
                Object.keys(preferences[key]).length > 0)
          );

          if (!preferencesExist) {
            console.log("No preferences found, reloading");
            initializeScreen();
          } else {
            console.log("Preferences exist, updating section status");
            updateSectionStatus();
          }
        }
      })
      .catch((error) => {
        console.error("Error checking user ID:", error);
      });
  }, [authState, isLoading]);

  // Update section status when preferences change
  useEffect(() => {
    // This will run whenever preferences change
    if (!isLoading && isMounted) {
      console.log("Preferences changed, updating section status");
      updateSectionStatus();
    }
  }, [preferences, isLoading]);

  // Handle country selection to fetch cities
  useEffect(() => {
    if (selectedCountryId) {
      dispatch(fetchCitiesByCountry(selectedCountryId));
    }
  }, [selectedCountryId, dispatch]);

  // Enhance updateSectionStatus function for better debugging
  const updateSectionStatus = () => {
    if (!isMounted) return;

    try {
      console.log(
        "Updating section status with current preferences:",
        Object.keys(preferences).filter(
          (key) => preferences[key] !== null && preferences[key] !== undefined
        )
      );

      const newStatus = {
        basic: isBasicSectionComplete(),
        education: isEducationSectionComplete(),
        personal: isPersonalSectionComplete(),
        lifestyle: isLifestyleSectionComplete(),
      };

      console.log("New section status:", newStatus);
      setSectionStatus(newStatus);
    } catch (error) {
      console.error("Error updating section status:", error);
    }
  };

  // Check if each section is complete
  const isBasicSectionComplete = () => {
    return !!(
      preferences.preferred_nationality_id ||
      preferences.preferred_origin_id ||
      preferences.preferred_country_id ||
      preferences.preferred_age_min !== 18 ||
      preferences.preferred_age_max !== 50
    );
  };

  const isEducationSectionComplete = () => {
    return !!(
      preferences.preferred_educational_level_id ||
      preferences.preferred_specialization_id ||
      preferences.preferred_employment_status !== null ||
      preferences.preferred_job_title_id ||
      preferences.preferred_financial_status_id ||
      preferences.preferred_marriage_budget_id
    );
  };

  const isPersonalSectionComplete = () => {
    return !!(
      preferences.preferred_height_id ||
      preferences.preferred_weight_id ||
      preferences.preferred_marital_status_id ||
      preferences.preferred_social_media_presence_id
    );
  };

  const isLifestyleSectionComplete = () => {
    return !!(
      preferences.preferred_smoking_status !== null ||
      preferences.preferred_drinking_status_id ||
      preferences.preferred_sports_activity_id ||
      preferences.preferred_sleep_habit_id ||
      (preferences.preferred_pets_id &&
        preferences.preferred_pets_id.length > 0) ||
      preferences.preferred_religiosity_level_id
    );
  };

  // Handle preference changes
  const handlePreferenceChange = (field, value) => {
    dispatch(updatePreference({ field, value }));

    // If changing country, clear the selected city
    if (field === "preferred_country_id") {
      dispatch(updatePreference({ field: "preferred_city_id", value: null }));
    }

    // Update section status after a short delay to allow state update
    setTimeout(() => updateSectionStatus(), 100);
  };

  // Handle age range preset selection
  const handleAgeRangePreset = (min, max) => {
    handlePreferenceChange("preferred_age_min", min);
    handlePreferenceChange("preferred_age_max", max);
  };

  // Submit search preferences and show results
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      await dispatch(submitSearchPreferences(preferences)).unwrap();
      setHasSearched(true);
      setShowResults(true);

      // Navigate to matches screen after successful search
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
  };

  // Reset to default preferences
  const handleReset = () => {
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
  };

  // Navigate to a specific section
  const handleNavigateToSection = (section) => {
    setActiveSection(section);

    // Scroll to top when switching sections
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  // Return from section to main tiles view
  const handleReturnToTiles = () => {
    setActiveSection(null);
  };

  // Complete section and return to tiles
  const handleCompleteSection = () => {
    updateSectionStatus();
    setActiveSection(null);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <LinearGradient
          colors={COLORS.primaryGradient}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color={COLORS.white} />
          <Text style={styles.loadingText}>Loading preferences...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <LinearGradient colors={COLORS.primaryGradient} style={styles.header}>
        {activeSection ? (
          <View style={styles.sectionHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleReturnToTiles}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {activeSection === "basic" && "Basic Information"}
              {activeSection === "education" && "Education & Career"}
              {activeSection === "personal" && "Personal Attributes"}
              {activeSection === "lifestyle" && "Lifestyle"}
            </Text>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={handleCompleteSection}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.headerTitle}>Find Your Match</Text>
            <Text style={styles.headerSubtitle}>
              Complete the sections below to find your perfect partner
            </Text>
          </>
        )}
      </LinearGradient>

      <Animated.ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Tiles View */}
        {!activeSection && (
          <View style={styles.tilesContainer}>
            {/* Basic Information Tile */}
            <TouchableOpacity
              style={[styles.tile, sectionStatus.basic && styles.completeTile]}
              onPress={() => handleNavigateToSection("basic")}
            >
              <View style={styles.tileContent}>
                <View
                  style={[
                    styles.tileIconContainer,
                    sectionStatus.basic && styles.completeTileIconContainer,
                  ]}
                >
                  <Ionicons
                    name="person"
                    size={32}
                    color={sectionStatus.basic ? COLORS.white : COLORS.primary}
                  />
                </View>
                <Text style={styles.tileTitle}>Basic Information</Text>
                <Text style={styles.tileSubtitle}>
                  Nationality, location, age range
                </Text>
                {sectionStatus.basic && (
                  <View style={styles.completeBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={COLORS.success}
                    />
                    <Text style={styles.completeBadgeText}>Complete</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {/* Education & Career Tile */}
            <TouchableOpacity
              style={[
                styles.tile,
                sectionStatus.education && styles.completeTile,
              ]}
              onPress={() => handleNavigateToSection("education")}
            >
              <View style={styles.tileContent}>
                <View
                  style={[
                    styles.tileIconContainer,
                    sectionStatus.education && styles.completeTileIconContainer,
                  ]}
                >
                  <Ionicons
                    name="school"
                    size={32}
                    color={
                      sectionStatus.education ? COLORS.white : COLORS.primary
                    }
                  />
                </View>
                <Text style={styles.tileTitle}>Education & Career</Text>
                <Text style={styles.tileSubtitle}>
                  Education, job, financial status
                </Text>
                {sectionStatus.education && (
                  <View style={styles.completeBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={COLORS.success}
                    />
                    <Text style={styles.completeBadgeText}>Complete</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {/* Personal Attributes Tile */}
            <TouchableOpacity
              style={[
                styles.tile,
                sectionStatus.personal && styles.completeTile,
              ]}
              onPress={() => handleNavigateToSection("personal")}
            >
              <View style={styles.tileContent}>
                <View
                  style={[
                    styles.tileIconContainer,
                    sectionStatus.personal && styles.completeTileIconContainer,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="human-male-height"
                    size={32}
                    color={
                      sectionStatus.personal ? COLORS.white : COLORS.primary
                    }
                  />
                </View>
                <Text style={styles.tileTitle}>Personal Attributes</Text>
                <Text style={styles.tileSubtitle}>
                  Height, weight, marital status
                </Text>
                {sectionStatus.personal && (
                  <View style={styles.completeBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={COLORS.success}
                    />
                    <Text style={styles.completeBadgeText}>Complete</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {/* Lifestyle Tile */}
            <TouchableOpacity
              style={[
                styles.tile,
                sectionStatus.lifestyle && styles.completeTile,
              ]}
              onPress={() => handleNavigateToSection("lifestyle")}
            >
              <View style={styles.tileContent}>
                <View
                  style={[
                    styles.tileIconContainer,
                    sectionStatus.lifestyle && styles.completeTileIconContainer,
                  ]}
                >
                  <FontAwesome5
                    name="coffee"
                    size={28}
                    color={
                      sectionStatus.lifestyle ? COLORS.white : COLORS.primary
                    }
                  />
                </View>
                <Text style={styles.tileTitle}>Lifestyle</Text>
                <Text style={styles.tileSubtitle}>
                  Habits, pets, religiosity
                </Text>
                {sectionStatus.lifestyle && (
                  <View style={styles.completeBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={COLORS.success}
                    />
                    <Text style={styles.completeBadgeText}>Complete</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Section Content - Only Show When Section Is Selected */}
        {activeSection && (
          <Animated.View
            style={[
              styles.formContainer,
              { transform: [{ translateY: cardOffset }] },
            ]}
          >
            {/* Basic Information Section */}
            {activeSection === "basic" && (
              <View style={styles.sectionCard}>
                <View style={styles.sectionDescription}>
                  <Text style={styles.descriptionText}>
                    Tell us about the basic attributes you're looking for in a
                    partner
                  </Text>
                </View>

                <ModernDropdown
                  label="Nationality"
                  value={preferences.preferred_nationality_id}
                  items={geographic.nationalities.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  onValueChange={(value) =>
                    handlePreferenceChange("preferred_nationality_id", value)
                  }
                  placeholder="Select nationality (optional)"
                />

                <ModernDropdown
                  label="Origin"
                  value={preferences.preferred_origin_id}
                  items={personalAttributes.origins.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  onValueChange={(value) =>
                    handlePreferenceChange("preferred_origin_id", value)
                  }
                  placeholder="Select origin (optional)"
                />

                <ModernDropdown
                  label="Country"
                  value={preferences.preferred_country_id}
                  items={geographic.countries.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  onValueChange={(value) =>
                    handlePreferenceChange("preferred_country_id", value)
                  }
                  placeholder="Select country (optional)"
                />

                {selectedCountryId && (
                  <ModernDropdown
                    label="City"
                    value={preferences.preferred_city_id}
                    items={cities.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                    onValueChange={(value) =>
                      handlePreferenceChange("preferred_city_id", value)
                    }
                    placeholder="Select city (optional)"
                  />
                )}

                <View style={styles.ageRangeContainer}>
                  <Text style={styles.inputLabel}>Age Range</Text>
                  <Text style={styles.ageRangeDisplay}>
                    {preferences.preferred_age_min} -{" "}
                    {preferences.preferred_age_max} years
                  </Text>

                  {/* Age Range Presets */}
                  <View style={styles.agePresets}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {AGE_RANGE_PRESETS.map((preset, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.agePresetButton,
                            preferences.preferred_age_min === preset.min &&
                              preferences.preferred_age_max === preset.max &&
                              styles.activeAgePreset,
                          ]}
                          onPress={() =>
                            handleAgeRangePreset(preset.min, preset.max)
                          }
                        >
                          <Text
                            style={[
                              styles.agePresetText,
                              preferences.preferred_age_min === preset.min &&
                                preferences.preferred_age_max === preset.max &&
                                styles.activeAgePresetText,
                            ]}
                          >
                            {preset.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <RangeSlider
                    minValue={18}
                    maxValue={70}
                    initialLowValue={preferences.preferred_age_min}
                    initialHighValue={preferences.preferred_age_max}
                    onValueChange={(low, high) => {
                      handlePreferenceChange("preferred_age_min", low);
                      handlePreferenceChange("preferred_age_max", high);
                    }}
                  />
                </View>
              </View>
            )}

            {/* Education & Career Section */}
            {activeSection === "education" && (
              <View style={styles.sectionCard}>
                <View style={styles.sectionDescription}>
                  <Text style={styles.descriptionText}>
                    Specify educational and career preferences for your ideal
                    match
                  </Text>
                </View>

                <ModernDropdown
                  label="Educational Level"
                  value={preferences.preferred_educational_level_id}
                  items={professionalEducational.educationalLevels.map(
                    (item) => ({
                      label: item.name,
                      value: item.id,
                    })
                  )}
                  onValueChange={(value) =>
                    handlePreferenceChange(
                      "preferred_educational_level_id",
                      value
                    )
                  }
                  placeholder="Select educational level (optional)"
                />

                <ModernDropdown
                  label="Specialization"
                  value={preferences.preferred_specialization_id}
                  items={professionalEducational.specializations.map(
                    (item) => ({
                      label: item.name,
                      value: item.id,
                    })
                  )}
                  onValueChange={(value) =>
                    handlePreferenceChange("preferred_specialization_id", value)
                  }
                  placeholder="Select specialization (optional)"
                />

                <View style={styles.toggleContainerWithLabel}>
                  <View style={styles.toggleLabelRow}>
                    <Text style={styles.inputLabel}>Employment Status</Text>
                    <TouchableOpacity
                      onPress={() =>
                        handlePreferenceChange(
                          "preferred_employment_status",
                          null
                        )
                      }
                      style={styles.clearButton}
                    >
                      <Text style={styles.clearButtonText}>Clear</Text>
                    </TouchableOpacity>
                  </View>

                  {preferences.preferred_employment_status !== null ? (
                    <View style={styles.toggleButtons}>
                      <TouchableOpacity
                        style={[
                          styles.toggleButton,
                          preferences.preferred_employment_status === true &&
                            styles.activeToggle,
                        ]}
                        onPress={() =>
                          handlePreferenceChange(
                            "preferred_employment_status",
                            true
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.toggleText,
                            preferences.preferred_employment_status === true &&
                              styles.activeToggleText,
                          ]}
                        >
                          Employed
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.toggleButton,
                          preferences.preferred_employment_status === false &&
                            styles.activeToggle,
                        ]}
                        onPress={() =>
                          handlePreferenceChange(
                            "preferred_employment_status",
                            false
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.toggleText,
                            preferences.preferred_employment_status === false &&
                              styles.activeToggleText,
                          ]}
                        >
                          Unemployed
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.addPreferenceButton}
                      onPress={() =>
                        handlePreferenceChange(
                          "preferred_employment_status",
                          true
                        )
                      }
                    >
                      <Text style={styles.addPreferenceText}>
                        Add employment preference
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Only show job title if employment status is true (employed) or null */}
                {preferences.preferred_employment_status !== false && (
                  <ModernDropdown
                    label="Job Title"
                    value={preferences.preferred_job_title_id}
                    items={
                      professionalEducational.jobTitles
                        ? professionalEducational.jobTitles.map((item) => ({
                            label: item.name,
                            value: item.id,
                          }))
                        : []
                    }
                    onValueChange={(value) =>
                      handlePreferenceChange("preferred_job_title_id", value)
                    }
                    placeholder="Select job title (optional)"
                  />
                )}

                <ModernDropdown
                  label="Financial Status"
                  value={preferences.preferred_financial_status_id}
                  items={geographic.financialStatuses.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  onValueChange={(value) =>
                    handlePreferenceChange(
                      "preferred_financial_status_id",
                      value
                    )
                  }
                  placeholder="Select financial status (optional)"
                />

                <ModernDropdown
                  label="Marriage Budget"
                  value={preferences.preferred_marriage_budget_id}
                  items={professionalEducational.marriageBudget.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  onValueChange={(value) =>
                    handlePreferenceChange(
                      "preferred_marriage_budget_id",
                      value
                    )
                  }
                  placeholder="Select marriage budget (optional)"
                />
              </View>
            )}

            {/* Personal Attributes Section */}
            {activeSection === "personal" && (
              <View style={styles.sectionCard}>
                <View style={styles.sectionDescription}>
                  <Text style={styles.descriptionText}>
                    Set preferences for physical and personal attributes
                  </Text>
                </View>

                <ModernDropdown
                  label="Height"
                  value={preferences.preferred_height_id}
                  items={personalAttributes.heights.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  onValueChange={(value) =>
                    handlePreferenceChange("preferred_height_id", value)
                  }
                  placeholder="Select height (optional)"
                />

                <ModernDropdown
                  label="Weight"
                  value={preferences.preferred_weight_id}
                  items={personalAttributes.weights.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  onValueChange={(value) =>
                    handlePreferenceChange("preferred_weight_id", value)
                  }
                  placeholder="Select weight (optional)"
                />

                <ModernDropdown
                  label="Marital Status"
                  value={preferences.preferred_marital_status_id}
                  items={personalAttributes.maritalStatuses.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  onValueChange={(value) =>
                    handlePreferenceChange("preferred_marital_status_id", value)
                  }
                  placeholder="Select marital status (optional)"
                />

                <ModernDropdown
                  label="Social Media Presence"
                  value={preferences.preferred_social_media_presence_id}
                  items={[
                    { label: "Active on social media", value: 1 },
                    { label: "Moderate social media use", value: 2 },
                    { label: "Limited social media use", value: 3 },
                    { label: "No social media presence", value: 4 },
                  ]}
                  onValueChange={(value) =>
                    handlePreferenceChange(
                      "preferred_social_media_presence_id",
                      value
                    )
                  }
                  placeholder="Select social media presence (optional)"
                />
              </View>
            )}

            {/* Lifestyle Section */}
            {activeSection === "lifestyle" && (
              <View style={styles.sectionCard}>
                <View style={styles.sectionDescription}>
                  <Text style={styles.descriptionText}>
                    Set preferences for lifestyle habits and preferences
                  </Text>
                </View>

                <View style={styles.toggleContainerWithLabel}>
                  <View style={styles.toggleLabelRow}>
                    <Text style={styles.inputLabel}>Smoking Status</Text>
                    <TouchableOpacity
                      onPress={() => {
                        handlePreferenceChange(
                          "preferred_smoking_status",
                          null
                        );
                        handlePreferenceChange("preferred_smoking_tools", []);
                      }}
                      style={styles.clearButton}
                    >
                      <Text style={styles.clearButtonText}>Clear</Text>
                    </TouchableOpacity>
                  </View>

                  {preferences.preferred_smoking_status !== null ? (
                    <View style={styles.toggleButtons}>
                      <TouchableOpacity
                        style={[
                          styles.toggleButton,
                          preferences.preferred_smoking_status === true &&
                            styles.activeToggle,
                        ]}
                        onPress={() => {
                          handlePreferenceChange(
                            "preferred_smoking_status",
                            true
                          );
                        }}
                      >
                        <Text
                          style={[
                            styles.toggleText,
                            preferences.preferred_smoking_status === true &&
                              styles.activeToggleText,
                          ]}
                        >
                          Smoker
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.addPreferenceButton}
                      onPress={() => {
                        handlePreferenceChange(
                          "preferred_smoking_status",
                          true
                        );

                        // Check if no smoking tool is selected and set a default one
                        if (!preferences.preferred_smoking_tools?.length) {
                          const defaultTool =
                            lifestyleInterests.smokingTools.find(
                              (tool) => tool.name === "Cigarettes"
                            );
                          if (defaultTool) {
                            handlePreferenceChange("preferred_smoking_tools", [
                              defaultTool.id,
                            ]);
                          }
                        }
                      }}
                    >
                      <Text style={styles.addPreferenceText}>
                        Add smoking preference
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Only show smoking tools if preferred_smoking_status is true (smoker) */}
                {preferences.preferred_smoking_status === true && (
                  <View style={styles.chipSelectorContainer}>
                    <Text style={styles.inputLabel}>Smoking Tools</Text>
                    <MultiSelectChips
                      items={lifestyleInterests.smokingTools.map((item) => ({
                        id: item.id,
                        name: item.name,
                      }))}
                      selectedItems={preferences.preferred_smoking_tools}
                      onSelectItem={(items) =>
                        handlePreferenceChange("preferred_smoking_tools", items)
                      }
                    />
                  </View>
                )}

                <ModernDropdown
                  label="Drinking Status"
                  value={preferences.preferred_drinking_status_id}
                  items={lifestyleInterests.drinkingStatuses.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  onValueChange={(value) =>
                    handlePreferenceChange(
                      "preferred_drinking_status_id",
                      value
                    )
                  }
                  placeholder="Select drinking status (optional)"
                />

                <ModernDropdown
                  label="Sports Activity"
                  value={preferences.preferred_sports_activity_id}
                  items={lifestyleInterests.sportsActivities.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  onValueChange={(value) =>
                    handlePreferenceChange(
                      "preferred_sports_activity_id",
                      value
                    )
                  }
                  placeholder="Select sports activity (optional)"
                />

                <ModernDropdown
                  label="Sleep Habit"
                  value={preferences.preferred_sleep_habit_id}
                  items={personalAttributes.sleepHabits.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  onValueChange={(value) =>
                    handlePreferenceChange("preferred_sleep_habit_id", value)
                  }
                  placeholder="Select sleep habit (optional)"
                />

                <View style={styles.chipSelectorContainer}>
                  <View style={styles.toggleLabelRow}>
                    <Text style={styles.inputLabel}>Pets</Text>
                    {preferences.preferred_pets_id?.length > 0 && (
                      <TouchableOpacity
                        onPress={() =>
                          handlePreferenceChange("preferred_pets_id", [])
                        }
                        style={styles.clearButton}
                      >
                        <Text style={styles.clearButtonText}>Clear</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <MultiSelectChips
                    items={lifestyleInterests.pets.map((item) => ({
                      id: item.id,
                      name: item.name,
                    }))}
                    selectedItems={preferences.preferred_pets_id}
                    onSelectItem={(items) =>
                      handlePreferenceChange("preferred_pets_id", items)
                    }
                  />
                </View>

                <ModernDropdown
                  label="Religiosity Level"
                  value={preferences.preferred_religiosity_level_id}
                  items={
                    lifestyleInterests.religiosityLevels
                      ? lifestyleInterests.religiosityLevels.map((item) => ({
                          label: item.name,
                          value: item.id,
                        }))
                      : []
                  }
                  onValueChange={(value) =>
                    handlePreferenceChange(
                      "preferred_religiosity_level_id",
                      value
                    )
                  }
                  placeholder="Select religiosity level (optional)"
                />
              </View>
            )}

            {/* Complete Section Button */}
            <TouchableOpacity
              style={styles.completeSectionButton}
              onPress={handleCompleteSection}
            >
              <Text style={styles.completeSectionButtonText}>
                Save & Complete This Section
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Show the search button only on the main tiles screen */}
        {!activeSection && (
          <View style={styles.searchButtonContainer}>
            <TouchableOpacity
              style={[
                styles.searchButton,
                !Object.values(sectionStatus).some((value) => value) &&
                  styles.disabledSearchButton,
              ]}
              onPress={handleSearch}
              disabled={
                !Object.values(sectionStatus).some((value) => value) || loading
              }
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="search"
                    size={20}
                    color={COLORS.white}
                    style={styles.searchIcon}
                  />
                  <Text style={styles.searchButtonText}>
                    Find Matches (
                    {
                      Object.values(sectionStatus).filter((value) => value)
                        .length
                    }
                    /4 completed)
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {hasSearched && (
              <TouchableOpacity
                style={styles.viewResultsButton}
                onPress={() => setShowResults(true)}
              >
                <Text style={styles.viewResultsText}>
                  View Previous Results
                </Text>
              </TouchableOpacity>
            )}

            {Object.values(sectionStatus).some((value) => value) && (
              <TouchableOpacity
                style={styles.resetFiltersButton}
                onPress={handleReset}
              >
                <Text style={styles.resetFiltersText}>Reset All Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Show a tip at the bottom of the main screen */}
        {!activeSection &&
          !Object.values(sectionStatus).every((value) => value) && (
            <View style={styles.tipsContainer}>
              <View style={styles.tipCard}>
                <Ionicons
                  name="bulb-outline"
                  size={24}
                  color={COLORS.primary}
                  style={styles.tipIcon}
                />
                <Text style={styles.tipText}>
                  {Object.values(sectionStatus).some((value) => value)
                    ? "Complete all sections to find your perfect match! You can search with partially completed preferences."
                    : "Tap on a section to start setting your preferences. You don't need to complete all sections to search."}
                </Text>
              </View>
            </View>
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  loadingGradient: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 90 : 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: "center",
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 6,
  },
  doneButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  doneButtonText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  tilesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  completeTile: {
    borderColor: COLORS.success + "50",
    backgroundColor: COLORS.white,
  },
  tileContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tileIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.lightPrimary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  completeTileIconContainer: {
    backgroundColor: COLORS.primary,
  },
  tileTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 4,
  },
  tileSubtitle: {
    fontSize: 12,
    color: COLORS.lightText,
    textAlign: "center",
  },
  completeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.success + "20",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 8,
  },
  completeBadgeText: {
    fontSize: 12,
    color: COLORS.success,
    marginLeft: 4,
    fontWeight: "500",
  },
  errorContainer: {
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: COLORS.error + "20", // 20% opacity
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionDescription: {
    backgroundColor: COLORS.lightPrimary + "50",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
  },
  ageRangeContainer: {
    marginVertical: 16,
  },
  ageRangeDisplay: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    textAlign: "center",
    marginVertical: 10,
  },
  agePresets: {
    marginBottom: 16,
  },
  agePresetButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeAgePreset: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  agePresetText: {
    fontSize: 14,
    color: COLORS.text,
  },
  activeAgePresetText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  toggleContainerWithLabel: {
    marginBottom: 16,
  },
  toggleLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  clearButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  clearButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "500",
  },
  toggleButtons: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeToggle: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontWeight: "500",
    color: COLORS.lightText,
  },
  activeToggleText: {
    color: COLORS.white,
  },
  addPreferenceButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  addPreferenceText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  chipSelectorContainer: {
    marginBottom: 16,
  },
  completeSectionButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  completeSectionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  searchButtonContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 16,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  disabledSearchButton: {
    backgroundColor: COLORS.primary + "80", // 50% opacity
  },
  searchIcon: {
    marginRight: 8,
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  viewResultsButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  viewResultsText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  resetFiltersButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  resetFiltersText: {
    color: COLORS.lightText,
    fontSize: 14,
  },
  tipsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  tipCard: {
    backgroundColor: COLORS.lightPrimary + "40",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  tipIcon: {
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  savedPreferencesCard: {
    backgroundColor: COLORS.lightPrimary,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  savedPreferencesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  savedPreferencesText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
});

export default SearchScreen;
