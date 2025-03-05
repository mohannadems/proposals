// app/search.js
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";
import {
  updatePreference,
  resetPreferences,
  submitSearchPreferences,
} from "../../store/slices/searchSlice";

// Import selectors from profileAttributesSlice
import {
  selectPersonalAttributes,
  selectLifestyleInterests,
  selectProfessionalEducational,
  selectGeographic,
  selectCitiesByCountry,
  fetchAllProfileData,
  fetchCitiesByCountry,
} from "../../store/slices/profileAttributesSlice";

// Import custom components
import DropdownFilter from "../../components/search/DropdownFilter";
import SliderFilter from "../../components/search/SliderFilter";
import ToggleFilter from "../../components/search/ToggleFilter";
import MultiSelectFilter from "../../components/search/MultiSelectFilter";
import SearchResults from "../../components/search/SearchResults";

// Required fields by section
const REQUIRED_FIELDS = {
  basic: [
    "preferred_age_min",
    "preferred_age_max",
    "preferred_marital_status_id",
  ],
  location: ["preferred_country_id"],
  lifestyle: ["preferred_smoking_status"],
  education: ["preferred_educational_level_id"],
  appearance: ["preferred_height_id"],
};

const SearchScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    preferences,
    loading: searchLoading,
    error,
    success,
    searchResults,
  } = useSelector((state) => state.search);
  const loadingStates = useSelector(
    (state) => state.profileAttributes?.loading || {}
  );
  const personalAttributes = useSelector(selectPersonalAttributes);
  const lifestyleInterests = useSelector(selectLifestyleInterests);
  const professionalEducational = useSelector(selectProfessionalEducational);
  const geographic = useSelector(selectGeographic);

  const [showResults, setShowResults] = useState(false);
  const [expandedSection, setExpandedSection] = useState("basic"); // Default to basic open
  const [sectionCompletionStatus, setSectionCompletionStatus] = useState({
    basic: false,
    location: false,
    lifestyle: false,
    education: false,
    appearance: false,
  });

  // Animation value for the button pulse effect
  const pulseAnim = useState(new Animated.Value(1))[0];

  // Load all profile data when component mounts
  useEffect(() => {
    dispatch(fetchAllProfileData());
  }, [dispatch]);

  // Fetch cities when country is selected
  useEffect(() => {
    if (preferences.preferred_country_id) {
      dispatch(fetchCitiesByCountry(preferences.preferred_country_id));
    }
  }, [dispatch, preferences.preferred_country_id]);

  // Update section completion status when preferences change
  useEffect(() => {
    const newCompletionStatus = {};

    Object.keys(REQUIRED_FIELDS).forEach((section) => {
      const requiredFieldsForSection = REQUIRED_FIELDS[section];
      const allFieldsCompleted = requiredFieldsForSection.every((field) => {
        if (
          field === "preferred_smoking_status" &&
          preferences[field] === false
        ) {
          return true; // Consider false as a valid value for smoking status
        }
        return preferences[field] !== null && preferences[field] !== undefined;
      });

      newCompletionStatus[section] = allFieldsCompleted;
    });

    setSectionCompletionStatus(newCompletionStatus);
  }, [preferences]);

  // Pulse animation for submit button when form is complete
  useEffect(() => {
    const isFormComplete = Object.values(sectionCompletionStatus).every(
      (status) => status
    );

    if (isFormComplete) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [sectionCompletionStatus, pulseAnim]);

  // Get cities for the selected country
  const cities = useSelector((state) =>
    selectCitiesByCountry(state, preferences.preferred_country_id)
  );

  // Calculate overall form completion percentage
  const formCompletionPercentage = useMemo(() => {
    const totalRequiredFields = Object.values(REQUIRED_FIELDS).flat().length;
    const completedFields = Object.values(REQUIRED_FIELDS)
      .flat()
      .filter((field) => {
        if (
          field === "preferred_smoking_status" &&
          preferences[field] === false
        ) {
          return true;
        }
        return preferences[field] !== null && preferences[field] !== undefined;
      }).length;

    return Math.floor((completedFields / totalRequiredFields) * 100);
  }, [preferences]);

  // Handle selection for single-select options
  const handleSelect = useCallback(
    (field, value) => {
      dispatch(updatePreference({ field, value }));
    },
    [dispatch]
  );

  // Handle multi-select options (like smoking tools, pets)
  const handleMultiSelect = useCallback(
    (field, value) => {
      const currentValues = preferences[field] || [];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((id) => id !== value)
        : [...currentValues, value];

      dispatch(updatePreference({ field, value: updatedValues }));
    },
    [dispatch, preferences]
  );

  // Handle form submission
  const handleSubmit = () => {
    // Check if all required fields are filled
    const isFormComplete = Object.values(sectionCompletionStatus).every(
      (status) => status
    );

    if (!isFormComplete) {
      // Find the first incomplete section
      const incompleteSection = Object.keys(sectionCompletionStatus).find(
        (section) => !sectionCompletionStatus[section]
      );

      // Expand that section
      setExpandedSection(incompleteSection);

      // Show error message
      dispatch(
        updatePreference({
          field: "error",
          value: "Please complete all required fields before searching",
        })
      );
      return;
    }

    // Add language parameter if not already set
    const searchParams = {
      ...preferences,
      language: preferences.language || 1,
    };

    // Dispatch the search action
    dispatch(submitSearchPreferences(searchParams)).then(() => {
      setShowResults(true);
    });
  };

  // Reset all preferences
  const handleReset = () => {
    dispatch(resetPreferences());
    setExpandedSection("basic");
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Render required field indicator
  const renderRequiredIndicator = () => (
    <Text style={styles.fieldRequired}>*</Text>
  );

  // Check if all the profile data is still loading
  const isDataLoading =
    loadingStates.personalAttributes ||
    loadingStates.lifestyleInterests ||
    loadingStates.professionalEducational ||
    loadingStates.geographic;

  if (isDataLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIcon}>
            <Ionicons name="search" size={44} color={COLORS.white} />
          </View>
          <Text style={styles.loadingTitle}>Setting Up</Text>
          <Text style={styles.loadingSubtitle}>
            Loading your preferences and preparing the perfect search for you
          </Text>
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="large"
            color={COLORS.primary}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (showResults && success) {
    // Import the SearchResults component
    const SearchResults =
      require("../../components/search/SearchResults").default;

    return (
      <SearchResults
        navigation={navigation}
        results={searchResults || []}
        onBack={() => setShowResults(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Your Partner</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
          <Ionicons name="refresh-outline" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Form completion progress */}
        <View style={styles.formCompletionStatus}>
          <Ionicons
            name={
              formCompletionPercentage === 100
                ? "checkmark-circle"
                : "information-circle"
            }
            size={18}
            color={formCompletionPercentage === 100 ? "#34C759" : "#888"}
          />
          <Text style={styles.formCompletionText}>
            {formCompletionPercentage === 100
              ? "All required fields completed!"
              : `Form completion: ${formCompletionPercentage}%`}
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${formCompletionPercentage}%` },
            ]}
          />
        </View>

        <Text style={styles.requiredFieldNote}>
          Fields marked with {renderRequiredIndicator()} are required
        </Text>

        {/* Basic Information Section */}
        <TouchableOpacity
          style={[
            styles.sectionHeader,
            expandedSection === "basic" && styles.sectionHeaderActive,
          ]}
          onPress={() => toggleSection("basic")}
        >
          <View style={styles.sectionTitleRow}>
            <Ionicons
              name="person"
              size={22}
              color={
                expandedSection === "basic" ? COLORS.white : COLORS.primary
              }
            />
            <Text
              style={[
                styles.sectionTitle,
                expandedSection === "basic" && styles.sectionTitleActive,
              ]}
            >
              Basic Information
            </Text>
          </View>
          {sectionCompletionStatus.basic && (
            <View style={styles.sectionCompletionBadge}>
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </View>
          )}
          <Ionicons
            name={expandedSection === "basic" ? "chevron-up" : "chevron-down"}
            size={22}
            color={expandedSection === "basic" ? COLORS.white : COLORS.text}
          />
        </TouchableOpacity>

        {expandedSection === "basic" && (
          <View style={styles.sectionContent}>
            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Age Range</Text>
              {renderRequiredIndicator()}
            </View>
            <View style={styles.sliderContainer}>
              <SliderFilter
                minValue={18}
                maxValue={65}
                startValue={preferences.preferred_age_min || 18}
                endValue={preferences.preferred_age_max || 50}
                onValueChange={(min, max) => {
                  handleSelect("preferred_age_min", min);
                  handleSelect("preferred_age_max", max);
                }}
              />
            </View>

            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Marital Status</Text>
              {renderRequiredIndicator()}
            </View>
            <DropdownFilter
              value={preferences.preferred_marital_status_id}
              items={personalAttributes.maritalStatuses || []}
              onSelect={(value) =>
                handleSelect("preferred_marital_status_id", value)
              }
              loading={loadingStates.personalAttributes}
              containerStyle={
                preferences.preferred_marital_status_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />

            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Religion</Text>
            </View>
            <DropdownFilter
              value={preferences.preferred_religion_id}
              items={geographic.religions || []}
              onSelect={(value) => handleSelect("preferred_religion_id", value)}
              loading={loadingStates.geographic}
              containerStyle={
                preferences.preferred_religion_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />

            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Religiosity Level</Text>
            </View>
            <DropdownFilter
              value={preferences.preferred_religiosity_level_id}
              items={lifestyleInterests.religiosityLevels || []}
              onSelect={(value) =>
                handleSelect("preferred_religiosity_level_id", value)
              }
              loading={loadingStates.lifestyleInterests}
              containerStyle={
                preferences.preferred_religiosity_level_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />
          </View>
        )}

        {/* Location Information */}
        <TouchableOpacity
          style={[
            styles.sectionHeader,
            expandedSection === "location" && styles.sectionHeaderActive,
          ]}
          onPress={() => toggleSection("location")}
        >
          <View style={styles.sectionTitleRow}>
            <Ionicons
              name="location"
              size={22}
              color={
                expandedSection === "location" ? COLORS.white : COLORS.primary
              }
            />
            <Text
              style={[
                styles.sectionTitle,
                expandedSection === "location" && styles.sectionTitleActive,
              ]}
            >
              Location
            </Text>
          </View>
          {sectionCompletionStatus.location && (
            <View style={styles.sectionCompletionBadge}>
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </View>
          )}
          <Ionicons
            name={
              expandedSection === "location" ? "chevron-up" : "chevron-down"
            }
            size={22}
            color={expandedSection === "location" ? COLORS.white : COLORS.text}
          />
        </TouchableOpacity>

        {expandedSection === "location" && (
          <View style={styles.sectionContent}>
            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Nationality</Text>
            </View>
            <DropdownFilter
              value={preferences.preferred_nationality_id}
              items={geographic.nationalities || []}
              onSelect={(value) =>
                handleSelect("preferred_nationality_id", value)
              }
              loading={loadingStates.geographic}
              containerStyle={
                preferences.preferred_nationality_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />

            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Origin</Text>
            </View>
            <DropdownFilter
              value={preferences.preferred_origin_id}
              items={personalAttributes.origins || []}
              onSelect={(value) => handleSelect("preferred_origin_id", value)}
              loading={loadingStates.personalAttributes}
              containerStyle={
                preferences.preferred_origin_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />

            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Country</Text>
              {renderRequiredIndicator()}
            </View>
            <DropdownFilter
              value={preferences.preferred_country_id}
              items={geographic.countries || []}
              onSelect={(value) => handleSelect("preferred_country_id", value)}
              loading={loadingStates.geographic}
              containerStyle={
                preferences.preferred_country_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />

            {preferences.preferred_country_id && (
              <>
                <View style={styles.fieldLabel}>
                  <Text style={styles.fieldLabelText}>City</Text>
                </View>
                <DropdownFilter
                  value={preferences.preferred_city_id}
                  items={cities || []}
                  onSelect={(value) => handleSelect("preferred_city_id", value)}
                  loading={loadingStates.cities}
                  disabled={!cities || cities.length === 0}
                  placeholder={
                    cities && cities.length === 0
                      ? "No cities available for this country"
                      : "Select a city"
                  }
                  containerStyle={
                    preferences.preferred_city_id
                      ? styles.dropdownButtonSelected
                      : {}
                  }
                />
              </>
            )}
          </View>
        )}

        {/* Lifestyle Section */}
        <TouchableOpacity
          style={[
            styles.sectionHeader,
            expandedSection === "lifestyle" && styles.sectionHeaderActive,
          ]}
          onPress={() => toggleSection("lifestyle")}
        >
          <View style={styles.sectionTitleRow}>
            <Ionicons
              name="heart"
              size={22}
              color={
                expandedSection === "lifestyle" ? COLORS.white : COLORS.primary
              }
            />
            <Text
              style={[
                styles.sectionTitle,
                expandedSection === "lifestyle" && styles.sectionTitleActive,
              ]}
            >
              Lifestyle
            </Text>
          </View>
          {sectionCompletionStatus.lifestyle && (
            <View style={styles.sectionCompletionBadge}>
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </View>
          )}
          <Ionicons
            name={
              expandedSection === "lifestyle" ? "chevron-up" : "chevron-down"
            }
            size={22}
            color={expandedSection === "lifestyle" ? COLORS.white : COLORS.text}
          />
        </TouchableOpacity>

        {expandedSection === "lifestyle" && (
          <View style={styles.sectionContent}>
            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Marriage Budget</Text>
            </View>

            <DropdownFilter
              value={preferences.preferred_marriage_budget_id}
              items={professionalEducational.marriageBudget || []}
              onSelect={(value) =>
                handleSelect("preferred_marriage_budget_id", value)
              }
              loading={loadingStates.professionalEducational}
              containerStyle={
                preferences.preferred_marriage_budget_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />

            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Sleep Habits</Text>
            </View>
            <DropdownFilter
              value={preferences.preferred_sleep_habit_id}
              items={personalAttributes.sleepHabits || []}
              onSelect={(value) =>
                handleSelect("preferred_sleep_habit_id", value)
              }
              loading={loadingStates.personalAttributes}
              containerStyle={
                preferences.preferred_sleep_habit_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />

            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Smoking</Text>
              {renderRequiredIndicator()}
            </View>
            <View style={styles.toggleContainer}>
              <ToggleFilter
                value={preferences.preferred_smoking_status}
                onToggle={(value) =>
                  handleSelect("preferred_smoking_status", value)
                }
              />
            </View>

            {preferences.preferred_smoking_status && (
              <>
                <View style={styles.fieldLabel}>
                  <Text style={styles.fieldLabelText}>Smoking Tools</Text>
                </View>
                <MultiSelectFilter
                  values={preferences.preferred_smoking_tools || []}
                  items={lifestyleInterests.smokingTools || []}
                  onSelect={(value) =>
                    handleMultiSelect("preferred_smoking_tools", value)
                  }
                  loading={loadingStates.lifestyleInterests}
                />
              </>
            )}

            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Drinking Status</Text>
            </View>
            <DropdownFilter
              value={preferences.preferred_drinking_status_id}
              items={lifestyleInterests.drinkingStatuses || []}
              onSelect={(value) =>
                handleSelect("preferred_drinking_status_id", value)
              }
              loading={loadingStates.lifestyleInterests}
              containerStyle={
                preferences.preferred_drinking_status_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />

            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Sports Activity</Text>
            </View>
            <DropdownFilter
              value={preferences.preferred_sports_activity_id}
              items={lifestyleInterests.sportsActivities || []}
              onSelect={(value) =>
                handleSelect("preferred_sports_activity_id", value)
              }
              loading={loadingStates.lifestyleInterests}
              containerStyle={
                preferences.preferred_sports_activity_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />

            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Pets</Text>
            </View>
            <MultiSelectFilter
              values={preferences.preferred_pets_id || []}
              items={lifestyleInterests.pets || []}
              onSelect={(value) =>
                handleMultiSelect("preferred_pets_id", value)
              }
              loading={loadingStates.lifestyleInterests}
            />
          </View>
        )}

        {/* Education & Career Section */}
        <TouchableOpacity
          style={[
            styles.sectionHeader,
            expandedSection === "education" && styles.sectionHeaderActive,
          ]}
          onPress={() => toggleSection("education")}
        >
          <View style={styles.sectionTitleRow}>
            <Ionicons
              name="school"
              size={22}
              color={
                expandedSection === "education" ? COLORS.white : COLORS.primary
              }
            />
            <Text
              style={[
                styles.sectionTitle,
                expandedSection === "education" && styles.sectionTitleActive,
              ]}
            >
              Education & Career
            </Text>
          </View>
          {sectionCompletionStatus.education && (
            <View style={styles.sectionCompletionBadge}>
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </View>
          )}
          <Ionicons
            name={
              expandedSection === "education" ? "chevron-up" : "chevron-down"
            }
            size={22}
            color={expandedSection === "education" ? COLORS.white : COLORS.text}
          />
        </TouchableOpacity>

        {expandedSection === "education" && (
          <View style={styles.sectionContent}>
            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Educational Level</Text>
              {renderRequiredIndicator()}
            </View>
            <DropdownFilter
              value={preferences.preferred_educational_level_id}
              items={professionalEducational.educationalLevels || []}
              onSelect={(value) =>
                handleSelect("preferred_educational_level_id", value)
              }
              loading={loadingStates.professionalEducational}
              containerStyle={
                preferences.preferred_educational_level_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />

            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Specialization</Text>
            </View>
            <DropdownFilter
              value={preferences.preferred_specialization_id}
              items={professionalEducational.specializations || []}
              onSelect={(value) =>
                handleSelect("preferred_specialization_id", value)
              }
              loading={loadingStates.professionalEducational}
              containerStyle={
                preferences.preferred_specialization_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />

            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Employed</Text>
            </View>
            <View style={styles.toggleContainer}>
              <ToggleFilter
                value={preferences.preferred_employment_status}
                onToggle={(value) =>
                  handleSelect("preferred_employment_status", value)
                }
              />
            </View>

            {preferences.preferred_employment_status && (
              <>
                <View style={styles.fieldLabel}>
                  <Text style={styles.fieldLabelText}>Job Title</Text>
                </View>
                <DropdownFilter
                  value={preferences.preferred_job_title_id}
                  items={professionalEducational.jobTitles || []}
                  onSelect={(value) =>
                    handleSelect("preferred_job_title_id", value)
                  }
                  loading={loadingStates.professionalEducational}
                  containerStyle={
                    preferences.preferred_job_title_id
                      ? styles.dropdownButtonSelected
                      : {}
                  }
                />
              </>
            )}

            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Financial Status</Text>
            </View>
            <DropdownFilter
              value={preferences.preferred_financial_status_id}
              items={geographic.financialStatuses || []}
              onSelect={(value) =>
                handleSelect("preferred_financial_status_id", value)
              }
              loading={loadingStates.geographic}
              containerStyle={
                preferences.preferred_financial_status_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />
          </View>
        )}

        {/* Appearance Section */}
        <TouchableOpacity
          style={[
            styles.sectionHeader,
            expandedSection === "appearance" && styles.sectionHeaderActive,
          ]}
          onPress={() => toggleSection("appearance")}
        >
          <View style={styles.sectionTitleRow}>
            <Ionicons
              name="body"
              size={22}
              color={
                expandedSection === "appearance" ? COLORS.white : COLORS.primary
              }
            />
            <Text
              style={[
                styles.sectionTitle,
                expandedSection === "appearance" && styles.sectionTitleActive,
              ]}
            >
              Appearance
            </Text>
          </View>
          {sectionCompletionStatus.appearance && (
            <View style={styles.sectionCompletionBadge}>
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </View>
          )}
          <Ionicons
            name={
              expandedSection === "appearance" ? "chevron-up" : "chevron-down"
            }
            size={22}
            color={
              expandedSection === "appearance" ? COLORS.white : COLORS.text
            }
          />
        </TouchableOpacity>

        {expandedSection === "appearance" && (
          <View style={styles.sectionContent}>
            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Height</Text>
              {renderRequiredIndicator()}
            </View>
            <DropdownFilter
              value={preferences.preferred_height_id}
              items={personalAttributes.heights || []}
              onSelect={(value) => handleSelect("preferred_height_id", value)}
              loading={loadingStates.personalAttributes}
              containerStyle={
                preferences.preferred_height_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />

            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Weight</Text>
            </View>
            <DropdownFilter
              value={preferences.preferred_weight_id}
              items={personalAttributes.weights || []}
              onSelect={(value) => handleSelect("preferred_weight_id", value)}
              loading={loadingStates.personalAttributes}
              containerStyle={
                preferences.preferred_weight_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />

            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Hair Color</Text>
            </View>
            <DropdownFilter
              value={preferences.preferred_hair_color_id}
              items={personalAttributes.hairColors || []}
              onSelect={(value) =>
                handleSelect("preferred_hair_color_id", value)
              }
              loading={loadingStates.personalAttributes}
              containerStyle={
                preferences.preferred_hair_color_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />

            <View style={styles.fieldLabel}>
              <Text style={styles.fieldLabelText}>Skin Color</Text>
            </View>
            <DropdownFilter
              value={preferences.preferred_skin_color_id}
              items={personalAttributes.skinColors || []}
              onSelect={(value) =>
                handleSelect("preferred_skin_color_id", value)
              }
              loading={loadingStates.personalAttributes}
              containerStyle={
                preferences.preferred_skin_color_id
                  ? styles.dropdownButtonSelected
                  : {}
              }
            />
          </View>
        )}

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.footer}>
        <Animated.View
          style={{
            transform: [{ scale: pulseAnim }],
            borderRadius: 50,
            overflow: "hidden",
            width: "100%",
          }}
        >
          <LinearGradient
            colors={
              formCompletionPercentage === 100
                ? [COLORS.primary, "#aa1a75"]
                : ["#888", "#666"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.searchButton}
          >
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={searchLoading || formCompletionPercentage !== 100}
              style={styles.searchButtonTouchable}
            >
              {searchLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.searchButtonText}>Find My Match</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {formCompletionPercentage !== 100 && (
          <Text
            style={{
              textAlign: "center",
              color: "#888",
              marginTop: 8,
              fontSize: 12,
            }}
          >
            Complete all required fields to enable search
          </Text>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.errorText}>
            {typeof error === "object"
              ? error.message || "An error occurred"
              : error}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

// The styles are imported from the modernized-styles artifact

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F7FA",
  },
  loadingContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  loadingIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    letterSpacing: 0.5,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  loadingIndicator: {
    marginTop: 16,
    transform: [{ scale: 1.2 }],
  },
  header: {
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    letterSpacing: 0.5,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(158, 8, 108, 0.08)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resetButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  sectionHeaderActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    elevation: 5,
    borderColor: COLORS.primary,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
    marginLeft: 12,
    letterSpacing: 0.3,
  },
  sectionTitleActive: {
    color: COLORS.white,
  },
  sectionContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  requiredFieldNote: {
    fontSize: 13,
    color: "#888",
    marginBottom: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
  formCompletionStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.04)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  formCompletionText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
    marginLeft: 8,
  },
  spacer: {
    height: 100,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  searchButton: {
    borderRadius: 50,
    overflow: "hidden",
  },
  searchButtonTouchable: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginRight: 8,
  },
  errorContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 15,
    marginLeft: 10,
    flex: 1,
    fontWeight: "500",
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginVertical: 20,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  // Progress indicator for form completion
  progressBar: {
    height: 5,
    backgroundColor: "rgba(158, 8, 108, 0.1)",
    borderRadius: 3,
    marginBottom: 16,
    width: "100%",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  // Required field indicator
  fieldRequired: {
    color: COLORS.primary,
    fontWeight: "bold",
    marginLeft: 4,
  },
  fieldLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fieldLabelText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#444",
  },
  // Refreshed dropdown styles
  dropdownButton: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.08)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dropdownButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(158, 8, 108, 0.03)",
  },
  // Toggle updated styles
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.08)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  // Slider updated styles
  sliderContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.08)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  // Section completion indicator
  sectionCompletionBadge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "#34C759", // Success green
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});
export default SearchScreen;
