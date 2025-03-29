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

const cardConfigs = {
  education: {
    title: "Educational Background",
    iconName: "school-outline",
    description: "Your academic achievements and specialization",
    emoji: "🎓",
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
  social: {
    title: "Online Presence",
    iconName: "web",
    description: "Your social media and digital footprint",
    emoji: "🌐",
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
  const dispatch = useDispatch();
  const employment_status = watch("employment_status");

  const professionalEducational = useSelector(selectProfessionalEducational);
  const geographic = useSelector(selectGeographic);
  const personalAttributes = useSelector(selectPersonalAttributes);
  const loading = useSelector(selectLoadingStates);

  useEffect(() => {
    dispatch(fetchAllProfileData());
  }, [dispatch]);

  const {
    educationalLevels = [],
    specializations = [],
    positionLevels = [],
  } = professionalEducational;

  const { zodiacSigns = [], socialMediaPresence = [] } = personalAttributes;
  const { jobTitles = [] } = useSelector(selectProfessionalEducational);
  const { housingStatuses = [], financialStatuses = [] } = geographic;

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

      <Controller
        control={control}
        name="employment_status"
        render={({ field: { value, onChange } }) => (
          <ToggleButton
            label="Employment Status"
            value={value}
            onChange={(newValue) => {
              onChange(newValue);
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

      {employment_status === true && (
        <AnimatedCard delay={200}>
          <CardHeader {...cardConfigs.jobDetails} />
          <AnimatedFormContainer>
            <FormDropdown
              control={control}
              name="job_title_id"
              label="Job Title 💼"
              items={jobTitles}
              leftIcon={
                <FeatherIcon
                  name="briefcase"
                  size={20}
                  color={COLORS.primary}
                />
              }
              rules={{
                required: "Job title is required",
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
                required: "Position level is required",
              }}
            />
          </AnimatedFormContainer>
        </AnimatedCard>
      )}

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

      <AnimatedCard delay={400}>
        <CardHeader {...cardConfigs.social} />
        <AnimatedFormContainer>
          <FormDropdown
            required
            control={control}
            name="social_media_presence_id"
            label="Social Media Presence 📱"
            items={socialMediaPresence}
            leftIcon={
              <FeatherIcon name="share-2" size={20} color={COLORS.primary} />
            }
          />
        </AnimatedFormContainer>
      </AnimatedCard>

      <AnimatedCard delay={500}>
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
