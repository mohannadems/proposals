// services/dynamicProfileData.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProfileData,
  selectPersonalAttributes,
  selectLifestyleInterests,
  selectProfessionalEducational,
  selectGeographic,
  selectSocialMediaPresences,
  selectJobTitles,
  selectCitiesByCountry,
  selectLoadingStates,
  selectErrorStates,
} from "../store/slices/profileAttributesSlice";

export const useDynamicProfileData = () => {
  const dispatch = useDispatch();

  const personalAttributes = useSelector(selectPersonalAttributes);
  const lifestyleInterests = useSelector(selectLifestyleInterests);
  const professionalEducational = useSelector(selectProfessionalEducational);
  const geographic = useSelector(selectGeographic);
  const socialMediaPresences = useSelector(selectSocialMediaPresences);
  const jobTitles = useSelector(selectJobTitles);
  const loading = useSelector(selectLoadingStates);
  const errors = useSelector(selectErrorStates);

  useEffect(() => {
    dispatch(fetchAllProfileData());
  }, [dispatch]);

  const getCitiesByCountry = (countryId) => {
    return (
      useSelector((state) => selectCitiesByCountry(state, countryId)) || []
    );
  };

  const {
    hairColors = [],
    heights = [],
    weights = [],
    origins = [],
    maritalStatuses = [],
    skinColors = [],
    zodiacSigns = [],
    sleepHabits = [],
    eyeColors = [],
  } = personalAttributes;

  const {
    hobbies = [],
    pets = [],
    sportsActivities = [],
    smokingTools = [],
    drinkingStatuses = [],
    religiosityLevels = [],
  } = lifestyleInterests;

  const {
    specializations = [],
    positionLevels = [],
    educationalLevels = [],
    marriageBudget = [],
  } = professionalEducational;

  const {
    countries = [],
    religions = [],
    nationalities = [],
    housingStatuses = [],
    financialStatuses = [],
  } = geographic;

  const childrenNumbers = [
    { id: 1, name: "No Children 🚫" },
    { id: 2, name: "1 Child 👶" },
    { id: 3, name: "2 Children 🧒👧" },
    { id: 4, name: "3 Children 👧🧒👦" },
    { id: 5, name: "4 or More Children 👨‍👩‍👧‍👦" },
  ];

  const dynamicProfileData = {
    marriageBudget,
    religiosityLevels,
    sleep_habits: sleepHabits,
    hair_colors: hairColors,
    heights,
    eye_color_id: eyeColors,
    weights,
    origins,
    marital_statuses: maritalStatuses,
    skin_colors: skinColors,
    zodiac_signs: zodiacSigns,
    hobbies,
    pets,
    sports_activities: sportsActivities,
    smoking_tools: smokingTools,
    drinking_statuses: drinkingStatuses,
    specializations,
    position_levels: positionLevels,
    educational_levels: educationalLevels,
    countries,
    religions,
    nationalities,
    housing_statuses: housingStatuses,
    financial_statuses: financialStatuses,
    social_media_presences: socialMediaPresences,
    jobTitles,
    maritalStatuses,
    childrenNumbers,
    cities: {},
  };

  return {
    profileData: dynamicProfileData,
    getCitiesByCountry,
    isLoading: Object.values(loading).some((value) => value === true),
    hasErrors: Object.values(errors).some((value) => value !== null),
    loading,
    errors,
  };
};

export const getCitiesByCountryId = (state, countryId) => {
  return selectCitiesByCountry(state, countryId) || [];
};
