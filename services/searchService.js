import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "./auth.service";

const SEARCH_PREFERENCES_KEY = "user_search_preferences";
const HAS_SUBMITTED_PREFERENCES = "has_submitted_preferences";

const getUserSpecificKey = async () => {
  try {
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
  submitPreferences: async (preferences) => {
    try {
      const response = await api.post(ENDPOINTS.USER_PREFERENCES, preferences);

      const storageKey = await getUserSpecificKey();
      await AsyncStorage.setItem(storageKey, JSON.stringify(preferences));

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

  getSavedPreferences: async () => {
    try {
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

  debugPreferences: async () => {
    try {
      const userId = await authService.getUserId();

      const token = await AsyncStorage.getItem("userToken");
      const tokenPrefix = token ? token.split("|")[0] : null;

      const storageKey = await getUserSpecificKey();

      const preferences = await AsyncStorage.getItem(storageKey);

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
