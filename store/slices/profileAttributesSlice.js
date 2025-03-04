// store/profileAttributesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileService } from "../../services/profileService";

// Async thunks for fetching data
export const fetchPersonalAttributes = createAsyncThunk(
  "profileAttributes/fetchPersonalAttributes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.fetchPersonalAttributes();
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
      // Try to fetch cities from the API
      const response = await profileService.fetchCitiesByCountry(countryId);

      // Return the cities if we got a successful response
      return { countryId, cities: response };
    } catch (error) {
      // If the API call fails, provide an empty array rather than failing the thunk
      console.warn(
        `Couldn't fetch cities for country ID ${countryId}, using empty array:`,
        error
      );

      // Instead of rejecting, return an empty array
      return { countryId, cities: [] };
    }
  }
);

export const fetchAllProfileData = createAsyncThunk(
  "profileAttributes/fetchAllProfileData",
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(fetchPersonalAttributes()),
      dispatch(fetchLifestyleInterests()),
      dispatch(fetchProfessionalEducational()),
      dispatch(fetchGeographic()),
    ]);
  }
);

// Initial state structure
const initialState = {
  // Personal attributes
  hairColors: [],
  heights: [],
  weights: [],
  origins: [],
  maritalStatuses: [],
  skinColors: [],
  zodiacSigns: [],
  sleepHabits: [],

  // Lifestyle interests
  hobbies: [],
  pets: [],
  sportsActivities: [],
  smokingTools: [],
  drinkingStatuses: [],
  religiosityLevels: [],

  // Professional & educational
  specializations: [],
  positionLevels: [],
  educationalLevels: [],
  marriageBudget: [],

  // Geographic
  countries: [],
  religions: [],
  nationalities: [],
  housingStatuses: [],
  financialStatuses: [],

  // Cities by country
  citiesByCountry: {},

  // Loading states
  loading: {
    personalAttributes: false,
    lifestyleInterests: false,
    professionalEducational: false,
    geographic: false,
    cities: false,
  },

  // Error states
  errors: {
    personalAttributes: null,
    lifestyleInterests: null,
    professionalEducational: null,
    geographic: null,
    cities: null,
  },
};

