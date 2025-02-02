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
    id: null,
    bio_en: "",
    bio_ar: "",
    gender: "",
    hair_color: "",
    height: "",
    weight: "",
    origin: "",
    marital_status: "",
    skin_color: "",
    zodiac_sign: "",
    specialization: "",
    position_level: "",
    educational_level: "",
    country: "",
    religion: "",
    nationality: "",
    housing_status: "",
    financial_status: "",
    hobby: [],
    pet: [],
    sports_activity: "",
    smoking_tool: [],
    drinking_status: "",
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
