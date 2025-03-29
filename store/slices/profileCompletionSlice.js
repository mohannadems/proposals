import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";
import { profileService } from "../../services/profile.service";

const profilePersistConfig = {
  key: "profileCompletion",
  storage: AsyncStorage,
  whitelist: ["completedSteps", "missingFields", "lastUpdated"],
};

const initialState = {
  completedSteps: [],
  lastCompletedStep: null,
  missingFields: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

export const fetchProfileCompletionData = createAsyncThunk(
  "profileCompletion/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfile();

      if (response.success) {
        const profileData = response.data;

        const completedSteps = [];
        const missingFields = [];

        const requiredFields = [
          "bio_en",
          "date_of_birth",
          "height",
          "weight",
          "nationality_id",
          "country_of_residence_id",
          "city_id",
          "educational_level_id",
          "employment_status",
          "smoking_status",
          "religion_id",
          "hair_color_id",
          "skin_color_id",
          "marital_status_id",
          "housing_status_id",
          "health_issues_en",
          "religiosity_level_id",
          "financial_status_id",
          "marriage_budget_id",
          "position_level_id",
          "social_media_presence_id",
        ];

        if (
          profileData.smoking_status === 1 &&
          (!profileData.smoking_tools || profileData.smoking_tools.length === 0)
        ) {
          missingFields.push("smoking_tools");
        }

        for (const field of requiredFields) {
          if (field === "height" || field === "weight") {
            if (profileData[field] && profileData[field] > 0) {
              completedSteps.push(field);
            } else {
              missingFields.push(field);
            }
          } else if (
            field === "employment_status" ||
            field === "car_ownership" ||
            field === "hijab_status"
          ) {
            if (
              profileData[field] !== undefined &&
              profileData[field] !== null
            ) {
              completedSteps.push(field);
            } else {
              missingFields.push(field);
            }
          } else if (Array.isArray(profileData[field])) {
            completedSteps.push(field);
          } else if (profileData[field] || profileData[field] === 0) {
            completedSteps.push(field);
          } else {
            missingFields.push(field);
          }
        }

        if (
          profileData.guardian_contact &&
          /^\+?\d+$/.test(profileData.guardian_contact)
        ) {
          completedSteps.push("guardian_contact");
        } else {
          missingFields.push("guardian_contact");
        }

        return { completedSteps, missingFields };
      }

      return rejectWithValue("Failed to fetch profile completion data");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch profile completion data"
      );
    }
  }
);

const profileCompletionSlice = createSlice({
  name: "profileCompletion",
  initialState,
  reducers: {
    updateCompletedStep: (state, action) => {
      const step = action.payload;
      if (!state.completedSteps.includes(step)) {
        state.completedSteps.push(step);
        state.lastCompletedStep = step;

        state.missingFields = state.missingFields.filter(
          (field) => field !== step
        );
      }
      state.lastUpdated = new Date().toISOString();
    },
    setMissingFields: (state, action) => {
      state.missingFields = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    resetProfileCompletion: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileCompletionData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileCompletionData.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          state.completedSteps = action.payload.completedSteps || [];
          state.lastCompletedStep =
            action.payload.completedSteps &&
            action.payload.completedSteps.length > 0
              ? action.payload.completedSteps[
                  action.payload.completedSteps.length - 1
                ]
              : null;
          state.missingFields = action.payload.missingFields || [];
        }

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

export const selectShouldRefetchProfile = (state) => {
  if (!state.profileCompletion.lastUpdated) return true;

  const lastUpdated = new Date(state.profileCompletion.lastUpdated);
  const now = new Date();
  const differenceInMinutes = (now - lastUpdated) / (1000 * 60);

  return differenceInMinutes > 5;
};

export const selectCompletionPercentage = (state) => {
  const { completedSteps, missingFields } = state.profileCompletion;
  const totalSteps = completedSteps.length + missingFields.length;

  if (totalSteps === 0) return 0;
  return Math.round((completedSteps.length / totalSteps) * 100);
};

export default persistReducer(
  profilePersistConfig,
  profileCompletionSlice.reducer
);
