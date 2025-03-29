import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showMessage } from "react-native-flash-message";
import { userProfileService } from "../../services/userProfileService";

const handleApiError = (error, defaultMessage) => {
  const errorMessage =
    error.response?.data?.message || error.message || defaultMessage;

  showMessage({
    message: errorMessage,
    type: "danger",
  });

  return errorMessage;
};

const showSuccessMessage = (message) => {
  showMessage({
    message,
    type: "success",
  });
};

export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userProfileService.getUserProfile(userId);
      return response;
    } catch (error) {
      return rejectWithValue(
        handleApiError(error, "Failed to fetch user profile")
      );
    }
  }
);

export const likeUser = createAsyncThunk(
  "userProfile/likeUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userProfileService.likeUser(userId);
      showSuccessMessage("User liked successfully");
      return { response, userId };
    } catch (error) {
      return rejectWithValue(handleApiError(error, "Failed to like user"));
    }
  }
);

export const dislikeUser = createAsyncThunk(
  "userProfile/dislikeUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userProfileService.dislikeUser(userId);
      showMessage({
        message: "User disliked",
        type: "info",
      });
      return { response, userId };
    } catch (error) {
      return rejectWithValue(handleApiError(error, "Failed to dislike user"));
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

const setPending = (state, key) => {
  state.loading[key] = true;
  state.error[key] = null;
};

const setRejected = (state, key, payload) => {
  state.loading[key] = false;
  state.error[key] = payload;
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.userProfile = null;
    },
    clearLikeDislikeErrors: (state) => {
      state.error.like = null;
      state.error.dislike = null;
    },
    resetUserProfileState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        setPending(state, "profile");
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        if (action.payload?.data) {
          state.userProfile = action.payload.data;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        setRejected(state, "profile", action.payload);
      })

      .addCase(likeUser.pending, (state) => {
        setPending(state, "like");
      })
      .addCase(likeUser.fulfilled, (state, action) => {
        state.loading.like = false;

        const userId = action.payload.userId;
        if (userId && !state.likedUsers.includes(userId)) {
          state.likedUsers.push(userId);
        }

        state.dislikedUsers = state.dislikedUsers.filter((id) => id !== userId);
      })
      .addCase(likeUser.rejected, (state, action) => {
        setRejected(state, "like", action.payload);
      })

      .addCase(dislikeUser.pending, (state) => {
        setPending(state, "dislike");
      })
      .addCase(dislikeUser.fulfilled, (state, action) => {
        state.loading.dislike = false;

        const userId = action.payload.userId;
        if (userId && !state.dislikedUsers.includes(userId)) {
          state.dislikedUsers.push(userId);
        }

        state.likedUsers = state.likedUsers.filter((id) => id !== userId);
      })
      .addCase(dislikeUser.rejected, (state, action) => {
        setRejected(state, "dislike", action.payload);
      });
  },
});

export const {
  clearUserProfile,
  clearLikeDislikeErrors,
  resetUserProfileState,
} = userProfileSlice.actions;

export const selectUserProfile = (state) => state.userProfile.userProfile;
export const selectLikedUsers = (state) => state.userProfile.likedUsers;
export const selectDislikedUsers = (state) => state.userProfile.dislikedUsers;
export const selectLoadingStates = (state) => state.userProfile.loading;
export const selectErrorStates = (state) => state.userProfile.error;
export const selectIsUserLiked = (state, userId) =>
  state.userProfile.likedUsers.includes(userId);
export const selectIsUserDisliked = (state, userId) =>
  state.userProfile.dislikedUsers.includes(userId);

export default userProfileSlice.reducer;
