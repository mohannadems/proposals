import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showMessage } from "react-native-flash-message";
import { userProfileService } from "../../services/userProfileService";

// Async thunk for fetching user profile details
export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userProfileService.getUserProfile(userId);
      return response;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      showMessage({
        message: error.message || "Failed to fetch user profile",
        type: "danger",
      });
      return rejectWithValue(error.message || "Failed to fetch user profile");
    }
  }
);

// Async thunk for liking a user
export const likeUser = createAsyncThunk(
  "userProfile/likeUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userProfileService.likeUser(userId);
      showMessage({
        message: "User liked successfully",
        type: "success",
      });
      return response;
    } catch (error) {
      showMessage({
        message: error.message || "Failed to like user",
        type: "danger",
      });
      return rejectWithValue(error.message || "Failed to like user");
    }
  }
);

// Async thunk for disliking a user
export const dislikeUser = createAsyncThunk(
  "userProfile/dislikeUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userProfileService.dislikeUser(userId);
      showMessage({
        message: "User disliked",
        type: "info",
      });
      return response;
    } catch (error) {
      showMessage({
        message: error.message || "Failed to dislike user",
        type: "danger",
      });
      return rejectWithValue(error.message || "Failed to dislike user");
    }
  }
);

const initialState = {
  userProfile: null,
  likedUsers: [],
  dislikedUsers: [],
  loading: {
    profile: false,
    like: false,
    dislike: false,
  },
  error: {
    profile: null,
    like: null,
    dislike: null,
  },
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.userProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading.profile = true;
        state.error.profile = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        if (action.payload && action.payload.data) {
          state.userProfile = action.payload.data;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error.profile = action.payload;
      })

      // Like user
      .addCase(likeUser.pending, (state) => {
        state.loading.like = true;
        state.error.like = null;
      })
      .addCase(likeUser.fulfilled, (state, action) => {
        state.loading.like = false;
        if (state.userProfile) {
          // Add user to liked users array
          state.likedUsers.push(state.userProfile.id);
        }
      })
      .addCase(likeUser.rejected, (state, action) => {
        state.loading.like = false;
        state.error.like = action.payload;
      })

      // Dislike user
      .addCase(dislikeUser.pending, (state) => {
        state.loading.dislike = true;
        state.error.dislike = null;
      })
      .addCase(dislikeUser.fulfilled, (state, action) => {
        state.loading.dislike = false;
        if (state.userProfile) {
          // Add user to disliked users array
          state.dislikedUsers.push(state.userProfile.id);
        }
      })
      .addCase(dislikeUser.rejected, (state, action) => {
        state.loading.dislike = false;
        state.error.dislike = action.payload;
      });
  },
});

export const { clearUserProfile } = userProfileSlice.actions;

export default userProfileSlice.reducer;
