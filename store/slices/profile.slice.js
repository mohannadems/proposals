import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileService } from "../../services/profile.service";
import { calculateProfileProgress } from "../../utils/profileProgress";

const createThunkWithErrorHandling = (type, asyncFunction) =>
  createAsyncThunk(type, async (payload, { rejectWithValue }) => {
    try {
      const response = await asyncFunction(payload);
      if (response.success) {
        return response.data || response;
      }
      return rejectWithValue(
        response.message || `Failed to ${type.split("/")[1]}`
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || `Failed to ${type.split("/")[1]}`
      );
    }
  });

export const fetchProfile = createThunkWithErrorHandling("profile/fetch", () =>
  profileService.getProfile()
);

export const updateProfile = createThunkWithErrorHandling(
  "profile/update",
  (profileData) => profileService.updateProfile(profileData)
);

export const updateProfilePhoto = createAsyncThunk(
  "profile/updatePhoto",
  async (formData, { rejectWithValue }) => {
    try {
      const actualFormData = formData.formData || formData;
      const onProgress = formData.onProgress || null;

      const response = await profileService.updateProfilePhoto(
        actualFormData,
        onProgress
      );

      if (response.success) {
        return response;
      }
      return rejectWithValue(
        response.message || "Failed to update profile photo"
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile photo"
      );
    }
  }
);

const initialProfileData = {
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
  eye_color_id: null,
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
};

const initialState = {
  loading: false,
  error: null,
  progress: 0,
  showProfileAlert: true,
  data: initialProfileData,
  profilePhotoUpdated: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfile: () => initialState,
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state.data[field] = value;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setShowProfileAlert: (state, action) => {
      state.showProfileAlert = action.payload;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || `Failed to complete operation`;
    };

    builder
      .addCase(fetchProfile.pending, handlePending)
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
        const { progress } = calculateProfileProgress(action.payload);
        state.progress = progress;
      })
      .addCase(fetchProfile.rejected, handleRejected)

      .addCase(updateProfile.pending, handlePending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
        state.progress =
          calculateProfileProgress(action.payload).progress ||
          calculateProfileProgress(action.payload);
      })
      .addCase(updateProfile.rejected, handleRejected)

      .addCase(updateProfilePhoto.pending, (state) => {
        handlePending(state);
        state.profilePhotoUpdated = false;
      })
      .addCase(updateProfilePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.profilePhotoUpdated = true;
        state.error = null;

        const mainPhoto =
          action.payload?.data?.profile?.photos?.find(
            (photo) => photo.is_main
          ) || action.payload?.data?.profile?.photos?.[0];

        if (mainPhoto) {
          if (!state.data.profile) {
            state.data.profile = {};
          }
          state.data.profile.photos = [mainPhoto];
          state.data.profile.avatar_url = mainPhoto.photo_url;
        }
      })
      .addCase(updateProfilePhoto.rejected, (state, action) => {
        handleRejected(state, action);
        state.profilePhotoUpdated = false;
      });
  },
});

export const { resetProfile, updateField, setProgress, setShowProfileAlert } =
  profileSlice.actions;

export default profileSlice.reducer;