// Create the slice
const profileAttributesSlice = createSlice({
  name: "profileAttributes",
  initialState,
  reducers: {
    // Any additional reducers if needed for manual updates
    resetProfileAttributes: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Personal Attributes
    builder
      .addCase(fetchPersonalAttributes.pending, (state) => {
        state.loading.personalAttributes = true;
        state.errors.personalAttributes = null;
      })
      .addCase(fetchPersonalAttributes.fulfilled, (state, action) => {
        state.loading.personalAttributes = false;
        // Map the data to state
        state.hairColors = action.payload.hair_colors || [];
        state.heights = action.payload.heights || [];
        state.weights = action.payload.weights || [];
        state.origins = action.payload.origins || [];
        state.maritalStatuses = action.payload.marital_statuses || [];
        state.skinColors = action.payload.skin_colors || [];
        state.zodiacSigns = action.payload.zodiac_signs || [];
        state.sleepHabits = action.payload.sleep_habits || [];
      })
      .addCase(fetchPersonalAttributes.rejected, (state, action) => {
        state.loading.personalAttributes = false;
        state.errors.personalAttributes = action.payload || "An error occurred";
      });

    // Lifestyle Interests
    builder
      .addCase(fetchLifestyleInterests.pending, (state) => {
        state.loading.lifestyleInterests = true;
        state.errors.lifestyleInterests = null;
      })
      .addCase(fetchLifestyleInterests.fulfilled, (state, action) => {
        state.loading.lifestyleInterests = false;
        // Map the data to state
        state.hobbies = action.payload.hobbies || [];
        state.pets = action.payload.pets || [];
        state.sportsActivities = action.payload.sports_activities || [];
        state.smokingTools = action.payload.smoking_tools || [];
        state.drinkingStatuses = action.payload.drinking_statuses || [];
        state.religiosityLevels = action.payload.religiosityLevels || [];
      })
      .addCase(fetchLifestyleInterests.rejected, (state, action) => {
        state.loading.lifestyleInterests = false;
        state.errors.lifestyleInterests = action.payload || "An error occurred";
      });

    // Professional Educational
    builder
      .addCase(fetchProfessionalEducational.pending, (state) => {
        state.loading.professionalEducational = true;
        state.errors.professionalEducational = null;
      })
      .addCase(fetchProfessionalEducational.fulfilled, (state, action) => {
        state.loading.professionalEducational = false;
        // Map the data to state
        state.specializations = action.payload.specializations || [];
        state.positionLevels = action.payload.position_levels || [];
        state.educationalLevels = action.payload.educational_levels || [];
        state.marriageBudget = action.payload.marriage_budget || [];
      })
      .addCase(fetchProfessionalEducational.rejected, (state, action) => {
        state.loading.professionalEducational = false;
        state.errors.professionalEducational =
          action.payload || "An error occurred";
      });

    // Geographic
    builder
      .addCase(fetchGeographic.pending, (state) => {
        state.loading.geographic = true;
        state.errors.geographic = null;
      })
      .addCase(fetchGeographic.fulfilled, (state, action) => {
        state.loading.geographic = false;
        // Map the data to state
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

    // Cities by Country
    builder
      .addCase(fetchCitiesByCountry.pending, (state) => {
        state.loading.cities = true;
        state.errors.cities = null;
      })
      .addCase(fetchCitiesByCountry.fulfilled, (state, action) => {
        state.loading.cities = false;
        const { countryId, cities } = action.payload;
        // Store cities by country ID
        state.citiesByCountry[countryId] = cities;
      })
      .addCase(fetchCitiesByCountry.rejected, (state, action) => {
        state.loading.cities = false;
        state.errors.cities = action.payload || "An error occurred";
      });
  },
});

// Export actions and reducer
export const { resetProfileAttributes } = profileAttributesSlice.actions;
export default profileAttributesSlice.reducer;

// Selectors
export const selectPersonalAttributes = (state) => ({
  hairColors: state.profileAttributes.hairColors,
  heights: state.profileAttributes.heights,
  weights: state.profileAttributes.weights,
  origins: state.profileAttributes.origins,
  maritalStatuses: state.profileAttributes.maritalStatuses,
  skinColors: state.profileAttributes.skinColors,
  zodiacSigns: state.profileAttributes.zodiacSigns,
  sleepHabits: state.profileAttributes.sleepHabits,
});

export const selectLifestyleInterests = (state) => ({
  hobbies: state.profileAttributes.hobbies,
  pets: state.profileAttributes.pets,
  sportsActivities: state.profileAttributes.sportsActivities,
  smokingTools: state.profileAttributes.smokingTools,
  drinkingStatuses: state.profileAttributes.drinkingStatuses,
  religiosityLevels: state.profileAttributes.religiosityLevels,
});

export const selectProfessionalEducational = (state) => ({
  specializations: state.profileAttributes.specializations,
  positionLevels: state.profileAttributes.positionLevels,
  educationalLevels: state.profileAttributes.educationalLevels,
  marriageBudget: state.profileAttributes.marriageBudget,
});

export const selectGeographic = (state) => ({
  countries: state.profileAttributes.countries,
  religions: state.profileAttributes.religions,
  nationalities: state.profileAttributes.nationalities,
  housingStatuses: state.profileAttributes.housingStatuses,
  financialStatuses: state.profileAttributes.financialStatuses,
});

export const selectCitiesByCountry = (state, countryId) =>
  state.profileAttributes.citiesByCountry[countryId] || [];

export const selectLoadingStates = (state) => state.profileAttributes.loading;
export const selectErrorStates = (state) => state.profileAttributes.errors;
