import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showMessage } from "react-native-flash-message";
import api from "../../services/api";
import { ENDPOINTS } from "../../constants/endpoints";

// Async thunk for fetching user matches
export const fetchUserMatches = createAsyncThunk(
  "userMatches/fetchUserMatches",
  async (params = {}, { rejectWithValue }) => {
    try {
      // Don't send isFilter if it's not needed
      const requestParams = { ...params };
      if (!requestParams.isFilter) {
        delete requestParams.isFilter;
      }

      const response = await api.get(
        ENDPOINTS.GET_USER_PREFERENCES_AND_SUGGESTIONS,
        { params: requestParams }
      );
      return response.data;
    } catch (error) {
      showMessage({
        message: error.response?.data?.message || "Failed to fetch matches",
        type: "danger",
      });
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch matches" }
      );
    }
  }
);

// Async thunk for fetching filtered matches
export const fetchFilteredMatches = createAsyncThunk(
  "userMatches/fetchFilteredMatches",
  async (filterParams = {}, { rejectWithValue }) => {
    try {
      // Ensure isFilter is true if any filters are applied
      const requestParams = { ...filterParams };
      if (
        (requestParams.age_min || requestParams.age_max) &&
        requestParams.isFilter !== false
      ) {
        requestParams.isFilter = true;
      } else if (!requestParams.age_min && !requestParams.age_max) {
        delete requestParams.isFilter;
      }

      const response = await api.get(
        ENDPOINTS.GET_USER_PREFERENCES_AND_SUGGESTIONS,
        { params: requestParams }
      );
      return response.data;
    } catch (error) {
      showMessage({
        message:
          error.response?.data?.message || "Failed to fetch filtered matches",
        type: "danger",
      });
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch filtered matches" }
      );
    }
  }
);

const initialState = {
  // Renamed to match the API response
  preferenceMatches: [],
  suggestedMatches: [],
  suggestionPercentage: 0,
  loading: {
    preferences: false,
    suggested: false,
  },
  error: {
    preferences: null,
    suggested: null,
  },
  activeFilters: {
    isFilter: false,
    age_min: null,
    age_max: null,
  },
};

const userMatchesSlice = createSlice({
  name: "userMatches",
  initialState,
  reducers: {
    setActiveFilters: (state, action) => {
      state.activeFilters = {
        ...state.activeFilters,
        ...action.payload,
        isFilter: true,
      };
    },
    clearFilters: (state) => {
      state.activeFilters = {
        isFilter: false,
        age_min: null,
        age_max: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Matches
      .addCase(fetchUserMatches.pending, (state) => {
        state.loading.preferences = true;
        state.error.preferences = null;
      })
      .addCase(fetchUserMatches.fulfilled, (state, action) => {
        state.loading.preferences = false;

        // Handle both exact matches and suggested users
        if (action.payload) {
          // Handle exact matches (preference matches)
          if (action.payload.exact_matches) {
            state.preferenceMatches = action.payload.exact_matches;
          }

          // Handle suggested users
          if (action.payload.suggested_users) {
            state.suggestedMatches = action.payload.suggested_users;
          }

          // Store suggestion percentage if available
          if (action.payload.suggestion_percentage) {
            state.suggestionPercentage = action.payload.suggestion_percentage;
          }
        }
      })
      .addCase(fetchUserMatches.rejected, (state, action) => {
        state.loading.preferences = false;
        state.error.preferences = action.payload;
      })

      // Fetch Filtered Matches
      .addCase(fetchFilteredMatches.pending, (state) => {
        state.loading.suggested = true;
        state.error.suggested = null;
      })
      .addCase(fetchFilteredMatches.fulfilled, (state, action) => {
        state.loading.suggested = false;

        // For filtered matches, we primarily update the suggested matches
        if (action.payload && action.payload.suggested_users) {
          state.suggestedMatches = action.payload.suggested_users;
        } else {
          state.suggestedMatches = [];
        }

        // Also update exact matches if they're in the response
        if (action.payload && action.payload.exact_matches) {
          state.preferenceMatches = action.payload.exact_matches;
        }

        // Store suggestion percentage if available
        if (action.payload && action.payload.suggestion_percentage) {
          state.suggestionPercentage = action.payload.suggestion_percentage;
        }
      })
      .addCase(fetchFilteredMatches.rejected, (state, action) => {
        state.loading.suggested = false;
        state.error.suggested = action.payload;
      });
  },
});

export const { setActiveFilters, clearFilters } = userMatchesSlice.actions;

export default userMatchesSlice.reducer;
