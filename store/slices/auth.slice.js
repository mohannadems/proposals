import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { authService } from "../../services/auth.service";
import { ENDPOINTS } from "../../constants/endpoints";
import { setAuthToken } from "../../services/api";

// Initial State
const initialState = {
  user: null,
  tokens: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  tempEmail: null,
};

// Login Thunk
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

// Register Thunk
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

// Logout Thunk
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Optional: Call backend logout endpoint
      await api.post(ENDPOINTS.LOGOUT);

      // Clear local storage
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");

      // Reset auth token
      setAuthToken(null);

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

// Verify OTP Thunk
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOTP(otpData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTempEmail: (state, action) => {
      state.tempEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.tokens = action.payload.data;
        state.isAuthenticated = true;
        setAuthToken(action.payload.data.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
        state.isAuthenticated = false;
      })

      // Register Cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.tempEmail = action.payload.email;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      // Verify OTP Cases
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.tokens = action.payload.data;
        setAuthToken(action.payload.data.access_token);
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
      })

      // Logout Cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
        state.tempEmail = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
        // Ensure authentication state is reset even on failure
        state.isAuthenticated = false;
        state.user = null;
        state.tokens = null;
      });
  },
});

export const { setTempEmail } = authSlice.actions;
export default authSlice.reducer;
