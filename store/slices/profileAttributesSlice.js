import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { profileService } from "../../services/profileService";

export const fetchPersonalAttributes = createAsyncThunk(
  "profileAttributes/fetchPersonalAttributes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.fetchPersonalAttributes();
      console.log("Personal Attributes API response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch personal attributes"
      );
    }
  }
);

export const fetchLifestyleInterests = createAsyncThunk(
  "profileAttributes/fetchLifestyleInterests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.fetchLifestyleInterests();
      console.log("Lifestyle Interests API response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch lifestyle interests"
      );
    }
  }
);

export const fetchProfessionalEducational = createAsyncThunk(
  "profileAttributes/fetchProfessionalEducational",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.fetchProfessionalEducational();
      console.log("Professional Educational API response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch professional educational data"
      );
    }
  }
);

export const fetchGeographic = createAsyncThunk(
  "profileAttributes/fetchGeographic",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.fetchGeographic();
      console.log("Geographic API response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch geographic data"
      );
    }
  }
);

export const fetchCitiesByCountry = createAsyncThunk(
  "profileAttributes/fetchCitiesByCountry",
  async (countryId, { rejectWithValue }) => {
    try {
      const response = await profileService.fetchCitiesByCountry(countryId);
      console.log(`Cities API response for country ${countryId}:`, response);

      // Handle different response formats
      let cities = [];
      if (response && response.data) {
        cities = response.data;
      } else if (Array.isArray(response)) {
        cities = response;
      }

      console.log(`Processed cities for country ${countryId}:`, cities);
      return { countryId, cities };
    } catch (error) {
      console.warn(
        `Couldn't fetch cities for country ID ${countryId}, using empty array:`,
        error
      );
      return { countryId, cities: [] };
    }
  }
);

export const fetchAllProfileData = createAsyncThunk(
  "profileAttributes/fetchAllProfileData",
  async (_, { dispatch }) => {
    console.log("Fetching all profile data");
    await Promise.all([
      dispatch(fetchPersonalAttributes()),
      dispatch(fetchLifestyleInterests()),
      dispatch(fetchProfessionalEducational()),
      dispatch(fetchGeographic()),
    ]);
    console.log("All profile data fetched successfully");
  }
);

const initialState = {
  hairColors: [],
  heights: [],
  weights: [],
  origins: [],
  maritalStatuses: [],
  skinColors: [],
  zodiacSigns: [],
  sleepHabits: [],
  socialMediaPresence: [],

  hobbies: [],
  pets: [],
  sportsActivities: [],
  smokingTools: [],
  drinkingStatuses: [],
  religiosityLevels: [],

  specializations: [],
  positionLevels: [],
  educationalLevels: [],
  marriageBudget: [],
  jobTitles: [],

  countries: [],
  religions: [],
  nationalities: [],
  housingStatuses: [],
  financialStatuses: [],

  cities: [],
  citiesByCountry: {},

  loading: {
    personalAttributes: false,
    lifestyleInterests: false,
    professionalEducational: false,
    geographic: false,
    cities: false,
  },

  errors: {
    personalAttributes: null,
    lifestyleInterests: null,
    professionalEducational: null,
    geographic: null,
    cities: null,
  },
};

