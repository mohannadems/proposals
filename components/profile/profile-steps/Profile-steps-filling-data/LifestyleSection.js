import React, { useEffect, useContext } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { AnimatedCard } from "./AnimatedBase";
import { CardHeader } from "./CardHeader";
import { SectionHeader } from "./SectionHeader";
import { HobbyItem } from "./HobbyComponents";
import { PetItem } from "./PetComponents";
import {
  AnimatedFormContainer,
  AnimatedDropdown,
  PreferencesContainer,
  FormRow,
} from "./FormComponents";
import { LanguageContext } from "../../../../contexts/LanguageContext";

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

import { cardConfigs } from "./constants";
import { COLORS } from "../../../../constants/colors";
import SelectableGrid from "./SelectableGrid";

const LifestyleSection = ({ isRTL = false, t, userGender }) => {
  const { isRTL: contextRTL, t: contextT } = useContext(LanguageContext) || {};
  const _isRTL = isRTL !== undefined ? isRTL : contextRTL;
  const _t = t || contextT;

  const dispatch = useDispatch();
  const { control, watch, setValue } = useFormContext();
  const smoking_status = watch("smoking_status");
  const country_of_residence_id = watch("country_of_residence_id");

  const personalAttributes = useSelector(selectPersonalAttributes);
  const lifestyleInterests = useSelector(selectLifestyleInterests);
  const professionalEducational = useSelector(selectProfessionalEducational);
  const geographic = useSelector(selectGeographic);
  const loading = useSelector(selectLoadingStates);

  const cities = useSelector((state) =>
    selectCitiesByCountry(state, country_of_residence_id)
  );

  useEffect(() => {
    dispatch(fetchAllProfileData());
  }, [dispatch]);

  useEffect(() => {
    if (country_of_residence_id) {
      dispatch(fetchCitiesByCountry(country_of_residence_id));
    }
  }, [dispatch, country_of_residence_id]);

  useEffect(() => {
    if (smoking_status === 2 || smoking_status === 3) {
      const currentTools = watch("smoking_tools") || [];

      if (currentTools.length === 0) {
        const cigaretteOption = lifestyleInterests.smokingTools.find(
          (tool) => tool.name === "Cigarettes" || tool.name === "Cigarette"
        );

        if (cigaretteOption) {
          setValue("smoking_tools", [cigaretteOption.id]);
        }
      }
    }
  }, [smoking_status, lifestyleInterests.smokingTools, setValue, watch]);

  const {
    eyeColors = [],
    hairColors = [],
    heights = [],
    weights = [],
    origins = [],
    maritalStatuses = [],
    skinColors = [],
    sleepHabits = [],
  } = personalAttributes;

  const { marriageBudget = [] } = professionalEducational;

  const {
    hobbies = [],
    pets = [],
    sportsActivities = [],
    smokingTools = [],
    drinkingStatuses = [],
    religiosityLevels = [],
  } = lifestyleInterests;

  const { countries = [], religions = [], nationalities = [] } = geographic;

  const childNumbers = [
    {
      id: 1,
      name: _t ? _t("profile.lifestyle.children.none") : "No Children 🚫",
    },
    { id: 2, name: _t ? _t("profile.lifestyle.children.one") : "1 Child 👶" },
    {
      id: 3,
      name: _t ? _t("profile.lifestyle.children.two") : "2 Children 🧒👧",
    },
    {
      id: 4,
      name: _t ? _t("profile.lifestyle.children.three") : "3 Children 👧🧒👦",
    },
    {
      id: 5,
      name: _t
        ? _t("profile.lifestyle.children.four_plus")
        : "4 or More Children 👨‍👩‍👧‍👦",
    },
  ];

  const smokingStatuses = [
    {
      id: 1,
      name: _t ? _t("profile.lifestyle.smoking.non_smoker") : "Non-smoker",
    },
    {
      id: 2,
      name: _t ? _t("profile.lifestyle.smoking.regular") : "Regular smoker",
    },
    {
      id: 3,
      name: _t ? _t("profile.lifestyle.smoking.social") : "Social smoker",
    },
  ];

  const smokingIcons = {
    Cigarettes: "cafe",
    Cigarette: "cafe",
    Shisha: "flame",
    Hookah: "flame",
    "E-cigarettes": "battery-charging",
    Vape: "cloud",
    Other: "help-circle",
  };

  const hobbyIcons = {
    Photography: "camera",
    Gardening: "leaf",
    Painting: "color-palette",
    Cycling: "bicycle",
    Hiking: "walk",
  };

  const dynamicStyles = {
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
      textAlign: _isRTL ? "right" : "left",
    },
    preferenceItem: {
      flexDirection: _isRTL ? "row-reverse" : "row",
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
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "500",
      color: COLORS.text,
      textAlign: _isRTL ? "right" : "left",
      paddingHorizontal: 8,
    },
    preferenceTextSelected: {
      color: COLORS.white,
      fontWeight: "600",
    },
  };

  if (
    loading.personalAttributes ||
    loading.lifestyleInterests ||
    loading.professionalEducational ||
    loading.geographic
  ) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={dynamicStyles.loadingText}>
          {_t
            ? _t("profile.lifestyle.loading")
            : "Loading profile attributes..."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={dynamicStyles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={dynamicStyles.scrollContent}
    >
      <SectionHeader isRTL={_isRTL} t={_t} />
      <AnimatedCard delay={100}>
        <CardHeader {...cardConfigs.origin} isRTL={_isRTL} t={_t} />
        <AnimatedFormContainer isRTL={_isRTL}>
          <AnimatedDropdown
            control={control}
            name="nationality_id"
            label={_t ? _t("profile.lifestyle.nationality") : "Nationality"}
            items={nationalities}
            leftIcon={
              <FeatherIcon name="flag" size={20} color={COLORS.primary} />
            }
            required
            isRTL={_isRTL}
          />
          <AnimatedDropdown
            control={control}
            name="country_of_residence_id"
            label={
              _t ? _t("profile.lifestyle.country") : "Country of Residence"
            }
            items={countries}
            leftIcon={
              <FeatherIcon name="map-pin" size={20} color={COLORS.primary} />
            }
            required
            isRTL={_isRTL}
          />
          <AnimatedDropdown
            control={control}
            name="city_id"
            label={_t ? _t("profile.lifestyle.city") : "City"}
            items={cities}
            isLoading={loading.cities}
            leftIcon={
              <FeatherIcon name="map" size={20} color={COLORS.primary} />
            }
            required
            isRTL={_isRTL}
          />
          <AnimatedDropdown
            control={control}
            name="origin_id"
            label={_t ? _t("profile.lifestyle.origin") : "Origin"}
            items={origins}
            leftIcon={
              <FeatherIcon name="home" size={20} color={COLORS.primary} />
            }
            required
            isRTL={_isRTL}
          />
        </AnimatedFormContainer>
      </AnimatedCard>

      <AnimatedCard delay={200}>
        <CardHeader {...cardConfigs.personal} isRTL={_isRTL} t={_t} />
        <AnimatedFormContainer isRTL={_isRTL}>
          <FormRow isRTL={_isRTL}>
            <AnimatedDropdown
              control={control}
              name="marital_status_id"
              label={
                _t ? _t("profile.lifestyle.marital_status") : "Marital Status"
              }
              items={maritalStatuses}
              leftIcon={
                <MaterialIcon name="people" size={20} color={COLORS.primary} />
              }
              required
              isRTL={_isRTL}
            />
            <AnimatedDropdown
              required
              control={control}
              name="number_of_children"
              label={_t ? _t("profile.lifestyle.children_label") : "Children"}
              items={childNumbers}
              leftIcon={
                <MaterialIcon
                  name="child-care"
                  size={20}
                  color={COLORS.primary}
                />
              }
              isRTL={_isRTL}
            />
          </FormRow>
        </AnimatedFormContainer>
      </AnimatedCard>

      {/* Physical Attributes */}
      <AnimatedCard delay={400}>
        <CardHeader {...cardConfigs.physical} isRTL={_isRTL} t={_t} />
        <AnimatedFormContainer isRTL={_isRTL}>
          <FormRow isRTL={_isRTL}>
            <AnimatedDropdown
              control={control}
              name="height"
              label={_t ? _t("profile.lifestyle.height") : "Height"}
              items={heights}
              leftIcon={
                <FeatherIcon name="arrow-up" size={20} color={COLORS.primary} />
              }
              required
              isRTL={_isRTL}
            />
            <AnimatedDropdown
              control={control}
              name="weight"
              label={_t ? _t("profile.lifestyle.weight") : "Weight"}
              items={weights}
              leftIcon={
                <MaterialIcon
                  name="fitness-center"
                  size={20}
                  color={COLORS.primary}
                />
              }
              required
              isRTL={_isRTL}
            />
          </FormRow>
          <FormRow isRTL={_isRTL}>
            <AnimatedDropdown
              control={control}
              name="eye_color_id"
              label={_t ? _t("profile.lifestyle.eye_colors") : "Eye Color"}
              items={eyeColors}
              leftIcon={
                <MaterialIcon
                  name="visibility"
                  size={20}
                  color={COLORS.primary}
                />
              }
              required
              isRTL={_isRTL}
            />
            <AnimatedDropdown
              required
              control={control}
              name="skin_color_id"
              label={_t ? _t("profile.lifestyle.skin_color") : "Skin Color"}
              items={skinColors}
              leftIcon={
                <MaterialIcon name="palette" size={20} color={COLORS.primary} />
              }
              isRTL={_isRTL}
            />
          </FormRow>
        </AnimatedFormContainer>
      </AnimatedCard>

      {/* Lifestyle & Preferences */}
      <AnimatedCard delay={500}>
        <CardHeader {...cardConfigs.lifestyle} isRTL={_isRTL} t={_t} />
        <AnimatedFormContainer isRTL={_isRTL}>
          {userGender !== "female" && (
            <AnimatedDropdown
              control={control}
              name="marriage_budget_id"
              label={
                _t ? _t("profile.lifestyle.marriage_budget") : "Marriage Budget"
              }
              items={marriageBudget}
              leftIcon={
                <MaterialIcon
                  name="account-balance-wallet"
                  size={20}
                  color={COLORS.primary}
                />
              }
              required={userGender === "male"}
              isRTL={_isRTL}
            />
          )}
          <AnimatedDropdown
            control={control}
            name="religiosity_level_id"
            label={
              _t ? _t("profile.lifestyle.religiosity") : "Religiosity Level"
            }
            items={religiosityLevels}
            leftIcon={
              <MaterialIcon
                name="brightness-high"
                size={20}
                color={COLORS.primary}
              />
            }
            required
            isRTL={_isRTL}
          />
          {/* {userGender !== "male" && ( */}
          <AnimatedDropdown
            control={control}
            name="hair_color_id"
            label={_t ? _t("profile.lifestyle.hair_color") : "Hair Color"}
            items={hairColors}
            leftIcon={
              <MaterialIcon
                name="color-lens"
                size={20}
                color={COLORS.primary}
              />
            }
            required
            isRTL={_isRTL}
          />
          {/* )} */}
          <AnimatedDropdown
            control={control}
            name="sleep_habit_id"
            label={_t ? _t("profile.lifestyle.sleep_habits") : "Sleep Habits"}
            items={sleepHabits}
            leftIcon={
              <MaterialIcon
                name="nightlight-round"
                size={20}
                color={COLORS.primary}
              />
            }
            required
            isRTL={_isRTL}
          />
          <AnimatedDropdown
            required
            control={control}
            name="sports_activity_id"
            label={_t ? _t("profile.lifestyle.sports") : "Sports Activity"}
            items={sportsActivities}
            leftIcon={
              <MaterialIcon name="sports" size={20} color={COLORS.primary} />
            }
            isRTL={_isRTL}
          />
        </AnimatedFormContainer>
      </AnimatedCard>

      <AnimatedCard delay={500}>
        <CardHeader {...cardConfigs.lifestyle} isRTL={_isRTL} t={_t} />
        <AnimatedFormContainer isRTL={_isRTL}>
          {/* Add Smoking Status first */}
          <AnimatedDropdown
            control={control}
            name="smoking_status"
            label={
              _t ? _t("profile.lifestyle.smoking_status") : "Smoking Status"
            }
            items={smokingStatuses}
            leftIcon={
              <FeatherIcon name="wind" size={20} color={COLORS.primary} />
            }
            required
            isRTL={_isRTL}
          />

          {/* Conditional Smoking Preferences */}
          {smoking_status > 1 && (
            <PreferencesContainer isRTL={_isRTL}>
              <SelectableGrid
                placeholder={
                  _t ? _t("profile.lifestyle.smoking_tools") : "Smoking Tools"
                }
                control={control}
                name="smoking_tools"
                items={smokingTools}
                label={
                  _t
                    ? _t("profile.lifestyle.smoking_preferences")
                    : "Smoking Preferences (Required)"
                }
                multiple
                required
                isRTL={_isRTL}
                rules={{
                  validate: (value) => {
                    if (
                      (smoking_status === 2 || smoking_status === 3) &&
                      (!value || value.length === 0)
                    ) {
                      return _t
                        ? _t("profile.lifestyle.smoking_tools_required")
                        : "Please select at least one smoking tool";
                    }
                    return true;
                  },
                }}
                renderItem={(item, isSelected) => (
                  <View
                    style={[
                      dynamicStyles.preferenceItem,
                      isSelected && dynamicStyles.preferenceItemSelected,
                    ]}
                  >
                    <Ionicons
                      name={smokingIcons[item.name] || "alert-circle"}
                      size={20}
                      color={isSelected ? "white" : "#9e086c"}
                      style={{
                        marginRight: _isRTL ? 0 : 5,
                        marginLeft: _isRTL ? 5 : 0,
                      }}
                    />

                    <Text
                      style={[
                        dynamicStyles.preferenceText,
                        isSelected && dynamicStyles.preferenceTextSelected,
                      ]}
                    >
                      {_t
                        ? _t(
                            `profile.lifestyle.smoking_tool.${item.name
                              .toLowerCase()
                              .replace(/[\s-]+/g, "_")}`
                          ) || item.name
                        : item.name}
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
            label={
              _t ? _t("profile.lifestyle.drinking_status") : "Drinking Status"
            }
            items={drinkingStatuses}
            leftIcon={
              <FeatherIcon name="coffee" size={20} color={COLORS.primary} />
            }
            isRTL={_isRTL}
          />
        </AnimatedFormContainer>
      </AnimatedCard>

      {/* Hobbies & Interests */}
      <AnimatedCard delay={600}>
        <CardHeader {...cardConfigs.hobbies} isRTL={_isRTL} t={_t} />
        <AnimatedFormContainer isRTL={_isRTL}>
          <SelectableGrid
            control={control}
            name="hobbies"
            items={hobbies}
            multiple
            numColumns={3}
            isRTL={_isRTL}
            renderItem={(item, isSelected) => (
              <HobbyItem
                item={item}
                isSelected={isSelected}
                isRTL={_isRTL}
                t={_t}
              />
            )}
          />
        </AnimatedFormContainer>
      </AnimatedCard>

      <AnimatedCard delay={700}>
        <CardHeader {...cardConfigs.pets} isRTL={_isRTL} t={_t} />
        <AnimatedFormContainer isRTL={_isRTL}>
          <SelectableGrid
            control={control}
            name="pets"
            items={pets}
            multiple
            numColumns={3}
            isRTL={_isRTL}
            renderItem={(item, isSelected) => (
              <PetItem
                item={item}
                isSelected={isSelected}
                isRTL={_isRTL}
                t={_t}
              />
            )}
          />
        </AnimatedFormContainer>
      </AnimatedCard>

      {/* Religion */}
      <AnimatedCard delay={800}>
        <CardHeader {...cardConfigs.spiritual} isRTL={_isRTL} t={_t} />
        <AnimatedFormContainer isRTL={_isRTL}>
          <AnimatedDropdown
            control={control}
            name="religion_id"
            label={_t ? _t("profile.lifestyle.religion") : "Religion"}
            items={religions}
            leftIcon={
              <FeatherIcon name="moon" size={20} color={COLORS.primary} />
            }
            required
            isRTL={_isRTL}
          />
        </AnimatedFormContainer>
      </AnimatedCard>
    </ScrollView>
  );
};

export default LifestyleSection;
