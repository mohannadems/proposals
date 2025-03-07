import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";

// Keys for storage
const USER_TOKEN_KEY = "userToken";
const USER_ID_KEY = "userId";
const USER_PROFILE_KEY = "userProfile";

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN, credentials);

      if (
        response.data.success &&
        response.data.data &&
        response.data.data.access_token
      ) {
        const token = response.data.data.access_token;

        // Save token
        await AsyncStorage.setItem(USER_TOKEN_KEY, token);

        // Set auth header for subsequent requests
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Extract a stable identifier from the token
        // For tokens like "77|vnYZXOFDU4Mr..." use the first part
        const tokenParts = token.split("|");
        if (tokenParts.length > 0) {
          const tokenIdentifier = tokenParts[0];
          await AsyncStorage.setItem(USER_ID_KEY, tokenIdentifier);
          console.log(`Saved token-based user ID: ${tokenIdentifier}`);
        }

        // Try to fetch user profile to get a better user ID
        try {
          const profileResponse = await api.get(ENDPOINTS.USER_PROFILE);

          if (profileResponse.data.success && profileResponse.data.data) {
            const userProfile = profileResponse.data.data;

            // Save full profile
            await AsyncStorage.setItem(
              USER_PROFILE_KEY,
              JSON.stringify(userProfile)
            );

            // If profile has an ID, use that instead of token-based ID
            if (userProfile.id) {
              await AsyncStorage.setItem(
                USER_ID_KEY,
                userProfile.id.toString()
              );
              console.log(
                `Updated to profile-based user ID: ${userProfile.id}`
              );
            }
          }
        } catch (profileError) {
          console.log(
            "Profile fetch failed, using token-based ID:",
            profileError.message
          );
        }
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  register: async (userData) => {
    const response = await api.post(ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  verifyOTP: async (otpData) => {
    try {
      const response = await api.post(ENDPOINTS.VERIFY_OTP, otpData);

      if (response.data.success && response.data.access_token) {
        const token = response.data.access_token;

        // Save token
        await AsyncStorage.setItem(USER_TOKEN_KEY, token);

        // Set auth header
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Save token-based ID
        const tokenParts = token.split("|");
        if (tokenParts.length > 0) {
          const tokenIdentifier = tokenParts[0];
          await AsyncStorage.setItem(USER_ID_KEY, tokenIdentifier);
        }

        // Try to get user profile
        try {
          const profileResponse = await api.get(ENDPOINTS.USER_PROFILE);

          if (profileResponse.data.success && profileResponse.data.data) {
            const userProfile = profileResponse.data.data;
            await AsyncStorage.setItem(
              USER_PROFILE_KEY,
              JSON.stringify(userProfile)
            );

            if (userProfile.id) {
              await AsyncStorage.setItem(
                USER_ID_KEY,
                userProfile.id.toString()
              );
            }
          }
        } catch (profileError) {
          console.log("Profile fetch after OTP failed:", profileError.message);
        }
      }

      return {
        success: response.data.success,
        message: response.data.message,
        access_token: response.data.access_token,
        token_type: response.data.token_type || "Bearer",
      };
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  },

  resendOTP: async (email) => {
    const response = await api.post(ENDPOINTS.RESEND_OTP_MASSAGE, { email });
    return response.data;
  },

  logout: async () => {
    try {
      // Call logout API if needed
      try {
        await api.post(ENDPOINTS.LOGOUT);
      } catch (logoutError) {
        console.log("API logout error (continuing):", logoutError.message);
      }

      // DO NOT remove USER_ID_KEY - critical for preference persistence
      console.log("Keeping user ID for preferences during logout");

      // Remove token and profile
      await AsyncStorage.removeItem(USER_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_PROFILE_KEY);

      // Clear auth header
      delete api.defaults.headers.common["Authorization"];
    } catch (error) {
      console.error("Logout service error:", error);
      throw error;
    }
  },

  // Get user ID for preference storage
  getUserId: async () => {
    try {
      // First check direct user ID
      const userId = await AsyncStorage.getItem(USER_ID_KEY);

      if (userId) {
        return userId;
      }

      // Try to get from profile as fallback
      const profileJson = await AsyncStorage.getItem(USER_PROFILE_KEY);
      if (profileJson) {
        try {
          const profile = JSON.parse(profileJson);
          if (profile && profile.id) {
            // Save it for future use
            await AsyncStorage.setItem(USER_ID_KEY, profile.id.toString());
            return profile.id.toString();
          }
        } catch (e) {
          console.log("Error parsing profile:", e.message);
        }
      }

      // Last resort: try to extract from token
      const token = await AsyncStorage.getItem(USER_TOKEN_KEY);
      if (token) {
        const tokenParts = token.split("|");
        if (tokenParts.length > 0) {
          const tokenId = tokenParts[0];
          await AsyncStorage.setItem(USER_ID_KEY, tokenId);
          return tokenId;
        }
      }

      return "guest";
    } catch (error) {
      console.error("Error getting user ID:", error);
      return "guest";
    }
  },
};
