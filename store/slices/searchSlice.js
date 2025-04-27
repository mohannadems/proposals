import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchService } from "../../services/searchService";

export const DEFAULT_AGE_RANGE = {
  min: 18,
  max: 50,
};

const handleApiError = (error) =>
  error.response?.data?.message || error.message || "An error occurred";

export const submitSearchPreferences = createAsyncThunk(
  "search/submitPreferences",
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await searchService.submitPreferences(preferences);

      if (!response || typeof response !== "object") {
        return rejectWithValue("Invalid response format from server");
      }

      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getSavedPreferences = createAsyncThunk(
  "search/getSavedPreferences",
  async (_, { rejectWithValue }) => {
    try {
      const response = await searchService.getSavedPreferences();

      if (!response || typeof response !== "object") {
        return rejectWithValue("Invalid response format from server");
      }

      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const initialPreferences = {
  preferred_nationality_id: null,
  preferred_origin_id: null,
  preferred_country_id: null,
  preferred_city_id: null,
  preferred_age_min: DEFAULT_AGE_RANGE.min,
  preferred_age_max: DEFAULT_AGE_RANGE.max,
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
  preferred_marriage_budget_id: null,
  preferred_religiosity_level_id: null,
  preferred_sleep_habit_id: null,
  preferred_pets_id: [],
  language: 1,
};

const initialState = {
  preferences: initialPreferences,
  searchResults: [],
  loading: false,
  error: null,
  hasSearched: false,
  success: false,
  hasLoadedPreferences: false,
  initialLoadComplete: false,
};

const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.success = false;
  state.error =
    typeof action.payload === "object" && action.payload !== null
      ? action.payload.message || "Something went wrong"
      : action.payload || "Something went wrong";
};

const parseSearchResults = (payload) => {
  if (!payload || !payload.data) {
    return [];
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (typeof payload.data === "object") {
    return [payload.data];
  }

  return [];
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    updatePreference: (state, action) => {
      const { field, value } = action.payload;
      if (field in state.preferences) {
        state.preferences[field] = value;
      }
    },
    resetPreferences: (state) => {
      state.preferences = initialPreferences;
    },
    resetSearchState: (state) => {
      state.searchResults = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setInitialLoadComplete: (state, action) => {
      state.initialLoadComplete = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    manuallySetLoading: (state, action) => {
      state.loading = action.payload;
    },
    setHasSearched: (state, action) => {
      state.hasSearched = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSearchPreferences.pending, handlePending)
      .addCase(submitSearchPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.searchResults = parseSearchResults(action.payload);
      })
      .addCase(submitSearchPreferences.rejected, handleRejected)

      .addCase(getSavedPreferences.pending, handlePending)
      .addCase(getSavedPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.initialLoadComplete = true;
        state.hasLoadedPreferences = true;

        if (action.payload?.data && typeof action.payload.data === "object") {
          const loadedPrefs = action.payload.data;
          const newPreferences = { ...state.preferences };

          Object.entries(loadedPrefs).forEach(([key, value]) => {
            if (
              key in newPreferences &&
              value !== null &&
              value !== undefined
            ) {
              newPreferences[key] = Array.isArray(value) ? [...value] : value;
            }
          });

          state.preferences = newPreferences;
        }
      })
      .addCase(getSavedPreferences.rejected, (state, action) => {
        handleRejected(state, action);
        state.initialLoadComplete = true;
        state.hasLoadedPreferences = true;
      });
  },
});

export const {
  updatePreference,
  resetPreferences,
  resetSearchState,
  setInitialLoadComplete,
  clearError,
  setHasSearched,
  manuallySetLoading,
} = searchSlice.actions;

export const selectHasSearched = (state) => state.search.hasSearched;
export const selectPreferences = (state) => state.search.preferences;
export const selectSearchResults = (state) => state.search.searchResults;
export const selectSearchLoading = (state) => state.search.loading;
export const selectSearchError = (state) => state.search.error;
export const selectHasLoadedPreferences = (state) =>
  state.search.hasLoadedPreferences;

export const selectIsBasicSectionComplete = (state) => {
  const prefs = state.search.preferences;
  return !!(
    prefs.preferred_nationality_id ||
    prefs.preferred_origin_id ||
    prefs.preferred_country_id ||
    prefs.preferred_age_min !== DEFAULT_AGE_RANGE.min ||
    prefs.preferred_age_max !== DEFAULT_AGE_RANGE.max
  );
};

export default searchSlice.reducer;
