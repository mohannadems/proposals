import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.post("/profile/update", profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Profile update failed" }
      );
    }
  }
);

const initialState = {
  currentStep: 0,
  loading: false,
  error: null,
  isProfileComplete: false,
  data: {
    basicInfo: {
      name: "",
      gender: "",
      dateOfBirth: "",
      nationality: "",
      origin: "",
      religion: "",
    },
    location: {
      countryOfResidence: "",
      cityOfResidence: "",
      area: "",
    },
    personalDetails: {
      education: "",
      specialization: "",
      occupation: "",
      workSector: "",
      workLevel: "",
      financialStatus: "",
    },
    physicalAttributes: {
      height: "",
      weight: "",
      skinTone: "",
      hairColor: "",
    },
    lifestyle: {
      maritalStatus: "",
      hasChildren: false,
      numberOfChildren: 0,
      languages: [],
    },
    habitsAndPreferences: {
      hasPets: false,
      petTypes: [],
      smoking: "",
      drinking: "",
      exerciseHabits: "",
      socialMediaUsage: "",
      sleepingHabits: "",
      religiousCommitment: "",
    },
    additionalInfo: {
      hobbies: [],
      avatar: null,
      bio: "",
      aboutPartner: "",
    },
  },
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.currentStep = action.payload;
    },
    updateField: (state, action) => {
      const { section, field, value } = action.payload;
      state.data[section][field] = value;
    },
    resetProfile: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload };
        state.isProfileComplete = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Profile update failed";
      });
  },
});

export const { setStep, updateField, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
