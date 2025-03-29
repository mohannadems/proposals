import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { authService } from "../../services/auth.service";
import { ENDPOINTS } from "../../constants/endpoints";
import { setAuthToken } from "../../services/api";

const initialState = {
  user: null,
  tokens: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  tempEmail: null,
};

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

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      dispatch(setTempEmail(userData.email)); // Store the email
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post(ENDPOINTS.LOGOUT);

      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");

      setAuthToken(null);

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

export const clearUserData = createAsyncThunk(
  "auth/clearUserData",
  async (_, { rejectWithValue }) => {
    try {
      await authService.clearAllUserData();
      setAuthToken(null);
      return true;
    } catch (error) {
      console.error("Clear user data error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to clear user data"
      );
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOTP(otpData);
      if (response.success) {
        if (response.access_token) {
          await AsyncStorage.setItem("userToken", response.access_token);
          setAuthToken(`Bearer ${response.access_token}`);
        }
        return response;
      }
      return rejectWithValue(response.message || "OTP verification failed");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

export const resendOTP = createAsyncThunk(
  "auth/resendOTP",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.resendOTP(email);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend OTP"
      );
    }
  }
);

export const checkAuthState = createAsyncThunk(
  "auth/checkAuthState",
  async (_, { dispatch }) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");

      if (token) {
        setAuthToken(`Bearer ${token}`);
        return {
          tokens: { access_token: token },
          user: userData ? JSON.parse(userData) : null,
        };
      }
      return null;
    } catch (error) {
      console.error("Error checking auth state:", error);
      return null;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTempEmail: (state, action) => {
      state.tempEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.tokens = action.payload.data;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;

        AsyncStorage.setItem("userToken", action.payload.data.access_token);
        if (action.payload.data.user) {
          AsyncStorage.setItem(
            "userData",
            JSON.stringify(action.payload.data.user)
          );
        }
        setAuthToken(action.payload.data.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
        state.isAuthenticated = false;
      })

      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.firstTimeLogin = action.payload.first_time_login;
        if (action.payload.access_token) {
          state.tokens = {
            access_token: action.payload.access_token,
            token_type: action.payload.token_type || "Bearer",
          };
        }
        state.tempEmail = null;
        state.error = null;
      })

      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "OTP verification failed";
        state.isAuthenticated = false;
      })
      // Register Cases
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.tempEmail = action.payload.email;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to resend OTP";
      })

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
        state.isAuthenticated = false;
        state.user = null;
        state.tokens = null;
      })
      .addCase(checkAuthState.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        if (action.payload) {
          state.tokens = action.payload.tokens;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
        state.loading = false;
      })
      .addCase(checkAuthState.rejected, (state) => {
        state.loading = false;
      })
      .addCase(clearUserData.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
        state.tempEmail = null;
      });
  },
});

export const { setTempEmail } = authSlice.actions;
export default authSlice.reducer;
