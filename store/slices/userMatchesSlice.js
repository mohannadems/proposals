import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { showMessage } from "react-native-flash-message";
import api from "../../services/api";
import { ENDPOINTS } from "../../constants/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
const handleApiError = (error, defaultMessage) => {
  const errorMessage = error.response?.data?.message || defaultMessage;
  showMessage({
    message: errorMessage,
    type: "danger",
  });
  return error.response?.data || { message: defaultMessage };
};

const ensureUniqueUsers = (users) => {
  if (!Array.isArray(users) || users.length === 0) return [];

  const uniqueUsers = new Map();
  users.forEach((user) => {
    if (user && user.id && !uniqueUsers.has(user.id)) {
      uniqueUsers.set(user.id, user);
    }
  });
  return Array.from(uniqueUsers.values());
};

export const setActiveTab = createAction("userMatches/setActiveTab");

export const fetchUserMatches = createAsyncThunk(
  "userMatches/fetchUserMatches",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const searchPreferences = state.search.preferences;

      if (!state.userMatches.hasSubmittedFilters && !params.forceLoad) {
        return {
          exact_matches: [],
          suggested_users: [],
          suggestion_percentage: 0,
        };
      }

      const requestParams = {
        ...params,
        ...searchPreferences,
        timestamp: Date.now(),
      };

      if (!requestParams.isFilter) {
        delete requestParams.isFilter;
      }

      const response = await api.get(
        ENDPOINTS.GET_USER_PREFERENCES_AND_SUGGESTIONS,
        {
          params: requestParams,
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error in fetchUserMatches:", error);
      return rejectWithValue(handleApiError(error, "Failed to fetch matches"));
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
      return rejectWithValue(
        handleApiError(error, "Failed to fetch filtered matches")
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
      return rejectWithValue(
        handleApiError(error, "Failed to fetch liked users")
      );
    }
  }
);

export const fetchMatchDetails = createAsyncThunk(
  "userMatches/fetchMatchDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const matchResponse = await api.get(ENDPOINTS.MATCHES);
      let matchData = null;

      if (matchResponse.data?.data) {
        const parsedUserId =
          typeof userId === "string" ? parseInt(userId, 10) : userId;
        matchData = matchResponse.data.data.find(
          (match) =>
            match.matched_user_id === parsedUserId ||
            match.matched_user_id === userId.toString()
        );
      }

      if (matchData) {
        try {
          const profileResponse = await api.get(
            `${ENDPOINTS.USER_PROFILE}/${userId}`
          );

          return {
            ...matchData,
            ...profileResponse.data,
            match_percentage: profileResponse.data?.match_percentage || 90,
          };
        } catch (profileError) {
          return matchData;
        }
      }

      return matchData;
    } catch (error) {
      return rejectWithValue(
        handleApiError(error, "Failed to fetch match details")
      );
    }
  }
);
export const fetchUserMatchesList = createAsyncThunk(
  "userMatches/fetchUserMatchesList",
  async (_, { rejectWithValue }) => {
    try {
      const lang = (await AsyncStorage.getItem("userLanguage")) || "en";
      const response = await api.get(ENDPOINTS.MATCHES, {
        headers: {
          "Accept-Language": lang,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error, "Failed to fetch matches"));
    }
  }
);
const initialState = {
  activeTab: "All",
  matches: [],
  matchDetails: null,
  preferenceMatches: [],
  suggestedMatches: [],
  suggestionPercentage: 0,
  likedUsers: [],
  loading: {
    preferences: false,
    suggested: false,
    likes: false,
    matchDetails: false,
    matches: false,
  },
  error: {
    preferences: null,
    suggested: null,
    likes: null,
    matchDetails: null,
    matches: null,
  },
  activeFilters: {
    isFilter: false,
    age_min: null,
    age_max: null,
    isLikedFilter: false,
  },
  hasSubmittedFilters: false,
};

const formatLikesData = (likes) => {
  if (!Array.isArray(likes)) return [];

  return likes
    .map((like) => {
      const user = like.user;
      if (!user) return null;

      const photoUrl = user.photos?.[0]?.url ?? null;
      const fullPhotoUrl = photoUrl
        ? photoUrl.startsWith("http")
          ? photoUrl
          : `https://proposals.world${photoUrl}`
        : null;

      return {
        id: `${user.id}_${like.id}`,
        originalUserId: user.id,
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
    })
    .filter(Boolean);
};
const formatMatches = (matches) => {
  if (!Array.isArray(matches)) return [];

  return matches.map((match) => {
    const photoUrl = match.matched_user_photo;
    const fullPhotoUrl = photoUrl
      ? photoUrl.startsWith("http")
        ? photoUrl
        : `https://proposals.world${photoUrl}`
      : null;

    return {
      id: match.id,
      originalUserId: match.matched_user_id,
      first_name: match.matched_user_name,
      age: match.matched_user_age,
      city: match.matched_user_city,
      phone: match.matched_user_phone,
      email: match.matched_user_email,
      photo_url: fullPhotoUrl,
      photos: fullPhotoUrl ? [{ id: 1, url: fullPhotoUrl, is_main: 1 }] : [],
      contactExchanged: match.contact_exchanged,
      createdAt: match.created_at,
      updatedAt: match.updated_at,
      match_percentage: 100,
      verified: false,
      premium: false,
      last_active: "Matched",
    };
  });
};
const userMatchesSlice = createSlice({
  name: "userMatches",
  initialState,
  reducers: {
    addMatch: (state, action) => {
      const matchData = action.payload;
      if (!matchData) return;

      const matchExists = state.matches.some(
        (match) =>
          match.originalUserId === matchData.matched_user_id ||
          match.id === matchData.id
      );

      if (!matchExists) {
        const photoUrl =
          matchData.matched_user_photo ||
          matchData.user?.photos?.[0]?.url ||
          null;
        const fullPhotoUrl = photoUrl
          ? photoUrl.startsWith("http")
            ? photoUrl
            : `https://proposals.world${photoUrl}`
          : null;

        const formattedMatch = {
          id: matchData.id || `match_${Date.now()}`,
          originalUserId: matchData.matched_user_id,
          first_name: matchData.matched_user_name || matchData.user?.first_name,
          age: matchData.matched_user_age || matchData.user?.age,
          city: matchData.matched_user_city || matchData.user?.city,
          phone: matchData.matched_user_phone,
          email: matchData.matched_user_email,
          photo_url: fullPhotoUrl,
          photos: fullPhotoUrl
            ? [{ id: 1, url: fullPhotoUrl, is_main: 1 }]
            : [],
          contactExchanged: matchData.contact_exchanged || false,
          createdAt: matchData.created_at || new Date().toISOString(),
          updatedAt: matchData.updated_at || new Date().toISOString(),
          match_percentage: 100,
          verified: false,
          premium: false,
          last_active: "Just Matched",
        };

        state.matches.unshift(formattedMatch);
      }
    },
    setActiveFilters: (state, action) => {
      state.activeFilters = {
        ...state.activeFilters,
        ...action.payload,
        isFilter: true,
      };
    },
    clearFilters: (state) => {
      state.activeFilters = initialState.activeFilters;
    },
    setLikedFilter: (state, action) => {
      state.activeFilters.isLikedFilter = action.payload;
    },
    setActiveTabReducer: (state, action) => {
      state.activeTab = action.payload;
    },
    clearMatchDetails: (state) => {
      state.matchDetails = null;
    },
    setHasSubmittedFilters: (state, action) => {
      state.hasSubmittedFilters = action.payload;
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

        if (action.payload?.exact_matches) {
          state.preferenceMatches = ensureUniqueUsers(
            action.payload.exact_matches
          );
        }

        if (action.payload?.suggested_users) {
          state.suggestedMatches = ensureUniqueUsers(
            action.payload.suggested_users
          );
        }

        if (action.payload?.suggestion_percentage) {
          state.suggestionPercentage = action.payload.suggestion_percentage;
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
        state.hasSubmittedFilters = true; // Set the flag when matches are successfully fetched

        if (action.payload?.suggested_users) {
          state.suggestedMatches = ensureUniqueUsers(
            action.payload.suggested_users
          );
        } else {
          state.suggestedMatches = [];
        }

        if (action.payload?.exact_matches) {
          state.preferenceMatches = ensureUniqueUsers(
            action.payload.exact_matches
          );
        }

        if (action.payload?.suggestion_percentage) {
          state.suggestionPercentage = action.payload.suggestion_percentage;
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
          const formattedLikes = formatLikesData(action.payload.likes);
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
        state.loading.matchDetails = true;
        state.error.matchDetails = null;
      })
      .addCase(fetchMatchDetails.fulfilled, (state, action) => {
        state.loading.matchDetails = false;
        state.matchDetails = action.payload;
      })
      .addCase(fetchMatchDetails.rejected, (state, action) => {
        state.loading.matchDetails = false;
        state.error.matchDetails = action.payload;
      })
      .addCase(fetchUserMatchesList.pending, (state) => {
        state.loading.matches = true;
        state.error.matches = null;
      })
      .addCase(fetchUserMatchesList.fulfilled, (state, action) => {
        state.loading.matches = false;
        if (action.payload?.matches) {
          const formattedMatches = formatMatches(action.payload.matches);
          state.matches = formattedMatches;
        } else {
          state.matches = [];
        }
      })
      .addCase(fetchUserMatchesList.rejected, (state, action) => {
        state.loading.matches = false;
        state.error.matches = action.payload;
      })
      .addCase(refreshMatchesAfterSearch, (state) => {
        state.activeTab = "All";
        state.activeFilters = {
          ...state.activeFilters,
          isFilter: false,
          isLikedFilter: false,
        };
      });
  },
});

export const {
  setActiveFilters,
  clearFilters,
  setLikedFilter,
  setActiveTabReducer,
  clearMatchDetails,
  setHasSubmittedFilters,
  addMatch,
} = userMatchesSlice.actions;

export const selectActiveTab = (state) => state.userMatches.activeTab;
export const selectPreferenceMatches = (state) =>
  state.userMatches.preferenceMatches;
export const selectSuggestedMatches = (state) =>
  state.userMatches.suggestedMatches;
export const selectLikedUsers = (state) => state.userMatches.likedUsers;
export const selectActiveFilters = (state) => state.userMatches.activeFilters;
export const selectMatchDetails = (state) => state.userMatches.matchDetails;
export const selectLoadingStates = (state) => state.userMatches.loading;
export const selectErrorStates = (state) => state.userMatches.error;
export const selectHasSubmittedFilters = (state) =>
  state.userMatches.hasSubmittedFilters;
export const selectMatches = (state) => state.userMatches.matches;

export default userMatchesSlice.reducer;
export const refreshMatchesAfterSearch = createAction(
  "userMatches/refreshMatchesAfterSearch"
);
