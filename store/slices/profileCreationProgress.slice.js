import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const PROFILE_CREATION_STORAGE_KEY = "@ProfileCreation:SavedData";
const PROFILE_CREATION_STEP_KEY = "@ProfileCreation:CurrentStep";
const initialFormState = {
  loading: false,
  error: null,
  progress: 0,
  showProfileAlert: true,
  data: {
    bio_en: "",
    bio_ar: "",
    date_of_birth: "",
    height: null,
    weight: null,
    nationality_id: null,
    origin_id: null,
    country_of_residence_id: null,
    city_id: null,
    educational_level_id: null,
    specialization_id: null,
    employment_status: false,
    job_title_id: null,
    smoking_status: null,
    smoking_tools: [],
    drinking_status_id: null,
    sports_activity_id: null,
    social_media_presence_id: null,
    religion_id: null,
    hair_color_id: null,
    skin_color_id: null,
    marital_status_id: null,
    number_of_children: null,
    housing_status_id: null,
    hobbies: [],
    pets: [],
    health_issues_en: "",
    health_issues_ar: "",
    zodiac_sign_id: null,
    car_ownership: false,
    guardian_contact: "",
    hijab_status: 0,
    financial_status_id: null,
    profile: {
      photos: [],
      avatar_url: null,
    },
    marriage_budget_id: null,
    religiosity_level_id: null,
    sleep_habit_id: null,
  },
  profilePhotoUpdated: false,
};
const initialState = {
  savedFormFields: initialFormState,
  currentStep: 1,
  isResuming: false,
  error: null,
};

// Async Thunks
export const saveProfileCreationProgress = createAsyncThunk(
  "profileCreation/saveProgress",
  async ({ stepData, currentStep }, { rejectWithValue }) => {
    try {
      return {
        savedFormFields: stepData,
        currentStep,
        isResuming: true,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resumeProfileCreation = createAsyncThunk(
  "profileCreation/resumeProgress",
  async () => {
    return {
      isResuming: true,
    };
  }
);

export const clearProfileCreationProgress = createAsyncThunk(
  "profileCreation/clearProgress",
  async () => {
    return {
      savedFormFields: initialFormState,
      currentStep: 1,
      isResuming: false,
    };
  }
);

// Profile Creation Slice
const profileCreationSlice = createSlice({
  name: "profileCreation",
  initialState,
  reducers: {
    updateSavedFormFields: (state, action) => {
      // Merge new form fields with existing saved fields
      state.savedFormFields = {
        ...state.savedFormFields,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveProfileCreationProgress.fulfilled, (state, action) => {
        state.savedFormFields = action.payload.savedFormFields;
        state.currentStep = action.payload.currentStep;
        state.isResuming = true;
        state.error = null;
      })
      .addCase(resumeProfileCreation.fulfilled, (state, action) => {
        state.isResuming = action.payload.isResuming;
        state.error = null;
      })
      .addCase(clearProfileCreationProgress.fulfilled, (state, action) => {
        state.savedFormFields = action.payload.savedFormFields;
        state.currentStep = action.payload.currentStep;
        state.isResuming = action.payload.isResuming;
        state.error = null;
      });
  },
});

export const { updateSavedFormFields } = profileCreationSlice.actions;
export default profileCreationSlice.reducer;
