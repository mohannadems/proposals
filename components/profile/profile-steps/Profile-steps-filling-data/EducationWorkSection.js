import React, { useEffect, useContext } from "react";
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
import { LanguageContext } from "../../../../contexts/LanguageContext";

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

const EducationWorkSection = ({ isRTL = false, t, userGender }) => {
  const { isRTL: contextRTL, t: contextT } = useContext(LanguageContext) || {};
  const _isRTL = isRTL !== undefined ? isRTL : contextRTL;
  const _t = t || contextT;

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

  const dynamicStyles = {
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
      textAlign: _isRTL ? "right" : "left",
    },
  };

  if (
    loading.personalAttributes ||
    loading.professionalEducational ||
    loading.geographic
  ) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={dynamicStyles.loadingText}>
          {_t
            ? _t("profile.education.loading")
            : "Loading professional data..."}
        </Text>
      </View>
    );
  }

  const getTranslatedCardConfig = (config) => {
    if (!_t) return config;

    return {
      ...config,
      title:
        _t(
          `profile.education.cards.${config.title
            .toLowerCase()
            .replace(/\s+/g, "_")}`
        ) || config.title,
      description:
        _t(
          `profile.education.cards.${config.description
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^\w_]/g, "")}`
        ) || config.description,
    };
  };

  return (
    <ScrollView
      style={dynamicStyles.container}
      contentContainerStyle={dynamicStyles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <SectionHeader
        title={
          _t
            ? _t("profile.education.section_title")
            : "Your Professional Journey"
        }
        subtitle={
          _t
            ? _t("profile.education.section_subtitle")
            : "Craft the story of your educational and career path 🚀"
        }
        emoji="✨"
        isRTL={_isRTL}
      />

      <AnimatedCard delay={100}>
        <CardHeader
          {...getTranslatedCardConfig(cardConfigs.education)}
          isRTL={_isRTL}
        />
        <AnimatedFormContainer isRTL={_isRTL}>
          <FormDropdown
            control={control}
            name="educational_level_id"
            label={
              _t
                ? _t("profile.education.education_level")
                : "Education Level 📚"
            }
            items={educationalLevels}
            leftIcon={
              <FeatherIcon
                name="trending-up"
                size={20}
                color={COLORS.primary}
              />
            }
            isRTL={_isRTL}
          />
          <FormDropdown
            control={control}
            name="specialization_id"
            label={
              _t ? _t("profile.education.field_of_study") : "Field of Study 📖"
            }
            items={specializations}
            leftIcon={
              <FeatherIcon name="book-open" size={20} color={COLORS.primary} />
            }
            isRTL={_isRTL}
          />
        </AnimatedFormContainer>
      </AnimatedCard>

      <Controller
        control={control}
        name="employment_status"
        rules={{ required: "Please select your employment status" }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <ToggleButton
              label={
                _t
                  ? _t("profile.education.employment_status")
                  : "Employment Status"
              }
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
                  label: _t ? _t("profile.education.employed") : "Employed",
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
                  label: _t
                    ? _t("profile.education.not_employed")
                    : "Not Employed",
                  icon: (
                    <FeatherIcon
                      name="x-circle"
                      size={24}
                      color={value === false ? COLORS.white : COLORS.primary}
                    />
                  ),
                },
              ]}
              isRTL={_isRTL}
              error={error?.message}
            />
            {error && (
              <Text
                style={{
                  color: COLORS.error,
                  marginTop: 5,
                  textAlign: _isRTL ? "right" : "left",
                }}
              >
                {error.message}
              </Text>
            )}
          </>
        )}
      />

      {employment_status === true && (
        <AnimatedCard delay={200}>
          <CardHeader
            {...getTranslatedCardConfig(cardConfigs.jobDetails)}
            isRTL={_isRTL}
          />
          <AnimatedFormContainer isRTL={_isRTL}>
            <FormDropdown
              control={control}
              name="job_title_id"
              label={_t ? _t("profile.education.job_title") : "Job Title 💼"}
              items={jobTitles}
              leftIcon={
                <FeatherIcon
                  name="briefcase"
                  size={20}
                  color={COLORS.primary}
                />
              }
              rules={{
                required: _t
                  ? _t("profile.education.job_title_required")
                  : "Job title is required",
              }}
              isRTL={_isRTL}
            />
            <FormDropdown
              control={control}
              name="position_level_id"
              label={
                _t
                  ? _t("profile.education.position_level")
                  : "Position Level 📈"
              }
              items={positionLevels}
              leftIcon={
                <FeatherIcon
                  name="arrow-up-right"
                  size={20}
                  color={COLORS.primary}
                />
              }
              rules={{
                required: _t
                  ? _t("profile.education.position_level_required")
                  : "Position level is required",
              }}
              isRTL={_isRTL}
            />
          </AnimatedFormContainer>
        </AnimatedCard>
      )}

      <AnimatedCard delay={300}>
        <CardHeader
          {...getTranslatedCardConfig(cardConfigs.financial)}
          isRTL={_isRTL}
        />
        <AnimatedFormContainer isRTL={_isRTL}>
          <FormDropdown
            control={control}
            name="financial_status_id"
            label={
              _t
                ? _t("profile.education.financial_status")
                : "Financial Status 💵"
            }
            items={financialStatuses}
            leftIcon={
              <FeatherIcon
                name="dollar-sign"
                size={20}
                color={COLORS.primary}
              />
            }
            isRTL={_isRTL}
          />
          {userGender !== "female" && (
            <FormDropdown
              control={control}
              name="housing_status_id"
              label={
                _t
                  ? _t("profile.education.housing_status")
                  : "Housing Status 🏠"
              }
              items={housingStatuses}
              leftIcon={
                <FeatherIcon name="home" size={20} color={COLORS.primary} />
              }
              isRTL={_isRTL}
              required={userGender === "male"} // Only required for males
              rules={{
                required:
                  userGender === "male"
                    ? _t
                      ? _t("profile.education.housing_status_required")
                      : "Housing status is required"
                    : false,
              }}
            />
          )}
        </AnimatedFormContainer>
      </AnimatedCard>

      <AnimatedCard delay={400}>
        <CardHeader
          {...getTranslatedCardConfig(cardConfigs.social)}
          isRTL={_isRTL}
        />
        <AnimatedFormContainer isRTL={_isRTL}>
          <FormDropdown
            required
            control={control}
            name="social_media_presence_id"
            label={
              _t
                ? _t("profile.education.social_media")
                : "Social Media Presence 📱"
            }
            items={socialMediaPresence}
            leftIcon={
              <FeatherIcon name="share-2" size={20} color={COLORS.primary} />
            }
            isRTL={_isRTL}
          />
        </AnimatedFormContainer>
      </AnimatedCard>

      <AnimatedCard delay={500}>
        <CardHeader
          {...getTranslatedCardConfig(cardConfigs.zodiac)}
          isRTL={_isRTL}
        />
        <AnimatedFormContainer isRTL={_isRTL}>
          <FormDropdown
            required
            control={control}
            name="zodiac_sign_id"
            label={_t ? _t("profile.education.zodiac_sign") : "Zodiac Sign ✨"}
            items={zodiacSigns}
            leftIcon={
              <MaterialIcon name="stars" size={20} color={COLORS.primary} />
            }
            isRTL={_isRTL}
          />
        </AnimatedFormContainer>
      </AnimatedCard>

      <Controller
        control={control}
        name="car_ownership"
        rules={{ required: "Please select your car ownership status" }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <ToggleButton
              label={
                _t ? _t("profile.education.car_ownership") : "Car Ownership 🚗"
              }
              value={value}
              onChange={onChange}
              options={[
                {
                  value: true,
                  label: _t ? _t("common.yes") : "Yes",
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
                  label: _t ? _t("common.no") : "No",
                  icon: (
                    <FeatherIcon
                      name="x-circle"
                      size={24}
                      color={value === false ? COLORS.white : COLORS.primary}
                    />
                  ),
                },
              ]}
              isRTL={_isRTL}
              error={error?.message}
            />
            {error && (
              <Text
                style={{
                  color: COLORS.error,
                  marginTop: 5,
                  textAlign: _isRTL ? "right" : "left",
                }}
              >
                {error.message}
              </Text>
            )}
          </>
        )}
      />
    </ScrollView>
  );
};

export default EducationWorkSection;
