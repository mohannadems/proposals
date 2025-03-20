import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "./auth.service";

const SEARCH_PREFERENCES_KEY = "user_search_preferences";
const HAS_SUBMITTED_PREFERENCES = "has_submitted_preferences";

// Get user-specific storage key
const getUserSpecificKey = async () => {
  try {
    // Get user ID from auth service
    const userId = await authService.getUserId();

    if (userId) {
      const key = `${SEARCH_PREFERENCES_KEY}_${userId}`;
      return key;
    }

    return `${SEARCH_PREFERENCES_KEY}_guest`;
  } catch (error) {
    console.error("Error creating preferences key:", error.message);
    return `${SEARCH_PREFERENCES_KEY}_fallback`;
  }
};

export const searchService = {
  // Submit user preferences
  submitPreferences: async (preferences) => {
    try {
      const response = await api.post(ENDPOINTS.USER_PREFERENCES, preferences);

      // Save preferences with user-specific key
      const storageKey = await getUserSpecificKey();
      await AsyncStorage.setItem(storageKey, JSON.stringify(preferences));

      // Also save a flag that user has submitted preferences at least once
      await AsyncStorage.setItem(HAS_SUBMITTED_PREFERENCES, "true");

      return response.data;
    } catch (error) {
      console.error("Error submitting preferences:", error);
      throw {
        message:
          error.response?.data?.message || "Error submitting preferences",
      };
    }
  },

  // Get saved preferences
  getSavedPreferences: async () => {
    try {
      // First try API if we're online
      try {
        const response = await api.get(ENDPOINTS.GET_USER_PREFERENCES);

        if (response.data?.data) {
          // API returned preferences, save them locally
          const apiData = response.data.data;
          const storageKey = await getUserSpecificKey();
          await AsyncStorage.setItem(storageKey, JSON.stringify(apiData));
          return { data: apiData };
        } else {
        }
      } catch (apiError) {}

      // If API fails or returns no data, try local storage
      const storageKey = await getUserSpecificKey();
      const localPreferences = await AsyncStorage.getItem(storageKey);

      if (localPreferences) {
        return { data: JSON.parse(localPreferences) };
      }

      return { data: null };
    } catch (error) {
      console.error("Error getting saved preferences:", error);
      return { data: null };
    }
  },

  // Debug helper to identify preference storage issues
  debugPreferences: async () => {
    try {
      // Current user ID
      const userId = await authService.getUserId();

      // Current token
      const token = await AsyncStorage.getItem("userToken");
      const tokenPrefix = token ? token.split("|")[0] : null;

      // Current storage key
      const storageKey = await getUserSpecificKey();

      // Check if we have preferences with this key
      const preferences = await AsyncStorage.getItem(storageKey);

      // Get all preference-related keys
      const allKeys = await AsyncStorage.getAllKeys();
      const prefKeys = allKeys.filter((key) =>
        key.startsWith(SEARCH_PREFERENCES_KEY)
      );

      return {
        userId,
        tokenPrefix,
        storageKey,
        hasPreferences: !!preferences,
        allPreferenceKeys: prefKeys,
        isAuthenticated: !!token,
      };
    } catch (error) {
      console.error("Debug error:", error);
      return { error: error.message };
    }
  },
};
