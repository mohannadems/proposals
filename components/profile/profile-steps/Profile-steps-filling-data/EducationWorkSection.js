import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { COLORS } from "../../../../constants/colors";
import FormDropdown from "../../../common/FormDropdown";

// Import Redux actions and selectors
import {
  fetchAllProfileData,
  selectProfessionalEducational,
  selectGeographic,
  selectPersonalAttributes,
  selectLoadingStates,
} from "../../../../store/slices/profileAttributesSlice";

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

// Define social media presences (not in API)
const socialMediaPresences = [
  { id: 1, name: "Highly Active 📱" },
  { id: 2, name: "Moderately Active 🖥️" },
  { id: 3, name: "Rarely Active 📴" },
  { id: 4, name: "Inactive 🚫" },
];

// Define job titles (not in API)
const jobTitles = [
  { id: 1, name: "Software Developer 💻" },
  { id: 2, name: "Data Scientist 📊" },
  { id: 3, name: "Cloud Engineer ☁️" },
  { id: 4, name: "AI/ML Specialist 🤖" },
  { id: 5, name: "Teacher 👨‍🏫" },
  { id: 6, name: "Doctor 👩‍⚕️" },
  { id: 7, name: "Engineer 👷‍♂️" },
  { id: 8, name: "Business Analyst 📈" },
  { id: 9, name: "Marketing Specialist 📣" },
  { id: 10, name: "Accountant 💼" },
];

const EducationWorkSection = () => {
  const { control, watch, setValue } = useFormContext();
  const dispatch = useDispatch();
  const employment_status = watch("employment_status");

  // Get data from Redux store
  const professionalEducational = useSelector(selectProfessionalEducational);
  const geographic = useSelector(selectGeographic);
  const personalAttributes = useSelector(selectPersonalAttributes);
  const loading = useSelector(selectLoadingStates);

  // Fetch all profile data on component mount
  useEffect(() => {
    dispatch(fetchAllProfileData());
  }, [dispatch]);

  // Extract needed data from Redux state
  const {
    educationalLevels = [],
    specializations = [],
    positionLevels = [],
  } = professionalEducational;

  const { housingStatuses = [], financialStatuses = [] } = geographic;

  const { zodiacSigns = [] } = personalAttributes;

  // Show loading state
  if (
    loading.personalAttributes ||
    loading.professionalEducational ||
    loading.geographic
  ) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading professional data...</Text>
      </View>
    );
  }

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
            items={educationalLevels}
            leftIcon={
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
            items={specializations}
            leftIcon={
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
              items={jobTitles} // Using local static data as it's not in the API
              leftIcon={
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
              items={positionLevels}
              leftIcon={
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
            items={financialStatuses}
            leftIcon={
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
            items={housingStatuses}
            leftIcon={
              <FeatherIcon name="home" size={20} color={COLORS.primary} />
            }
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
            items={socialMediaPresences} // Using local static data as it's not in the API
            leftIcon={
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
            items={zodiacSigns}
            leftIcon={
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
});

export default EducationWorkSection;
