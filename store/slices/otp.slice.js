import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/auth.service"; // Adjust the import path as needed

// Async thunk for OTP verification
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOTP({ email, otp });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for resending OTP
export const resendOTP = createAsyncThunk(
  "auth/resendOTP",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.resendOTP(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state for auth slice
const initialState = {
  user: null,
  tempEmail: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Create auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer to set temporary email during OTP flow
    setTempEmail: (state, action) => {
      state.tempEmail = action.payload;
    },
    // Reducer to clear auth state
    clearAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    // OTP Verification Reducers
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.tempEmail = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "OTP verification failed";
        state.isAuthenticated = false;
      })

      // Resend OTP Reducers
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to resend OTP";
      });
  },
});

// Export actions and reducer
export const { setTempEmail, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
