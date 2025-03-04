// src/redux/profileCompletionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";
import { profileService } from "../../services/profile.service";

const profilePersistConfig = {
  key: "profileCompletion",
  storage: AsyncStorage,
  whitelist: ["completedSteps", "missingFields"],
};

// Create an async thunk for fetching profile completion data
export const fetchProfileCompletionData = createAsyncThunk(
  "profileCompletion/fetch",
  async (_, { rejectWithValue }) => {
    try {
      // Call the actual API to get profile data
      const response = await profileService.getProfile();

      return rejectWithValue("Failed to fetch profile completion data");
    } catch (error) {
      console.error("Profile completion fetch error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch profile completion data"
      );
    }
  }
);

const profileCompletionSlice = createSlice({
  name: "profileCompletion",
  initialState: {
    completedSteps: [],
    lastCompletedStep: null,
    missingFields: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    updateCompletedStep: (state, action) => {
      const step = action.payload;
      if (!state.completedSteps.includes(step)) {
        state.completedSteps.push(step);
        state.lastCompletedStep = step;
      }
      state.lastUpdated = new Date().toISOString();
    },
    setMissingFields: (state, action) => {
      state.missingFields = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    resetProfileCompletion: () => ({
      completedSteps: [],
      lastCompletedStep: null,
      missingFields: [],
      loading: false,
      error: null,
      lastUpdated: null,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileCompletionData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileCompletionData.fulfilled, (state, action) => {
        state.loading = false;
        state.completedSteps = action.payload.completedSteps;
        state.lastCompletedStep =
          action.payload.completedSteps[
            action.payload.completedSteps.length - 1
          ] || null;
        state.missingFields = action.payload.missingFields;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchProfileCompletionData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch profile completion data";
      });
  },
});

export const { updateCompletedStep, setMissingFields, resetProfileCompletion } =
  profileCompletionSlice.actions;

// Selector to check if we should refetch (e.g., if data is stale)
export const selectShouldRefetchProfile = (state) => {
  if (!state.profileCompletion.lastUpdated) return true;

  const lastUpdated = new Date(state.profileCompletion.lastUpdated);
  const now = new Date();
  const differenceInMinutes = (now - lastUpdated) / (1000 * 60);

  // Refetch if data is older than 5 minutes
  return differenceInMinutes > 5;
};

export default persistReducer(
  profilePersistConfig,
  profileCompletionSlice.reducer
);
