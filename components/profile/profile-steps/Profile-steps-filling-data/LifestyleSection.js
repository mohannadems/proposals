import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useFormContext } from "react-hook-form";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
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

// Import constants and styles
import { cardConfigs } from "./constants";
import { COLORS } from "../../../../constants/colors";
import { PROFILE_DATA } from "../../../../constants/profileData";
import SelectableGrid from "./SelectableGrid";

const LifestyleSection = () => {
  const { control, watch } = useFormContext();
  const smoking_status = watch("smoking_status");

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
            items={PROFILE_DATA.nationalities}
            icon={<FeatherIcon name="flag" size={20} color={COLORS.primary} />}
            required
          />
          <AnimatedDropdown
            control={control}
            name="country_of_residence_id"
            label="Country of Residence 📍"
            items={PROFILE_DATA.countries}
            icon={
              <FeatherIcon name="map-pin" size={20} color={COLORS.primary} />
            }
            required
          />
          <AnimatedDropdown
            control={control}
            name="city_id"
            label="City 🏙️"
            items={PROFILE_DATA.cities[watch("country_of_residence_id") || 1]}
            icon={<FeatherIcon name="map" size={20} color={COLORS.primary} />}
            required
          />
          <AnimatedDropdown
            control={control}
            name="origin_id"
            label="Origin 🏠"
            items={PROFILE_DATA.origins}
            icon={<FeatherIcon name="home" size={20} color={COLORS.primary} />}
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
              items={PROFILE_DATA.maritalStatuses}
              icon={
                <MaterialIcon name="people" size={20} color={COLORS.primary} />
              }
              required
            />
            <AnimatedDropdown
              required
              control={control}
              name="number_of_children"
              label="Children 👶"
              items={PROFILE_DATA.childrenNumbers}
              icon={
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
              items={PROFILE_DATA.heights}
              icon={
                <FeatherIcon name="arrow-up" size={20} color={COLORS.primary} />
              }
              required
            />
            <AnimatedDropdown
              control={control}
              name="weight"
              label="Weight ⚖️"
              items={PROFILE_DATA.weights}
              icon={
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
              items={PROFILE_DATA.hair_colors}
              icon={
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
              items={PROFILE_DATA.skin_colors}
              icon={
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
            items={PROFILE_DATA.marriageBudget}
            icon={
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
            items={PROFILE_DATA.religiosityLevels}
            icon={
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
            items={PROFILE_DATA.sleep_habits}
            icon={
              <MaterialIcon
                name="nightlight-round"
                size={20}
                color={COLORS.primary}
              />
            }
            required
          />
          <AnimatedDropdown
            control={control}
            name="sports_activity_id"
            label="Sports Activity 🏃‍♂️"
            items={PROFILE_DATA.sports_activities}
            icon={
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
            items={[
              { id: 1, name: "Non-smoker" },
              { id: 2, name: "Regular smoker" },
              { id: 3, name: "Social smoker" },
            ]}
            icon={<FeatherIcon name="wind" size={20} color={COLORS.primary} />}
            required
          />

          {/* Conditional Smoking Preferences */}
          {smoking_status > 1 && (
            <PreferencesContainer>
              <SelectableGrid
                control={control}
                name="smoking_tools"
                items={PROFILE_DATA.smoking_tools}
                label="Smoking Preferences"
                multiple
                renderItem={(item, isSelected) => (
                  <View
                    style={[
                      styles.preferenceItem,
                      isSelected && styles.preferenceItemSelected,
                    ]}
                  >
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
            items={PROFILE_DATA.drinking_statuses}
            icon={
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
            items={PROFILE_DATA.hobbies}
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
            items={PROFILE_DATA.pets}
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
            items={PROFILE_DATA.religions}
            icon={<FeatherIcon name="moon" size={20} color={COLORS.primary} />}
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
  },
  preferenceTextSelected: {
    color: COLORS.white,
    fontWeight: "600",
  },
});

export default LifestyleSection;
