// AdvancedSearchScreen.js
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
  Alert,
  SafeAreaView,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import FilterProgressTracker from "../../components/search/FilterProgressTracker";
import FilterSection from "../../components/search/FilterSection";
import ModernDropdown from "../../components/search/ModernDropdown";
import AgeRangeSelector from "../../components/search/AgeRangeSelector";
import SmokerSelector from "../../components/search/SmokerSelector";
import SearchActionButtons from "../../components/search/SearchActionButtons";
import MultiSelectChips from "../../components/search/MultiSelectChips";
import withProfileCompletion from "../../components/profile/withProfileCompletion";
import {
  updatePreference,
  submitSearchPreferences,
  resetPreferences,
  setHasSearched,
  getSavedPreferences,
  selectHasSearched,
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
import { SceneStyleInterpolators } from "@react-navigation/bottom-tabs";
import { setHasSubmittedFilters } from "../../store/slices/userMatchesSlice";
const MAX_FILTERS = 10;

const AdvancedSearchScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiltersCount, setSelectedFiltersCount] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const hasSearched = useSelector(selectHasSearched);

  const { preferences, loading } = useSelector((state) => state.search);
  const geographic = useSelector(selectGeographic);
  const personalAttributes = useSelector(selectPersonalAttributes);
  const professionalEducational = useSelector(selectProfessionalEducational);
  const lifestyleInterests = useSelector(selectLifestyleInterests);
  const cities = useSelector(selectCities);
  const marriageBudget = useSelector(selectDirectMarriageBudget);
  const religiosityLevels = useSelector(selectDirectReligiosityLevels);

  const isMaxFiltersSelected = selectedFiltersCount >= MAX_FILTERS;
  const selectedCountryId = preferences.preferred_country_id;

  const hasSmokingError =
    preferences.preferred_smoking_status === true &&
    (!preferences.preferred_smoking_tools ||
      preferences.preferred_smoking_tools.length === 0);

  useEffect(() => {
    const initializeScreen = async () => {
      setIsLoading(true);

      try {
        await dispatch(fetchAllProfileData()).unwrap();
        await dispatch(getSavedPreferences()).unwrap();

        if (preferences.preferred_country_id) {
          dispatch(fetchCitiesByCountry(preferences.preferred_country_id));
        }
      } catch (error) {
        console.error("Error initializing search screen:", error);
        Alert.alert("Error", "Failed to load search data. Please try again.");
      } finally {
        setIsLoading(false);
        countSelectedFilters();
      }
    };

    initializeScreen();
  }, [dispatch]);

  useEffect(() => {
    if (selectedCountryId) {
      dispatch(fetchCitiesByCountry(selectedCountryId));
    }
  }, [selectedCountryId, dispatch]);

  const countSelectedFilters = useCallback(() => {
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
  }, [preferences]);

  useEffect(() => {
    countSelectedFilters();
  }, [preferences, countSelectedFilters]);

  const handlePreferenceChange = useCallback(
    (field, value) => {
      const isAdding = value !== null && preferences[field] === null;

      if (isMaxFiltersSelected && isAdding) {
        Alert.alert(
          "Maximum Filters Reached",
          "You've selected the maximum of 10 filters for the perfect match. To add this filter, please remove another one first.",
          [{ text: "OK" }]
        );
        return;
      }

      dispatch(updatePreference({ field, value }));

      if (field === "preferred_country_id") {
        dispatch(updatePreference({ field: "preferred_city_id", value: null }));
      }
    },
    [dispatch, preferences, isMaxFiltersSelected]
  );

  const handleAgeRangeChange = useCallback(
    (min, max) => {
      const isAgeFilterAlreadySet =
        preferences.preferred_age_min !== 18 ||
        preferences.preferred_age_max !== 70;

      const wouldBeNewFilter =
        !isAgeFilterAlreadySet && (min !== 18 || max !== 70);

      if (isMaxFiltersSelected && wouldBeNewFilter) {
        Alert.alert(
          "Maximum Filters Reached",
          "You've selected the maximum of 10 filters for the perfect match. To add this filter, please remove another one first.",
          [{ text: "OK" }]
        );
        return;
      }

      handlePreferenceChange("preferred_age_min", min);
      handlePreferenceChange("preferred_age_max", max);
    },
    [handlePreferenceChange, preferences, isMaxFiltersSelected]
  );

  const isFilterDisabled = useCallback(
    (field) => {
      return isMaxFiltersSelected && preferences[field] === null;
    },
    [isMaxFiltersSelected, preferences]
  );

  const handleSearch = useCallback(async () => {
    if (hasSmokingError) {
      setValidationErrors((prev) => ({
        ...prev,
        smokingTools: true,
      }));
      Alert.alert(
        "Validation Error",
        "Please select at least one smoking tool."
      );
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(submitSearchPreferences(preferences)).unwrap();
      dispatch(setHasSubmittedFilters(true));
      dispatch(setHasSearched(true));
      router.push("/(tabs)/matches");
    } catch (error) {
      console.error("Error submitting search preferences:", error);
      Alert.alert("Error", "Failed to submit preferences. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, preferences, router, hasSmokingError]);

  const handleReset = useCallback(() => {
    Alert.alert(
      "Reset Filters",
      "Are you sure you want to reset all filters?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            dispatch(resetPreferences());
            setValidationErrors({});
            Alert.alert("Success", "All filters have been reset.");
          },
        },
      ]
    );
  }, [dispatch]);

  // Handle smoking tools change
  const handleSmokingToolsChange = useCallback(
    (tools) => {
      handlePreferenceChange("preferred_smoking_tools", tools);

      if (tools.length > 0) {
        setValidationErrors((prev) => ({
          ...prev,
          smokingTools: false,
        }));
      }
    },
    [handlePreferenceChange]
  );

  if (isLoading && !preferences) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading preferences...</Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons
            name="search"
            size={24}
            color="#FFFFFF"
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Find Matches</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Select up to 10 filters for your perfect match
        </Text>
      </View>

      {/* Progress Tracker */}
      <FilterProgressTracker
        selectedFiltersCount={selectedFiltersCount}
        maxFilters={MAX_FILTERS}
        scrollY={scrollY}
        isRTL={false}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <Animated.ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {/* Basic Information Section */}
          <FilterSection title="Basic Information">
            <ModernDropdown
              label="Nationality"
              value={preferences.preferred_nationality_id}
              items={(geographic?.nationalities || []).map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              onValueChange={(value) =>
                handlePreferenceChange("preferred_nationality_id", value)
              }
              placeholder="Select nationality (optional)"
              disabled={isFilterDisabled("preferred_nationality_id")}
            />

            <ModernDropdown
              label="Origin"
              value={preferences.preferred_origin_id}
              items={(personalAttributes?.origins || []).map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              onValueChange={(value) =>
                handlePreferenceChange("preferred_origin_id", value)
              }
              placeholder="Select origin (optional)"
              disabled={isFilterDisabled("preferred_origin_id")}
            />

            <ModernDropdown
              label="Country"
              value={preferences.preferred_country_id}
              items={(geographic?.countries || []).map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              onValueChange={(value) =>
                handlePreferenceChange("preferred_country_id", value)
              }
              placeholder="Select country (optional)"
              disabled={isFilterDisabled("preferred_country_id")}
            />

            {preferences.preferred_country_id &&
              cities &&
              cities.length > 0 && (
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
                  disabled={isFilterDisabled("preferred_city_id")}
                />
              )}

            <AgeRangeSelector
              minAge={preferences.preferred_age_min || 18}
              maxAge={preferences.preferred_age_max || 70}
              onChange={handleAgeRangeChange}
              isFilterDisabled={isFilterDisabled("preferred_age_min")}
              isMaxFiltersSelected={isMaxFiltersSelected}
            />
          </FilterSection>

          {/* Education & Career Section */}
          <FilterSection title="Education & Career">
            <ModernDropdown
              label="Educational Level"
              value={preferences.preferred_educational_level_id}
              items={(professionalEducational?.educationalLevels || []).map(
                (item) => ({
                  label: item.name,
                  value: item.id,
                })
              )}
              onValueChange={(value) =>
                handlePreferenceChange("preferred_educational_level_id", value)
              }
              placeholder="Select educational level (optional)"
              disabled={isFilterDisabled("preferred_educational_level_id")}
            />

            <ModernDropdown
              label="Specialization"
              value={preferences.preferred_specialization_id}
              items={(professionalEducational?.specializations || []).map(
                (item) => ({
                  label: item.name,
                  value: item.id,
                })
              )}
              onValueChange={(value) =>
                handlePreferenceChange("preferred_specialization_id", value)
              }
              placeholder="Select specialization (optional)"
              disabled={isFilterDisabled("preferred_specialization_id")}
            />

            <View style={styles.toggleSection}>
              <View style={styles.toggleHeader}>
                <Text style={styles.toggleLabel}>Employment Status</Text>
                {preferences.preferred_employment_status !== null && (
                  <TouchableOpacity
                    onPress={() => {
                      handlePreferenceChange(
                        "preferred_employment_status",
                        null
                      );
                      if (preferences.preferred_job_title_id) {
                        handlePreferenceChange("preferred_job_title_id", null);
                      }
                    }}
                    style={styles.clearButton}
                  >
                    <Text style={styles.clearButtonText}>Clear</Text>
                  </TouchableOpacity>
                )}
              </View>

              {preferences.preferred_employment_status !== null ? (
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      preferences.preferred_employment_status === true &&
                        styles.toggleButtonActive,
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
                          styles.toggleTextActive,
                      ]}
                    >
                      Employed
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      preferences.preferred_employment_status === false &&
                        styles.toggleButtonActive,
                    ]}
                    onPress={() => {
                      handlePreferenceChange(
                        "preferred_employment_status",
                        false
                      );
                      if (preferences.preferred_job_title_id) {
                        handlePreferenceChange("preferred_job_title_id", null);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        preferences.preferred_employment_status === false &&
                          styles.toggleTextActive,
                      ]}
                    >
                      Unemployed
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() =>
                    handlePreferenceChange("preferred_employment_status", true)
                  }
                  disabled={isFilterDisabled("preferred_employment_status")}
                >
                  <Text style={styles.addButtonText}>
                    Add employment preference
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {preferences.preferred_employment_status === true && (
              <ModernDropdown
                label="Job Title"
                value={preferences.preferred_job_title_id}
                items={(professionalEducational?.jobTitles || []).map(
                  (item) => ({
                    label: item.name,
                    value: item.id,
                  })
                )}
                onValueChange={(value) =>
                  handlePreferenceChange("preferred_job_title_id", value)
                }
                placeholder="Select job title (optional)"
                disabled={isFilterDisabled("preferred_job_title_id")}
              />
            )}

            <ModernDropdown
              label="Financial Status"
              value={preferences.preferred_financial_status_id}
              items={(geographic?.financialStatuses || []).map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              onValueChange={(value) =>
                handlePreferenceChange("preferred_financial_status_id", value)
              }
              placeholder="Select financial status (optional)"
              disabled={isFilterDisabled("preferred_financial_status_id")}
            />

            <ModernDropdown
              label="Marriage Budget"
              value={preferences.preferred_marriage_budget_id}
              items={(marriageBudget || []).map((item) => ({
                label: item.name || item.budget || `Budget ${item.id}`,
                value: item.id,
              }))}
              onValueChange={(value) =>
                handlePreferenceChange("preferred_marriage_budget_id", value)
              }
              placeholder="Select marriage budget (optional)"
              disabled={isFilterDisabled("preferred_marriage_budget_id")}
            />
          </FilterSection>

          {/* Personal Attributes Section */}
          <FilterSection title="Personal Attributes">
            <ModernDropdown
              label="Height"
              value={preferences.preferred_height_id}
              items={(personalAttributes?.heights || []).map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              onValueChange={(value) =>
                handlePreferenceChange("preferred_height_id", value)
              }
              placeholder="Select height (optional)"
              disabled={isFilterDisabled("preferred_height_id")}
            />

            <ModernDropdown
              label="Weight"
              value={preferences.preferred_weight_id}
              items={(personalAttributes?.weights || []).map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              onValueChange={(value) =>
                handlePreferenceChange("preferred_weight_id", value)
              }
              placeholder="Select weight (optional)"
              disabled={isFilterDisabled("preferred_weight_id")}
            />

            <ModernDropdown
              label="Marital Status"
              value={preferences.preferred_marital_status_id}
              items={(personalAttributes?.maritalStatuses || []).map(
                (item) => ({
                  label: item.name,
                  value: item.id,
                })
              )}
              onValueChange={(value) =>
                handlePreferenceChange("preferred_marital_status_id", value)
              }
              placeholder="Select marital status (optional)"
              disabled={isFilterDisabled("preferred_marital_status_id")}
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
              disabled={isFilterDisabled("preferred_social_media_presence_id")}
            />
          </FilterSection>

          {/* Lifestyle Section */}
          <FilterSection title="Lifestyle & Habits">
            <SmokerSelector
              isSmoker={preferences.preferred_smoking_status}
              onSmokerChange={(value) =>
                handlePreferenceChange("preferred_smoking_status", value)
              }
              selectedTools={preferences.preferred_smoking_tools || []}
              onToolsChange={handleSmokingToolsChange}
              smokingTools={lifestyleInterests?.smokingTools || []}
              isFilterDisabled={isFilterDisabled("preferred_smoking_status")}
              isMaxFiltersSelected={isMaxFiltersSelected}
              validationError={validationErrors.smokingTools}
            />

            <ModernDropdown
              label="Drinking Status"
              value={preferences.preferred_drinking_status_id}
              items={(lifestyleInterests?.drinkingStatuses || []).map(
                (item) => ({
                  label: item.name,
                  value: item.id,
                })
              )}
              onValueChange={(value) =>
                handlePreferenceChange("preferred_drinking_status_id", value)
              }
              placeholder="Select drinking status (optional)"
              disabled={isFilterDisabled("preferred_drinking_status_id")}
            />

            <ModernDropdown
              label="Sports Activity"
              value={preferences.preferred_sports_activity_id}
              items={(lifestyleInterests?.sportsActivities || []).map(
                (item) => ({
                  label: item.name,
                  value: item.id,
                })
              )}
              onValueChange={(value) =>
                handlePreferenceChange("preferred_sports_activity_id", value)
              }
              placeholder="Select sports activity (optional)"
              disabled={isFilterDisabled("preferred_sports_activity_id")}
            />

            <ModernDropdown
              label="Sleep Habit"
              value={preferences.preferred_sleep_habit_id}
              items={(personalAttributes?.sleepHabits || []).map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              onValueChange={(value) =>
                handlePreferenceChange("preferred_sleep_habit_id", value)
              }
              placeholder="Select sleep habit (optional)"
              disabled={isFilterDisabled("preferred_sleep_habit_id")}
            />

            <View style={styles.petsSection}>
              <View style={styles.petsHeader}>
                <Text style={styles.petsLabel}>Pets</Text>
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
                items={(lifestyleInterests?.pets || []).map((item) => ({
                  id: item.id,
                  name: item.name,
                }))}
                selectedItems={preferences.preferred_pets_id || []}
                onSelectItem={(items) => {
                  const isNewSelection =
                    !preferences.preferred_pets_id ||
                    preferences.preferred_pets_id.length === 0;

                  if (
                    isMaxFiltersSelected &&
                    isNewSelection &&
                    items.length > 0
                  ) {
                    Alert.alert(
                      "Maximum Filters Reached",
                      "You've selected the maximum of 10 filters for the perfect match. To add this filter, please remove another one first.",
                      [{ text: "OK" }]
                    );
                    return;
                  }

                  handlePreferenceChange("preferred_pets_id", items);
                }}
                disabled={isFilterDisabled("preferred_pets_id")}
                chipStyle={styles.petChip}
                selectedChipStyle={styles.selectedPetChip}
                chipTextStyle={styles.petChipText}
                selectedChipTextStyle={styles.selectedPetChipText}
              />
            </View>

            <ModernDropdown
              label="Religiosity Level"
              value={preferences.preferred_religiosity_level_id}
              items={(religiosityLevels || []).map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              onValueChange={(value) =>
                handlePreferenceChange("preferred_religiosity_level_id", value)
              }
              placeholder="Select religiosity level (optional)"
              disabled={isFilterDisabled("preferred_religiosity_level_id")}
            />
          </FilterSection>

          {/* Action Buttons */}
          <SearchActionButtons
            loading={loading}
            hasSmokingError={hasSmokingError}
            selectedFiltersCount={selectedFiltersCount}
            handleSearch={handleSearch}
            handleReset={handleReset}
          />

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 35,
    paddingTop: 55,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 4,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#555",
  },
  bottomSpacing: {
    height: 40,
  },
  toggleSection: {
    marginBottom: 16,
  },
  toggleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  clearButton: {
    backgroundColor: "rgba(74, 111, 161, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clearButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "500",
  },
  toggleContainer: {
    flexDirection: "row",
  },
  toggleButton: {
    flex: 1,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderWidth: 1,
    borderColor: "#DDE1E6",
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toggleText: {
    fontSize: 16,
    color: "#666",
  },
  toggleTextActive: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  addButton: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#A1A1A1",
    borderRadius: 8,
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  petsSection: {
    marginBottom: 16,
  },
  petsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  petsLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  petChip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE1E6",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedPetChip: {
    backgroundColor: "#E7EFF8",
    borderColor: COLORS.primary,
  },
  petChipText: {
    fontSize: 14,
    color: "#555",
  },
  selectedPetChipText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
});
export default withProfileCompletion(AdvancedSearchScreen);
