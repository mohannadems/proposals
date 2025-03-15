import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import components
import { AnimatedCard } from "./AnimatedBase";
import { CardHeader } from "./CardHeader";
import { SectionHeader } from "./SectionHeader";
import { HobbyItem } from "./HobbyComponents";
import { PetItem } from "./PetComponents";
import { Platform } from "react-native";
import {
  AnimatedFormContainer,
  AnimatedDropdown,
  PreferencesContainer,
  FormRow,
} from "./FormComponents";

// Import Redux actions and selectors
import {
  fetchAllProfileData,
  fetchCitiesByCountry,
  selectPersonalAttributes,
  selectLifestyleInterests,
  selectProfessionalEducational,
  selectGeographic,
  selectCitiesByCountry,
  selectLoadingStates,
} from "../../../../store/slices/profileAttributesSlice";

// Import constants and styles
import { cardConfigs } from "./constants";
import { COLORS } from "../../../../constants/colors";
import SelectableGrid from "./SelectableGrid";

const LifestyleSection = () => {
  const dispatch = useDispatch();
  const { control, watch } = useFormContext();
  const smoking_status = watch("smoking_status");
  const country_of_residence_id = watch("country_of_residence_id");

  // Get data from Redux store
  const personalAttributes = useSelector(selectPersonalAttributes);
  const lifestyleInterests = useSelector(selectLifestyleInterests);
  const professionalEducational = useSelector(selectProfessionalEducational);
  const geographic = useSelector(selectGeographic);
  const loading = useSelector(selectLoadingStates);

  // Get cities for the selected country
  const cities = useSelector((state) =>
    selectCitiesByCountry(state, country_of_residence_id)
  );

  // Fetch all profile data on component mount
  useEffect(() => {
    dispatch(fetchAllProfileData());
  }, [dispatch]);

  // Fetch cities when country changes
  useEffect(() => {
    if (country_of_residence_id) {
      dispatch(fetchCitiesByCountry(country_of_residence_id));
    }
  }, [dispatch, country_of_residence_id]);

  // Extract needed data from Redux state
  const {
    hairColors = [],
    heights = [],
    weights = [],
    origins = [],
    maritalStatuses = [],
    skinColors = [],
    sleepHabits = [],
  } = personalAttributes;

  const {
    hobbies = [],
    pets = [],
    sportsActivities = [],
    smokingTools = [],
    drinkingStatuses = [],
    religiosityLevels = [],
  } = lifestyleInterests;

  const { marriageBudget = [] } = professionalEducational;

  const { countries = [], religions = [], nationalities = [] } = geographic;

  // Define child numbers and smoking statuses (not in API)
  const childNumbers = [
    { id: 1, name: "No Children 🚫" },
    { id: 2, name: "1 Child 👶" },
    { id: 3, name: "2 Children 🧒👧" },
    { id: 4, name: "3 Children 👧🧒👦" },
    { id: 5, name: "4 or More Children 👨‍👩‍👧‍👦" },
  ];

  const smokingStatuses = [
    { id: 1, name: "Non-smoker" },
    { id: 2, name: "Regular smoker" },
    { id: 3, name: "Social smoker" },
  ];
  const smokingIcons = {
    Cigarettes: "cafe", // Using 'cafe' as a placeholder
    Cigarette: "cafe",
    Shisha: "flame",
    Hookah: "flame",
    "E-cigarettes": "battery-charging",
    Vape: "cloud",
    Other: "help-circle", // Generic icon for 'Other'
  };
  const hobbyIcons = {
    Photography: "camera",
    Gardening: "leaf",
    Painting: "color-palette",
    Cycling: "bicycle",
    Hiking: "walk",
  };
  // Show loading state
  if (
    loading.personalAttributes ||
    loading.lifestyleInterests ||
    loading.professionalEducational ||
    loading.geographic
  ) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile attributes...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <SectionHeader />
      {/* Origin & Residence */}
      <AnimatedCard delay={100}>
        <CardHeader {...cardConfigs.origin} />
        <AnimatedFormContainer>
          <AnimatedDropdown
            control={control}
            name="nationality_id"
            label="Nationality 🌎"
            items={nationalities}
            leftIcon={
              <FeatherIcon name="flag" size={20} color={COLORS.primary} />
            }
            required
          />
          <AnimatedDropdown
            control={control}
            name="country_of_residence_id"
            label="Country of Residence 📍"
            items={countries}
            leftIcon={
              <FeatherIcon name="map-pin" size={20} color={COLORS.primary} />
            }
            required
          />
          <AnimatedDropdown
            control={control}
            name="city_id"
            label="City 🏙️"
            items={cities}
            isLoading={loading.cities}
            leftIcon={
              <FeatherIcon name="map" size={20} color={COLORS.primary} />
            }
            required
          />
          <AnimatedDropdown
            control={control}
            name="origin_id"
            label="Origin 🏠"
            items={origins}
            leftIcon={
              <FeatherIcon name="home" size={20} color={COLORS.primary} />
            }
            required
          />
        </AnimatedFormContainer>
      </AnimatedCard>
      {/* Personal Info */}
      <AnimatedCard delay={200}>
        <CardHeader {...cardConfigs.personal} />
        <AnimatedFormContainer>
          <FormRow>
            <AnimatedDropdown
              control={control}
              name="marital_status_id"
              label="Marital Status 💑"
              items={maritalStatuses}
              leftIcon={
                <MaterialIcon name="people" size={20} color={COLORS.primary} />
              }
              required
            />
            <AnimatedDropdown
              required
              control={control}
              name="number_of_children"
              label="Children 👶"
              items={childNumbers}
              leftIcon={
                <MaterialIcon
                  name="child-care"
                  size={20}
                  color={COLORS.primary}
                />
              }
            />
          </FormRow>
        </AnimatedFormContainer>
      </AnimatedCard>
      {/* Physical Attributes */}
      <AnimatedCard delay={400}>
        <CardHeader {...cardConfigs.physical} />
        <AnimatedFormContainer>
          <FormRow>
            <AnimatedDropdown
              control={control}
              name="height"
              label="Height 📏"
              items={heights}
              leftIcon={
                <FeatherIcon name="arrow-up" size={20} color={COLORS.primary} />
              }
              required
            />
            <AnimatedDropdown
              control={control}
              name="weight"
              label="Weight ⚖️"
              items={weights}
              leftIcon={
                <MaterialIcon
                  name="fitness-center"
                  size={20}
                  color={COLORS.primary}
                />
              }
              required
            />
          </FormRow>
          <FormRow>
            <AnimatedDropdown
              control={control}
              name="hair_color_id"
              label="Hair Color 💁‍♂️"
              items={hairColors}
              leftIcon={
                <MaterialIcon
                  name="color-lens"
                  size={20}
                  color={COLORS.primary}
                />
              }
              required
            />
            <AnimatedDropdown
              required
              control={control}
              name="skin_color_id"
              label="Skin Color 🎨"
              items={skinColors}
              leftIcon={
                <MaterialIcon name="palette" size={20} color={COLORS.primary} />
              }
            />
          </FormRow>
        </AnimatedFormContainer>
      </AnimatedCard>
      {/* Lifestyle & Preferences */}
      <AnimatedCard delay={500}>
        <CardHeader {...cardConfigs.lifestyle} />
        <AnimatedFormContainer>
          <AnimatedDropdown
            control={control}
            name="marriage_budget_id"
            label="Marriage Budget 💍"
            items={marriageBudget}
            leftIcon={
              <MaterialIcon
                name="account-balance-wallet"
                size={20}
                color={COLORS.primary}
              />
            }
            required
          />
          <AnimatedDropdown
            control={control}
            name="religiosity_level_id"
            label="Religiosity Level 🕌"
            items={religiosityLevels}
            leftIcon={
              <MaterialIcon
                name="brightness-high"
                size={20}
                color={COLORS.primary}
              />
            }
            required
          />
          <AnimatedDropdown
            control={control}
            name="sleep_habit_id"
            label="Sleep Habits 😴"
            items={sleepHabits}
            leftIcon={
              <MaterialIcon
                name="nightlight-round"
                size={20}
                color={COLORS.primary}
              />
            }
            required
          />
          <AnimatedDropdown
            required
            control={control}
            name="sports_activity_id"
            label="Sports Activity 🏃‍♂️"
            items={sportsActivities}
            leftIcon={
              <MaterialIcon name="sports" size={20} color={COLORS.primary} />
            }
          />
        </AnimatedFormContainer>
      </AnimatedCard>
      <AnimatedCard delay={500}>
        <CardHeader {...cardConfigs.lifestyle} />
        <AnimatedFormContainer>
          {/* Add Smoking Status first */}
          <AnimatedDropdown
            control={control}
            name="smoking_status"
            label="Smoking Status 🚭"
            items={smokingStatuses}
            leftIcon={
              <FeatherIcon name="wind" size={20} color={COLORS.primary} />
            }
            required
          />

          {/* Conditional Smoking Preferences */}
          {smoking_status > 1 && (
            <PreferencesContainer>
              <SelectableGrid
                control={control}
                name="smoking_tools"
                items={smokingTools}
                label="Smoking Preferences"
                multiple
                renderItem={(item, isSelected) => (
                  <View
                    style={[
                      styles.preferenceItem,
                      isSelected && styles.preferenceItemSelected,
                    ]}
                  >
                    {/* Render icon based on item name */}
                    <Ionicons
                      name={smokingIcons[item.name] || "alert-circle"} // Default icon if not found
                      size={20}
                      color={isSelected ? "white" : "#9e086c"}
                      style={{ marginRight: 5 }}
                    />

                    <Text
                      style={[
                        styles.preferenceText,
                        isSelected && styles.preferenceTextSelected,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </View>
                )}
              />
            </PreferencesContainer>
          )}

          {/* Add Drinking Status */}
          <AnimatedDropdown
            control={control}
            name="drinking_status_id"
            label="Drinking Status ☕"
            items={drinkingStatuses}
            leftIcon={
              <FeatherIcon name="coffee" size={20} color={COLORS.primary} />
            }
          />
        </AnimatedFormContainer>
      </AnimatedCard>
      {/* Hobbies & Interests */}
      <AnimatedCard delay={600}>
        <CardHeader {...cardConfigs.hobbies} />
        <AnimatedFormContainer>
          <SelectableGrid
            control={control}
            name="hobbies"
            items={hobbies}
            multiple
            numColumns={3}
            renderItem={(item, isSelected) => (
              <HobbyItem item={item} isSelected={isSelected} />
            )}
          />
        </AnimatedFormContainer>
      </AnimatedCard>
      <AnimatedCard delay={700}>
        <CardHeader {...cardConfigs.pets} />
        <AnimatedFormContainer>
          <SelectableGrid
            control={control}
            name="pets"
            items={pets}
            multiple
            numColumns={3}
            renderItem={(item, isSelected) => (
              <PetItem item={item} isSelected={isSelected} />
            )}
          />
        </AnimatedFormContainer>
      </AnimatedCard>
      {/* Religion */}
      <AnimatedCard delay={800}>
        <CardHeader {...cardConfigs.spiritual} />
        <AnimatedFormContainer>
          <AnimatedDropdown
            control={control}
            name="religion_id"
            label="Religion 🕊️"
            items={religions}
            leftIcon={
              <FeatherIcon name="moon" size={20} color={COLORS.primary} />
            }
            required
          />
        </AnimatedFormContainer>
      </AnimatedCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
    marginTop: 10,
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.grayLight,
    borderRadius: 24,
    margin: 4,
    borderWidth: 2,
    borderColor: "transparent",
    minHeight: 48,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  preferenceItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    borderColor: "transparent",
    transform: [{ scale: 1.02 }],
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  preferenceText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
    color: COLORS.text,
    textAlign: "left",
    paddingHorizontal: 8,
    fontSize: 8,
  },
  preferenceTextSelected: {
    color: COLORS.white,
    fontWeight: "600",
  },
});

export default LifestyleSection;
