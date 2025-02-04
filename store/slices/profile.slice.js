import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileService } from "../../services/profile.service";

export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfile();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue("Failed to fetch profile data");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProfile(profileData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue("Failed to update profile data");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
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
    photos: [],
  },
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch profile";
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update profile";
      });
  },
});

export const { resetProfile, updateField } = profileSlice.actions;
export default profileSlice.reducer;
