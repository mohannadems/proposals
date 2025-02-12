import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { COLORS } from "../../../../constants/colors";
import { PROFILE_DATA } from "../../../../constants/profileData";
import FormDropdown from "../../../common/FormDropdown";

import { AnimatedCard, SectionHeader, ToggleButton } from "./AnimatedBase";
import { CardHeader } from "./CardHeader";
import { AnimatedFormContainer } from "./FormComponents";

// Card configurations
const cardConfigs = {
  education: {
    title: "Educational Background",
    iconName: "school-outline",
    description: "Your academic achievements and specialization",
    emoji: "🎓",
  },
  employment: {
    title: "Employment Status",
    iconName: "briefcase-outline",
    description: "Your current work situation",
    emoji: "💼",
  },
  jobDetails: {
    title: "Job Details",
    iconName: "briefcase-outline",
    description: "Your professional information",
    emoji: "👔",
  },
  financial: {
    title: "Financial Information",
    iconName: "currency-usd",
    description: "Your financial stability and housing",
    emoji: "💰",
  },
  marital: {
    title: "Marital Status",
    iconName: "heart-outline",
    description: "Your relationship status",
    emoji: "💑",
  },
  social: {
    title: "Online Presence",
    iconName: "web",
    description: "Your social media and digital footprint",
    emoji: "🌐",
  },
  origin: {
    title: "Origin",
    iconName: "earth",
    description: "Your cultural background",
    emoji: "🌍",
  },
  zodiac: {
    title: "Cosmic Identity",
    iconName: "zodiac-sagittarius",
    description: "Your astrological sign",
    emoji: "⭐",
  },
};

const EducationWorkSection = () => {
  const { control, watch, setValue } = useFormContext();
  const employment_status = watch("employment_status");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <SectionHeader
        title="Your Professional Journey"
        subtitle="Craft the story of your educational and career path 🚀"
        emoji="✨"
      />

      {/* Educational Background Card */}
      <AnimatedCard delay={100}>
        <CardHeader {...cardConfigs.education} />
        <AnimatedFormContainer>
          <FormDropdown
            control={control}
            name="educational_level_id"
            label="Education Level 📚"
            items={PROFILE_DATA.educational_levels}
            icon={
              <FeatherIcon
                name="trending-up"
                size={20}
                color={COLORS.primary}
              />
            }
          />
          <FormDropdown
            control={control}
            name="specialization_id"
            label="Field of Study 📖"
            items={PROFILE_DATA.specializations}
            icon={
              <FeatherIcon name="book-open" size={20} color={COLORS.primary} />
            }
          />
        </AnimatedFormContainer>
      </AnimatedCard>

      {/* Employment Status Toggle */}
      <Controller
        control={control}
        name="employment_status"
        render={({ field: { value, onChange } }) => (
          <ToggleButton
            label="Employment Status 💼"
            value={value}
            onChange={(newValue) => {
              onChange(newValue);
              // Optional: Clear job details when switching to not employed
              if (newValue === false) {
                setValue("job_title_id", null);
                setValue("position_level_id", null);
              }
            }}
            options={[
              {
                value: true,
                label: "Employed",
                icon: (
                  <FeatherIcon
                    name="briefcase"
                    size={24}
                    color={value === true ? COLORS.white : COLORS.primary}
                  />
                ),
              },
              {
                value: false,
                label: "Not Employed",
                icon: (
                  <FeatherIcon
                    name="x-circle"
                    size={24}
                    color={value === false ? COLORS.white : COLORS.primary}
                  />
                ),
              },
            ]}
          />
        )}
      />

      {/* Job Details Card (Only when Employed) */}
      {employment_status === true && (
        <AnimatedCard delay={200}>
          <CardHeader {...cardConfigs.jobDetails} />
          <AnimatedFormContainer>
            <FormDropdown
              control={control}
              name="job_title_id"
              label="Job Title 💼"
              items={PROFILE_DATA.jobTitles}
              icon={
                <FeatherIcon
                  name="briefcase"
                  size={20}
                  color={COLORS.primary}
                />
              }
              rules={{
                required:
                  employment_status === true ? "Job title is required" : false,
              }}
            />
            <FormDropdown
              control={control}
              name="position_level_id"
              label="Position Level 📈"
              items={PROFILE_DATA.position_levels}
              icon={
                <FeatherIcon
                  name="arrow-up-right"
                  size={20}
                  color={COLORS.primary}
                />
              }
              rules={{
                required:
                  employment_status === true
                    ? "Position level is required"
                    : false,
              }}
            />
          </AnimatedFormContainer>
        </AnimatedCard>
      )}

      {/* Financial Information Card */}
      <AnimatedCard delay={300}>
        <CardHeader {...cardConfigs.financial} />
        <AnimatedFormContainer>
          <FormDropdown
            control={control}
            name="financial_status_id"
            label="Financial Status 💵"
            items={PROFILE_DATA.financial_statuses}
            icon={
              <FeatherIcon
                name="dollar-sign"
                size={20}
                color={COLORS.primary}
              />
            }
          />
          <FormDropdown
            control={control}
            name="housing_status_id"
            label="Housing Status 🏠"
            items={PROFILE_DATA.housing_statuses}
            icon={<FeatherIcon name="home" size={20} color={COLORS.primary} />}
          />
        </AnimatedFormContainer>
      </AnimatedCard>

      {/* Social Media Card */}
      <AnimatedCard delay={400}>
        <CardHeader {...cardConfigs.social} />
        <AnimatedFormContainer>
          <FormDropdown
            required
            control={control}
            name="social_media_presence_id"
            label="Social Media Presence 📱"
            items={PROFILE_DATA.social_media_presences}
            icon={
              <FeatherIcon name="share-2" size={20} color={COLORS.primary} />
            }
          />
        </AnimatedFormContainer>
      </AnimatedCard>

      {/* Zodiac Sign Card */}
      <AnimatedCard delay={700}>
        <CardHeader {...cardConfigs.zodiac} />
        <AnimatedFormContainer>
          <FormDropdown
            required
            control={control}
            name="zodiac_sign_id"
            label="Zodiac Sign ✨"
            items={PROFILE_DATA.zodiac_signs}
            icon={
              <MaterialIcon name="stars" size={20} color={COLORS.primary} />
            }
          />
        </AnimatedFormContainer>
      </AnimatedCard>

      {/* Car Ownership Toggle */}
      <Controller
        control={control}
        name="car_ownership"
        render={({ field: { value, onChange } }) => (
          <ToggleButton
            label="Car Ownership 🚗"
            value={value}
            onChange={onChange}
            options={[
              {
                value: true,
                label: "Yes",
                icon: (
                  <FeatherIcon
                    name="check-circle"
                    size={24}
                    color={value === true ? COLORS.white : COLORS.primary}
                  />
                ),
              },
              {
                value: false,
                label: "No",
                icon: (
                  <FeatherIcon
                    name="x-circle"
                    size={24}
                    color={value === false ? COLORS.white : COLORS.primary}
                  />
                ),
              },
            ]}
          />
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
});

export default EducationWorkSection;
