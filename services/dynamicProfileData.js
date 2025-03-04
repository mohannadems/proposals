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

/**
 * Custom hook to provide dynamic profile data
 * This replaces the static PROFILE_DATA with data from the API
 */
export const useDynamicProfileData = () => {
  const dispatch = useDispatch();

  // Get all data from Redux store
  const personalAttributes = useSelector(selectPersonalAttributes);
  const lifestyleInterests = useSelector(selectLifestyleInterests);
  const professionalEducational = useSelector(selectProfessionalEducational);
  const geographic = useSelector(selectGeographic);
  const socialMediaPresences = useSelector(selectSocialMediaPresences);
  const jobTitles = useSelector(selectJobTitles);
  const loading = useSelector(selectLoadingStates);
  const errors = useSelector(selectErrorStates);

  // Fetch all data on hook mount
  useEffect(() => {
    dispatch(fetchAllProfileData());
  }, [dispatch]);

  // Selector for cities by country
  const getCitiesByCountry = (countryId) => {
    return (
      useSelector((state) => selectCitiesByCountry(state, countryId)) || []
    );
  };

  // Extract all the data to match the original PROFILE_DATA structure
  const {
    hairColors = [],
    heights = [],
    weights = [],
    origins = [],
    maritalStatuses = [],
    skinColors = [],
    zodiacSigns = [],
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

  // Define child numbers (not in API)
  const childrenNumbers = [
    { id: 1, name: "No Children 🚫" },
    { id: 2, name: "1 Child 👶" },
    { id: 3, name: "2 Children 🧒👧" },
    { id: 4, name: "3 Children 👧🧒👦" },
    { id: 5, name: "4 or More Children 👨‍👩‍👧‍👦" },
  ];

  // Dynamic version of PROFILE_DATA
  const dynamicProfileData = {
    marriageBudget,
    religiosityLevels,
    sleep_habits: sleepHabits,
    hair_colors: hairColors,
    heights,
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
    // Cities are handled separately since they're fetched dynamically by country
    cities: {}, // Will be accessed through getCitiesByCountry function
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

/**
 * Utility function to get cities by country ID
 * This can be used directly without the hook
 */
export const getCitiesByCountryId = (state, countryId) => {
  return selectCitiesByCountry(state, countryId) || [];
};
