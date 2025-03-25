import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { showMessage } from "react-native-flash-message";
import api from "../../services/api";
import { ENDPOINTS } from "../../constants/endpoints";

export const setActiveTab = createAction("userMatches/setActiveTab");

export const fetchUserMatches = createAsyncThunk(
  "userMatches/fetchUserMatches",
  async (params = {}, { rejectWithValue }) => {
    try {
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

export const fetchFilteredMatches = createAsyncThunk(
  "userMatches/fetchFilteredMatches",
  async (filterParams = {}, { rejectWithValue }) => {
    try {
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
export const fetchMatchDetails = createAsyncThunk(
  "userMatches/fetchMatchDetails",
  async (userId, { rejectWithValue }) => {
    try {
      // First, check if this is a match
      const matchResponse = await api.get(ENDPOINTS.MATCHES);

      let matchData = null;

      // Find the specific match with this user
      if (matchResponse.data && matchResponse.data.data) {
        matchData = matchResponse.data.data.find(
          (match) =>
            match.matched_user_id === parseInt(userId) ||
            match.matched_user_id === userId.toString()
        );
      }

      // If we found a match, get additional user profile info
      if (matchData) {
        try {
          const profileResponse = await api.get(
            `${ENDPOINTS.USER_PROFILE}/${userId}`
          );

          // Combine match data with profile data
          return {
            ...matchData,
            ...profileResponse.data,
            match_percentage: profileResponse.data?.match_percentage || 90,
          };
        } catch (profileError) {
          // If profile fetch fails, still return match data
          return matchData;
        }
      }

      return matchData;
    } catch (error) {
      showMessage({
        message:
          error.response?.data?.message || "Failed to fetch match details",
        type: "danger",
      });
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch match details" }
      );
    }
  }
);

const ensureUniqueUsers = (users) => {
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
  matchDetails: null,
  preferenceMatches: [],
  suggestedMatches: [],
  suggestionPercentage: 0,
  likedUsers: [],
  loading: {
    preferences: false,
    suggested: false,
    likes: false,
  },
  error: {
    preferences: null,
    suggested: null,
    likes: null,
  },
  activeFilters: {
    isFilter: false,
    age_min: null,
    age_max: null,
    isLikedFilter: false,
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
      .addCase(setActiveTab, (state, action) => {
        state.activeTab = action.payload;
      })
      .addCase(fetchUserMatches.pending, (state) => {
        state.loading.preferences = true;
        state.error.preferences = null;
      })
      .addCase(fetchUserMatches.fulfilled, (state, action) => {
        state.loading.preferences = false;
        if (action.payload) {
          if (action.payload.exact_matches) {
            state.preferenceMatches = ensureUniqueUsers(
              action.payload.exact_matches
            );
          }
          if (action.payload.suggested_users) {
            state.suggestedMatches = ensureUniqueUsers(
              action.payload.suggested_users
            );
          }
          if (action.payload.suggestion_percentage) {
            state.suggestionPercentage = action.payload.suggestion_percentage;
          }
        }
      })
      .addCase(fetchUserMatches.rejected, (state, action) => {
        state.loading.preferences = false;
        state.error.preferences = action.payload;
      })
      .addCase(fetchFilteredMatches.pending, (state) => {
        state.loading.suggested = true;
        state.error.suggested = null;
      })
      .addCase(fetchFilteredMatches.fulfilled, (state, action) => {
        state.loading.suggested = false;
        if (action.payload) {
          if (action.payload.suggested_users) {
            state.suggestedMatches = ensureUniqueUsers(
              action.payload.suggested_users
            );
          } else {
            state.suggestedMatches = [];
          }
          if (action.payload.exact_matches) {
            state.preferenceMatches = ensureUniqueUsers(
              action.payload.exact_matches
            );
          }
          if (action.payload.suggestion_percentage) {
            state.suggestionPercentage = action.payload.suggestion_percentage;
          }
        }
      })
      .addCase(fetchFilteredMatches.rejected, (state, action) => {
        state.loading.suggested = false;
        state.error.suggested = action.payload;
      })
      .addCase(fetchUserLikes.pending, (state) => {
        state.loading.likes = true;
        state.error.likes = null;
      })
      .addCase(fetchUserLikes.fulfilled, (state, action) => {
        state.loading.likes = false;
        if (action.payload?.likes) {
          const formattedLikes = action.payload.likes.map((like) => {
            const user = like.liked_user;
            const photoUrl = user.photos?.[0]?.url ?? null;
            const fullPhotoUrl = photoUrl
              ? photoUrl.startsWith("http")
                ? photoUrl
                : `https://proposals.world${photoUrl}`
              : null;

            return {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              photos: user.photos
                ? user.photos.map((photo) => ({
                    id: photo.id,
                    url: photo.url,
                    photo_url: photo.url,
                    is_main: photo.is_main || 0,
                  }))
                : [],
              photo_url: fullPhotoUrl,
              match_percentage: 100,
              verified: false,
              premium: false,
              last_active: "Recently",
              likeId: like.id,
            };
          });
          state.likedUsers = ensureUniqueUsers(formattedLikes);
        } else {
          state.likedUsers = [];
        }
      })
      .addCase(fetchUserLikes.rejected, (state, action) => {
        state.loading.likes = false;
        state.error.likes = action.payload;
      })
      .addCase(fetchMatchDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.matchDetails = null;
      })
      .addCase(fetchMatchDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.matchDetails = action.payload;
      })
      .addCase(fetchMatchDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
