import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { showMessage } from "react-native-flash-message";
import api from "../../services/api";
import { ENDPOINTS } from "../../constants/endpoints";

// Create action for setting active tab
export const setActiveTab = createAction("userMatches/setActiveTab");

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

// New async thunk for fetching user likes
export const fetchUserLikes = createAsyncThunk(
  "userMatches/fetchUserLikes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.GET_LIKES);
      return response.data;
    } catch (error) {
      showMessage({
        message: error.response?.data?.message || "Failed to fetch liked users",
        type: "danger",
      });
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch liked users" }
      );
    }
  }
);

// Helper function to ensure unique list items
const ensureUniqueUsers = (users) => {
  // Use Map to track unique users by ID
  const uniqueUsers = new Map();

  users.forEach((user) => {
    if (!uniqueUsers.has(user.id)) {
      uniqueUsers.set(user.id, user);
    }
  });

  return Array.from(uniqueUsers.values());
};

const initialState = {
  activeTab: "All",
  preferenceMatches: [],
  suggestedMatches: [],
  suggestionPercentage: 0,
  likedUsers: [], // New state for liked users
  loading: {
    preferences: false,
    suggested: false,
    likes: false, // New loading state for likes
  },
  error: {
    preferences: null,
    suggested: null,
    likes: null, // New error state for likes
  },
  activeFilters: {
    isFilter: false,
    age_min: null,
    age_max: null,
    isLikedFilter: false, // New filter flag for likes
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
        isLikedFilter: false,
      };
    },
    setLikedFilter: (state, action) => {
      state.activeFilters.isLikedFilter = action.payload;
    },
    setActiveTabReducer: (state, action) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the setActiveTab action
      .addCase(setActiveTab, (state, action) => {
        state.activeTab = action.payload;
      })

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
            // Ensure unique users
            state.preferenceMatches = ensureUniqueUsers(
              action.payload.exact_matches
            );
          }

          // Handle suggested users
          if (action.payload.suggested_users) {
            // Ensure unique users
            state.suggestedMatches = ensureUniqueUsers(
              action.payload.suggested_users
            );
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
          // Ensure unique users
          state.suggestedMatches = ensureUniqueUsers(
            action.payload.suggested_users
          );
        } else {
          state.suggestedMatches = [];
        }

        // Also update exact matches if they're in the response
        if (action.payload && action.payload.exact_matches) {
          // Ensure unique users
          state.preferenceMatches = ensureUniqueUsers(
            action.payload.exact_matches
          );
        }

        // Store suggestion percentage if available
        if (action.payload && action.payload.suggestion_percentage) {
          state.suggestionPercentage = action.payload.suggestion_percentage;
        }
      })
      .addCase(fetchFilteredMatches.rejected, (state, action) => {
        state.loading.suggested = false;
        state.error.suggested = action.payload;
      })

      // Fetch User Likes
      .addCase(fetchUserLikes.pending, (state) => {
        state.loading.likes = true;
        state.error.likes = null;
      })
      // Update the fetchUserLikes.fulfilled case in your userMatchesSlice.js file
      .addCase(fetchUserLikes.fulfilled, (state, action) => {
        state.loading.likes = false;

        // Extract and format liked users from the response
        if (action.payload && action.payload.likes) {
          // Map the likes array to the format expected by the UI components
          const formattedLikes = action.payload.likes.map((like) => {
            // The liked_user property contains the user data
            const user = like.liked_user;

            // Get the photo URL from the first photo if available
            const mainPhoto =
              user.photos && user.photos.length > 0
                ? { photo_url: user.photos[0].url }
                : null;

            return {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              photos: user.photos
                ? user.photos.map((photo) => ({
                    id: photo.id,
                    photo_url: photo.url,
                    is_main: photo.is_main || 0,
                  }))
                : [],
              // Add additional fields that might be needed by the UI
              match_percentage: 100, // Liked users can be considered 100% match
              verified: false, // Default values for required fields
              premium: false,
              last_active: "Recently",
              likeId: like.id, // Store the like ID to ensure uniqueness
            };
          });

          // Ensure unique users in liked list
          state.likedUsers = ensureUniqueUsers(formattedLikes);
        } else {
          state.likedUsers = [];
        }
      })
      .addCase(fetchUserLikes.rejected, (state, action) => {
        state.loading.likes = false;
        state.error.likes = action.payload;
      });
  },
});

export const {
  setActiveFilters,
  clearFilters,
  setLikedFilter,
  setActiveTabReducer,
} = userMatchesSlice.actions;

export default userMatchesSlice.reducer;
