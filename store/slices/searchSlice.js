// store/searchSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchService } from "../../services/searchService";

// Async thunk for submitting preferences
export const submitSearchPreferences = createAsyncThunk(
  "search/submitPreferences",
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await searchService.submitPreferences(preferences);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to submit preferences"
      );
    }
  }
);

// Async thunk for getting saved preferences - modified as API uses POST
export const getSavedPreferences = createAsyncThunk(
  "search/getSavedPreferences",
  async (_, { rejectWithValue }) => {
    try {
      // Note: This might not be used now since we're initializing with defaults
      const response = await searchService.getSavedPreferences();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to get saved preferences" }
      );
    }
  }
);

const initialState = {
  preferences: {
    preferred_nationality_id: null,
    preferred_origin_id: null,
    preferred_country_id: null,
    preferred_city_id: null,
    preferred_age_min: 18,
    preferred_age_max: 50,
    preferred_educational_level_id: null,
    preferred_specialization_id: null,
    preferred_employment_status: null,
    preferred_job_title_id: null,
    preferred_financial_status_id: null,
    preferred_height_id: null,
    preferred_weight_id: null,
    preferred_marital_status_id: null,
    preferred_smoking_status: null,
    preferred_smoking_tools: [],
    preferred_drinking_status_id: null,
    preferred_sports_activity_id: null,
    preferred_social_media_presence_id: null,
    preferred_marriage_budget: null,
    preferred_religiosity_level_id: null,
    preferred_sleep_habit_id: null,
    preferred_pets_id: [],
    language: 1,
  },
  searchResults: [],
  loading: false,
  error: null,
  success: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    updatePreference: (state, action) => {
      const { field, value } = action.payload;
      state.preferences[field] = value;
    },
    resetPreferences: (state) => {
      state.preferences = initialState.preferences;
    },
    resetSearchState: (state) => {
      state.searchResults = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle submitSearchPreferences
      .addCase(submitSearchPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitSearchPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // Ensure we're storing an array for searchResults
        if (Array.isArray(action.payload.data)) {
          state.searchResults = action.payload.data;
        } else if (action.payload.data) {
          // If data exists but isn't an array, try to handle it safely
          try {
            state.searchResults = [action.payload.data];
          } catch (e) {
            console.error("Error parsing search results:", e);
            state.searchResults = [];
          }
        } else {
          state.searchResults = [];
        }
      })
      .addCase(submitSearchPreferences.rejected, (state, action) => {
        state.loading = false;
        // Handle different error formats
        if (typeof action.payload === "object" && action.payload !== null) {
          state.error = action.payload.message || "Something went wrong";
        } else {
          state.error = action.payload || "Something went wrong";
        }
      })

      // Handle getSavedPreferences
      .addCase(getSavedPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSavedPreferences.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload && action.payload.data) {
          // Check if we received a non-empty object
          if (Object.keys(action.payload.data).length > 0) {
            // REPLACE the preferences instead of merging

            // Make sure to preserve any default values that might not be in the response
            const loadedPrefs = action.payload.data;

            // Update each field only if it exists in the loaded preferences
            Object.keys(loadedPrefs).forEach((key) => {
              if (state.preferences.hasOwnProperty(key)) {
                state.preferences[key] = loadedPrefs[key];
              }
            });

            // Flag that we have preferences loaded
            state.hasLoadedPreferences = true;
          } else {
          }
        }
      })
      .addCase(getSavedPreferences.rejected, (state, action) => {
        state.loading = false;
        // Handle different error formats
        if (typeof action.payload === "object" && action.payload !== null) {
          state.error =
            action.payload.message || "Failed to fetch saved preferences";
        } else {
          state.error = action.payload || "Failed to fetch saved preferences";
        }
      });
  },
});

export const { updatePreference, resetPreferences, resetSearchState } =
  searchSlice.actions;
export default searchSlice.reducer;