const profileAttributesSlice = createSlice({
  name: "profileAttributes",
  initialState,
  reducers: {
    resetProfileAttributes: () => initialState,
    clearCities: (state) => {
      state.cities = [];
    },
    debugState: (state) => {
      console.log(
        "Current state:",
        JSON.stringify(
          {
            marriageBudget: state.marriageBudget,
            religiosityLevels: state.religiosityLevels,
            cities: state.cities,
          },
          null,
          2
        )
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersonalAttributes.pending, (state) => {
        state.loading.personalAttributes = true;
        state.errors.personalAttributes = null;
      })
      .addCase(fetchPersonalAttributes.fulfilled, (state, action) => {
        state.loading.personalAttributes = false;
        state.hairColors = action.payload.hair_colors || [];
        state.heights = action.payload.heights || [];
        state.weights = action.payload.weights || [];
        state.origins = action.payload.origins || [];
        state.maritalStatuses = action.payload.marital_statuses || [];
        state.skinColors = action.payload.skin_colors || [];
        state.zodiacSigns = action.payload.zodiac_signs || [];
        state.sleepHabits = action.payload.sleep_habits || [];
        state.socialMediaPresence = action.payload.social_media_presence || [];

        // JobTitles moved to professionalEducational
        if (action.payload.job_titles) {
          state.jobTitles = action.payload.job_titles;
        }
      })
      .addCase(fetchPersonalAttributes.rejected, (state, action) => {
        state.loading.personalAttributes = false;
        state.errors.personalAttributes = action.payload || "An error occurred";
      });

    builder
      .addCase(fetchLifestyleInterests.pending, (state) => {
        state.loading.lifestyleInterests = true;
        state.errors.lifestyleInterests = null;
      })
      .addCase(fetchLifestyleInterests.fulfilled, (state, action) => {
        state.loading.lifestyleInterests = false;
        state.hobbies = action.payload.hobbies || [];
        state.pets = action.payload.pets || [];
        state.sportsActivities = action.payload.sports_activities || [];
        state.smokingTools = action.payload.smoking_tools || [];
        state.drinkingStatuses = action.payload.drinking_statuses || [];

        // Handle both possible API formats for religiosity_levels
        state.religiosityLevels =
          action.payload.religiosity_levels ||
          action.payload.religiosityLevels ||
          [];

        console.log("Updated religiosityLevels:", state.religiosityLevels);
      })
      .addCase(fetchLifestyleInterests.rejected, (state, action) => {
        state.loading.lifestyleInterests = false;
        state.errors.lifestyleInterests = action.payload || "An error occurred";
      });

    builder.addCase(fetchProfessionalEducational.fulfilled, (state, action) => {
      state.loading.professionalEducational = false;
      state.specializations = action.payload.specializations || [];
      state.positionLevels = action.payload.position_levels || [];
      state.educationalLevels = action.payload.educational_levels || [];
      if (action.payload.marriage_budget) {
        state.marriageBudget = action.payload.marriage_budget.map((item) => ({
          id: item.id,
          name: item.name || item.budget || `Budget ${item.id}`,
        }));
      } else if (action.payload.marriageBudget) {
        state.marriageBudget = action.payload.marriageBudget;
      } else {
        state.marriageBudget = [];
      }

      if (action.payload.job_titles) {
        state.jobTitles = action.payload.job_titles;
      }
    });

    builder
      .addCase(fetchGeographic.pending, (state) => {
        state.loading.geographic = true;
        state.errors.geographic = null;
      })
      .addCase(fetchGeographic.fulfilled, (state, action) => {
        state.loading.geographic = false;
        state.countries = action.payload.countries || [];
        state.religions = action.payload.religions || [];
        state.nationalities = action.payload.nationalities || [];
        state.housingStatuses = action.payload.housing_statuses || [];
        state.financialStatuses = action.payload.financial_statuses || [];
      })
      .addCase(fetchGeographic.rejected, (state, action) => {
        state.loading.geographic = false;
        state.errors.geographic = action.payload || "An error occurred";
      });

    builder
      .addCase(fetchCitiesByCountry.pending, (state) => {
        state.loading.cities = true;
        state.errors.cities = null;
      })
      .addCase(fetchCitiesByCountry.fulfilled, (state, action) => {
        state.loading.cities = false;
        const { countryId, cities } = action.payload;

        // Store in both places for maximum compatibility
        state.citiesByCountry[countryId] = cities;
        state.cities = cities; // Also update the direct cities array

        console.log(`Updated cities for country ${countryId}:`, state.cities);
      })
      .addCase(fetchCitiesByCountry.rejected, (state, action) => {
        state.loading.cities = false;
        state.errors.cities = action.payload || "An error occurred";
        state.cities = [];
      });
  },
});

export const { resetProfileAttributes, clearCities, debugState } =
  profileAttributesSlice.actions;
export default profileAttributesSlice.reducer;

// Direct selectors
const selectHairColors = (state) => state.profileAttributes.hairColors;
const selectHeights = (state) => state.profileAttributes.heights;
const selectWeights = (state) => state.profileAttributes.weights;
const selectOrigins = (state) => state.profileAttributes.origins;
const selectMaritalStatuses = (state) =>
  state.profileAttributes.maritalStatuses;
const selectSkinColors = (state) => state.profileAttributes.skinColors;
const selectZodiacSigns = (state) => state.profileAttributes.zodiacSigns;
const selectSleepHabits = (state) => state.profileAttributes.sleepHabits;
const selectMarriageBudget = (state) => state.profileAttributes.marriageBudget;
const selectJobTitles = (state) => state.profileAttributes.jobTitles;
const selectSocialMediaPresence = (state) =>
  state.profileAttributes.socialMediaPresence;

const selectHobbies = (state) => state.profileAttributes.hobbies;
const selectPets = (state) => state.profileAttributes.pets;
const selectSportsActivities = (state) =>
  state.profileAttributes.sportsActivities;
const selectSmokingTools = (state) => state.profileAttributes.smokingTools;
const selectDrinkingStatuses = (state) =>
  state.profileAttributes.drinkingStatuses;
const selectReligiosityLevels = (state) =>
  state.profileAttributes.religiosityLevels;

const selectSpecializations = (state) =>
  state.profileAttributes.specializations;
const selectPositionLevels = (state) => state.profileAttributes.positionLevels;
const selectEducationalLevels = (state) =>
  state.profileAttributes.educationalLevels;

const selectCountries = (state) => state.profileAttributes.countries;
const selectReligions = (state) => state.profileAttributes.religions;
const selectNationalities = (state) => state.profileAttributes.nationalities;
const selectHousingStatuses = (state) =>
  state.profileAttributes.housingStatuses;
const selectFinancialStatuses = (state) =>
  state.profileAttributes.financialStatuses;

// Export direct selectors for critical fields
export const selectCities = (state) => state.profileAttributes.cities;
export const selectDirectMarriageBudget = (state) =>
  state.profileAttributes.marriageBudget;
export const selectDirectReligiosityLevels = (state) =>
  state.profileAttributes.religiosityLevels;

// Composed selectors
export const selectPersonalAttributes = createSelector(
  [
    selectHairColors,
    selectHeights,
    selectWeights,
    selectOrigins,
    selectMaritalStatuses,
    selectSkinColors,
    selectZodiacSigns,
    selectSleepHabits,
    selectSocialMediaPresence,
  ],
  (
    hairColors,
    heights,
    weights,
    origins,
    maritalStatuses,
    skinColors,
    zodiacSigns,
    sleepHabits,
    socialMediaPresence
  ) => ({
    hairColors,
    heights,
    weights,
    origins,
    maritalStatuses,
    skinColors,
    zodiacSigns,
    sleepHabits,
    socialMediaPresence,
  })
);

export const selectLifestyleInterests = createSelector(
  [
    selectHobbies,
    selectPets,
    selectSportsActivities,
    selectSmokingTools,
    selectDrinkingStatuses,
    selectReligiosityLevels,
  ],
  (
    hobbies,
    pets,
    sportsActivities,
    smokingTools,
    drinkingStatuses,
    religiosityLevels
  ) => ({
    hobbies,
    pets,
    sportsActivities,
    smokingTools,
    drinkingStatuses,
    religiosityLevels,
  })
);

export const selectProfessionalEducational = createSelector(
  [
    selectSpecializations,
    selectPositionLevels,
    selectEducationalLevels,
    selectMarriageBudget,
    selectJobTitles,
  ],
  (
    specializations,
    positionLevels,
    educationalLevels,
    marriageBudget,
    jobTitles
  ) => ({
    specializations,
    positionLevels,
    educationalLevels,
    marriageBudget,
    jobTitles,
  })
);

export const selectGeographic = createSelector(
  [
    selectCountries,
    selectReligions,
    selectNationalities,
    selectHousingStatuses,
    selectFinancialStatuses,
  ],
  (
    countries,
    religions,
    nationalities,
    housingStatuses,
    financialStatuses
  ) => ({
    countries,
    religions,
    nationalities,
    housingStatuses,
    financialStatuses,
  })
);

const selectCitiesByCountryMap = (state) =>
  state.profileAttributes.citiesByCountry;

export const selectCitiesByCountry = createSelector(
  [selectCitiesByCountryMap, (_, countryId) => countryId],
  (citiesByCountry, countryId) => {
    return citiesByCountry[countryId] || [];
  }
);

export const selectLoadingStates = (state) => state.profileAttributes.loading;
export const selectErrorStates = (state) => state.profileAttributes.errors;
